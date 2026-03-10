from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


# ==================== CHI TIẾT ĐƠN HÀNG ====================
class CTDonHangResponse(BaseModel):
    ct_don_hang_id: int
    don_hang_id: int
    cay_canh_id: int
    so_luong: int
    don_gia: Decimal
    thanh_tien: Decimal
    ten_cay: Optional[str] = None
    hinh_anh: Optional[str] = None
    
    class Config:
        from_attributes = True


# ==================== ĐƠN HÀNG ====================
class DonHangBase(BaseModel):
    ten_nguoi_nhan: str = Field(..., max_length=100)
    sdt_nguoi_nhan: str = Field(..., pattern=r"^\d{10}$")
    dia_chi_giao_hang: str = Field(..., max_length=255)
    ghi_chu: Optional[str] = Field(None, max_length=255)
    phuong_thuc_thanh_toan: str = Field(..., pattern="^(COD|Chuyển khoản)$")


class DatHangRequest(DonHangBase):
    pass


class DonHangResponse(BaseModel):
    don_hang_id: int
    khach_hang_id: Optional[int] = None
    ngay_dat: Optional[datetime] = None
    tong_tien: Optional[Decimal] = None
    trang_thai: Optional[str] = None
    ngay_duyet: Optional[datetime] = None
    ngay_huy: Optional[datetime] = None
    ten_nguoi_nhan: Optional[str] = None
    sdt_nguoi_nhan: Optional[str] = None
    dia_chi_giao_hang: Optional[str] = None
    ghi_chu: Optional[str] = None
    phuong_thuc_thanh_toan: Optional[str] = None
    ngay_giao_hang: Optional[datetime] = None
    ngay_hoan_thanh: Optional[datetime] = None
    chi_tiets: List[CTDonHangResponse] = []
    
    class Config:
        from_attributes = True


class DonHangListResponse(BaseModel):
    don_hang_id: int
    ngay_dat: Optional[datetime] = None
    tong_tien: Optional[Decimal] = None
    trang_thai: Optional[str] = None
    ten_nguoi_nhan: Optional[str] = None
    phuong_thuc_thanh_toan: Optional[str] = None
    so_san_pham: int = 0
    
    class Config:
        from_attributes = True


# ==================== CẬP NHẬT TRẠNG THÁI ====================
class UpdateTrangThaiRequest(BaseModel):
    trang_thai: str = Field(..., pattern="^(Đã xác nhận|Đang giao hàng|Đã nhận hàng|Đã hủy)$")
    ly_do_huy: Optional[str] = None


class HuyDonRequest(BaseModel):
    ly_do: str = Field(..., min_length=1, max_length=255)
