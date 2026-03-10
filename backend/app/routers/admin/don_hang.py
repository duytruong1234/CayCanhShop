from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import DonHang, CTDonHang, CayCanh, KhachHang, TaiKhoan
from app.utils.auth import get_current_admin
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/admin/don-hang",
    tags=["Admin Don Hang"],
    dependencies=[Depends(get_current_admin)]
)

class AdminDonHangResponse(BaseModel):
    don_hang_id: int
    ngay_dat: Optional[datetime]
    tong_tien: float
    trang_thai: str
    dia_chi_giao_hang: str
    sdt_nguoi_nhan: str
    ten_nguoi_nhan: str
    phuong_thuc_thanh_toan: str
    ghi_chu: Optional[str]
    user_id: Optional[int]
    ten_user: Optional[str]

    class Config:
        from_attributes = True

class ChiTietResponse(BaseModel):
    ten_cay: str
    hinh_anh: Optional[str]
    so_luong: int
    don_gia: float
    thanh_tien: float

class AdminDonHangDetailResponse(AdminDonHangResponse):
    chi_tiets: List[ChiTietResponse] = []

@router.get("/", response_model=List[AdminDonHangResponse])
def get_all_orders(trang_thai: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(DonHang)
    if trang_thai and trang_thai != 'all':
        query = query.filter(DonHang.TrangThai == trang_thai)
    
    orders = query.order_by(DonHang.NgayDat.desc()).all()
    
    res = []
    for o in orders:
        # Get user info via KhachHang -> TaiKhoan
        user_name = "Khách vãng lai"
        user_id = None
        if o.khach_hang:
            user_name = o.khach_hang.HoTen or o.khach_hang.TaiKhoanID # Fallback
            # If we want username:
            if o.khach_hang.tai_khoan:
                user_name = f"{o.khach_hang.HoTen} ({o.khach_hang.tai_khoan.TenDangNhap})"
            user_id = o.khach_hang.TaiKhoanID
        
        res.append({
            "don_hang_id": o.DonHangID,
            "ngay_dat": o.NgayDat,
            "tong_tien": float(o.TongTien) if o.TongTien else 0.0,
            "trang_thai": o.TrangThai,
            "dia_chi_giao_hang": o.DiaChiGiaoHang,
            "sdt_nguoi_nhan": o.SDTNguoiNhan,
            "ten_nguoi_nhan": o.TenNguoiNhan,
            "phuong_thuc_thanh_toan": o.PhuongThucThanhToan,
            "ghi_chu": o.GhiChu,
            "user_id": user_id,
            "ten_user": user_name
        })
    return res

@router.get("/stats")
def get_order_stats(db: Session = Depends(get_db)):
    total_orders = db.query(DonHang).count()
    success_orders = db.query(DonHang).filter(DonHang.TrangThai == 'Đã nhận hàng').count()
    revenue = db.query(func.sum(DonHang.TongTien)).filter(DonHang.TrangThai == 'Đã nhận hàng').scalar() or 0
    return {
        "tong_don": total_orders,
        "don_thanh_cong": success_orders,
        "doanh_thu": float(revenue)
    }

@router.get("/{id}", response_model=AdminDonHangDetailResponse)
def get_order_detail(id: int, db: Session = Depends(get_db)):
    order = db.query(DonHang).filter(DonHang.DonHangID == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # details = db.query(CTDonHang).filter(CTDonHang.DonHangID == id).all()
    # Using relationship
    details = order.chi_tiets
    
    chi_tiets_data = []
    for d in details:
        # relationship in CTDonHang is cay_canh
        cay = d.cay_canh
        chi_tiets_data.append({
            "ten_cay": cay.TenCay if cay else "Unknown",
            "hinh_anh": cay.HinhAnh if cay else None,
            "so_luong": d.SoLuong,
            "don_gia": float(d.DonGia),
            "thanh_tien": float(d.ThanhTien)
        })
    
    user_name = "Khách vãng lai"
    user_id = None
    if order.khach_hang:
        if order.khach_hang.tai_khoan:
            user_name = f"{order.khach_hang.HoTen} ({order.khach_hang.tai_khoan.TenDangNhap})"
        else:
            user_name = order.khach_hang.HoTen
        user_id = order.khach_hang.TaiKhoanID

    return {
        "don_hang_id": order.DonHangID,
        "ngay_dat": order.NgayDat,
        "tong_tien": float(order.TongTien) if order.TongTien else 0.0,
        "trang_thai": order.TrangThai,
        "dia_chi_giao_hang": order.DiaChiGiaoHang,
        "sdt_nguoi_nhan": order.SDTNguoiNhan,
        "ten_nguoi_nhan": order.TenNguoiNhan,
        "phuong_thuc_thanh_toan": order.PhuongThucThanhToan,
        "ghi_chu": order.GhiChu,
        "user_id": user_id,
        "ten_user": user_name,
        "chi_tiets": chi_tiets_data
    }

@router.post("/{id}/status")
def update_order_status(id: int, status: str, db: Session = Depends(get_db)):
    """
    Status: xac-nhan, giao-hang, hoan-thanh, huy
    """
    order = db.query(DonHang).filter(DonHang.DonHangID == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

    if status == 'xac-nhan':
        order.TrangThai = 'Đã xác nhận'
    elif status == 'giao-hang':
        order.TrangThai = 'Đang giao hàng'
        order.NgayGiaoHang = datetime.now()
    elif status == 'hoan-thanh':
        order.TrangThai = 'Đã nhận hàng'
        order.NgayHoanThanh = datetime.now()
    elif status == 'huy':
        order.TrangThai = 'Đã hủy'
        order.NgayHuy = datetime.now()
    else:
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ")

    db.commit()
    return {"message": "Cập nhật trạng thái thành công"}
