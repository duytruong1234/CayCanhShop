from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models import DonHang, CTDonHang, CayCanh, KhachHang
from app.utils.auth import get_current_admin

router = APIRouter(
    prefix="/admin/thong-ke",
    tags=["Admin - Thống kê"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/tong-quan")
async def get_summary_stats(db: Session = Depends(get_db)):
    """Thống kê tổng quan: Doanh thu, Đơn hàng, Khách hàng"""
    
    # Tổng doanh thu (đơn đã giao/hoàn thành)
    revenue = db.query(func.sum(DonHang.TongTien)).filter(
        DonHang.TrangThai.in_(['Đã nhận hàng', 'Đã giao hàng'])
    ).scalar() or 0
    total_orders = db.query(DonHang).count()
    pending_orders = db.query(DonHang).filter(DonHang.TrangThai == 'Chờ xác nhận').count()
    total_customers = db.query(KhachHang).count()
    
    return {
        "revenue": float(revenue),
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_customers": total_customers
    }

@router.get("/doanh-thu")
async def get_revenue_chart(days: int = 7, db: Session = Depends(get_db)):
    """Biểu đồ doanh thu theo ngày (mặc định 7 ngày gần nhất)"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    orders = db.query(DonHang).filter(
        DonHang.TrangThai.in_(['Đã nhận hàng', 'Đã giao hàng']),
        DonHang.NgayDat >= start_date
    ).all()
    data = {} 
    for i in range(days):
        d = (start_date + timedelta(days=i)).strftime("%d/%m")
        data[d] = 0.0
    for o in orders:
        if o.NgayDat:
            d = o.NgayDat.strftime("%d/%m")
            if d in data:
                data[d] += float(o.TongTien or 0)
    return [{"date": k, "revenue": v} for k, v in data.items()]

@router.get("/trang-thai-don-hang")
async def get_order_status_chart(db: Session = Depends(get_db)):
    """Biểu đồ tròn tỉ lệ trạng thái đơn hàng"""
    statuses = db.query(DonHang.TrangThai).all()
    
    counts = {}
    for (s,) in statuses:
        if not s:
            s = "Khác"
        s_norm = s
        if "xác nh?n" in s or "xác nhận" in s: # Covers "Chờ xác nhận", "Đã xác nhận"
             if "Ch?" in s or "Chờ" in s: s_norm = "Chờ xác nhận"
             elif "Đã" in s or "xác nhận" in s: s_norm = "Đã xác nhận" # "Đã" might be "Đ?"
        elif "giao" in s: s_norm = "Đang giao hàng"
        elif "nh?n" in s or "nhận" in s: s_norm = "Đã nhận hàng"
        elif "h?y" in s or "hủy" in s: s_norm = "Đã hủy"
        else:
            if s == "Chờ xác nhận": s_norm = "Chờ xác nhận"
            if s == "Đã hủy": s_norm = "Đã hủy"
        std_map = {
            "Chờ xác nhận": "Chờ xác nhận",
            "Đã xác nhận": "Đã xác nhận", 
            "Đang giao hàng": "Đang giao hàng",
            "Đã nhận hàng": "Đã nhận hàng",
            "Đã hủy": "Đã hủy"
        }
        if s in std_map:
            s_norm = std_map[s]

        counts[s_norm] = counts.get(s_norm, 0) + 1
    
    return [{"name": k, "value": v} for k, v in counts.items()]

@router.get("/top-san-pham")
async def get_top_products(limit: int = 5, db: Session = Depends(get_db)):
    """Top sản phẩm bán chạy nhất"""
    results = db.query(
        CayCanh.TenCay,
        func.sum(CTDonHang.SoLuong).label("total_sold")
    ).join(CTDonHang, CayCanh.CayCanhID == CTDonHang.CayCanhID)\
     .join(DonHang, CTDonHang.DonHangID == DonHang.DonHangID)\
     .filter(DonHang.TrangThai.in_(['Đã nhận hàng', 'Đã giao hàng']))\
     .group_by(CayCanh.TenCay)\
     .order_by(func.sum(CTDonHang.SoLuong).desc())\
     .limit(limit)\
     .all()
     
    return [{"name": r[0], "sold": r[1]} for r in results]
