from pydantic import BaseModel
from typing import Optional, List


# ================= THÔNG TIN KHOA HỌC =================
class ThongTinKhoaHocBase(BaseModel):
    ten_khoa_hoc: Optional[str] = None
    ho_thuc_vat: Optional[str] = None
    nguon_goc: Optional[str] = None
    ten_goi_khac: Optional[str] = None


class ThongTinKhoaHocCreate(ThongTinKhoaHocBase):
    cay_canh_id: int


class ThongTinKhoaHocResponse(ThongTinKhoaHocBase):
    cay_canh_id: int
    
    class Config:
        from_attributes = True


# ================= MÔ TẢ CHI TIẾT =================
class MoTaChiTietBase(BaseModel):
    tieu_de: Optional[str] = None
    noi_dung: Optional[str] = None


class MoTaChiTietCreate(MoTaChiTietBase):
    cay_canh_id: int


class MoTaChiTietResponse(MoTaChiTietBase):
    cay_canh_id: int
    
    class Config:
        from_attributes = True


# ================= ĐẶC ĐIỂM NỔI BẬT =================
class DacDiemNoiBatBase(BaseModel):
    noi_dung: str


class DacDiemNoiBatCreate(BaseModel):
    cay_canh_id: int
    noi_dungs: List[str]


class DacDiemNoiBatResponse(BaseModel):
    dac_diem_id: int
    cay_canh_id: int
    noi_dung: str
    
    class Config:
        from_attributes = True


# ================= CÁCH CHĂM SÓC =================
class CachChamSocItem(BaseModel):
    tieu_de: str
    noi_dung: str


class CachChamSocCreate(BaseModel):
    cay_canh_id: int
    anh_sang: Optional[str] = None
    tuoi_nuoc: Optional[str] = None
    dat_trong: Optional[str] = None
    nhiet_do: Optional[str] = None
    bon_phan: Optional[str] = None


class CachChamSocResponse(BaseModel):
    cay_canh_id: int
    items: List[CachChamSocItem]
    
    class Config:
        from_attributes = True


# ================= TỔNG HỢP BÀI VIẾT =================
class BaiVietTongHopResponse(BaseModel):
    cay_canh_id: int
    ten_cay: Optional[str] = None
    thong_tin_khoa_hoc: Optional[ThongTinKhoaHocResponse] = None
    mo_ta_chi_tiet: Optional[MoTaChiTietResponse] = None
    dac_diem_noi_bat: List[DacDiemNoiBatResponse] = []
    cach_cham_soc: List[CachChamSocItem] = []
    
    class Config:
        from_attributes = True
