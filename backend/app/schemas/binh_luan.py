from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BinhLuanBase(BaseModel):
    cay_canh_id: int
    don_hang_id: int
    noi_dung: Optional[str] = Field(None, max_length=1000)
    so_sao: int = Field(..., ge=1, le=5)


class BinhLuanCreate(BinhLuanBase):
    pass


class BinhLuanResponse(BaseModel):
    binh_luan_id: int
    cay_canh_id: int
    tai_khoan_id: int
    noi_dung: Optional[str]
    so_sao: int
    ngay_binh_luan: Optional[datetime]
    hinh_anh: Optional[str]
    don_hang_id: int
    ten_nguoi_dung: Optional[str] = None
    
    class Config:
        from_attributes = True
