from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class TaiKhoan(Base):
    """Bảng TaiKhoan - Quản lý tài khoản đăng nhập"""
    __tablename__ = "TaiKhoan"
    
    TaiKhoanID = Column(Integer, primary_key=True, autoincrement=True)
    TenDangNhap = Column(String(50), unique=True, nullable=False)
    MatKhau = Column(String(255), nullable=False)
    Email = Column(String(100))
    DienThoai = Column(String(20))
    VaiTroID = Column(Integer, ForeignKey("VaiTro.VaiTroID"), nullable=False)
    TrangThai = Column(String(30), default="Hoạt động")
    NgayTao = Column(DateTime, default=datetime.now)
    
    # Ràng buộc
    __table_args__ = (
        CheckConstraint("TrangThai IN (N'Hoạt động', N'Bị khóa')", name="CK_TaiKhoan_TrangThai"),
    )
    
    # Quan hệ
    vai_tro = relationship("VaiTro", back_populates="tai_khoans")
    khach_hang = relationship("KhachHang", back_populates="tai_khoan", uselist=False)
    nhan_vien = relationship("NhanVien", back_populates="tai_khoan", uselist=False)
    gio_hang = relationship("GioHang", back_populates="tai_khoan")
    binh_luans = relationship("BinhLuan", back_populates="tai_khoan")
