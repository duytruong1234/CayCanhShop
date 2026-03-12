# 🌿 CayCanhShop – Hệ thống bán cây cảnh

## Mô tả

Dự án web bán cây cảnh, gồm **Backend (FastAPI + PostgreSQL)** và **Frontend (React + Vite + TailwindCSS)**.

Tích hợp hệ thống gợi ý cây thông minh bằng phương pháp **AHP** (Analytic Hierarchy Process).

---

## Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu | Link tải |
|-----------|---------------------|----------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |

---

## Hướng dẫn cài đặt (Local)

### Bước 1: Tạo Database

1. Mở **pgAdmin 4**
2. Tạo database tên `HeThongBanCayCanh`
3. Chạy file SQL để tạo bảng và dữ liệu (nếu có file `database/init_postgres.sql`)

---

### Bước 2: Cài đặt Backend (FastAPI)

```bash
# 1. Tạo môi trường ảo Python
python -m venv .venv

# 2. Kích hoạt môi trường ảo (Windows)
.venv\Scripts\activate

# 3. Cài đặt thư viện
pip install -r backend/requirements.txt

# 4. Tạo file cấu hình
copy backend\.env.example backend\.env
```

Mở file `backend/.env`, sửa lại thông tin database:

```env
DATABASE_URL=postgresql://postgres:mật_khẩu_của_bạn@localhost:5432/HeThongBanCayCanh
SECRET_KEY=đổi-key-bí-mật-của-bạn
```

Chạy server:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

✅ Truy cập http://localhost:8000/docs để xem API docs.

---

### Bước 3: Cài đặt Frontend (React)

Mở **Terminal mới** (giữ terminal backend đang chạy):

```bash
cd frontend
npm install
npm run dev
```

✅ Truy cập http://localhost:3000 để xem trang web.

---

## Cấu trúc thư mục

```
CayCanhShop/
├── README.md                    # File hướng dẫn này
├── DEPLOY_RAILWAY.md            # Hướng dẫn deploy lên Railway
├── CONG_THUC_AHP.md             # Tài liệu công thức AHP chi tiết
├── docker-compose.yml           # Docker Compose (dev/production)
│
├── backend/                     # FastAPI (Python)
│   ├── Dockerfile               # Docker image cho backend
│   ├── requirements.txt         # Thư viện Python
│   ├── .env                     # Cấu hình (tự tạo từ .env.example)
│   └── app/
│       ├── main.py              # Điểm khởi chạy server
│       ├── config.py            # Cấu hình ứng dụng
│       ├── database.py          # Kết nối PostgreSQL
│       ├── models/              # Các bảng DB (SQLAlchemy)
│       ├── schemas/             # Định dạng dữ liệu vào/ra
│       ├── routers/             # Các API endpoint
│       │   ├── auth.py          # Đăng nhập / Đăng ký
│       │   ├── cay_canh.py      # API cây cảnh (public)
│       │   ├── gio_hang.py      # Giỏ hàng
│       │   ├── don_hang.py      # Đơn hàng
│       │   ├── binh_luan.py     # Bình luận
│       │   ├── tieu_chi.py      # Ma trận tiêu chí AHP
│       │   ├── phuong_an.py     # Ma trận phương án AHP
│       │   ├── dac_diem.py      # Đặc điểm cây
│       │   ├── ahp_recommend.py # Gợi ý cây cho khách
│       │   └── admin/           # Các API dành cho admin
│       └── utils/
│           ├── auth.py          # JWT + bcrypt
│           └── ahp_calculator.py # Tính toán AHP
│
└── frontend/                    # React + Vite + TailwindCSS
    ├── Dockerfile               # Docker image cho frontend
    ├── nginx.conf               # Cấu hình Nginx (production)
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Routing chính
        ├── pages/
        │   ├── Home.jsx         # Trang chủ
        │   ├── Auth/            # Đăng nhập, Đăng ký
        │   ├── CayCanh/         # Danh sách, Chi tiết, Tư vấn AHP
        │   ├── GioHang/         # Giỏ hàng, Đặt hàng
        │   ├── DonHang/         # Lịch sử đơn hàng
        │   ├── Profile/         # Thông tin cá nhân
        │   └── Admin/           # Quản trị (Dashboard, CRUD, AHP)
        └── services/
            ├── api.js           # Axios instance
            └── ahpService.js    # Gọi API AHP
```

---

## Tính năng

### Phía Khách hàng
- ✅ Xem danh sách cây cảnh, lọc theo loại, tìm kiếm
- ✅ Xem chi tiết sản phẩm (mô tả, cách chăm sóc, thông tin khoa học)
- ✅ **Tư vấn AHP**: Chọn tiêu chí → hệ thống gợi ý cây phù hợp nhất (hiển thị % phù hợp)
- ✅ Đăng ký / Đăng nhập / Quên mật khẩu
- ✅ Giỏ hàng, đặt hàng, xem lịch sử đơn hàng
- ✅ Bình luận sản phẩm

### Phía Admin
- ✅ Dashboard thống kê (doanh thu, đơn hàng, khách hàng)
- ✅ Quản lý cây cảnh (thêm/sửa/xóa)
- ✅ Quản lý ma trận tiêu chí AHP (nhập so sánh, tính trọng số, xem CR)
- ✅ Quản lý ma trận phương án AHP (so sánh các cây theo từng tiêu chí)
- ✅ Quản lý đơn hàng, khách hàng, tồn kho, bài viết

---

## Hệ thống AHP – Tóm tắt

1. **Admin** nhập ma trận so sánh cặp → hệ thống tính **trọng số** + **CR** (Consistency Ratio)
2. **Khách hàng** chọn tiêu chí quan tâm → hệ thống **chuẩn hóa lại trọng số** (tổng = 100%)
3. Tính **điểm phù hợp** = Σ(trọng số × điểm cây) → Sắp xếp → Hiển thị

📄 **Xem chi tiết công thức**: [CONG_THUC_AHP.md](./CONG_THUC_AHP.md)

---

## API Endpoints chính

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/cay-canh/` | Danh sách cây cảnh |
| GET | `/cay-canh/{id}` | Chi tiết cây cảnh |
| GET | `/cay-canh/loai-cay` | Danh sách loại cây |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| GET | `/gio-hang/` | Xem giỏ hàng |
| POST | `/don-hang/dat-hang` | Đặt hàng |
| GET | `/tieu-chi/` | Danh sách tiêu chí AHP |
| GET | `/tieu-chi/ma-tran` | Ma trận so sánh tiêu chí |
| POST | `/ahp-recommend/goi-y` | Gợi ý cây theo tiêu chí AHP |
| GET | `/ahp-recommend/tieu-chi-va-dac-diem` | Lấy tiêu chí + đặc điểm |
| GET | `/dac-diem/` | Danh sách đặc điểm |
| GET | `/phuong-an/{maTieuChi}` | Ma trận phương án theo tiêu chí |

📄 **API docs đầy đủ**: http://localhost:8000/docs (sau khi chạy backend)

---

## Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Backend | Python 3.10+, FastAPI, SQLAlchemy, Pydantic, Uvicorn |
| Frontend | React 18, Vite, TailwindCSS, TanStack Query, Axios, Recharts |
| Database | PostgreSQL 15+ |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| AHP | Geometric Mean method, Consistency Ratio validation |
| Deploy | Docker, Railway |

---

## Deploy lên Railway

📄 Xem hướng dẫn chi tiết: [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)