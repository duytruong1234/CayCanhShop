from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CachChamSoc(Base):
    """Bảng CachChamSoc - Hướng dẫn chăm sóc cây"""
    __tablename__ = "CachChamSoc"
    
    ID = Column(Integer, primary_key=True, autoincrement=True)
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"))
    TieuDe = Column(String(200))
    NoiDung = Column(String)  # nvarchar(max)
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="cach_cham_socs")
