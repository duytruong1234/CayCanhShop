# Sử dụng Python 3.10 slim
FROM python:3.10-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt libpq cho PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev libmagic1 && rm -rf /var/lib/apt/lists/*

# Copy file requirements
COPY requirements.txt .

# Cài đặt thư viện Python
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code backend
COPY . .

# Expose port
EXPOSE 8000

# Chạy Uvicorn server
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
