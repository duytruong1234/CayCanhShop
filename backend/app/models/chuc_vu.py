from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class ChucVu(Base):
    """Bảng ChucVu - Chức vụ nhân viên"""
    __tablename__ = "ChucVu"
    
    ChucVuID = Column(Integer, primary_key=True, autoincrement=True)
    TenChucVu = Column(String(100), nullable=False)
    MoTa = Column(String(255))
    
    # Relationships
    nhan_viens = relationship("NhanVien", back_populates="chuc_vu")
