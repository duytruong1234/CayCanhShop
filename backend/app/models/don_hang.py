from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class DonHang(Base):
    """Bảng DonHang - Đơn hàng"""
    __tablename__ = "DonHang"
    
    DonHangID = Column(Integer, primary_key=True, autoincrement=True)
    KhachHangID = Column(Integer, ForeignKey("KhachHang.KhachHangID"))
    NgayDat = Column(DateTime, default=datetime.now)
    TongTien = Column(Numeric(18, 2))
    TrangThai = Column(String(50), default="Chờ xác nhận")
    NgayDuyet = Column(DateTime)
    NguoiDuyet = Column(Integer, ForeignKey("NhanVien.NhanVienID"))
    NgayHuy = Column(DateTime)
    TenNguoiNhan = Column(String(100))
    SDTNguoiNhan = Column(String(20))
    DiaChiGiaoHang = Column(String(255))
    GhiChu = Column(String(255))
    PhuongThucThanhToan = Column(String(50))
    NgayGiaoHang = Column(DateTime)
    NgayHoanThanh = Column(DateTime)
    
    # Relationships
    khach_hang = relationship("KhachHang", back_populates="don_hangs")
    nguoi_duyet_ref = relationship("NhanVien", back_populates="don_hangs_duyet")
    chi_tiets = relationship("CTDonHang", back_populates="don_hang", cascade="all, delete-orphan")
    binh_luans = relationship("BinhLuan", back_populates="don_hang")


class CTDonHang(Base):
    """Bảng CT_DonHang - Chi tiết đơn hàng"""
    __tablename__ = "CT_DonHang"
    
    CTDonHangID = Column(Integer, primary_key=True, autoincrement=True)
    DonHangID = Column(Integer, ForeignKey("DonHang.DonHangID"))
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"))
    SoLuong = Column(Integer)
    DonGia = Column(Numeric(18, 2))
    ThanhTien = Column(Numeric(18, 2))
    
    # Relationships
    don_hang = relationship("DonHang", back_populates="chi_tiets")
    cay_canh = relationship("CayCanh", back_populates="ct_don_hangs")
