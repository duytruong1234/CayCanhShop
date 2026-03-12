import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import TaiKhoan, KhachHang

logger = logging.getLogger(__name__)

# JWT Bearer
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Xác thực mật khẩu - hỗ trợ migration từ plain text sang bcrypt"""
    try:
        plain_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        # Fallback: mật khẩu cũ lưu plain text (legacy từ C#)
        # Nếu khớp, sẽ được auto-rehash trong login handler
        if plain_password == hashed_password:
            logger.warning("Plain text password matched - needs rehash migration")
            return True
        return False


def hash_password(password: str) -> str:
    """Hash mật khẩu"""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Giải mã JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        logger.debug(f"JWT Decode Error: {str(e)}")
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
        logger.debug(f"Token decode failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ"
        )
    
    raw_id = payload.get("sub")
    logger.debug(f"get_current_user raw sub: {raw_id}")
    
    if raw_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ (missing sub)"
        )

    try:
        tai_khoan_id = int(raw_id)
    except ValueError:
        logger.debug("sub is not an integer")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ (sub not int)"
        )

    
    user = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == tai_khoan_id).first()
    if user is None:
        logger.debug(f"User ID {tai_khoan_id} not found in DB")
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
    except Exception as e:
        logger.debug(f"Optional auth failed: {e}")
    
    return None
