from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal


# ==================== LOẠI CÂY ====================
class LoaiCayBase(BaseModel):
    ten_loai: str = Field(..., max_length=100)
    mo_ta: Optional[str] = Field(None, max_length=255)


class LoaiCayCreate(LoaiCayBase):
    pass


class LoaiCayResponse(LoaiCayBase):
    loai_cay_id: int
    
    class Config:
        from_attributes = True


# ==================== CÂY CẢNH ====================
# ==================== CÂY CẢNH ====================
class CayCanhBase(BaseModel):
    ten_cay: str = Field(..., max_length=100)
    gia: Decimal = Field(..., gt=0)
    mo_ta: Optional[str] = Field(None, max_length=500)
    loai_cay_id: Optional[int] = None


class CayCanhCreate(CayCanhBase):
    dac_diems: Optional[List[str]] = []


class CayCanhUpdate(BaseModel):
    ten_cay: Optional[str] = None
    gia: Optional[Decimal] = None
    mo_ta: Optional[str] = None
    loai_cay_id: Optional[int] = None
    dac_diems: Optional[List[str]] = None


class CayCanhResponse(CayCanhBase):
    cay_canh_id: int
    hinh_anh: Optional[str] = None
    loai_cay: Optional[LoaiCayResponse] = None
    so_luong_ton: Optional[int] = None
    dac_diems: List[str] = []
    
    class Config:
        from_attributes = True


# ==================== TỒN KHO ====================
class TonKhoResponse(BaseModel):
    ton_kho_id: int
    cay_canh_id: int
    so_luong_ton: int
    ten_cay: Optional[str] = None
    
    class Config:
        from_attributes = True


class TonKhoUpdate(BaseModel):
    so_luong_ton: int = Field(..., ge=0)


# ==================== THÔNG TIN CHI TIẾT ====================
class MoTaChiTietResponse(BaseModel):
    cay_canh_id: int
    tieu_de: Optional[str]
    noi_dung: Optional[str]
    
    class Config:
        from_attributes = True


class CachChamSocResponse(BaseModel):
    id: int
    cay_canh_id: int
    tieu_de: Optional[str]
    noi_dung: Optional[str]
    
    class Config:
        from_attributes = True


class DacDiemNoiBatResponse(BaseModel):
    id: int
    cay_canh_id: int
    noi_dung: Optional[str]
    
    class Config:
        from_attributes = True


class ThongTinKhoaHocResponse(BaseModel):
    cay_canh_id: int
    ten_khoa_hoc: Optional[str]
    ho_thuc_vat: Optional[str]
    nguon_goc: Optional[str]
    ten_goi_khac: Optional[str]
    
    class Config:
        from_attributes = True


# ==================== CÂY CẢNH CHI TIẾT (FULL) ====================
class CayCanhDetailResponse(CayCanhResponse):
    mo_ta_chi_tiet: Optional[MoTaChiTietResponse] = None
    cach_cham_socs: List[CachChamSocResponse] = []
    dac_diem_noi_bats: List[DacDiemNoiBatResponse] = []
    thong_tin_khoa_hoc: Optional[ThongTinKhoaHocResponse] = None
    
    class Config:
        from_attributes = True
