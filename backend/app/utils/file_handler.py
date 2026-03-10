import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from app.config import settings


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


async def save_upload_file(file: UploadFile, folder: str = "images") -> str:
    """
    Lưu file upload và trả về tên file
    """
    # Kiểm tra extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Chỉ cho phép file ảnh: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Kiểm tra size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File quá lớn. Tối đa {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Tạo tên file unique
    filename = f"{uuid.uuid4()}{ext}"
    
    # Tạo thư mục nếu chưa có
    upload_dir = os.path.join("static", folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Lưu file
    filepath = os.path.join(upload_dir, filename)
    async with aiofiles.open(filepath, 'wb') as f:
        await f.write(content)
    
    return filename


def delete_file(filename: str, folder: str = "images") -> bool:
    """Xóa file"""
    if not filename:
        return False
    
    filepath = os.path.join("static", folder, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False


def get_file_url(filename: str, folder: str = "images") -> str:
    """Lấy URL của file"""
    if not filename:
        return None
    return f"/static/{folder}/{filename}"
