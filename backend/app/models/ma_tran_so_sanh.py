from sqlalchemy import Column, String, Float, ForeignKey
from app.database import Base


class MaTranSoSanh(Base):
    """Ma trận so sánh cặp giữa các Tiêu Chí (4x4)"""
    __tablename__ = "MaTranSoSanh"

    TieuChiDong = Column(String(10), ForeignKey("TieuChi.MaTieuChi"), primary_key=True)
    TieuChiCot = Column(String(10), ForeignKey("TieuChi.MaTieuChi"), primary_key=True)
    GiaTriTieuChi = Column(Float, nullable=False)
