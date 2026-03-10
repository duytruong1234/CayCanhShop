import sys
import os
from sqlalchemy import inspect

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.database import engine

def check_schema():
    print("--- CHECKING DB SCHEMA ---")
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Found {len(tables)} tables.")
        print("Tables:", tables)

        if "DonHang" in tables:
            print("\nColumns in DonHang:")
            cols = inspector.get_columns("DonHang")
            for c in cols:
                print(f"- {c['name']} ({c['type']})")
        else:
            print("\nFATAL: Table 'DonHang' NOT FOUND!")

        if "CT_DonHang" in tables:
             print("\nColumns in CT_DonHang:")
             cols = inspector.get_columns("CT_DonHang")
             for c in cols:
                print(f"- {c['name']} ({c['type']})")
        elif "CTDonHang" in tables:
             print("\nFound 'CTDonHang' instead of 'CT_DonHang'. Update model!")
        else:
             print("\nFATAL: Table 'CT_DonHang' (or variant) NOT FOUND!")

    except Exception as e:
        print(f"Error inspecting DB: {e}")
    print("--- END CHECK ---")

if __name__ == "__main__":
    check_schema()
