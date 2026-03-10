from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from decimal import Decimal

from app.database import get_db
from app.models import TaiKhoan, CayCanh, LoaiCay, TonKho
# Import CayCanhDacDiem implicitly or explicitly if needed, but usually just for querying
from app.models.cay_canh_dac_diem import CayCanhDacDiem
from app.models.tieu_chi import TieuChi
from app.models.ma_tran_phuong_an import MaTranPhuongAn
from app.models.trong_so_phuong_an import TrongSoPhuongAn
from app.schemas.cay_canh import CayCanhResponse, CayCanhCreate, CayCanhUpdate, LoaiCayResponse
from app.utils.auth import get_current_admin
from app.utils.file_handler import save_upload_file, delete_file

router = APIRouter(prefix="/admin/cay-canh", tags=["Admin - Cây Cảnh"])


@router.get("/", response_model=List[CayCanhResponse])
async def get_all(
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Lấy danh sách tất cả cây cảnh"""
    
    cay_canhs = db.query(CayCanh).options(
        joinedload(CayCanh.loai_cay),
        joinedload(CayCanh.ton_kho),
        joinedload(CayCanh.dac_diems)
    ).all()
    
    return [
        CayCanhResponse(
            cay_canh_id=cay.CayCanhID,
            ten_cay=cay.TenCay,
            gia=cay.Gia,
            mo_ta=cay.MoTa,
            hinh_anh=cay.HinhAnh,
            loai_cay_id=cay.LoaiCayID,
            loai_cay=LoaiCayResponse(
                loai_cay_id=cay.loai_cay.LoaiCayID,
                ten_loai=cay.loai_cay.TenLoai,
                mo_ta=cay.loai_cay.MoTa
            ) if cay.loai_cay else None,
            so_luong_ton=cay.ton_kho.SoLuongTon if cay.ton_kho else 0,
            dac_diems=[dd.MaDacDiem for dd in cay.dac_diems] if cay.dac_diems else []
        ) for cay in cay_canhs
    ]


@router.post("/")
async def create(
    ten_cay: str = Form(...),
    gia: float = Form(...),
    mo_ta: Optional[str] = Form(None),
    loai_cay_id: Optional[int] = Form(None),
    dac_diems: Optional[List[str]] = Form(None),
    hinh_anh: Optional[UploadFile] = File(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm cây cảnh mới + tự động thêm cột AHP"""
    
    # Upload hình ảnh nếu có
    filename = None
    if hinh_anh:
        filename = await save_upload_file(hinh_anh)
    
    # Tạo cây cảnh
    cay = CayCanh(
        TenCay=ten_cay,
        Gia=Decimal(str(gia)),
        MoTa=mo_ta,
        LoaiCayID=loai_cay_id,
        HinhAnh=filename
    )
    db.add(cay)
    db.commit()
    db.refresh(cay)
    
    # Thêm đặc điểm
    if dac_diems:
        for ma in dac_diems:
            link = CayCanhDacDiem(CayCanhID=cay.CayCanhID, MaDacDiem=ma)
            db.add(link)
        db.commit()
    
    # ============ TỰ ĐỘNG THÊM CỘT AHP ============
    new_id = cay.CayCanhID
    
    # Lấy tất cả tiêu chí
    all_tieu_chi = db.query(TieuChi).all()
    
    for tc in all_tieu_chi:
        ma_tc = tc.MaTieuChi
        
        # Lấy danh sách cây cũ đã có trong ma trận của tiêu chí này
        existing_ids = [
            row[0] for row in
            db.query(MaTranPhuongAn.CayDongID)
            .filter(MaTranPhuongAn.MaTieuChi == ma_tc)
            .distinct()
            .all()
        ]
        
        # Thêm đường chéo (cây mới vs chính nó = 1)
        db.add(MaTranPhuongAn(
            MaTieuChi=ma_tc, CayDongID=new_id, CayCotID=new_id, GiaTriPhuongAn=1.0
        ))
        
        # Thêm so sánh cây mới vs tất cả cây cũ (= 1, tức bằng nhau, admin sửa sau)
        for old_id in existing_ids:
            if old_id == new_id:
                continue
            # cây mới vs cây cũ
            db.add(MaTranPhuongAn(
                MaTieuChi=ma_tc, CayDongID=new_id, CayCotID=old_id, GiaTriPhuongAn=1.0
            ))
            # cây cũ vs cây mới (đối xứng)
            db.add(MaTranPhuongAn(
                MaTieuChi=ma_tc, CayDongID=old_id, CayCotID=new_id, GiaTriPhuongAn=1.0
            ))
        
        # Thêm trọng số mặc định = 0 (admin sẽ tính lại)
        db.add(TrongSoPhuongAn(
            CayCanhID=new_id, MaTieuChi=ma_tc, TrongSoPhuongAn=0.0
        ))
    
    db.commit()
    # ================================================
    
    return {"success": True, "cay_canh_id": cay.CayCanhID}


@router.put("/{cay_canh_id}")
async def update(
    cay_canh_id: int,
    ten_cay: Optional[str] = Form(None),
    gia: Optional[float] = Form(None),
    mo_ta: Optional[str] = Form(None),
    loai_cay_id: Optional[int] = Form(None),
    dac_diems: Optional[List[str]] = Form(None),
    hinh_anh: Optional[UploadFile] = File(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Cập nhật cây cảnh"""
    
    cay = db.query(CayCanh).filter(CayCanh.CayCanhID == cay_canh_id).first()
    if not cay:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây cảnh")
    
    # Cập nhật thông tin
    if ten_cay:
        cay.TenCay = ten_cay
    if gia:
        cay.Gia = Decimal(str(gia))
    if mo_ta is not None:
        cay.MoTa = mo_ta
    if loai_cay_id:
        cay.LoaiCayID = loai_cay_id
    
    # Cập nhật đặc điểm (nếu có gửi lên field dac_diems)
    if dac_diems is not None:
        # Xóa cũ
        db.query(CayCanhDacDiem).filter(CayCanhDacDiem.CayCanhID == cay_canh_id).delete()
        # Thêm mới
        for ma in dac_diems:
            link = CayCanhDacDiem(CayCanhID=cay_canh_id, MaDacDiem=ma)
            db.add(link)
    
    # Upload hình mới nếu có
    if hinh_anh:
        # Xóa hình cũ
        if cay.HinhAnh:
            delete_file(cay.HinhAnh)
        # Lưu hình mới
        cay.HinhAnh = await save_upload_file(hinh_anh)
    
    db.commit()
    
    return {"success": True}


@router.delete("/{cay_canh_id}")
async def delete(
    cay_canh_id: int,
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Xóa cây cảnh + dọn dẹp dữ liệu AHP liên quan"""
    
    cay = db.query(CayCanh).filter(CayCanh.CayCanhID == cay_canh_id).first()
    if not cay:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây cảnh")
    
    # Xóa dữ liệu AHP liên quan trước (tránh lỗi FK)
    db.query(TrongSoPhuongAn).filter(TrongSoPhuongAn.CayCanhID == cay_canh_id).delete()
    db.query(MaTranPhuongAn).filter(
        (MaTranPhuongAn.CayDongID == cay_canh_id) | (MaTranPhuongAn.CayCotID == cay_canh_id)
    ).delete(synchronize_session='fetch')
    db.query(CayCanhDacDiem).filter(CayCanhDacDiem.CayCanhID == cay_canh_id).delete()
    
    # Xóa hình ảnh
    if cay.HinhAnh:
        delete_file(cay.HinhAnh)
    
    db.delete(cay)
    db.commit()
    
    return {"success": True}


# ==================== LOẠI CÂY ====================
@router.get("/loai-cay", response_model=List[LoaiCayResponse])
async def get_loai_cay(
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Lấy danh sách loại cây"""
    loai_cays = db.query(LoaiCay).all()
    return [
        LoaiCayResponse(
            loai_cay_id=lc.LoaiCayID,
            ten_loai=lc.TenLoai,
            mo_ta=lc.MoTa
        ) for lc in loai_cays
    ]


@router.post("/loai-cay")
async def create_loai_cay(
    ten_loai: str = Form(...),
    mo_ta: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm loại cây mới"""
    loai_cay = LoaiCay(TenLoai=ten_loai, MoTa=mo_ta)
    db.add(loai_cay)
    db.commit()
    return {"success": True, "loai_cay_id": loai_cay.LoaiCayID}

