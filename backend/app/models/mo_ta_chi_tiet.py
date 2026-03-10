from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class MoTaChiTiet(Base):
    """Bảng MoTaChiTiet - Mô tả chi tiết sản phẩm"""
    __tablename__ = "MoTaChiTiet"
    
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    TieuDe = Column(String(200))
    NoiDung = Column(String)  # nvarchar(max)
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="mo_ta_chi_tiet")
