from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class VaiTro(Base):
    """Bảng VaiTro - Phân quyền người dùng"""
    __tablename__ = "VaiTro"
    
    VaiTroID = Column(Integer, primary_key=True, autoincrement=True)
    TenVaiTro = Column(String(50))
    MoTa = Column(String(200))
    
    # Relationships
    tai_khoans = relationship("TaiKhoan", back_populates="vai_tro")
