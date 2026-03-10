from sqlalchemy import Column, String, Integer, Float, ForeignKey
from app.database import Base


class TrongSoPhuongAn(Base):
    """Bảng trọng số tính toán của từng cây theo từng tiêu chí (Local Weight)"""
    __tablename__ = "TrongSoPhuongAn"

    CayCanhID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), primary_key=True)
    MaTieuChi = Column(String(10), ForeignKey("TieuChi.MaTieuChi"), primary_key=True)
    TrongSoPhuongAn = Column(Float, default=0)  # Weight score (e.g., 0.156)
