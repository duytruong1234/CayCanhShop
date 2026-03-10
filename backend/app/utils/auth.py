from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import TaiKhoan, KhachHang

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Xác thực mật khẩu - tương thích với BCrypt.Net của C#"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Nếu không phải hash, so sánh plain text (cho dữ liệu cũ)
        return plain_password == hashed_password


def hash_password(password: str) -> str:
    """Hash mật khẩu"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Giải mã JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        print(f"DEBUG: JWT Decode Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> TaiKhoan:
    """Dependency để lấy user hiện tại từ token"""
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except Exception as e:
        print(f"DEBUG: Token decode failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ"
        )
    
    raw_id = payload.get("sub")
    print(f"DEBUG: get_current_user raw sub: {raw_id} (type: {type(raw_id)})")
    
    if raw_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ (missing sub)"
        )

    try:
        tai_khoan_id = int(raw_id)
    except ValueError:
        print(f"DEBUG: sub is not an integer")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ (sub not int)"
        )

    
    user = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == tai_khoan_id).first()
    if user is None:
        print(f"DEBUG: User ID {tai_khoan_id} not found in DB")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không tìm thấy người dùng"
        )
    
    if user.TrangThai == "Bị khóa":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa"
        )
    
    return user


async def get_current_admin(
    current_user: TaiKhoan = Depends(get_current_user)
) -> TaiKhoan:
    """Dependency kiểm tra quyền Admin"""
    if current_user.VaiTroID != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập"
        )
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[TaiKhoan]:
    """Dependency lấy user nếu có token (không bắt buộc)"""
    if credentials is None:
        return None
    
    try:
        token = credentials.credentials
        payload = decode_token(token)
        tai_khoan_id: int = payload.get("sub")
        
        if tai_khoan_id:
            return db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == tai_khoan_id).first()
    except:
        pass
    
    return None
