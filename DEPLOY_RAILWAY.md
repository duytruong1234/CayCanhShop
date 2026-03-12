# 🚀 Hướng dẫn Deploy CayCanhShop lên Railway (Chi tiết)

> Hướng dẫn dành cho người mới bắt đầu, từng bước một.

---

## 📋 Cần chuẩn bị trước

1. **Tài khoản GitHub** — [github.com](https://github.com) (đã có)
2. **Tài khoản Railway** — [railway.app](https://railway.app) (đăng ký miễn phí bằng GitHub)
3. **Code đã push lên GitHub** — đảm bảo tất cả thay đổi mới nhất đã commit & push

---

## Bước 1: Push code mới nhất lên GitHub

Mở Terminal trong VS Code, chạy:

```powershell
cd D:\Dowload\WebSiteCayCanh-main\CayCanhShop

git add .
git commit -m "Chuẩn bị deploy Railway"
git push origin main
```

---

## Bước 2: Tạo tài khoản Railway

1. Truy cập [railway.app](https://railway.app)
2. Nhấn **"Login"** → chọn **"Login with GitHub"**
3. Cho phép Railway truy cập GitHub của bạn
4. Sau khi đăng nhập, bạn sẽ thấy **Dashboard** của Railway

---

## Bước 3: Tạo dự án mới trên Railway

1. Nhấn nút **"New Project"** (góc phải trên)
2. Chọn **"Empty Project"** (tạo project trống)
3. Bạn sẽ thấy trang project trống — đây là nơi chúng ta sẽ thêm các service

---

## Bước 4: Thêm Database PostgreSQL

1. Trong project, nhấn **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway sẽ tự động tạo một database PostgreSQL
3. Nhấn vào service **PostgreSQL** vừa tạo
4. Vào tab **"Variables"** → copy giá trị **`DATABASE_URL`** (dạng `postgresql://postgres:xxx@xxx.railway.internal:5432/railway`)
5. Vào tab **"Data"** → nhấn **"Query"** → dán nội dung file `database/init_postgres.sql` vào → nhấn **"Run"** để tạo bảng và dữ liệu

> ⚠️ **Lưu ý**: Nếu không có file `init_postgres.sql`, bạn cần export database từ pgAdmin và import vào Railway PostgreSQL.

### Cách export database từ pgAdmin:

1. Mở **pgAdmin 4**
2. Click chuột phải vào database **HeThongBanCayCanh** → **Backup...**
3. Chọn Format: **Plain** | Encoding: **UTF8**
4. Tab **Data/Objects**: tick tất cả
5. Nhấn **Backup** → sẽ tạo file `.sql`
6. Copy nội dung file `.sql` và dán vào Railway Query tab

---

## Bước 5: Deploy Backend (FastAPI)

### 5.1. Thêm service Backend

1. Trong project Railway, nhấn **"New"** → **"GitHub Repo"**
2. Chọn repo **CayCanhShop** của bạn
3. Railway sẽ hỏi thư mục — chọn hoặc cấu hình thư mục `backend`

### 5.2. Cấu hình Backend

Nhấn vào service backend vừa tạo, vào tab **"Settings"**:

**Root Directory** (quan trọng!):
```
backend
```

**Build Command** (để trống — Railway tự detect Dockerfile)

Nếu Railway không detect Dockerfile, vào tab **Settings** → **Build** → chọn **Dockerfile**.

### 5.3. Thiết lập biến môi trường

Vào tab **"Variables"** → nhấn **"New Variable"** → thêm từng biến:

| Tên biến | Giá trị | Ghi chú |
|----------|---------|---------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Nhấn "Add Reference" → chọn PostgreSQL |
| `SECRET_KEY` | `ban-tu-dat-key-bi-mat-day-0987654321` | Đặt một chuỗi dài bất kỳ, khó đoán |
| `ALGORITHM` | `HS256` | |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24 giờ |
| `DEBUG` | `False` | |
| `PORT` | `8000` | |

> 💡 **Mẹo**: Với `DATABASE_URL`, bạn có thể nhấn nút **"Add Reference"** → chọn service **PostgreSQL** → chọn biến `DATABASE_URL`. Railway sẽ tự động liên kết.

### 5.4. Mở port

Vào tab **"Settings"** → mục **"Networking"** → nhấn **"Generate Domain"** để tạo URL public.

Railway sẽ tạo URL dạng: `https://caycanhshop-backend-production.up.railway.app`

**Copy URL này**, bạn sẽ cần nó ở bước tiếp theo!

---

## Bước 6: Cập nhật CORS cho Backend

Trước khi deploy frontend, cần cho backend biết URL frontend hợp lệ.

Mở file `backend/app/main.py`, thêm URL Railway frontend vào CORS:

```python
# CORS - cho phép React frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React dev
        "http://localhost:5173",      # Vite dev
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        # *** THÊM URL RAILWAY VÀO ĐÂY ***
        "https://caycanhshop-frontend-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

> 💡 **Mẹo nhanh**: Nếu chưa biết URL frontend Railway, bạn có thể tạm thời dùng `allow_origins=["*"]` để cho phép tất cả origin. Sau khi có URL chính xác thì sửa lại.

Commit & push:
```powershell
git add .
git commit -m "Thêm CORS cho Railway"
git push origin main
```

Railway sẽ **tự động redeploy** khi có code mới.

---

## Bước 7: Deploy Frontend (React)

### 7.1. Thêm service Frontend

1. Trong project Railway, nhấn **"New"** → **"GitHub Repo"**
2. Chọn repo **CayCanhShop** lần nữa
3. Cấu hình thư mục `frontend`

### 7.2. Cấu hình Frontend

Vào tab **"Settings"**:

**Root Directory**:
```
frontend
```

### 7.3. Thiết lập biến môi trường Frontend

Vào tab **"Variables"** → thêm:

| Tên biến | Giá trị | Ghi chú |
|----------|---------|---------|
| `VITE_API_URL` | `https://caycanhshop-backend-production.up.railway.app` | URL backend từ Bước 5.4 |

> ⚠️ **QUAN TRỌNG**: `VITE_API_URL` phải là URL backend Railway (KHÔNG phải localhost!). Biến này sẽ được nhúng vào code lúc build.

### 7.4. Mở port Frontend

Vào **Settings** → **Networking** → **Generate Domain**

URL frontend dạng: `https://caycanhshop-frontend-production.up.railway.app`

---

## Bước 8: Kiểm tra

1. Mở URL **backend**: `https://your-backend.up.railway.app/docs` → thấy Swagger UI = ✅
2. Mở URL **backend**: `https://your-backend.up.railway.app/health` → thấy `{"status":"healthy"}` = ✅  
3. Mở URL **frontend**: `https://your-frontend.up.railway.app` → thấy trang web = ✅

---

## 🔧 Xử lý lỗi thường gặp

### Lỗi: "Build failed"
- Kiểm tra **Root Directory** đã đặt đúng (`backend` hoặc `frontend`)
- Kiểm tra tab **Deploy Logs** để xem lỗi chi tiết

### Lỗi: "Database connection failed"
- Kiểm tra biến `DATABASE_URL` đã được set đúng
- Đảm bảo dùng **Reference** thay vì copy cứng URL (Railway có thể đổi URL)

### Lỗi: "CORS error" trên frontend
- Thêm URL frontend Railway vào `allow_origins` trong `main.py`
- Commit & push lại

### Lỗi: Frontend gọi API về localhost
- Kiểm tra biến `VITE_API_URL` đã set đúng URL backend Railway
- **Lưu ý**: Sau khi đổi biến `VITE_API_URL`, cần **Redeploy** frontend (vào Settings → nhấn Redeploy)

### Lỗi: "Application failed to respond"
- Kiểm tra `PORT` đã set đúng: backend = `8000`
- Kiểm tra Dockerfile có `--host 0.0.0.0`

---

## 📊 Kiến trúc Deploy

```
Railway Project
├── 🐘 PostgreSQL (Database)
│     └── HeThongBanCayCanh
│
├── 🐍 Backend (FastAPI)
│     ├── Root Dir: /backend
│     ├── Dockerfile → Python + Uvicorn
│     ├── Port: 8000
│     └── Env: DATABASE_URL, SECRET_KEY
│
└── ⚛️ Frontend (React)
      ├── Root Dir: /frontend  
      ├── Dockerfile → Node build + Nginx
      ├── Port: 80
      └── Env: VITE_API_URL (URL backend)
```

---

## 💰 Chi phí Railway

- **Trial Plan** (miễn phí): $5 credit/tháng — đủ cho dự án nhỏ
- **Hobby Plan**: $5/tháng — không giới hạn dự án
- Sau khi hết trial, Railway sẽ tạm dừng service — cần nâng cấp để tiếp tục

---

## ✅ Checklist trước khi Deploy

- [ ] Code đã push lên GitHub
- [ ] Database đã import dữ liệu vào Railway PostgreSQL
- [ ] Backend biến môi trường: `DATABASE_URL`, `SECRET_KEY`
- [ ] Frontend biến môi trường: `VITE_API_URL` = URL backend Railway
- [ ] CORS đã thêm URL frontend Railway
- [ ] Cả 2 service đã Generate Domain
- [ ] Test: `/health` trả về OK
- [ ] Test: Frontend hiển thị trang web
