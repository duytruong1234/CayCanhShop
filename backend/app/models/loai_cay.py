from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class LoaiCay(Base):
    """Bảng LoaiCay - Danh mục loại cây"""
    __tablename__ = "LoaiCay"
    
    LoaiCayID = Column(Integer, primary_key=True, autoincrement=True)
    TenLoai = Column(String(100), nullable=False)
    MoTa = Column(String(255))
    
    # Relationships
    cay_canhs = relationship("CayCanh", back_populates="loai_cay")
