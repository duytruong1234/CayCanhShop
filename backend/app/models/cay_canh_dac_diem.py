from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CayCanhDacDiem(Base):
    """Bảng liên kết nhiều-nhiều giữa CayCanh và DacDiem"""
    __tablename__ = "CayCanh_DacDiem"

    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    MaDacDiem = Column(String(20), ForeignKey("DacDiem.MaDacDiem"), primary_key=True)
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="dac_diems")
    dac_diem = relationship("DacDiem")
