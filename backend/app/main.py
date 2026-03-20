from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.routers import auth, cay_canh, gio_hang, don_hang, binh_luan
from app.routers import dac_diem, tieu_chi, phuong_an, ahp_recommend
from app.routers.admin import cay_canh as admin_cay_canh
from app.routers.admin import bai_viet as admin_bai_viet
from app.routers.admin import don_hang as admin_don_hang
from app.routers.admin import khach_hang as admin_khach_hang
from app.routers.admin import ton_kho as admin_ton_kho
from app.routers.admin import thong_ke as admin_thong_ke

# Tạo FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="API cho hệ thống bán cây cảnh - Chuyển đổi từ C# ASP.NET",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - cho phép React frontend gọi API
origins = [
    "http://localhost:3000",      # React dev
    "http://localhost:5173",      # Vite dev
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Thêm các origin từ biến môi trường (Railway production)
extra_origins = os.environ.get("CORS_ORIGINS", "")
if extra_origins:
    origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

# Nếu đang chạy trên Railway, cho phép tất cả origin
if os.environ.get("RAILWAY_ENVIRONMENT_NAME"):
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tệp tĩnh (hình ảnh)
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ==================== ĐĂNG KÝ ROUTER ====================

# Route công khai
app.include_router(auth.router)
app.include_router(cay_canh.router)
app.include_router(gio_hang.router)
app.include_router(don_hang.router)

app.include_router(binh_luan.router)

# Route hệ thống AHP
app.include_router(dac_diem.router)
app.include_router(tieu_chi.router)
app.include_router(phuong_an.router)
app.include_router(ahp_recommend.router)

# Route quản trị (Admin)
app.include_router(admin_cay_canh.router)
app.include_router(admin_bai_viet.router)
app.include_router(admin_don_hang.router)
app.include_router(admin_khach_hang.router)
app.include_router(admin_ton_kho.router)
app.include_router(admin_thong_ke.router)


# ==================== ENDPOINT GỐC ====================
@app.get("/")
async def root():
    return {
        "message": "Chào mừng đến với CayCanhShop API!",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# ==================== CHẠY MÁY CHỦ ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
