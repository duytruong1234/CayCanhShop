from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


# ==================== GIỎ HÀNG CHI TIẾT ====================
class GioHangChiTietBase(BaseModel):
    cay_canh_id: int
    so_luong: int = Field(default=1, ge=1)


class GioHangChiTietResponse(BaseModel):
    ghct_id: int
    gio_hang_id: int
    cay_canh_id: int
    so_luong: int
    don_gia: Decimal
    ten_cay: Optional[str] = None
    hinh_anh: Optional[str] = None
    thanh_tien: Decimal = Decimal(0)
    
    class Config:
        from_attributes = True


# ==================== GIỎ HÀNG ====================
class GioHangResponse(BaseModel):
    gio_hang_id: int
    tai_khoan_id: int
    ngay_cap_nhat: Optional[datetime]
    chi_tiets: List[GioHangChiTietResponse] = []
    tong_tien: Decimal = Decimal(0)
    tong_so_luong: int = 0
    
    class Config:
        from_attributes = True


# ==================== THÊM VÀO GIỎ ====================
class ThemVaoGioRequest(BaseModel):
    cay_canh_id: int
    so_luong: int = Field(default=1, ge=1)


class UpdateQtyRequest(BaseModel):
    change: int  # +1 hoặc -1
