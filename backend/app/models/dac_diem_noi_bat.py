from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class DacDiemNoiBat(Base):
    """Bảng DacDiemNoiBat - Đặc điểm nổi bật của cây"""
    __tablename__ = "DacDiemNoiBat"
    
    ID = Column(Integer, primary_key=True, autoincrement=True)
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"))
    NoiDung = Column(String(300))
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="dac_diem_noi_bats")
