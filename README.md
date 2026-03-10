# CayCanhShop – Hệ thống bán cây cảnh

## Mô tả

Dự án web bán cây cảnh, gồm **backend (FastAPI Python)** và **frontend (React + Vite)**.

Tích hợp hệ thống gợi ý cây thông minh bằng phương pháp **AHP** (Analytic Hierarchy Process).

---

## Yêu cầu hệ thống

Trước khi cài đặt, hãy đảm bảo máy tính đã có:

| Phần mềm | Phiên bản tối thiểu | Link tải |
|-----------|---------------------|----------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| SQL Server | 2019+ | [microsoft.com](https://www.microsoft.com/sql-server) |
| ODBC Driver | 17+ | [microsoft.com](https://learn.microsoft.com/en-us/sql/connect/odbc) |

---

## Hướng dẫn cài đặt – Từng bước

### Bước 1: Tạo Database

1. Mở **SQL Server Management Studio (SSMS)**
2. Chạy file `SQL_HeThongBanCayCanh.sql` → tạo database `HeThongBanCayCanh`
3. Chạy file `SQL_AHP.sql` → tạo các bảng và dữ liệu AHP

---

### Bước 2: Cài đặt Backend (FastAPI)

Mở **Terminal / CMD** rồi chạy lần lượt:

```bash
# 1. Vào thư mục backend
cd backend

# 2. Tạo môi trường ảo Python
python -m venv venv

# 3. Kích hoạt môi trường ảo (Windows)
venv\Scripts\activate

# 4. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 5. Tạo file cấu hình database
copy .env.example .env
```

Mở file `backend/.env` bằng Notepad hoặc VS Code, sửa lại thông tin database:

```
DB_SERVER=localhost
DB_NAME=HeThongBanCayCanh
DB_USER=sa
DB_PASSWORD=mật_khẩu_của_bạn


Chạy server:

```bash
# 6. Khởi chạy backend
uvicorn app.main:app --reload --port 8000
```

✅ Nếu thành công, truy cập http://localhost:8000/docs để xem API docs.

---

### Bước 3: Cài đặt Frontend (React)

Mở **Terminal mới** (giữ terminal backend đang chạy):

```bash
# 1. Vào thư mục frontend
cd frontend

# 2. Cài đặt thư viện
npm install

# 3. Chạy frontend
npm run dev
```

✅ Nếu thành công, truy cập http://localhost:5173 để xem trang web.

---

## Cấu trúc thư mục

```
CayCanhShop/
├── README.md                    # File hướng dẫn này
├── CONG_THUC_AHP.md             # Tài liệu công thức AHP chi tiết
├── SQL_HeThongBanCayCanh.sql    # Script tạo database chính
├── SQL_AHP.sql                  # Script tạo bảng + dữ liệu AHP
│
├── backend/                     # FastAPI (Python)
│   ├── app/
│   │   ├── main.py              # Điểm khởi chạy server
│   │   ├── config.py            # Cấu hình ứng dụng
│   │   ├── database.py          # Kết nối database
│   │   ├── models/              # Các bảng DB (SQLAlchemy)
│   │   ├── schemas/             # Định dạng dữ liệu vào/ra
│   │   ├── routers/             # Các API endpoint
│   │   │   ├── ahp_recommend.py # API gợi ý cây cho khách
│   │   │   ├── tieu_chi.py      # API quản lý tiêu chí AHP
│   │   │   ├── phuong_an.py     # API quản lý ma trận phương án
│   │   │   ├── cay_canh.py      # API cây cảnh (public)
│   │   │   ├── auth.py          # Đăng nhập / Đăng ký
│   │   │   ├── gio_hang.py      # Giỏ hàng
│   │   │   ├── don_hang.py      # Đơn hàng
│   │   │   └── admin/           # Các API dành cho admin
│   │   └── utils/               # Hàm hỗ trợ
│   │       └── ahp_calculator.py # Tính toán AHP (trọng số, CR)
│   ├── requirements.txt         # Danh sách thư viện Python
│   └── .env                     # Cấu hình database (tự tạo)
│
└── frontend/                    # React + Vite
    ├── src/
    │   ├── App.jsx              # Routing chính
    │   ├── pages/
    │   │   ├── CayCanh/
    │   │   │   ├── TuVanAHP.jsx # Trang khách hàng chọn tiêu chí → gợi ý
    │   │   │   ├── CayCanhList.jsx
    │   │   │   └── CayCanhDetail.jsx
    │   │   ├── Admin/
    │   │   │   ├── AHP/
    │   │   │   │   ├── TieuChiAHP.jsx  # Admin: quản lý ma trận tiêu chí
    │   │   │   │   └── PhuongAnAHP.jsx # Admin: quản lý ma trận phương án
    │   │   │   ├── CayCanh/     # Admin: CRUD cây cảnh
    │   │   │   ├── DonHang/     # Admin: quản lý đơn hàng
    │   │   │   └── ...
    │   │   └── ...
    │   └── services/
    │       └── ahpService.js    # Gọi API AHP
    ├── package.json
    └── vite.config.js
```

---

## Tính năng

### Phía Khách hàng
- ✅ Xem danh sách cây cảnh, lọc theo loại
- ✅ Xem chi tiết sản phẩm
- ✅ **Tư vấn AHP**: Chọn tiêu chí → hệ thống gợi ý cây phù hợp nhất (hiển thị % phù hợp)
- ✅ Đăng ký / Đăng nhập
- ✅ Giỏ hàng, đặt hàng, xem đơn hàng

### Phía Admin
- ✅ Dashboard thống kê
- ✅ Quản lý cây cảnh (thêm/sửa/xóa) – **tự động thêm cột AHP**
- ✅ Quản lý ma trận tiêu chí AHP (nhập so sánh, tính trọng số, xem CR)
- ✅ Quản lý ma trận phương án AHP (so sánh các cây theo từng tiêu chí)
- ✅ Quản lý đơn hàng, khách hàng, tồn kho

---

## Hệ thống AHP – Tóm tắt

1. **Admin** nhập ma trận so sánh cặp → hệ thống tính **trọng số** + **CR**
2. **Khách hàng** chọn tiêu chí quan tâm → hệ thống **chuẩn hóa lại trọng số** (tổng = 100%)
3. Tính **điểm phù hợp** = Σ(trọng số × điểm cây) → Sắp xếp → Hiển thị

📄 **Xem chi tiết công thức**: [CONG_THUC_AHP.md](./CONG_THUC_AHP.md)

---

## API Endpoints chính

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/cay-canh` | Danh sách cây cảnh |
| GET | `/cay-canh/{id}` | Chi tiết cây cảnh |
| POST | `/ahp-recommend/goi-y` | Gợi ý cây theo tiêu chí AHP |
| GET | `/ahp-recommend/tieu-chi-va-dac-diem` | Lấy danh sách tiêu chí + đặc điểm |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| GET | `/gio-hang` | Xem giỏ hàng |
| POST | `/don-hang/dat-hang` | Đặt hàng |
| POST | `/admin/cay-canh/` | Admin thêm cây (auto AHP) |
| POST | `/tieu-chi/tinh-trong-so` | Admin tính trọng số tiêu chí |
| POST | `/phuong-an/{maTieuChi}/tinh-trong-so` | Admin tính trọng số phương án |

📄 **API docs đầy đủ**: http://localhost:8000/docs (sau khi chạy backend)

---

## Tech Stack

| Library | Phần mềm (IDE/Tool) | Cơ sở dữ liệu (DB) |
|---------|---------------------|--------------------|
| FastAPI, SQLAlchemy, Pydantic, JWT, bcrypt<br>React 18, Vite, TailwindCSS, TanStack Query, Axios | VS Code<br>SQL Server Management Studio (SSMS)<br>Postman | SQL Server |


| Phần | Công nghệ |
|------|-----------|
| Backend | Python 3.10+, FastAPI, SQLAlchemy, Pydantic |
| Frontend | React 18, Vite, TailwindCSS, TanStack Query, Axios |
| Database | SQL Server |
| Auth | JWT + bcrypt |
| AHP | Geometric Mean method, Consistency Ratio validation |