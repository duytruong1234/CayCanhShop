from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from decimal import Decimal

from app.database import get_db
from app.models import TaiKhoan, GioHang, GioHangChiTiet, CayCanh
from app.schemas.gio_hang import (
    GioHangResponse, GioHangChiTietResponse, 
    ThemVaoGioRequest, UpdateQtyRequest
)
from app.utils.auth import get_current_user

router = APIRouter(prefix="/gio-hang", tags=["Giỏ Hàng"])


@router.get("/", response_model=GioHangResponse)
async def get_gio_hang(
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy giỏ hàng của user hiện tại"""
    
    gio_hang = db.query(GioHang).options(
        joinedload(GioHang.chi_tiets).joinedload(GioHangChiTiet.cay_canh)
    ).filter(GioHang.TaiKhoanID == current_user.TaiKhoanID).first()
    
    if not gio_hang:
        # Trả về giỏ hàng rỗng
        return GioHangResponse(
            gio_hang_id=0,
            tai_khoan_id=current_user.TaiKhoanID,
            ngay_cap_nhat=None,
            chi_tiets=[],
            tong_tien=Decimal(0),
            tong_so_luong=0
        )
    
    chi_tiets = []
    tong_tien = Decimal(0)
    tong_so_luong = 0
    
    for ct in gio_hang.chi_tiets:
        thanh_tien = ct.SoLuong * ct.DonGia
        tong_tien += thanh_tien
        tong_so_luong += ct.SoLuong
        
        chi_tiets.append(GioHangChiTietResponse(
            ghct_id=ct.GHCTID,
            gio_hang_id=ct.GioHangID,
            cay_canh_id=ct.CayCanhID,
            so_luong=ct.SoLuong,
            don_gia=ct.DonGia,
            ten_cay=ct.cay_canh.TenCay if ct.cay_canh else None,
            hinh_anh=ct.cay_canh.HinhAnh if ct.cay_canh else None,
            thanh_tien=thanh_tien
        ))
    
    return GioHangResponse(
        gio_hang_id=gio_hang.GioHangID,
        tai_khoan_id=gio_hang.TaiKhoanID,
        ngay_cap_nhat=gio_hang.NgayCapNhat,
        chi_tiets=chi_tiets,
        tong_tien=tong_tien,
        tong_so_luong=tong_so_luong
    )


@router.post("/them")
async def them_vao_gio(
    request: ThemVaoGioRequest,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Thêm sản phẩm vào giỏ hàng"""
    
    # Kiểm tra cây cảnh tồn tại
    cay = db.query(CayCanh).filter(CayCanh.CayCanhID == request.cay_canh_id).first()
    if not cay:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây cảnh")
    
    # Lấy hoặc tạo giỏ hàng
    gio_hang = db.query(GioHang).filter(
        GioHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if not gio_hang:
        gio_hang = GioHang(
            TaiKhoanID=current_user.TaiKhoanID,
            NgayCapNhat=datetime.now()
        )
        db.add(gio_hang)
        db.flush()
    
    # Kiểm tra sản phẩm đã có trong giỏ chưa
    chi_tiet = db.query(GioHangChiTiet).filter(
        GioHangChiTiet.GioHangID == gio_hang.GioHangID,
        GioHangChiTiet.CayCanhID == request.cay_canh_id
    ).first()
    
    if chi_tiet:
        # Cập nhật số lượng
        chi_tiet.SoLuong += request.so_luong
    else:
        # Thêm mới
        chi_tiet = GioHangChiTiet(
            GioHangID=gio_hang.GioHangID,
            CayCanhID=request.cay_canh_id,
            SoLuong=request.so_luong,
            DonGia=cay.Gia
        )
        db.add(chi_tiet)
    
    gio_hang.NgayCapNhat = datetime.now()
    db.commit()
    
    return {"success": True, "message": "Thêm vào giỏ hàng thành công!"}


@router.put("/{ghct_id}")
async def update_so_luong(
    ghct_id: int,
    request: UpdateQtyRequest,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cập nhật số lượng sản phẩm trong giỏ"""
    
    chi_tiet = db.query(GioHangChiTiet).join(GioHang).filter(
        GioHangChiTiet.GHCTID == ghct_id,
        GioHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if not chi_tiet:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm trong giỏ")
    
    chi_tiet.SoLuong += request.change
    
    if chi_tiet.SoLuong <= 0:
        db.delete(chi_tiet)
    
    db.commit()
    
    return {"success": True}


@router.delete("/{ghct_id}")
async def xoa_khoi_gio(
    ghct_id: int,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xóa sản phẩm khỏi giỏ hàng"""
    
    chi_tiet = db.query(GioHangChiTiet).join(GioHang).filter(
        GioHangChiTiet.GHCTID == ghct_id,
        GioHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if chi_tiet:
        db.delete(chi_tiet)
        db.commit()
    
    return {"success": True}


@router.delete("/")
async def xoa_gio_hang(
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xóa toàn bộ giỏ hàng"""
    
    gio_hang = db.query(GioHang).filter(
        GioHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if gio_hang:
        db.query(GioHangChiTiet).filter(
            GioHangChiTiet.GioHangID == gio_hang.GioHangID
        ).delete()
        db.commit()
    
    return {"success": True}
