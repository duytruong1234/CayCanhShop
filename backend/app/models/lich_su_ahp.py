from sqlalchemy import Column, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class LichSuAHP(Base):
    """Bảng LichSuAHP - Lưu lịch sử đánh giá AHP của khách hàng"""
    __tablename__ = "LichSuAHP"
    
    LichSuAHPID = Column(Integer, primary_key=True, autoincrement=True)
    TaiKhoanID = Column(Integer, ForeignKey("TaiKhoan.TaiKhoanID"), nullable=False)
    NgayDanhGia = Column(DateTime, default=datetime.now, nullable=False)
    TrongSoTieuChi = Column(Text)       # JSON: {"GIA": 0.3, "DEP": 0.4, ...}
    CRTieuChi = Column(Float)           # Giá trị CR
    CauTraLoi = Column(Text)            # JSON: {"0": "A", "1": "B", ...}
    KetQua = Column(Text)               # JSON: [{"cay_canh_id": 1, "ten_cay": "...", "score": 45.2}, ...]
    CayDuocChonID = Column(Integer, ForeignKey("CayCanh.CayCanhID"), nullable=True)
    
    # Relationships
    tai_khoan = relationship("TaiKhoan", backref="lich_su_ahps")
    cay_duoc_chon = relationship("CayCanh", backref="lich_su_ahps")
