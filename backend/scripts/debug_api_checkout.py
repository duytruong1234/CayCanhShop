import sys
import os
import json
import urllib.request
import urllib.error
from datetime import timedelta

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import TaiKhoan, KhachHang, GioHang
from app.utils.auth import create_access_token
from app.config import settings

def debug_api_checkout():
    print("--- DEBUG API CHECKOUT ---")
    db = SessionLocal()
    
    # 1. Get User with Cart
    user = db.query(TaiKhoan).join(GioHang).join(KhachHang).first()
    if not user:
        print("No user with cart and customer found.")
        return

    print(f"Testing User: {user.TenDangNhap} (ID: {user.TaiKhoanID})")
    
    # 2. Generate Token
    token = create_access_token(
        data={"sub": str(user.TaiKhoanID), "vai_tro": user.VaiTroID},
        expires_delta=timedelta(minutes=30)
    )
    print(f"Token generated.")

    # 3. Request Data
    url = "http://localhost:8000/don-hang/dat-hang"
    data = {
        "ten_nguoi_nhan": "Debug API User",
        "sdt_nguoi_nhan": "0123456789",
        "dia_chi_giao_hang": "Debug Address API",
        "phuong_thuc_thanh_toan": "COD",
        "ghi_chu": "Debug API Note"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    
    print(f"Sending POST to {url}...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.status}")
            print(f"Response: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Error Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    debug_api_checkout()
