from sqlalchemy import Column, String, Float
from app.database import Base


class AHPThongSoTieuChi(Base):
    """Bảng cấu hình thông số chung AHP (CR tổng thể, RI, CI, ...)"""
    __tablename__ = "AHP_ThongSoTieuChi"

    MaThongSo = Column(String(50), primary_key=True)  # 'CR_TieuChi_TongThe'
    GiaTri = Column(Float, default=0)
