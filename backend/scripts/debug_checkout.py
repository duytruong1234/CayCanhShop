import sys
import os
from datetime import datetime
from decimal import Decimal

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import TaiKhoan, KhachHang, GioHang, GioHangChiTiet, DonHang, CTDonHang, CayCanh
from app.utils.auth import get_current_user

def debug_checkout():
    print("--- DEBUG CHECKOUT ---")
    db = SessionLocal()
    try:
        # Find all users with a Cart
        users_with_cart = db.query(TaiKhoan).join(GioHang).all()
        print(f"Found {len(users_with_cart)} users with carts.")
        
        for user in users_with_cart:
            print(f"\n--- Testing User: {user.TenDangNhap} (ID: {user.TaiKhoanID}) ---")
            
            khach_hang = db.query(KhachHang).filter(KhachHang.TaiKhoanID == user.TaiKhoanID).first()
            if not khach_hang:
                print("SKIPPING: No Customer Record (Should raise 400, not 500)")
                continue

            gio_hang = db.query(GioHang).filter(GioHang.TaiKhoanID == user.TaiKhoanID).first()
            if not gio_hang or not gio_hang.chi_tiets:
                print("SKIPPING: Empty Cart")
                continue

            print(f"Customer: {khach_hang.HoTen}, Cart Items: {len(gio_hang.chi_tiets)}")
            
            # Simulate Checkout
            try:
                # Calc total
                tong_tien = Decimal(0)
                for ct in gio_hang.chi_tiets:
                     don_gia = ct.DonGia if ct.DonGia is not None else Decimal(0)
                     tong_tien += ct.SoLuong * don_gia
                
                print(f"Total: {tong_tien}")
                
                don_hang = DonHang(
                    KhachHangID=khach_hang.KhachHangID,
                    NgayDat=datetime.now(),
                    TongTien=tong_tien,
                    TrangThai="Chờ xác nhận",
                    TenNguoiNhan="Test User",
                    SDTNguoiNhan="0909090909",
                    DiaChiGiaoHang="Test Address",
                    GhiChu="Test Note",
                    PhuongThucThanhToan="COD"
                )
                db.add(don_hang)
                db.flush()
                print(f"DonHang created. ID: {don_hang.DonHangID}")
                
                # Check Details
                for ct in gio_hang.chi_tiets:
                    don_gia = ct.DonGia if ct.DonGia is not None else Decimal(0)
                    ct_don_hang = CTDonHang(
                        DonHangID=don_hang.DonHangID,
                        CayCanhID=ct.CayCanhID,
                        SoLuong=ct.SoLuong,
                        DonGia=don_gia,
                        ThanhTien=ct.SoLuong * don_gia
                    )
                    db.add(ct_don_hang)
                    
                db.commit()
                print("SUCCESS: Checkout OK")
                
            except Exception as e:
                print(f"FAILURE: Checkout Failed for {user.TenDangNhap}")
                print(f"ERROR: {e}")
                import traceback
                traceback.print_exc()
                db.rollback()
        
    except Exception as e:
        print("\nFATAL ERROR DURING CHECKOUT SIMULATION:")
        print(e)
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()
    print("--- END DEBUG CHECKOUT ---")

if __name__ == "__main__":
    debug_checkout()
