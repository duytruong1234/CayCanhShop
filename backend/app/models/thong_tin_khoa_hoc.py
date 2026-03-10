from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ThongTinKhoaHoc(Base):
    """Bảng ThongTinKhoaHoc - Thông tin khoa học của cây"""
    __tablename__ = "ThongTinKhoaHoc"
    
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    TenKhoaHoc = Column(String(200))
    HoThucVat = Column(String(200))
    NguonGoc = Column(String(300))
    TenGoiKhac = Column(String(300))
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="thong_tin_khoa_hoc")
