from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date


# ==================== LOGIN / REGISTER ====================
class LoginRequest(BaseModel):
    ten_dang_nhap: str = Field(..., min_length=1, description="Tên đăng nhập hoặc email")
    mat_khau: str = Field(..., min_length=1, description="Mật khẩu")


class RegisterRequest(BaseModel):
    ho_ten: str = Field(..., min_length=1, max_length=100)
    gioi_tinh: str = Field(..., pattern="^(Nam|Nữ)$")
    ngay_sinh: date
    dia_chi: Optional[str] = Field(None, max_length=255)
    email: EmailStr
    dien_thoai: str = Field(..., pattern=r"^\d{10}$")
    ten_dang_nhap: str = Field(..., min_length=3, max_length=50)
    mat_khau: str = Field(..., min_length=6, max_length=100)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserInfo"


class UserInfo(BaseModel):
    tai_khoan_id: int
    ten_dang_nhap: str
    email: Optional[str]
    vai_tro_id: int
    vai_tro_ten: Optional[str]
    ho_ten: Optional[str]
    
    class Config:
        from_attributes = True


# ==================== KHÁCH HÀNG ====================
class KhachHangBase(BaseModel):
    ho_ten: Optional[str]
    gioi_tinh: Optional[str]
    ngay_sinh: Optional[date]
    dia_chi: Optional[str]


class KhachHangResponse(KhachHangBase):
    khach_hang_id: int
    tai_khoan_id: Optional[int]
    
    class Config:
        from_attributes = True


class KhachHangUpdate(BaseModel):
    ho_ten: Optional[str] = None
    gioi_tinh: Optional[str] = None
    ngay_sinh: Optional[date] = None
    dia_chi: Optional[str] = None
    email: Optional[EmailStr] = None
    dien_thoai: Optional[str] = None


# Forward reference update
TokenResponse.model_rebuild()
