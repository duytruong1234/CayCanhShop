from sqlalchemy import Column, String
from app.database import Base


class DacDiem(Base):
    """Bảng đặc điểm nổi bật (Có hoa, Không độc, Ít mùi, ...)"""
    __tablename__ = "DacDiem"

    MaDacDiem = Column(String(20), primary_key=True)
    TenDacDiem = Column(String(50), nullable=False)
