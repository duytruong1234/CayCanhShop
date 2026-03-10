from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CayCanh(Base):
    """Bảng CayCanh - Sản phẩm cây cảnh"""
    __tablename__ = "CayCanh"
    
    CayCanhID = Column(Integer, primary_key=True, autoincrement=True)
    TenCay = Column(String(100), nullable=False)
    Gia = Column(Numeric(18, 2), nullable=False)
    MoTa = Column(String(500))
    HinhAnh = Column(String(255))
    LoaiCayID = Column(Integer, ForeignKey("LoaiCay.LoaiCayID"))
    
    # Quan hệ
    loai_cay = relationship("LoaiCay", back_populates="cay_canhs")
    ton_kho = relationship("TonKho", back_populates="cay_canh", uselist=False)
    gio_hang_chi_tiets = relationship("GioHangChiTiet", back_populates="cay_canh")
    ct_don_hangs = relationship("CTDonHang", back_populates="cay_canh")
    binh_luans = relationship("BinhLuan", back_populates="cay_canh")
    mo_ta_chi_tiet = relationship("MoTaChiTiet", back_populates="cay_canh", uselist=False)
    cach_cham_socs = relationship("CachChamSoc", back_populates="cay_canh")
    dac_diem_noi_bats = relationship("DacDiemNoiBat", back_populates="cay_canh")
    thong_tin_khoa_hoc = relationship("ThongTinKhoaHoc", back_populates="cay_canh", uselist=False)
    
    # Quan hệ AHP
    dac_diems = relationship("CayCanhDacDiem", back_populates="cay_canh")
