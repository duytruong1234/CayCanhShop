from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class TonKho(Base):
    """Bảng TonKho - Quản lý tồn kho"""
    __tablename__ = "TonKho"
    
    TonKhoID = Column(Integer, primary_key=True, autoincrement=True)
    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID", ondelete="CASCADE"), nullable=False)
    SoLuongTon = Column(Integer, nullable=False, default=0)
    NgayCapNhat = Column(DateTime, nullable=False, default=datetime.now)
    
    # Relationships
    cay_canh = relationship("CayCanh", back_populates="ton_kho")
