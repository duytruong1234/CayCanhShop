from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import (
    TaiKhoan, CayCanh, ThongTinKhoaHoc, 
    MoTaChiTiet, DacDiemNoiBat, CachChamSoc
)
from app.schemas.bai_viet import (
    BaiVietTongHopResponse, ThongTinKhoaHocResponse,
    MoTaChiTietResponse, DacDiemNoiBatResponse, CachChamSocItem
)
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/admin/bai-viet", tags=["Admin - Bài Viết"])


@router.get("/{cay_canh_id}", response_model=BaiVietTongHopResponse)
async def get_bai_viet(
    cay_canh_id: int,
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Lấy tất cả thông tin bài viết của cây cảnh"""
    
    cay = db.query(CayCanh).filter(CayCanh.CayCanhID == cay_canh_id).first()
    if not cay:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây cảnh")
    
    # Thông tin khoa học
    ttkh = db.query(ThongTinKhoaHoc).filter(
        ThongTinKhoaHoc.CayCanhID == cay_canh_id
    ).first()
    
    ttkh_response = None
    if ttkh:
        ttkh_response = ThongTinKhoaHocResponse(
            cay_canh_id=ttkh.CayCanhID,
            ten_khoa_hoc=ttkh.TenKhoaHoc,
            ho_thuc_vat=ttkh.HoThucVat,
            nguon_goc=ttkh.NguonGoc,
            ten_goi_khac=ttkh.TenGoiKhac
        )
    
    # Mô tả chi tiết
    mtct = db.query(MoTaChiTiet).filter(
        MoTaChiTiet.CayCanhID == cay_canh_id
    ).first()
    
    mtct_response = None
    if mtct:
        mtct_response = MoTaChiTietResponse(
            cay_canh_id=mtct.CayCanhID,
            tieu_de=mtct.TieuDe,
            noi_dung=mtct.NoiDung
        )
    
    # Đặc điểm nổi bật
    ddnb_list = db.query(DacDiemNoiBat).filter(
        DacDiemNoiBat.CayCanhID == cay_canh_id
    ).all()
    
    ddnb_response = [
        DacDiemNoiBatResponse(
            dac_diem_id=dd.DacDiemID,
            cay_canh_id=dd.CayCanhID,
            noi_dung=dd.NoiDung
        ) for dd in ddnb_list
    ]
    
    # Cách chăm sóc
    ccs_list = db.query(CachChamSoc).filter(
        CachChamSoc.CayCanhID == cay_canh_id
    ).all()
    
    ccs_response = [
        CachChamSocItem(
            tieu_de=cs.TieuDe,
            noi_dung=cs.NoiDung
        ) for cs in ccs_list
    ]
    
    return BaiVietTongHopResponse(
        cay_canh_id=cay_canh_id,
        ten_cay=cay.TenCay,
        thong_tin_khoa_hoc=ttkh_response,
        mo_ta_chi_tiet=mtct_response,
        dac_diem_noi_bat=ddnb_response,
        cach_cham_soc=ccs_response
    )


# ================= THÔNG TIN KHOA HỌC =================
@router.post("/thong-tin-khoa-hoc")
async def create_thong_tin_khoa_hoc(
    cay_canh_id: int = Form(...),
    ten_khoa_hoc: Optional[str] = Form(None),
    ho_thuc_vat: Optional[str] = Form(None),
    nguon_goc: Optional[str] = Form(None),
    ten_goi_khac: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm thông tin khoa học"""
    
    # Kiểm tra đã tồn tại chưa
    existing = db.query(ThongTinKhoaHoc).filter(
        ThongTinKhoaHoc.CayCanhID == cay_canh_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Cây này đã có thông tin khoa học")
    
    ttkh = ThongTinKhoaHoc(
        CayCanhID=cay_canh_id,
        TenKhoaHoc=ten_khoa_hoc,
        HoThucVat=ho_thuc_vat,
        NguonGoc=nguon_goc,
        TenGoiKhac=ten_goi_khac
    )
    db.add(ttkh)
    db.commit()
    
    return {"success": True, "message": "Thêm thông tin khoa học thành công!"}


@router.put("/thong-tin-khoa-hoc")
async def update_thong_tin_khoa_hoc(
    cay_canh_id: int = Form(...),
    ten_khoa_hoc: Optional[str] = Form(None),
    ho_thuc_vat: Optional[str] = Form(None),
    nguon_goc: Optional[str] = Form(None),
    ten_goi_khac: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Cập nhật thông tin khoa học"""
    
    ttkh = db.query(ThongTinKhoaHoc).filter(
        ThongTinKhoaHoc.CayCanhID == cay_canh_id
    ).first()
    
    if not ttkh:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin khoa học")
    
    ttkh.TenKhoaHoc = ten_khoa_hoc
    ttkh.HoThucVat = ho_thuc_vat
    ttkh.NguonGoc = nguon_goc
    ttkh.TenGoiKhac = ten_goi_khac
    
    db.commit()
    
    return {"success": True, "message": "Cập nhật thành công!"}


# ================= MÔ TẢ CHI TIẾT =================
@router.post("/mo-ta-chi-tiet")
async def create_mo_ta_chi_tiet(
    cay_canh_id: int = Form(...),
    tieu_de: Optional[str] = Form(None),
    noi_dung: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm mô tả chi tiết"""
    
    existing = db.query(MoTaChiTiet).filter(
        MoTaChiTiet.CayCanhID == cay_canh_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Cây này đã có mô tả chi tiết")
    
    mtct = MoTaChiTiet(
        CayCanhID=cay_canh_id,
        TieuDe=tieu_de,
        NoiDung=noi_dung
    )
    db.add(mtct)
    db.commit()
    
    return {"success": True, "message": "Thêm mô tả chi tiết thành công!"}


@router.put("/mo-ta-chi-tiet")
async def update_mo_ta_chi_tiet(
    cay_canh_id: int = Form(...),
    tieu_de: Optional[str] = Form(None),
    noi_dung: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Cập nhật mô tả chi tiết"""
    
    mtct = db.query(MoTaChiTiet).filter(
        MoTaChiTiet.CayCanhID == cay_canh_id
    ).first()
    
    if not mtct:
        raise HTTPException(status_code=404, detail="Không tìm thấy mô tả chi tiết")
    
    mtct.TieuDe = tieu_de
    mtct.NoiDung = noi_dung
    
    db.commit()
    
    return {"success": True, "message": "Cập nhật thành công!"}


# ================= ĐẶC ĐIỂM NỔI BẬT =================
@router.post("/dac-diem-noi-bat")
async def create_dac_diem_noi_bat(
    cay_canh_id: int = Form(...),
    noi_dung_1: Optional[str] = Form(None),
    noi_dung_2: Optional[str] = Form(None),
    noi_dung_3: Optional[str] = Form(None),
    noi_dung_4: Optional[str] = Form(None),
    noi_dung_5: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm đặc điểm nổi bật"""
    
    noi_dungs = [noi_dung_1, noi_dung_2, noi_dung_3, noi_dung_4, noi_dung_5]
    
    for nd in noi_dungs:
        if nd and nd.strip():
            ddnb = DacDiemNoiBat(
                CayCanhID=cay_canh_id,
                NoiDung=nd.strip()
            )
            db.add(ddnb)
    
    db.commit()
    
    return {"success": True, "message": "Thêm đặc điểm nổi bật thành công!"}


@router.put("/dac-diem-noi-bat")
async def update_dac_diem_noi_bat(
    cay_canh_id: int = Form(...),
    noi_dung_1: Optional[str] = Form(None),
    noi_dung_2: Optional[str] = Form(None),
    noi_dung_3: Optional[str] = Form(None),
    noi_dung_4: Optional[str] = Form(None),
    noi_dung_5: Optional[str] = Form(None),
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Cập nhật đặc điểm nổi bật"""
    
    # Xóa hết đặc điểm cũ
    db.query(DacDiemNoiBat).filter(
        DacDiemNoiBat.CayCanhID == cay_canh_id
    ).delete()
    
    # Thêm lại
    noi_dungs = [noi_dung_1, noi_dung_2, noi_dung_3, noi_dung_4, noi_dung_5]
    
    for nd in noi_dungs:
        if nd and nd.strip():
            ddnb = DacDiemNoiBat(
                CayCanhID=cay_canh_id,
                NoiDung=nd.strip()
            )
            db.add(ddnb)
    
    db.commit()
    
    return {"success": True, "message": "Cập nhật đặc điểm nổi bật thành công!"}


# ================= CÁCH CHĂM SÓC =================
@router.post("/cach-cham-soc")
async def save_cach_cham_soc(
    cay_canh_id: int = Form(...),
    noi_dung_1: Optional[str] = Form(None),  # Ánh sáng
    noi_dung_2: Optional[str] = Form(None),  # Tưới nước
    noi_dung_3: Optional[str] = Form(None),  # Đất trồng
    noi_dung_4: Optional[str] = Form(None),  # Nhiệt độ
    noi_dung_5: Optional[str] = Form(None),  # Bón phân
    current_admin: TaiKhoan = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """[Admin] Thêm/Cập nhật cách chăm sóc"""
    
    tieu_des = ["Ánh sáng", "Tưới nước", "Đất trồng", "Nhiệt độ", "Bón phân"]
    noi_dungs = [noi_dung_1, noi_dung_2, noi_dung_3, noi_dung_4, noi_dung_5]
    
    # Lấy danh sách hiện có
    existing = db.query(CachChamSoc).filter(
        CachChamSoc.CayCanhID == cay_canh_id
    ).all()
    
    existing_dict = {cs.TieuDe: cs for cs in existing}
    
    for i in range(5):
        tieu_de = tieu_des[i]
        noi_dung = noi_dungs[i] or ""
        
        if tieu_de in existing_dict:
            # Cập nhật
            existing_dict[tieu_de].NoiDung = noi_dung
        else:
            # Thêm mới
            cs = CachChamSoc(
                CayCanhID=cay_canh_id,
                TieuDe=tieu_de,
                NoiDung=noi_dung
            )
            db.add(cs)
    
    db.commit()
    
    return {"success": True, "message": "Cập nhật cách chăm sóc thành công!"}
