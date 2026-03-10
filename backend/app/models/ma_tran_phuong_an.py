from sqlalchemy import Column, String, Integer, Float, ForeignKey
from app.database import Base


class MaTranPhuongAn(Base):
    """Ma trận so sánh cặp giữa các Cây theo từng Tiêu Chí (10x10 per criterion)"""
    __tablename__ = "MaTranPhuongAn"

    MaTieuChi = Column(String(10), ForeignKey("TieuChi.MaTieuChi"), primary_key=True)
    CayDongID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    CayCotID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    GiaTriPhuongAn = Column(Float, nullable=False)
