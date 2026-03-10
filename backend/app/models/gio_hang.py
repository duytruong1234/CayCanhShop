from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class GioHang(Base):
    """Bảng GioHang - Giỏ hàng của khách"""
    __tablename__ = "GioHang"
    
    GioHangID = Column(Integer, primary_key=True, autoincrement=True)
    TaiKhoanID = Column(Integer, ForeignKey("TaiKhoan.TaiKhoanID"), nullable=False)
    NgayCapNhat = Column(DateTime, default=datetime.now)
    
    # Relationships
    tai_khoan = relationship("TaiKhoan", back_populates="gio_hang")
    chi_tiets = relationship("GioHangChiTiet", back_populates="gio_hang", cascade="all, delete-orphan")


class GioHangChiTiet(Base):
    """Bảng GioHangChiTiet - Chi tiết giỏ hàng"""
    __tablename__ = "GioHangChiTiet"
    
    GHCTID = Column(Integer, primary_key=True, autoincrement=True)
    GioHangID = Column(Integer, ForeignKey("GioHang.GioHangID"), nullable=False)
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), nullable=False)
    SoLuong = Column(Integer, nullable=False, default=1)
    DonGia = Column(Numeric(18, 2), nullable=False)
    
    # Relationships
    gio_hang = relationship("GioHang", back_populates="chi_tiets")
    cay_canh = relationship("CayCanh", back_populates="gio_hang_chi_tiets")
