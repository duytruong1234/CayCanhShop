from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import TaiKhoan, KhachHang, VaiTro
from app.utils.auth import get_current_admin
from pydantic import BaseModel
from datetime import date
import bcrypt

router = APIRouter(
    prefix="/admin/khach-hang",
    tags=["Admin Khach Hang"],
    dependencies=[Depends(get_current_admin)]
)

class KhachHangResponse(BaseModel):
    user_id: int
    ten_dang_nhap: str
    ho_ten: Optional[str]
    email: Optional[str]
    dien_thoai: Optional[str]
    gioi_tinh: Optional[str]
    ngay_sinh: Optional[date]
    dia_chi: Optional[str]
    vai_tro_id: int
    ten_vai_tro: str

    class Config:
        from_attributes = True

class CreateKhachHang(BaseModel):
    ten_dang_nhap: str
    mat_khau: str
    ho_ten: str
    email: str
    dien_thoai: str
    gioi_tinh: str = "Nam"
    dia_chi: str
    vai_tro_id: int = 2  # Default to Customer

@router.get("/", response_model=List[KhachHangResponse])
def get_all_customers(db: Session = Depends(get_db)):
    # Join TaiKhoan and KhachHang
    results = db.query(TaiKhoan, KhachHang, VaiTro).outerjoin(
        KhachHang, TaiKhoan.TaiKhoanID == KhachHang.TaiKhoanID
    ).join(
        VaiTro, TaiKhoan.VaiTroID == VaiTro.VaiTroID
    ).all()

    res = []
    for tk, kh, vt in results:
        res.append({
            "user_id": tk.TaiKhoanID,
            "ten_dang_nhap": tk.TenDangNhap,
            "ho_ten": kh.HoTen if kh else "",
            "email": tk.Email,
            "dien_thoai": tk.DienThoai,
            "gioi_tinh": kh.GioiTinh if kh else "",
            "ngay_sinh": kh.NgaySinh if kh else None,
            "dia_chi": kh.DiaChi if kh else "",
            "vai_tro_id": tk.VaiTroID,
            "ten_vai_tro": vt.TenVaiTro if vt else "Unknown"
        })
    return res

@router.post("/")
def create_customer(data: CreateKhachHang, db: Session = Depends(get_db)):
    if db.query(TaiKhoan).filter(TaiKhoan.TenDangNhap == data.ten_dang_nhap).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    if db.query(TaiKhoan).filter(TaiKhoan.Email == data.email).first():
         raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    hashed_pw = bcrypt.hashpw(data.mat_khau.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create TaiKhoan
    new_acc = TaiKhoan(
        TenDangNhap=data.ten_dang_nhap,
        MatKhau=hashed_pw,
        Email=data.email,
        DienThoai=data.dien_thoai,
        VaiTroID=data.vai_tro_id,
        TrangThai="Hoạt động"
    )
    db.add(new_acc)
    db.flush() # Get ID

    # Create KhachHang profile
    new_kh = KhachHang(
        TaiKhoanID=new_acc.TaiKhoanID,
        HoTen=data.ho_ten,
        GioiTinh=data.gioi_tinh,
        DiaChi=data.dia_chi
        # NgaySinh
    )
    db.add(new_kh)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Lỗi database: {str(e)}")
        
    return {"message": "Thêm thành công"}

@router.delete("/{id}")
def delete_customer(id: int, db: Session = Depends(get_db)):
    tk = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == id).first()
    if not tk:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Cascade should handle KhachHang but check DB config
        # Safe way: Delete KhachHang first if no Cascade
        kh = db.query(KhachHang).filter(KhachHang.TaiKhoanID == id).first()
        if kh:
            db.delete(kh)
            
        db.delete(tk)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Không thể xóa user này (Lỗi: {str(e)})")
    
    return {"message": "Xóa thành công"}

@router.post("/{id}/reset-password")
def reset_password(id: int, new_pass: str, db: Session = Depends(get_db)):
    tk = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == id).first()
    if not tk:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed = bcrypt.hashpw(new_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    tk.MatKhau = hashed
    db.commit()
    return {"message": "Đặt lại mật khẩu thành công"}
