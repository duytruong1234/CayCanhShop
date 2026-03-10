from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class NhanVien(Base):
    """Bảng NhanVien - Thông tin nhân viên"""
    __tablename__ = "NhanVien"
    
    NhanVienID = Column(Integer, primary_key=True, autoincrement=True)
    TaiKhoanID = Column(Integer, ForeignKey("TaiKhoan.TaiKhoanID"), unique=True)
    HoTen = Column(String(100))
    GioiTinh = Column(String(10))
    NgaySinh = Column(Date)
    DiaChi = Column(String(255))
    DienThoai = Column(String(20))
    Email = Column(String(100))
    ChucVuID = Column(Integer, ForeignKey("ChucVu.ChucVuID"))
    
    # Relationships
    tai_khoan = relationship("TaiKhoan", back_populates="nhan_vien")
    chuc_vu = relationship("ChucVu", back_populates="nhan_viens")
    don_hangs_duyet = relationship("DonHang", back_populates="nguoi_duyet_ref")
