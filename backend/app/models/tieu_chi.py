from sqlalchemy import Column, String, Float
from app.database import Base


class TieuChi(Base):
    """Bảng tiêu chí AHP (C1: Nhiệt độ, C2: Ánh sáng, ...)"""
    __tablename__ = "TieuChi"

    MaTieuChi = Column(String(10), primary_key=True)  # 'C1', 'C2', ...
    TenTieuChi = Column(String(200), nullable=False)
    TrongSoTieuChi = Column(Float, default=0)  # Calculated weight
    CR_PhuongAn = Column(Float, default=0)  # CR of plant comparison matrix for this criterion
