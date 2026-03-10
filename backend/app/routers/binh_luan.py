from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.models import TaiKhoan, BinhLuan, DonHang, CayCanh, KhachHang
from app.schemas.binh_luan import BinhLuanCreate, BinhLuanResponse
from app.utils.auth import get_current_user
from app.utils.file_handler import save_upload_file

router = APIRouter(prefix="/binh-luan", tags=["Bình Luận"])


@router.post("/")
async def them_binh_luan(
    cay_canh_id: int = Form(...),
    don_hang_id: int = Form(...),
    so_sao: int = Form(...),
    noi_dung: Optional[str] = Form(None),
    hinh_anh: Optional[UploadFile] = File(None),
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Thêm đánh giá sản phẩm"""
    
    # Kiểm tra đơn hàng có thuộc về user không
    don_hang = db.query(DonHang).join(KhachHang).filter(
        DonHang.DonHangID == don_hang_id,
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if not don_hang:
        raise HTTPException(status_code=400, detail="Đơn hàng không hợp lệ")
    
    # Kiểm tra đơn hàng đã hoàn thành chưa
    if don_hang.TrangThai != "Đã nhận hàng":
        raise HTTPException(status_code=400, detail="Chỉ được đánh giá sau khi nhận hàng")
    
    # Kiểm tra đã đánh giá chưa
    existing = db.query(BinhLuan).filter(
        BinhLuan.CayCanhID == cay_canh_id,
        BinhLuan.DonHangID == don_hang_id,
        BinhLuan.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Sản phẩm trong đơn này đã được đánh giá")
    
    # Upload hình ảnh nếu có
    filename = None
    if hinh_anh:
        filename = await save_upload_file(hinh_anh, "binhluan")
    
    # Tạo bình luận
    binh_luan = BinhLuan(
        CayCanhID=cay_canh_id,
        DonHangID=don_hang_id,
        TaiKhoanID=current_user.TaiKhoanID,
        SoSao=so_sao,
        NoiDung=noi_dung,
        HinhAnh=filename,
        NgayBinhLuan=datetime.now()
    )
    db.add(binh_luan)
    db.commit()
    
    return {"success": True, "message": "Đánh giá thành công!"}


@router.get("/cay-canh/{cay_canh_id}")
async def get_binh_luan_cay_canh(
    cay_canh_id: int,
    db: Session = Depends(get_db)
):
    """Lấy danh sách bình luận của một cây cảnh"""
    
    binh_luans = db.query(BinhLuan).filter(
        BinhLuan.CayCanhID == cay_canh_id
    ).order_by(BinhLuan.NgayBinhLuan.desc()).all()
    
    result = []
    for bl in binh_luans:
        tai_khoan = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == bl.TaiKhoanID).first()
        khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == bl.TaiKhoanID).first()
        
        result.append({
            "binh_luan_id": bl.BinhLuanID,
            "cay_canh_id": bl.CayCanhID,
            "so_sao": bl.SoSao,
            "noi_dung": bl.NoiDung,
            "hinh_anh": bl.HinhAnh,
            "ngay_binh_luan": bl.NgayBinhLuan,
            "ten_nguoi_dung": khach_hang.HoTen if khach_hang else tai_khoan.TenDangNhap
        })
    
    return result
