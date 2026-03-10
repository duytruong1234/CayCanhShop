from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class BinhLuan(Base):
    """Bảng BinhLuan - Đánh giá sản phẩm"""
    __tablename__ = "BinhLuan"
    
    BinhLuanID = Column(Integer, primary_key=True, autoincrement=True)
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), nullable=False)
    TaiKhoanID = Column(Integer, ForeignKey("TaiKhoan.TaiKhoanID"), nullable=False)
    NoiDung = Column(String(1000))
    SoSao = Column(Integer)
    NgayBinhLuan = Column(DateTime, default=datetime.now)
    HinhAnh = Column(String(255))
    DonHangID = Column(Integer, ForeignKey("DonHang.DonHangID"), nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("SoSao >= 1 AND SoSao <= 5", name="CK_BinhLuan_SoSao"),
    )
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="binh_luans")
    tai_khoan = relationship("TaiKhoan", back_populates="binh_luans")
    don_hang = relationship("DonHang", back_populates="binh_luans")
