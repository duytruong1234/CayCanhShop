from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class KhachHang(Base):
    """Bảng KhachHang - Thông tin khách hàng"""
    __tablename__ = "KhachHang"
    
    KhachHangID = Column(Integer, primary_key=True, autoincrement=True)
    TaiKhoanID = Column(Integer, ForeignKey("TaiKhoan.TaiKhoanID"))
    HoTen = Column(String(100))
    GioiTinh = Column(String(10))
    NgaySinh = Column(Date)
    DiaChi = Column(String(255))
    
    # Relationships
    tai_khoan = relationship("TaiKhoan", back_populates="khach_hang")
    don_hangs = relationship("DonHang", back_populates="khach_hang")
