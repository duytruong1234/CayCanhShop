import sys
import os

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import TaiKhoan
from app.utils.auth import create_access_token, decode_token
from app.config import settings

def test_auth():
    print("--- START DEBUG AUTH ---")
    
    # 1. Test DB Connection
    print("1. Connecting to DB...")
    try:
        db = SessionLocal()
        print("   DB Session created.")
    except Exception as e:
        print(f"   FATAL: DB Connection failed: {e}")
        return

    # 2. Test User Fetch
    print("2. Fetching first user...")
    try:
        user = db.query(TaiKhoan).first()
        if not user:
            print("   FATAL: No users found in DB!")
            return
        
        print(f"   User Found: ID={user.TaiKhoanID}, User={user.TenDangNhap}, Pass={user.MatKhau[:10]}...")
    except Exception as e:
        print(f"   FATAL: Query failed: {e}")
        return

    # 3. Test Token Generation
    print("3. Generating Token...")
    try:
        token = create_access_token(data={"sub": str(user.TaiKhoanID)})
        print(f"   Token generated: {token[:20]}...")
    except Exception as e:
        print(f"   FATAL: Token generation failed: {e}")
        return

    # 4. Test Token Decoding
    print("4. Decoding Token...")
    try:
        payload = decode_token(token)
        print(f"   Payload: {payload}")
        
        sub = payload.get("sub")
        print(f"   Sub: {sub} (type: {type(sub)})")
        
        if int(sub) == user.TaiKhoanID:
            print("   SUCCESS: Token sub matches User ID.")
        else:
            print(f"   FAILURE: Mismatch! {sub} != {user.TaiKhoanID}")
            
    except Exception as e:
        print(f"   FATAL: Token decode failed: {e}")

    db.close()
    print("--- END DEBUG AUTH ---")

if __name__ == "__main__":
    test_auth()
