from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models import TaiKhoan, KhachHang, VaiTro
from app.schemas.auth import (
    LoginRequest, RegisterRequest, TokenResponse, 
    UserInfo, KhachHangResponse, KhachHangUpdate
)
from app.utils.auth import (
    verify_password, hash_password, create_access_token, get_current_user
)
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập - trả về JWT token"""
    
    print(f"DEBUG: Login attempt for {request.ten_dang_nhap}")
    
    # Tìm tài khoản theo tên đăng nhập hoặc email
    user = db.query(TaiKhoan).filter(
        (TaiKhoan.TenDangNhap == request.ten_dang_nhap) | 
        (TaiKhoan.Email == request.ten_dang_nhap)
    ).first()
    
    if not user:
        print("DEBUG: User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai tài khoản hoặc mật khẩu"
        )
    
    print(f"DEBUG: User found: {user.TenDangNhap}, ID: {user.TaiKhoanID}")
    
    # Kiểm tra mật khẩu
    is_valid = verify_password(request.mat_khau, user.MatKhau)
    print(f"DEBUG: Password check result: {is_valid}")
    
    if not is_valid:
        print(f"DEBUG: Password verification failed. Hash in DB: {user.MatKhau[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai tài khoản hoặc mật khẩu"
        )
    
    # Kiểm tra trạng thái
    if user.TrangThai == "Bị khóa":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa"
        )
    
    # Lấy thông tin khách hàng
    khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == user.TaiKhoanID).first()
    vai_tro = db.query(VaiTro).filter(VaiTro.VaiTroID == user.VaiTroID).first()
    
    # Tạo token
    access_token = create_access_token(
        data={"sub": str(user.TaiKhoanID), "vai_tro": user.VaiTroID},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserInfo(
            tai_khoan_id=user.TaiKhoanID,
            ten_dang_nhap=user.TenDangNhap,
            email=user.Email,
            vai_tro_id=user.VaiTroID,
            vai_tro_ten=vai_tro.TenVaiTro if vai_tro else None,
            ho_ten=khach_hang.HoTen if khach_hang else None
        )
    )


@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới"""
    
    # Kiểm tra tuổi >= 16
    from datetime import date
    today = date.today()
    age = today.year - request.ngay_sinh.year
    if request.ngay_sinh > today.replace(year=today.year - age):
        age -= 1
    if age < 16:
        raise HTTPException(status_code=400, detail="Bạn phải đủ 16 tuổi")
    
    # Kiểm tra tên đăng nhập đã tồn tại
    if db.query(TaiKhoan).filter(TaiKhoan.TenDangNhap == request.ten_dang_nhap).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    # Kiểm tra email đã tồn tại
    if db.query(TaiKhoan).filter(TaiKhoan.Email == request.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    # Kiểm tra số điện thoại đã tồn tại
    if db.query(TaiKhoan).filter(TaiKhoan.DienThoai == request.dien_thoai).first():
        raise HTTPException(status_code=400, detail="Số điện thoại đã tồn tại")
    
    # Tạo tài khoản
    tai_khoan = TaiKhoan(
        TenDangNhap=request.ten_dang_nhap,
        MatKhau=hash_password(request.mat_khau),
        Email=request.email,
        DienThoai=request.dien_thoai,
        VaiTroID=2,  # Khách hàng
        TrangThai="Hoạt động"
    )
    db.add(tai_khoan)
    db.flush()  # Lấy ID
    
    # Tạo khách hàng
    khach_hang = KhachHang(
        TaiKhoanID=tai_khoan.TaiKhoanID,
        HoTen=request.ho_ten,
        GioiTinh=request.gioi_tinh,
        NgaySinh=request.ngay_sinh,
        DiaChi=request.dia_chi
    )
    db.add(khach_hang)
    db.commit()
    
    # Tạo token
    access_token = create_access_token(
        data={"sub": str(tai_khoan.TaiKhoanID), "vai_tro": tai_khoan.VaiTroID}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserInfo(
            tai_khoan_id=tai_khoan.TaiKhoanID,
            ten_dang_nhap=tai_khoan.TenDangNhap,
            email=tai_khoan.Email,
            vai_tro_id=tai_khoan.VaiTroID,
            vai_tro_ten="KhachHang",
            ho_ten=khach_hang.HoTen
        )
    )


@router.get("/me", response_model=UserInfo)
async def get_me(current_user: TaiKhoan = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lấy thông tin user hiện tại"""
    khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == current_user.TaiKhoanID).first()
    vai_tro = db.query(VaiTro).filter(VaiTro.VaiTroID == current_user.VaiTroID).first()
    
    return UserInfo(
        tai_khoan_id=current_user.TaiKhoanID,
        ten_dang_nhap=current_user.TenDangNhap,
        email=current_user.Email,
        vai_tro_id=current_user.VaiTroID,
        vai_tro_ten=vai_tro.TenVaiTro if vai_tro else None,
        ho_ten=khach_hang.HoTen if khach_hang else None
    )


@router.get("/profile", response_model=KhachHangResponse)
async def get_profile(current_user: TaiKhoan = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lấy thông tin profile khách hàng"""
    khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == current_user.TaiKhoanID).first()
    
    if not khach_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin khách hàng")
    
    return KhachHangResponse(
        khach_hang_id=khach_hang.KhachHangID,
        tai_khoan_id=khach_hang.TaiKhoanID,
        ho_ten=khach_hang.HoTen,
        gioi_tinh=khach_hang.GioiTinh,
        ngay_sinh=khach_hang.NgaySinh,
        dia_chi=khach_hang.DiaChi
    )


@router.put("/profile")
async def update_profile(
    request: KhachHangUpdate,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin profile"""
    khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == current_user.TaiKhoanID).first()
    
    if not khach_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin khách hàng")
    
    # Cập nhật khách hàng
    if request.ho_ten is not None:
        khach_hang.HoTen = request.ho_ten
    if request.gioi_tinh is not None:
        khach_hang.GioiTinh = request.gioi_tinh
    if request.ngay_sinh is not None:
        khach_hang.NgaySinh = request.ngay_sinh
    if request.dia_chi is not None:
        khach_hang.DiaChi = request.dia_chi
    
    # Cập nhật tài khoản
    if request.email is not None:
        current_user.Email = request.email
    if request.dien_thoai is not None:
        current_user.DienThoai = request.dien_thoai
    
    db.commit()
    

    return {"message": "Cập nhật thành công"}


# ================= Lưu trữ OTP tạm thời (trong production nên dùng Redis) =================
import random
from pydantic import BaseModel

# Dictionary lưu OTP tạm thời (email -> otp)
otp_storage = {}


class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    mat_khau_moi: str


class ChangePasswordRequest(BaseModel):
    mat_khau_cu: str
    mat_khau_moi: str
    nhap_lai_mat_khau: str


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Gửi mã OTP để reset mật khẩu"""
    
    email = request.email.strip()
    
    if not email:
        raise HTTPException(status_code=400, detail="Vui lòng nhập email!")
    
    # Kiểm tra email tồn tại
    user = db.query(TaiKhoan).filter(TaiKhoan.Email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại trong hệ thống!")
    
    # Tạo mã OTP
    otp = str(random.randint(100000, 999999))
    
    # Lưu OTP (trong production nên dùng Redis với TTL)
    otp_storage[email] = otp
    
    # TODO: Gửi email thực tế
    # await send_email(email, "Mã xác nhận quên mật khẩu", f"Mã OTP của bạn là: {otp}")
    
    # Tạm thời trả về OTP để test (trong production phải bỏ)
    return {
        "success": True, 
        "email": email,
        "message": "Mã xác nhận đã được gửi đến email!",
        "otp_debug": otp  # Chỉ để test, bỏ trong production
    }


@router.post("/verify-otp")
async def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    """Xác nhận OTP và đổi mật khẩu"""
    
    email = request.email.strip()
    otp = request.otp.strip()
    mat_khau_moi = request.mat_khau_moi.strip()
    
    # Kiểm tra OTP
    if email not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP đã hết hạn!")
    
    if otp_storage[email] != otp:
        raise HTTPException(status_code=400, detail="Mã OTP không đúng!")
    
    # Kiểm tra mật khẩu mới
    if not mat_khau_moi or len(mat_khau_moi) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải >= 6 ký tự!")
    
    # Cập nhật mật khẩu
    user = db.query(TaiKhoan).filter(TaiKhoan.Email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại!")
    
    user.MatKhau = hash_password(mat_khau_moi)
    db.commit()
    
    # Xóa OTP đã sử dụng
    del otp_storage[email]
    
    return {"success": True, "message": "Đổi mật khẩu thành công!"}


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Đổi mật khẩu (khi đang đăng nhập)"""
    
    mat_khau_cu = request.mat_khau_cu.strip()
    mat_khau_moi = request.mat_khau_moi.strip()
    nhap_lai = request.nhap_lai_mat_khau.strip()
    
    # Kiểm tra mật khẩu cũ
    if not verify_password(mat_khau_cu, current_user.MatKhau):
        raise HTTPException(
            status_code=400, 
            detail="Mật khẩu cũ không chính xác!",
            headers={"field": "mat_khau_cu"}
        )
    
    # Kiểm tra mật khẩu mới
    if not mat_khau_moi or len(mat_khau_moi) < 6:
        raise HTTPException(
            status_code=400, 
            detail="Mật khẩu mới phải >= 6 ký tự!",
            headers={"field": "mat_khau_moi"}
        )
    
    # Kiểm tra nhập lại
    if mat_khau_moi != nhap_lai:
        raise HTTPException(
            status_code=400, 
            detail="Mật khẩu nhập lại không trùng khớp!",
            headers={"field": "nhap_lai_mat_khau"}
        )
    
    # Cập nhật mật khẩu
    current_user.MatKhau = hash_password(mat_khau_moi)
    db.commit()
    
    return {"success": True, "message": "Đổi mật khẩu thành công!"}
