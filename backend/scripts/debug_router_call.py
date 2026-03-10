import sys
import os
import asyncio
from datetime import datetime
from decimal import Decimal

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import TaiKhoan, KhachHang, GioHang, GioHangChiTiet, CayCanh
from app.routers.don_hang import dat_hang
from app.schemas.don_hang import DatHangRequest

def debug_router():
    print("--- DEBUG ROUTER CALL ---")
    db = SessionLocal()
    try:
        # 1. Setup User with Cart
        user = db.query(TaiKhoan).join(KhachHang).first()
        if not user:
            print("No user found")
            return
        
        # Ensure Item in Cart
        gio_hang = db.query(GioHang).filter(GioHang.TaiKhoanID == user.TaiKhoanID).first()
        if not gio_hang:
             gio_hang = GioHang(TaiKhoanID=user.TaiKhoanID, NgayTao=datetime.now())
             db.add(gio_hang)
             db.flush()

        cay = db.query(CayCanh).first()
        if not cay:
             print("No plants")
             return

        ghct = db.query(GioHangChiTiet).filter(
            GioHangChiTiet.GioHangID == gio_hang.GioHangID
        ).first()

        if not ghct:
            print("Cart empty, adding item...")
            ghct = GioHangChiTiet(
                GioHangID=gio_hang.GioHangID,
                CayCanhID=cay.CayCanhID,
                SoLuong=1,
                DonGia=cay.Gia or Decimal(100000)
            )
            db.add(ghct)
            db.commit()
        
        print(f"Testing User: {user.TenDangNhap}")
        
        # 2. Prepare Request
        # Note: DatHangRequest expects camelCase keys if configured? 
        # Pydantic models use snake_case by default unless aliased.
        # Let's check schemas/don_hang.py. It uses snake_case fields.
        req_data = DatHangRequest(
            ten_nguoi_nhan="Debug Router User",
            sdt_nguoi_nhan="0123456789",
            dia_chi_giao_hang="Debug Address Router",
            phuong_thuc_thanh_toan="COD", # Valid pattern
            ghi_chu="Debug Note"
        )
        
        # 3. Call Router Function
        # It is async!
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        print("Calling dat_hang function directly...")
        try:
            result = loop.run_until_complete(dat_hang(
                request=req_data,
                current_user=user,
                db=db
            ))
            print("SUCCESS! Result:")
            print(result)
        except Exception as e:
            print(f"\nFATAL ERROR calling router:")
            print(e)
            import traceback
            traceback.print_exc()
            
    finally:
        db.close()
    print("--- END DEBUG ROUTER ---")

if __name__ == "__main__":
    debug_router()
