-- CayCanhShop Database Export
-- Generated for Railway PostgreSQL import

-- Table: AHP_ThongSoTieuChi
CREATE TABLE IF NOT EXISTS "AHP_ThongSoTieuChi" (
    "MaThongSo" VARCHAR(50) NOT NULL,
    "GiaTri" DOUBLE PRECISION NOT NULL DEFAULT 0,
    PRIMARY KEY ("MaThongSo")
);

-- Table: BinhLuan
CREATE TABLE IF NOT EXISTS "BinhLuan" (
    "BinhLuanID" SERIAL,
    "CayCanhID" INTEGER NOT NULL,
    "TaiKhoanID" INTEGER NOT NULL,
    "NoiDung" VARCHAR(1000),
    "SoSao" INTEGER,
    "NgayBinhLuan" TIMESTAMP DEFAULT now(),
    "HinhAnh" VARCHAR(255),
    "DonHangID" INTEGER NOT NULL,
    PRIMARY KEY ("BinhLuanID")
);

-- Table: CT_DonHang
CREATE TABLE IF NOT EXISTS "CT_DonHang" (
    "CTDonHangID" SERIAL,
    "DonHangID" INTEGER,
    "CayCanhID" INTEGER,
    "SoLuong" INTEGER,
    "DonGia" NUMERIC(18,2),
    "ThanhTien" NUMERIC(18,2),
    PRIMARY KEY ("CTDonHangID")
);

-- Table: CachChamSoc
CREATE TABLE IF NOT EXISTS "CachChamSoc" (
    "ID" SERIAL,
    "CayCanhID" INTEGER,
    "TieuDe" VARCHAR(200),
    "NoiDung" TEXT,
    PRIMARY KEY ("ID")
);

-- Table: CayCanh
CREATE TABLE IF NOT EXISTS "CayCanh" (
    "CayCanhID" SERIAL,
    "TenCay" VARCHAR(100) NOT NULL,
    "Gia" NUMERIC(18,2) NOT NULL,
    "MoTa" VARCHAR(500),
    "HinhAnh" VARCHAR(255),
    "LoaiCayID" INTEGER,
    PRIMARY KEY ("CayCanhID")
);

-- Table: CayCanh_DacDiem
CREATE TABLE IF NOT EXISTS "CayCanh_DacDiem" (
    "CayCanhID" INTEGER NOT NULL,
    "MaDacDiem" VARCHAR(20) NOT NULL,
    PRIMARY KEY ("CayCanhID", "MaDacDiem")
);

-- Table: ChucVu
CREATE TABLE IF NOT EXISTS "ChucVu" (
    "ChucVuID" SERIAL,
    "TenChucVu" VARCHAR(100) NOT NULL,
    "MoTa" VARCHAR(255),
    PRIMARY KEY ("ChucVuID")
);

-- Table: DacDiem
CREATE TABLE IF NOT EXISTS "DacDiem" (
    "MaDacDiem" VARCHAR(20) NOT NULL,
    "TenDacDiem" VARCHAR(50) NOT NULL,
    PRIMARY KEY ("MaDacDiem")
);

-- Table: DacDiemNoiBat
CREATE TABLE IF NOT EXISTS "DacDiemNoiBat" (
    "ID" SERIAL,
    "CayCanhID" INTEGER,
    "NoiDung" VARCHAR(300),
    PRIMARY KEY ("ID")
);

-- Table: DonHang
CREATE TABLE IF NOT EXISTS "DonHang" (
    "DonHangID" SERIAL,
    "KhachHangID" INTEGER,
    "NgayDat" TIMESTAMP,
    "TongTien" NUMERIC(18,2),
    "TrangThai" VARCHAR(50) DEFAULT 'Chờ xác nhận'::character varying,
    "NgayDuyet" TIMESTAMP,
    "NguoiDuyet" INTEGER,
    "NgayHuy" TIMESTAMP,
    "TenNguoiNhan" VARCHAR(100),
    "SDTNguoiNhan" VARCHAR(20),
    "DiaChiGiaoHang" VARCHAR(255),
    "GhiChu" VARCHAR(255),
    "PhuongThucThanhToan" VARCHAR(50),
    "NgayGiaoHang" TIMESTAMP,
    "NgayHoanThanh" TIMESTAMP,
    PRIMARY KEY ("DonHangID")
);

-- Table: GioHang
CREATE TABLE IF NOT EXISTS "GioHang" (
    "GioHangID" SERIAL,
    "TaiKhoanID" INTEGER NOT NULL,
    "NgayCapNhat" TIMESTAMP DEFAULT now(),
    PRIMARY KEY ("GioHangID")
);

-- Table: GioHangChiTiet
CREATE TABLE IF NOT EXISTS "GioHangChiTiet" (
    "GHCTID" SERIAL,
    "GioHangID" INTEGER NOT NULL,
    "CayCanhID" INTEGER NOT NULL,
    "SoLuong" INTEGER NOT NULL DEFAULT 1,
    "DonGia" NUMERIC(18,2) NOT NULL,
    PRIMARY KEY ("GHCTID")
);

-- Table: KhachHang
CREATE TABLE IF NOT EXISTS "KhachHang" (
    "KhachHangID" SERIAL,
    "TaiKhoanID" INTEGER,
    "HoTen" VARCHAR(100),
    "GioiTinh" VARCHAR(10),
    "NgaySinh" DATE,
    "DiaChi" VARCHAR(255),
    PRIMARY KEY ("KhachHangID")
);

-- Table: LoaiCay
CREATE TABLE IF NOT EXISTS "LoaiCay" (
    "LoaiCayID" SERIAL,
    "TenLoai" VARCHAR(100) NOT NULL,
    "MoTa" VARCHAR(255),
    PRIMARY KEY ("LoaiCayID")
);

-- Table: MaTranPhuongAn
CREATE TABLE IF NOT EXISTS "MaTranPhuongAn" (
    "MaTieuChi" VARCHAR(10) NOT NULL,
    "CayDongID" INTEGER NOT NULL,
    "CayCotID" INTEGER NOT NULL,
    "GiaTriPhuongAn" DOUBLE PRECISION NOT NULL,
    PRIMARY KEY ("MaTieuChi", "CayDongID", "CayCotID")
);

-- Table: MaTranSoSanh
CREATE TABLE IF NOT EXISTS "MaTranSoSanh" (
    "TieuChiDong" VARCHAR(10) NOT NULL,
    "TieuChiCot" VARCHAR(10) NOT NULL,
    "GiaTriTieuChi" DOUBLE PRECISION NOT NULL,
    PRIMARY KEY ("TieuChiDong", "TieuChiCot")
);

-- Table: MoTaChiTiet
CREATE TABLE IF NOT EXISTS "MoTaChiTiet" (
    "CayCanhID" INTEGER NOT NULL,
    "TieuDe" VARCHAR(200),
    "NoiDung" TEXT,
    PRIMARY KEY ("CayCanhID")
);

-- Table: NhanVien
CREATE TABLE IF NOT EXISTS "NhanVien" (
    "NhanVienID" SERIAL,
    "TaiKhoanID" INTEGER,
    "HoTen" VARCHAR(100),
    "GioiTinh" VARCHAR(10),
    "NgaySinh" DATE,
    "DiaChi" VARCHAR(255),
    "DienThoai" VARCHAR(20),
    "Email" VARCHAR(100),
    "ChucVuID" INTEGER,
    PRIMARY KEY ("NhanVienID")
);

-- Table: TaiKhoan
CREATE TABLE IF NOT EXISTS "TaiKhoan" (
    "TaiKhoanID" SERIAL,
    "TenDangNhap" VARCHAR(50) NOT NULL,
    "MatKhau" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(100),
    "DienThoai" VARCHAR(20),
    "VaiTroID" INTEGER NOT NULL,
    "TrangThai" VARCHAR(30) DEFAULT 'Hoạt động'::character varying,
    "NgayTao" TIMESTAMP DEFAULT now(),
    PRIMARY KEY ("TaiKhoanID")
);

-- Table: ThongTinKhoaHoc
CREATE TABLE IF NOT EXISTS "ThongTinKhoaHoc" (
    "CayCanhID" INTEGER NOT NULL,
    "TenKhoaHoc" VARCHAR(200),
    "HoThucVat" VARCHAR(200),
    "NguonGoc" VARCHAR(300),
    "TenGoiKhac" VARCHAR(300),
    PRIMARY KEY ("CayCanhID")
);

-- Table: TieuChi
CREATE TABLE IF NOT EXISTS "TieuChi" (
    "MaTieuChi" VARCHAR(10) NOT NULL,
    "TenTieuChi" VARCHAR(200) NOT NULL,
    "TrongSoTieuChi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "CR_PhuongAn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    PRIMARY KEY ("MaTieuChi")
);

-- Table: TonKho
CREATE TABLE IF NOT EXISTS "TonKho" (
    "TonKhoID" SERIAL,
    "CayCanhID" INTEGER NOT NULL,
    "SoLuongTon" INTEGER NOT NULL DEFAULT 0,
    "NgayCapNhat" TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY ("TonKhoID")
);

-- Table: TrongSoPhuongAn
CREATE TABLE IF NOT EXISTS "TrongSoPhuongAn" (
    "CayCanhID" INTEGER NOT NULL,
    "MaTieuChi" VARCHAR(10) NOT NULL,
    "TrongSoPhuongAn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    PRIMARY KEY ("CayCanhID", "MaTieuChi")
);

-- Table: VaiTro
CREATE TABLE IF NOT EXISTS "VaiTro" (
    "VaiTroID" SERIAL,
    "TenVaiTro" VARCHAR(50),
    "MoTa" VARCHAR(200),
    PRIMARY KEY ("VaiTroID")
);

ALTER TABLE "BinhLuan" ADD CONSTRAINT "BinhLuan_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "BinhLuan" ADD CONSTRAINT "BinhLuan_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES "TaiKhoan" ("TaiKhoanID");
ALTER TABLE "BinhLuan" ADD CONSTRAINT "BinhLuan_DonHangID_fkey" FOREIGN KEY ("DonHangID") REFERENCES "DonHang" ("DonHangID");
ALTER TABLE "CT_DonHang" ADD CONSTRAINT "CT_DonHang_DonHangID_fkey" FOREIGN KEY ("DonHangID") REFERENCES "DonHang" ("DonHangID");
ALTER TABLE "CT_DonHang" ADD CONSTRAINT "CT_DonHang_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "CachChamSoc" ADD CONSTRAINT "CachChamSoc_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "CayCanh" ADD CONSTRAINT "CayCanh_LoaiCayID_fkey" FOREIGN KEY ("LoaiCayID") REFERENCES "LoaiCay" ("LoaiCayID");
ALTER TABLE "CayCanh_DacDiem" ADD CONSTRAINT "CayCanh_DacDiem_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "CayCanh_DacDiem" ADD CONSTRAINT "CayCanh_DacDiem_MaDacDiem_fkey" FOREIGN KEY ("MaDacDiem") REFERENCES "DacDiem" ("MaDacDiem");
ALTER TABLE "DacDiemNoiBat" ADD CONSTRAINT "DacDiemNoiBat_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "DonHang" ADD CONSTRAINT "DonHang_KhachHangID_fkey" FOREIGN KEY ("KhachHangID") REFERENCES "KhachHang" ("KhachHangID");
ALTER TABLE "DonHang" ADD CONSTRAINT "DonHang_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES "NhanVien" ("NhanVienID");
ALTER TABLE "GioHang" ADD CONSTRAINT "GioHang_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES "TaiKhoan" ("TaiKhoanID");
ALTER TABLE "GioHangChiTiet" ADD CONSTRAINT "GioHangChiTiet_GioHangID_fkey" FOREIGN KEY ("GioHangID") REFERENCES "GioHang" ("GioHangID");
ALTER TABLE "GioHangChiTiet" ADD CONSTRAINT "GioHangChiTiet_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "KhachHang" ADD CONSTRAINT "KhachHang_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES "TaiKhoan" ("TaiKhoanID");
ALTER TABLE "MaTranPhuongAn" ADD CONSTRAINT "MaTranPhuongAn_MaTieuChi_fkey" FOREIGN KEY ("MaTieuChi") REFERENCES "TieuChi" ("MaTieuChi");
ALTER TABLE "MaTranPhuongAn" ADD CONSTRAINT "MaTranPhuongAn_CayDongID_fkey" FOREIGN KEY ("CayDongID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "MaTranPhuongAn" ADD CONSTRAINT "MaTranPhuongAn_CayCotID_fkey" FOREIGN KEY ("CayCotID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "MaTranSoSanh" ADD CONSTRAINT "MaTranSoSanh_TieuChiDong_fkey" FOREIGN KEY ("TieuChiDong") REFERENCES "TieuChi" ("MaTieuChi");
ALTER TABLE "MaTranSoSanh" ADD CONSTRAINT "MaTranSoSanh_TieuChiCot_fkey" FOREIGN KEY ("TieuChiCot") REFERENCES "TieuChi" ("MaTieuChi");
ALTER TABLE "MoTaChiTiet" ADD CONSTRAINT "MoTaChiTiet_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "NhanVien" ADD CONSTRAINT "NhanVien_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES "TaiKhoan" ("TaiKhoanID");
ALTER TABLE "NhanVien" ADD CONSTRAINT "NhanVien_ChucVuID_fkey" FOREIGN KEY ("ChucVuID") REFERENCES "ChucVu" ("ChucVuID");
ALTER TABLE "TaiKhoan" ADD CONSTRAINT "TaiKhoan_VaiTroID_fkey" FOREIGN KEY ("VaiTroID") REFERENCES "VaiTro" ("VaiTroID");
ALTER TABLE "ThongTinKhoaHoc" ADD CONSTRAINT "ThongTinKhoaHoc_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "TonKho" ADD CONSTRAINT "TonKho_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "TrongSoPhuongAn" ADD CONSTRAINT "TrongSoPhuongAn_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES "CayCanh" ("CayCanhID");
ALTER TABLE "TrongSoPhuongAn" ADD CONSTRAINT "TrongSoPhuongAn_MaTieuChi_fkey" FOREIGN KEY ("MaTieuChi") REFERENCES "TieuChi" ("MaTieuChi");


-- Data for table: AHP_ThongSoTieuChi (1 rows)
INSERT INTO "AHP_ThongSoTieuChi" ("MaThongSo", "GiaTri") VALUES ('CR_TieuChi_TongThe', 0.04387617228057044);

-- Data for table: BinhLuan (3 rows)
INSERT INTO "BinhLuan" ("BinhLuanID", "CayCanhID", "TaiKhoanID", "NoiDung", "SoSao", "NgayBinhLuan", "HinhAnh", "DonHangID") VALUES (11, 4, 2, 'săner phẩm ok', 5, '2025-12-15 19:56:36.257000', NULL, 17);
INSERT INTO "BinhLuan" ("BinhLuanID", "CayCanhID", "TaiKhoanID", "NoiDung", "SoSao", "NgayBinhLuan", "HinhAnh", "DonHangID") VALUES (12, 4, 2, NULL, 5, '2025-12-15 20:04:25.253000', NULL, 17);
INSERT INTO "BinhLuan" ("BinhLuanID", "CayCanhID", "TaiKhoanID", "NoiDung", "SoSao", "NgayBinhLuan", "HinhAnh", "DonHangID") VALUES (13, 2, 2, NULL, 5, '2025-12-15 21:52:00.277000', NULL, 17);
SELECT setval(pg_get_serial_sequence('"BinhLuan"', 'BinhLuanID'), (SELECT COALESCE(MAX("BinhLuanID"), 0) FROM "BinhLuan"));

-- Data for table: CT_DonHang (30 rows)
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (3, 2, 1, 2, '45000.00', '90000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (4, 3, 5, 2, '123000.00', '246000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (5, 12, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (6, 12, 5, 2, '123000.00', '246000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (7, 13, 1, 1, '45000.00', '45000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (8, 13, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (9, 14, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (10, 15, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (11, 16, 1, 1, '45000.00', '45000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (12, 17, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (13, 17, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (14, 18, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (15, 19, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (16, 20, 2, 2, '120000.00', '240000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (17, 21, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (18, 22, 1, 3, '45000.00', '135000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (19, 22, 5, 2, '123000.00', '246000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (20, 22, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (21, 23, 2, 1, '120000.00', '120000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (22, 24, 1, 1, '45000.00', '45000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (23, 25, 1, 3, '45000.00', '135000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (24, 25, 5, 2, '123000.00', '246000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (25, 25, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (26, 26, 1, 3, '45000.00', '135000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (27, 26, 5, 2, '123000.00', '246000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (28, 26, 4, 1, '23000.00', '23000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (29, 27, 4, 2, '23000.00', '46000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (30, 28, 1, 1, '45000.00', '45000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (31, 29, 1, 1, '45000.00', '45000.00');
INSERT INTO "CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") VALUES (32, 29, 2, 1, '120000.00', '120000.00');
SELECT setval(pg_get_serial_sequence('"CT_DonHang"', 'CTDonHangID'), (SELECT COALESCE(MAX("CTDonHangID"), 0) FROM "CT_DonHang"));

-- Data for table: CachChamSoc (55 rows)
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (1, 1, 'Ánh sáng', 'Ưa ánh sáng nhẹ, tránh nắng gắt trực tiếp.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (2, 1, 'Tưới nước', 'Tưới 1–2 lần/tuần khi đất khô hoàn toàn.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (3, 1, 'Đất trồng', 'Đất tơi xốp, thoát nước tốt (tro trấu + perlite).');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (4, 1, 'Nhiệt độ', '18–30°C, chịu tốt máy lạnh.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (5, 1, 'Bón phân', 'Bón phân hữu cơ 1 lần/tuần');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (6, 2, 'Ánh sáng', 'Sống tốt trong ánh sáng yếu, nhưng phát triển mạnh ở nơi có ánh sáng tự nhiên.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (7, 2, 'Tưới nước', 'Chỉ tưới khi đất thật khô; trung bình 7–14 ngày tưới một lần.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (8, 2, 'Đất trồng', 'Nên dùng đất thoát nước tốt: hỗn hợp đất thịt + cát + xơ dừa hoặc đất xương rồng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (9, 2, 'Độ ẩm', 'Không cần độ ẩm cao, tránh để nước đọng gây úng rễ.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (10, 2, 'Bón phân', ' Nên bón phân hữu cơ hoặc NPK loãng mỗi 1–2 tháng trong mùa sinh trưởng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (11, 4, 'Ánh sáng', 'Lan tím ưa sáng nhẹ, tránh nắng gắt trực tiếp; đặt cạnh cửa sổ có rèm là tốt nhất.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (12, 4, 'Tưới nước', 'Tưới 2–3 lần/tuần; chỉ tưới khi giá thể khô, tránh để úng làm thối rễ.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (13, 4, 'Đất trồng / giá thể', 'Dùng vỏ thông, than gỗ hoặc dớn — giúp thông thoáng và thoát nước nhanh.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (14, 4, 'Độ ẩm & nhiệt độ', 'Duy trì độ ẩm khoảng 50–70%; nhiệt độ lý tưởng 20–28°C.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (15, 4, 'Bón phân', 'Bón phân NPK 30-10-10 hoặc phân lan chuyên dụng 2 lần/tháng vào mùa sinh trưởng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (41, 5, 'Ánh sáng', 'Cây ưa sáng nhẹ; để nơi có ánh sáng gián tiếp giúp lá giữ màu hồng đẹp nhất.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (42, 5, 'Tưới nước', 'Tưới 2–3 lần/tuần; giữ đất luôn hơi ẩm nhưng không để đọng nước.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (43, 5, 'Đất trồng', 'Dùng đất tơi xốp, thoát nước tốt; có thể trộn đất tribat + perlite + xơ dừa.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (44, 5, 'Độ ẩm & nhiệt độ', 'Cây thích độ ẩm 60–80% và nhiệt độ 18–28°C; tránh khí lạnh trực tiếp.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (45, 5, 'Nhân giống', 'Rất dễ nhân giống bằng cách cắt ngọn và giâm xuống đất ẩm hoặc nước.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (46, 6, 'Ánh sáng', 'Cây chịu bóng tốt, nên đặt nơi có ánh sáng gián tiếp. Tránh nắng gắt trực tiếp.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (47, 6, 'Tưới nước', 'Tưới 1–2 lần/tuần. Chỉ tưới khi đất khô để tránh úng rễ.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (48, 6, 'Đất trồng', 'Nên dùng đất tơi xốp, thoát nước tốt như hỗn hợp tribat + vỏ thông + perlite.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (49, 6, 'Nhiệt độ & độ ẩm', 'Sống tốt trong khoảng 20–32°C; thích độ ẩm trung bình.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (50, 6, 'Phòng bệnh', 'Tránh để nước đọng ở gốc; lau lá thường xuyên giúp cây quang hợp tốt.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (51, 7, 'Ánh sáng', 'Cây ưa bóng nhẹ hoặc sáng tán xạ. Không đặt dưới nắng gắt vì dễ cháy lá.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (52, 7, 'Nước tưới', 'Tưới 2–3 lần/tuần. Giữ đất ẩm nhưng không ngập úng. Đặt cây ở vị trí thoáng khí.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (53, 7, 'Đất trồng', 'Sử dụng đất tơi xốp, thoát nước tốt, có trộn xơ dừa hoặc tro trấu để cây phát triển khỏe.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (54, 7, 'Phân bón', 'Bón phân hữu cơ hoặc NPK loãng mỗi 30 ngày để kích thích lá xanh và mọc nhanh.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (55, 7, 'Nhân giống', 'Cắt cành có 2–3 đốt lá và giâm vào nước hoặc đất. Tỷ lệ sống rất cao và dễ chăm.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (56, 8, 'Ánh sáng', 'Cây ưa bóng râm hoặc ánh sáng tán xạ. Không để dưới nắng trực tiếp vì dễ cháy lá.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (57, 8, 'Nước tưới', 'Tưới 2–3 lần/tuần. Giữ đất ẩm nhẹ, không để cây bị úng nước. Khi lá rũ xuống là dấu hiệu cần tưới.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (58, 8, 'Đất trồng', 'Dùng đất tơi xốp, thoát nước tốt. Có thể pha trộn đất + xơ dừa + perlite để cây phát triển tốt hơn.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (59, 8, 'Phân bón', 'Bón phân hữu cơ hoặc NPK loãng 20-30 ngày/lần giúp lá xanh và kích thích ra hoa.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (60, 8, 'Không khí & Độ ẩm', 'Cây thích môi trường mát và độ ẩm cao. Có thể xịt phun sương nhẹ lên lá vào buổi sáng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (61, 9, 'Ánh sáng', 'Cây ưa ánh sáng mạnh. Đặt ở nơi có nắng buổi sáng để kích thích ra hoa.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (62, 9, 'Nước tưới', 'Tưới 2–3 lần/tuần. Đảm bảo đất luôn ẩm nhưng không bị úng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (63, 9, 'Đất trồng', 'Nên dùng hỗn hợp đất tơi xốp gồm đất thịt, mùn và perlite để thoát nước tốt.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (64, 9, 'Phân bón', 'Bón phân hữu cơ hoặc NPK 20-20-15 mỗi 30 ngày để lá xanh và hoa nhiều.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (65, 9, 'Không khí & Độ ẩm', 'Cây thích không gian thoáng, gió nhẹ. Có thể xịt sương giúp lá bóng và tăng độ ẩm.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (66, 10, 'Ánh sáng', 'Cây thích ánh sáng gián tiếp mạnh. Đặt gần cửa sổ, tránh nắng gắt buổi trưa.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (67, 10, 'Tưới nước', 'Tưới 1–2 lần/tuần. Đảm bảo đất khô 50% bề mặt rồi mới tưới lại. Không để úng.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (68, 10, 'Đất trồng', 'Sử dụng đất tơi xốp, nhiều mùn, trộn perlite hoặc xơ dừa để thoát nước tốt.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (69, 10, 'Phân bón', 'Bón phân hữu cơ hoặc NPK 20-20-20 mỗi 30 ngày để cây phát triển ổn định.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (70, 10, 'Sức khỏe cây', 'Lau lá định kỳ, kiểm tra nấm và rệp sáp. Đặt nơi thoáng mát, gió nhẹ để cây khỏe.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (71, 11, 'Ánh sáng', 'Cây thích ánh sáng khuếch tán hoặc bóng râm nhẹ. Tránh nắng gắt gây cháy lá.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (72, 11, 'Tưới nước', 'Tưới 2–3 lần/tuần. Đảm bảo đất ẩm nhẹ nhưng không đọng nước.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (73, 11, 'Đất trồng', 'Sử dụng đất tơi xốp, thoát nước tốt. Trộn tro trấu, xơ dừa để giúp cây phát triển khỏe.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (74, 11, 'Phân bón', 'Bón phân hữu cơ hoặc phân vi sinh định kỳ 20–30 ngày giúp lá lên màu đẹp.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (75, 11, 'Nhân giống', 'Cắt cành và ngâm nước 5–7 ngày để ra rễ, sau đó trồng vào đất. Tỷ lệ sống rất cao.');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (76, 14, 'Ánh sáng', 'để dưới ánh sáng trực tiếp');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (77, 14, 'Tưới nước', 'Lâu lâu tưới 1 lần ');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (78, 14, 'Đất trồng', '');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (79, 14, 'Nhiệt độ', '');
INSERT INTO "CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") VALUES (80, 14, 'Bón phân', '');
SELECT setval(pg_get_serial_sequence('"CachChamSoc"', 'ID'), (SELECT COALESCE(MAX("ID"), 0) FROM "CachChamSoc"));

-- Data for table: CayCanh (11 rows)
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (1, 'Sen đá kim cương', '45000.00', NULL, '6a424f4c-a772-4293-91ac-c4d4698ca9ed.jpg', 1);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (2, 'Lưỡi hổ', '120000.00', NULL, 'dd69aac3-2b79-4153-b603-b65cbf716374.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (4, 'Hoa Lan Tím', '23000.00', NULL, 'ef26b69a-b01d-4128-ba13-ebd49186788c.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (5, 'Cây Thài Lài Sọc Hồng', '123000.00', NULL, '82bc4ca8-2d6b-443b-a754-f9e799cfad17.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (6, 'Vạn Niên Thanh', '125000.00', NULL, '24f87c83-2599-4ea4-ba17-602855c898f5.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (7, 'Trầu Bà Nam Mỹ', '200000.00', NULL, '72eeb814-be27-485b-8db4-3a6f3a90a526.jpg', 1);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (8, 'Lan Ý', '240000.00', NULL, '70ddeb88-2f94-4c1a-9354-c06173f485fd.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (9, 'Thiên Điểu', '230000.00', NULL, '31c28a23-fc6e-41c4-b522-e1ba27482a55.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (10, 'Cây Bàng Singapore', '300000.00', NULL, 'afa4a58d-0629-4115-8a8d-ed6340cb4213.jpg', 2);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (11, 'Lá Gấm', '230000.00', NULL, '2faecb8e-ef61-489d-81b5-c2d3a4d26a7a.jpg', 1);
INSERT INTO "CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") VALUES (14, 'Bằng lăng', '123.00', NULL, '84f7ef77-2117-488e-9dfa-21794815126e.jpg', 2);
SELECT setval(pg_get_serial_sequence('"CayCanh"', 'CayCanhID'), (SELECT COALESCE(MAX("CayCanhID"), 0) FROM "CayCanh"));

-- Data for table: CayCanh_DacDiem (35 rows)
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (1, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (1, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (1, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (1, 'KHONG_DOC');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (2, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (2, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (2, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (4, 'HOA');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (4, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (4, 'KHONG_DOC');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (5, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (5, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (5, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (5, 'KHONG_DOC');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (6, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (6, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (6, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (7, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (7, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (7, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (8, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (8, 'HOA');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (8, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (8, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (9, 'HOA');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (9, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (9, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (9, 'KHONG_DOC');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (10, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (10, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (10, 'IT_SAU');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (10, 'KHONG_DOC');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (11, 'DE_CHAM');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (11, 'IT_MUI');
INSERT INTO "CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") VALUES (11, 'KHONG_DOC');
-- Table ChucVu: no data

-- Data for table: DacDiem (5 rows)
INSERT INTO "DacDiem" ("MaDacDiem", "TenDacDiem") VALUES ('DE_CHAM', 'Dễ chăm sóc');
INSERT INTO "DacDiem" ("MaDacDiem", "TenDacDiem") VALUES ('HOA', 'Có hoa');
INSERT INTO "DacDiem" ("MaDacDiem", "TenDacDiem") VALUES ('IT_MUI', 'Ít mùi');
INSERT INTO "DacDiem" ("MaDacDiem", "TenDacDiem") VALUES ('IT_SAU', 'Ít sâu bệnh');
INSERT INTO "DacDiem" ("MaDacDiem", "TenDacDiem") VALUES ('KHONG_DOC', 'Không độc');

-- Data for table: DacDiemNoiBat (50 rows)
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (1, 1, 'Lá mọng nước hình hoa thị, màu xanh ngọc trong đặc trưng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (2, 1, 'Chịu hạn tốt, sống khỏe trong môi trường khô nóng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (3, 1, 'Ít cần chăm sóc, phù hợp người bận rộn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (4, 1, 'Ý nghĩa phong thủy hút tài lộc, may mắn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (5, 1, 'Dễ nhân giống từ lá, tốc độ phát triển ổn định');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (11, 4, 'Hoa nở lâu, giữ màu đẹp từ 6–10 tuần');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (12, 4, 'Màu tím sang trọng – biểu tượng của sự quý phái và may mắn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (13, 4, 'Phù hợp trang trí phòng khách, lễ tân, quán café, tiệc cưới');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (14, 4, 'Dễ chăm sóc hơn nhiều loại lan khác, phù hợp người mới chơi');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (15, 4, 'Hương thơm nhẹ nhàng, tinh khiết, tạo cảm giác thư giãn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (41, 5, 'Lá xanh kết hợp vệt hồng tím đẹp mắt, nổi bật trong mọi không gian');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (42, 5, 'Dễ trồng, phát triển nhanh và thích hợp với người mới chơi cây');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (43, 5, 'Có thể sống tốt cả trong nhà và ngoài trời');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (44, 5, 'Thanh lọc không khí nhẹ, giúp không gian tươi mát hơn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (45, 5, 'Ứa sự sinh sôi, may mắn trong phong thủy – phù hợp đặt trên bàn làm việc');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (46, 6, 'Lá lớn, xanh mướt quanh năm, mang lại cảm giác mát mắt và sang trọng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (47, 6, 'Sống bền bỉ, chịu được môi trường thiếu sáng – cực phù hợp văn phòng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (48, 6, 'Khả năng lọc không khí tốt, hấp thụ độc tố từ thiết bị điện tử');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (49, 6, 'Ý nghĩa phong thủy: mang may mắn, bình an và trường thọ');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (50, 6, 'Cây dễ chăm, phù hợp người mới bắt đầu');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (51, 7, 'Lá hình tim mềm mại, mọc rủ rất đẹp');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (52, 7, 'Rất dễ trồng, phát triển tốt trong bóng râm');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (53, 7, 'Lọc khí tốt, hấp thụ độc tố trong phòng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (54, 7, 'Sống khỏe cả trong nước và đất');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (55, 7, 'Tốc độ sinh trưởng nhanh, dễ nhân giống');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (56, 9, 'Hoa hình dáng độc đáo giống chú chim đang tung cánh');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (57, 9, 'Màu sắc rực rỡ, nổi bật trong mọi không gian');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (58, 9, 'Chịu nắng tốt, sống khỏe ngoài trời lẫn trong nhà');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (59, 9, 'Tuổi thọ cao, ít sâu bệnh và dễ chăm sóc');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (60, 9, 'Mang ý nghĩa may mắn, sung túc và thịnh vượng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (61, 10, 'Lá to bản, hình đàn violin cực kỳ sang trọng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (62, 10, 'Thu hút ánh nhìn, phù hợp trang trí nhà, văn phòng, sảnh lớn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (63, 10, 'Lọc không khí tốt, cải thiện chất lượng không gian sống');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (64, 10, 'Dễ chăm sóc, sống khỏe trong ánh sáng gián tiếp');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (65, 10, 'Tượng trưng cho may mắn, thịnh vượng và năng lượng tích cực');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (66, 11, 'Họa tiết lá nhiều màu sắc cực bắt mắt');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (67, 11, 'Dễ trồng, thích nghi tốt với mọi môi trường');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (68, 11, 'Phù hợp trang trí bàn làm việc, ban công, sân vườn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (69, 11, 'Tốc độ sinh trưởng nhanh, dễ nhân giống');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (70, 11, 'Giúp không gian trở nên sinh động và tươi sáng');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (71, 8, 'Khả năng thanh lọc không khí cực tốt – nằm trong TOP cây lọc độc tố theo NASA.');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (72, 8, 'Dễ sống, chịu bóng, phù hợp với phòng máy lạnh hoặc ánh sáng yếu.');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (73, 8, 'Hoa trắng thanh lịch, nở bền và dễ chăm, mang vẻ đẹp sang trọng.');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (74, 8, 'Ý nghĩa phong thủy tốt: giúp cân bằng năng lượng, thu hút may mắn.');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (75, 8, 'Chăm sóc đơn giản – chỉ cần tưới 1–2 lần/tuần, ít bị sâu bệnh.');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (76, 2, 'Thanh lọc không khí cực tốt – hấp thụ khí độc như formaldehyde');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (77, 2, 'Dễ sống, chịu hạn mạnh, phù hợp người bận rộn');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (78, 2, 'Sinh trưởng tốt cả trong nhà và văn phòng ánh sáng yếu');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (79, 2, 'Hình dáng sang trọng, lá cứng khỏe, họa tiết khỏe');
INSERT INTO "DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") VALUES (80, 2, 'Ý nghĩa phong thủy: mang lại may mắn và bảo vệ gia chủ');
SELECT setval(pg_get_serial_sequence('"DacDiemNoiBat"', 'ID'), (SELECT COALESCE(MAX("ID"), 0) FROM "DacDiemNoiBat"));

-- Data for table: DonHang (20 rows)
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (2, 2, '2025-11-27 13:26:50.970000', '90000.00', 'Đã nhận hàng', NULL, NULL, NULL, 'Quyên', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'COD', '2025-11-28 14:35:40.873000', '2025-11-28 14:40:55.273000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (3, 2, '2025-11-27 13:53:06.553000', '246000.00', 'Ðã nh?n hàng', '2025-11-28 14:36:00.967000', NULL, NULL, 'Quyên', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'Chuyển khoản', '2025-11-29 14:16:10.520000', '2026-01-28 08:22:17.730000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (12, 5, '2025-11-28 12:27:36.347000', '366000.00', 'Đã nhận hàng', NULL, NULL, NULL, 'Quyên', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'COD', NULL, '2025-11-28 14:36:58.230000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (13, 1, '2025-11-28 22:23:17.167000', '165000.00', 'Đã hủy', NULL, NULL, '2025-12-15 12:13:48.787000', 'Quyên', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', 'Lý do hủy: Muốn thay đổi sản phẩm', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (14, 1, '2025-11-29 01:19:03.187000', '120000.00', 'Đã nhận hàng', '2025-11-29 14:15:58.330000', NULL, NULL, 'Quyên', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'COD', '2025-11-29 14:20:30.513000', '2025-12-12 12:35:20.157000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (15, 5, '2025-11-29 14:13:44.303000', '23000.00', 'Đã hủy', NULL, NULL, '2025-11-29 14:14:00.667000', 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', 'Lý do hủy: Muốn thay đổi sản phẩm', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (16, 1, '2025-12-09 12:11:03.430000', '45000.00', 'Đã hủy', '2025-12-09 15:11:01.723000', NULL, '2025-12-15 20:07:10.147000', 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', 'Lý do hủy: Đổi ý không mua nữa', 'Chuyển khoản', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (17, 1, '2025-12-15 18:16:16.420000', '143000.00', 'Đã nhận hàng', '2025-12-15 18:16:58.477000', NULL, NULL, 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'COD', '2025-12-15 18:17:02.197000', '2025-12-15 18:17:06.390000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (18, 1, '2025-12-15 21:59:14.213000', '120000.00', 'Đã nhận hàng', '2025-12-15 22:00:23.327000', NULL, NULL, 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'COD', '2025-12-15 22:00:26.757000', '2025-12-15 22:00:29.500000');
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (19, 1, '2025-12-15 23:39:14.717000', '120000.00', 'Chờ xác nhận', NULL, NULL, NULL, 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'Chuyển khoản', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (20, 1, '2025-12-18 12:08:09.333000', '240000.00', 'Đã xác nhận', '2025-12-18 12:08:59.630000', NULL, NULL, 'Thư', '0094436823', '124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh', NULL, 'Chuyển khoản', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (21, 4, '2026-01-18 20:31:16.987000', '23000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'dddd', '0127580182', 'ddd, dd, dd, dd', '', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (22, 1, '2026-01-18 20:33:28.757000', '404000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'Test User', '0909090909', 'Test Address', 'Test Note', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (23, 4, '2026-01-18 20:35:05.770000', '120000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'sddd', '0345678671', 'sâsas, sâsas, sâsas, sffffff', '', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (24, 4, '2026-01-18 20:35:57.137000', '45000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'sdddd', '0161237896', 'dddyuuuuuuu, gghhjh, geeeee, wwwww', '', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (25, 1, '2026-01-18 20:37:33.550000', '404000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'Test User', '0909090909', 'Test Address', 'Test Note', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (26, 1, '2026-01-18 20:38:11.723000', '404000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'Debug API User', '0123456789', 'Debug Address API', 'Debug API Note', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (27, 4, '2026-01-18 20:41:15.267000', '46000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'eweew', '0345670123', 'sâss, ssssss, ssssss, sssss', '', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (28, 1, '2026-01-18 20:42:10.217000', '45000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'Debug Router User', '0123456789', 'Debug Address Router', 'Debug Note', 'COD', NULL, NULL);
INSERT INTO "DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") VALUES (29, 4, '2026-01-18 20:44:09.503000', '165000.00', 'Ch? xác nh?n', NULL, NULL, NULL, 'xxxxxxx', '0127580182', 'xxxxxxxx, xxxxxxxxxxxxxx, xxxxxxxxxxxxxxx, xxxxxxxxxxxxxxxxx', '', 'COD', NULL, NULL);
SELECT setval(pg_get_serial_sequence('"DonHang"', 'DonHangID'), (SELECT COALESCE(MAX("DonHangID"), 0) FROM "DonHang"));

-- Data for table: GioHang (5 rows)
INSERT INTO "GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") VALUES (6, 2, '2025-12-18 12:07:50.007000');
INSERT INTO "GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") VALUES (7, 2, '2025-11-26 02:58:01.817000');
INSERT INTO "GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") VALUES (8, 6, '2025-11-29 14:12:47.353000');
INSERT INTO "GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") VALUES (1009, 7, '2026-02-20 09:12:05.157000');
INSERT INTO "GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") VALUES (9, 5, '2026-03-12 21:06:46.214835');
SELECT setval(pg_get_serial_sequence('"GioHang"', 'GioHangID'), (SELECT COALESCE(MAX("GioHangID"), 0) FROM "GioHang"));

-- Data for table: GioHangChiTiet (1 rows)
INSERT INTO "GioHangChiTiet" ("GHCTID", "GioHangID", "CayCanhID", "SoLuong", "DonGia") VALUES (25, 7, 2, 1, '120000.00');
SELECT setval(pg_get_serial_sequence('"GioHangChiTiet"', 'GHCTID'), (SELECT COALESCE(MAX("GHCTID"), 0) FROM "GioHangChiTiet"));

-- Data for table: KhachHang (9 rows)
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (1, 2, 'Nguyễn Văn A', 'Nam', '1999-06-15', '123 Lê Lợi, Q1, TP.HCM');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (2, 3, 'Trần Mỹ Quyên', 'Nữ', '2005-07-10', '236 Le Van Sy');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (4, 5, 'na', 'Nữ', '2002-01-02', '124 cau trương');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (5, 6, 'thu', 'Nữ', '2006-07-06', '123 Lê Lợi, Q1, TP.HCM');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (18, 7, 'tram', 'Nữ', '2004-10-09', 'ta quang buu');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (19, 8, 'tram', 'Nam', '2003-10-09', 'caolo');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (24, NULL, 'tram', 'Nữ', '2004-12-10', 'hoa thanh');
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (26, NULL, 'tram', 'Nữ', '2005-12-31', NULL);
INSERT INTO "KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") VALUES (27, 9, 'linh', 'Nữ', '1999-06-08', '124 Lê Lợi, Q1, TP.HCM');
SELECT setval(pg_get_serial_sequence('"KhachHang"', 'KhachHangID'), (SELECT COALESCE(MAX("KhachHangID"), 0) FROM "KhachHang"));

-- Data for table: LoaiCay (2 rows)
INSERT INTO "LoaiCay" ("LoaiCayID", "TenLoai", "MoTa") VALUES (1, 'Cây để bàn', NULL);
INSERT INTO "LoaiCay" ("LoaiCayID", "TenLoai", "MoTa") VALUES (2, 'Cây phong thủy', NULL);
SELECT setval(pg_get_serial_sequence('"LoaiCay"', 'LoaiCayID'), (SELECT COALESCE(MAX("LoaiCayID"), 0) FROM "LoaiCay"));

-- Data for table: MaTranPhuongAn (400 rows)
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 6, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 7, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 1, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 5, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 6, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 7, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 8, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 10, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 2, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 4, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 5, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 6, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 7, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 8, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 1, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 4, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 5, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 8, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 9, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 10, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C1', 11, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 5, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 6, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 7, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 8, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 1, 11, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 1, 7.000000000007001);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 10, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 2, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 2, 0.14285714285714285);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 5, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 6, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 7, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 8, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 4, 11, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 2, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 5, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 1, 7.000000000007001);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 4, 7.000000000007001);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 5, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 10, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 6, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 1, 7.000000000007001);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 4, 7.000000000007001);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 5, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 10, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 7, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 2, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 6, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 7, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 8, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 2, 0.14285714285714285);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 5, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 6, 0.14285714285714285);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 7, 0.14285714285714285);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 8, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 9, 11, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 1, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 4, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 5, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 6, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 7, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 8, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 9, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 10, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 2, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 6, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 7, 0.3333333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 10, 3.000000000003);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C2', 11, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 5, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 6, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 7, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 8, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 1, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 5, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 6, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 7, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 8, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 2, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 1, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 5, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 6, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 7, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 8, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 10, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 4, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 1, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 5, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 6, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 7, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 1, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 8, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 1, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 5, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 6, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 7, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 8, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 10, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 9, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 10, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 1, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C3', 11, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 5, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 6, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 7, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 8, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 1, 11, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 2, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 5, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 6, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 7, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 8, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 10, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 4, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 1, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 5, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 6, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 1, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 2, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 4, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 5, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 6, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 7, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 8, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 9, 7.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 10, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 7, 11, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 1, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 8, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 1, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 2, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 4, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 5, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 6, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 7, 0.142857142857);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 8, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 9, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 10, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 9, 11, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 1, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 2, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 4, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 5, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 6, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 7, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 8, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 9, 5.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 10, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 10, 11, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 1, 1.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 2, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 4, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 5, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 6, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 7, 0.2);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 8, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 9, 3.0);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 10, 0.333333333333);
INSERT INTO "MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") VALUES ('C4', 11, 11, 1.0);

-- Data for table: MaTranSoSanh (16 rows)
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C1', 'C1', 1.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C1', 'C2', 0.333333333333);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C1', 'C3', 3.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C1', 'C4', 5.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C2', 'C1', 3.000000000003);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C2', 'C2', 1.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C2', 'C3', 5.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C2', 'C4', 7.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C3', 'C1', 0.3333333333333333);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C3', 'C2', 0.2);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C3', 'C3', 1.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C3', 'C4', 3.0);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C4', 'C1', 0.2);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C4', 'C2', 0.14285714285714285);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C4', 'C3', 0.3333333333333333);
INSERT INTO "MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") VALUES ('C4', 'C4', 1.0);

-- Data for table: MoTaChiTiet (11 rows)
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (1, 'Sen đá kim cương – vẻ đẹp độc đáo và cực kỳ dễ chăm', 'Sen đá kim Cương (Haworthia cooperi) là một trong những dòng sen đá được yêu thích nhất nhờ vẻ đẹp độc đáo và khả năng sinh trưởng mạnh mẽ. Cây có bộ lá mọng nước xếp thành hoa thị, trong suốt như pha lê, tạo hiệu ứng ánh sáng rất cuốn hút khi nhìn từ nhiều góc độ. Đây là loại sen đá có nguồn gốc từ châu Phi, thích nghi hoàn hảo với điều kiện khí hậu khô nóng và thiếu nước, vì vậy rất phù hợp với môi trường sống trong nhà, văn phòng hoặc nơi có máy lạnh.

Ngoài thẩm mỹ cao, sen đá kim cương còn mang ý nghĩa phong thủy may mắn: tượng trưng cho sự bền bỉ, kiên trì và thu hút tài lộc. Cây thường được đặt trên bàn làm việc, quầy thu ngân, phòng khách hoặc làm quà tặng khai trương, sinh nhật vô cùng ý nghĩa.

Ưu điểm nổi bật của sen đá kim cương là cực kỳ dễ sống. Chỉ cần tưới nước 1–2 lần/tuần, tránh ánh nắng gắt và dùng đất tơi thoáng là cây phát triển tốt quanh năm. Sen đá cũng ít sâu bệnh, ít phải thay chậu và có thể nhân giống dễ dàng bằng lá hoặc tách bụi.

Nhờ hội tụ đầy đủ các yếu tố đẹp – bền – rẻ – dễ trồng, sen đá kim cương luôn nằm trong top cây cảnh mini được yêu thích nhất hiện nay.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (2, 'Cây lưỡi hổ – lá mạnh mẽ, lọc không khí tuyệt vời', 'Cây lưỡi hổ (Sansevieria) là một trong những loại cây cảnh trong nhà được yêu thích nhất trên thế giới nhờ vào khả năng sinh trưởng mạnh mẽ, dễ chăm sóc và hình dáng sang trọng. Với những chiếc lá thẳng đứng, cứng cáp, mang họa tiết sọc xanh – vàng đặc trưng, cây lưỡi hổ không chỉ đẹp mắt mà còn truyền tải cảm giác mạnh mẽ và kiên cường. Đây là loại cây phù hợp để trang trí phòng khách, phòng ngủ, văn phòng, quán cà phê hoặc các không gian tối giản hiện đại.

Một trong những đặc điểm nổi bật nhất của cây lưỡi hổ là khả năng lọc không khí vượt trội. Theo nghiên cứu của NASA, lưỡi hổ có thể hấp thụ khí độc như formaldehyde, xylene, toluene và sản sinh oxy ngay cả vào ban đêm. Điều này giúp cải thiện chất lượng không khí và tạo môi trường sống thoải mái, đặc biệt trong các không gian kín có điều hòa.

Cây lưỡi hổ cũng rất dễ chăm sóc, gần như "bất tử" đối với người ít kinh nghiệm. Cây chịu hạn tốt, chỉ cần tưới 1–2 tuần/lần và ít gặp sâu bệnh. Lưỡi hổ sống được trong nhiều điều kiện ánh sáng khác nhau, từ nơi có ánh sáng mạnh đến văn phòng ít ánh sáng. Đây là lựa chọn tuyệt vời cho người bận rộn hoặc những ai muốn có cây cảnh đẹp mà không tốn thời gian chăm sóc.

Về phong thủy, lưỡi hổ mang ý nghĩa xua đuổi tà khí, mang lại may mắn và sự bảo vệ cho gia chủ. Với dáng lá hướng lên tượng trưng cho sự phát triển và thăng tiến, cây thường được dùng làm quà tặng khai trương, tân gia hoặc đặt ở bàn làm việc để thu hút năng lượng tích cực.

Nhờ sự kết hợp hoàn hảo giữa tính thẩm mỹ, công dụng lọc khí và phong thủy, cây lưỡi hổ luôn là lựa chọn hàng đầu trong danh sách cây cảnh trong nhà của nhiều gia đình hiện đại.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (4, 'Hoa lan tím – sang trọng, tinh tế và bền bỉ', 'Hoa lan tím (Phalaenopsis tím) là một trong những dòng lan được yêu thích nhất nhờ vẻ đẹp quý phái, màu sắc nổi bật và khả năng nở hoa lâu. Với sắc tím tự nhiên từ nhạt đến đậm tùy giống, lan tím luôn tạo cảm giác mềm mại, lãng mạn nhưng đầy sự sang trọng. Đây là loại lan được dùng phổ biến để trang trí phòng khách, bàn làm việc, khách sạn, nhà hàng hoặc làm quà tặng trong những dịp trọng đại như sinh nhật, lễ khai trương, lễ tình nhân và ngày kỷ niệm.

Một trong những ưu điểm nổi bật nhất của lan tím là thời gian nở hoa rất lâu, có thể từ 6 đến 10 tuần nếu chăm sóc tốt. Cánh hoa mềm mịn như nhung cùng mùi hương nhẹ, dễ chịu giúp lan tím trở thành lựa chọn lý tưởng cho những người yêu hoa nhưng không có nhiều thời gian để chăm sóc. Thân cây khỏe, lá dày bóng và bộ rễ bám chắc là những đặc điểm giúp cây sống tốt trong điều kiện ánh sáng vừa phải và môi trường trong nhà.

Lan tím thuộc nhóm lan hồ điệp – dòng lan được mệnh danh là "nữ hoàng của các loài lan" bởi vẻ đẹp thanh lịch và dễ chăm sóc hơn nhiều loại lan khác. Cây ưa môi trường thoáng khí, đất trồng tơi xốp như vỏ thông hoặc dớn. Lan cũng không yêu cầu tưới nước nhiều, tránh úng rễ và có khả năng thích nghi tốt với nhiệt độ phòng.

Về ý nghĩa phong thủy, lan tím tượng trưng cho sự thủy chung, thịnh vượng và tài lộc. Màu tím còn mang ý nghĩa tinh khiết, sang trọng và sự trân trọng trong các mối quan hệ — vì vậy lan tím thường được chọn để làm quà tặng cho người thân, bạn bè hoặc đối tác quan trọng. Với vẻ đẹp tinh tế, bền bỉ cùng dễ chăm sóc, hoa lan tím luôn xứng đáng có mặt trong mọi không gian sống hiện đại.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (5, 'Thài Lài Sọc Hồng – nhỏ nhắn nhưng cực kỳ nổi bật', 'Thài Lài Sọc Hồng (Tradescantia Pink Stripe) là dòng cây cảnh mini được yêu thích hàng đầu nhờ vẻ ngoài độc đáo với sự kết hợp giữa màu xanh, hồng và tím trên từng chiếc lá. Cây nhỏ gọn, mềm mại và sinh trưởng nhanh nên thường được sử dụng để trang trí bàn làm việc, kệ sách, ban công hoặc đặt trong các chậu treo nhỏ. Cây mang lại cảm giác tươi mới, trẻ trung và rất phù hợp với những không gian năng động.

Điểm đặc trưng của Thài Lài Sọc Hồng chính là các sọc hồng tím chạy dọc theo gân lá, tạo nên vẻ đẹp nổi bật mà hiếm loại cây mini nào có được. Cây có khả năng lan nhanh, đâm chồi liên tục, giúp tán cây ngày càng sum suê. Chính vì thế, cây tượng trưng cho sự sinh sôi, phát triển và thường được chọn làm cây phong thủy mang lại may mắn trong công việc lẫn cuộc sống.

Một ưu điểm lớn của Thài Lài Sọc Hồng là khả năng thích nghi rất tốt. Cây sống khỏe trong nhiều điều kiện ánh sáng khác nhau, từ ánh sáng gián tiếp trong nhà cho đến ngoài trời râm mát. Cây cũng không đòi hỏi chăm sóc quá cầu kỳ, chỉ cần tưới nước điều độ và giữ độ ẩm vừa phải là đủ để cây phát triển xanh tốt. Vì vậy, cây rất phù hợp với người mới bắt đầu chơi cây cảnh hoặc những ai bận rộn không có nhiều thời gian chăm sóc.

Không chỉ đẹp, Thài Lài Sọc Hồng còn giúp thanh lọc không khí nhẹ, hấp thụ bụi mịn và giúp cải thiện không gian làm việc trở nên thoáng đãng hơn. Với giá thành phải chăng, màu sắc bắt mắt và ý nghĩa phong thủy tích cực, cây luôn nằm trong danh sách best–seller tại các cửa hàng cây cảnh. Nếu bạn đang cần một loại cây mini xinh đẹp, nổi bật, dễ trồng và dễ chăm sóc, Thài Lài Sọc Hồng chắc chắn là lựa chọn tuyệt vời cho mọi không gian.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (6, 'Vạn Niên Thanh – Biểu tượng của sự bình an và thịnh vượng', 'Vạn Niên Thanh (Aglaonema) là một trong những loại cây cảnh nội thất được yêu thích nhất tại Việt Nam nhờ vẻ đẹp xanh mướt, bền bỉ và rất dễ chăm. Cây có bộ lá to bản, màu xanh đậm xen các đường vân sáng tinh tế, tạo nên vẻ ngoài sang trọng nhưng vẫn rất gần gũi. Chỉ cần đặt một chậu Vạn Niên Thanh trong phòng khách, văn phòng hay quán cà phê, không gian lập tức trở nên xanh mát và hài hòa hơn.

Một trong những đặc điểm đáng giá nhất của Vạn Niên Thanh là khả năng thích nghi mạnh mẽ. Cây sống tốt trong điều kiện ánh sáng thấp – điều mà rất ít cây lá lớn làm được. Bạn có thể đặt cây ở khu vực cách cửa sổ khá xa, trong phòng máy lạnh hoặc hành lang mà cây vẫn xanh tốt. Nhờ đặc tính này, Vạn Niên Thanh là lựa chọn hàng đầu cho dân văn phòng hoặc những người bận rộn ít có thời gian chăm sóc.

Không chỉ đẹp, Vạn Niên Thanh còn là một trong những loài cây có khả năng lọc không khí được NASA khuyến nghị. Cây giúp hấp thụ các chất độc phổ biến trong môi trường nhà ở như formaldehyde, benzen hoặc các chất bay hơi phát sinh từ sơn tường và nội thất. Điều này góp phần cải thiện chất lượng không khí và tạo cảm giác dễ chịu khi bạn ở trong phòng.

Trong phong thủy, Vạn Niên Thanh tượng trưng cho sự cát tường, phú quý, bình an và trường thọ. Cây thường được chọn làm quà tặng trong dịp tân gia, khai trương hoặc các sự kiện quan trọng. Tên gọi "Vạn Niên" thể hiện sự bền vững, phát triển lâu dài – rất phù hợp để đặt trong phòng khách hoặc bàn làm việc nhằm thu hút vận khí tốt.

Ngoài ra, Vạn Niên Thanh còn có tốc độ sinh trưởng ổn định, thân lá chắc và ít sâu bệnh. Cây không đòi hỏi tưới nước nhiều và chỉ cần một chế độ ánh sáng gián tiếp đơn giản là đã luôn giữ được màu xanh mượt mà. Với vẻ đẹp sang trọng, ý nghĩa phong thủy tốt và khả năng sống khỏe, Vạn Niên Thanh là một trong những loại cây nội thất "quốc dân" mà bất kỳ ai cũng có thể sở hữu.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (7, 'Trầu bà Nam Mỹ – Cây nội thất dễ trồng, đẹp và lọc khí tốt', 'Trầu bà Nam Mỹ (Philodendron oxycardium) là một trong những loại cây nội thất được yêu thích nhất nhờ vẻ đẹp nhẹ nhàng và khả năng sống khỏe trong nhiều điều kiện khác nhau. Lá cây có dạng hình tim mềm mại, xanh bóng tự nhiên, tạo cảm giác dễ chịu và mang đến màu xanh mát cho mọi không gian.

Cây phát triển theo dạng leo hoặc rủ, vì vậy bạn có thể đặt trong chậu treo, để trên kệ, hoặc cho cây leo cột đều rất đẹp. Trầu bà Nam Mỹ đặc biệt phù hợp với người bận rộn vì không cần chăm sóc nhiều, chịu được bóng râm tốt và ít bị sâu bệnh.

Không chỉ có giá trị trang trí, cây còn nổi tiếng với khả năng lọc khí hiệu quả. Theo nghiên cứu của NASA, nhóm cây Philodendron có khả năng hấp thụ các khí độc phổ biến trong nhà như formaldehyde, xylene hay toluene – những chất thường xuất hiện trong nội thất và thiết bị điện tử.

Cây phù hợp cho phòng khách, phòng ngủ, bàn làm việc, quán cà phê và cả không gian văn phòng. Với vẻ đẹp mềm mại cùng ý nghĩa phong thủy mang lại sự bình an và thư thái, Trầu bà Nam Mỹ là lựa chọn hoàn hảo cho người yêu cây, cả người mới bắt đầu lẫn người chơi lâu năm.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (8, 'Mô tả chi tiết cây Lan Ý', 'Lan Ý (Peace Lily) là một trong những loại cây nội thất được yêu thích nhất bởi vẻ đẹp sang trọng, thanh lịch và khả năng thanh lọc không khí vượt trội. Cây sở hữu tán lá xanh đậm, bóng mượt cùng những bông hoa trắng tinh khôi vươn lên cao đầy trang nhã. Lan Ý phù hợp đặt ở phòng khách, bàn làm việc, quầy lễ tân, phòng ngủ và cả trong các không gian văn phòng hiện đại. Đây là loại cây có khả năng sống tốt trong môi trường thiếu sáng, ít cần chăm sóc và phù hợp cả với người mới bắt đầu chơi cây cảnh.

Lan Ý còn được xem là biểu tượng của sự bình yên, cân bằng và may mắn trong phong thủy. Việc đặt một chậu Lan Ý trong nhà giúp mang lại nguồn năng lượng tích cực, thu hút tài lộc và xua tan căng thẳng. Theo nhiều nghiên cứu, Lan Ý được xếp vào nhóm cây có khả năng lọc các chất độc hại trong không khí như benzene, formaldehyde, toluene… giúp không gian sống trở nên trong lành hơn.

Ngoài vẻ đẹp nhẹ nhàng, Lan Ý rất dễ sống và ít cần chăm sóc. Cây ưa bóng râm, chịu được ánh sáng yếu, đồng thời chỉ cần tưới nước khoảng 1–2 lần mỗi tuần. Rễ cây khá mạnh nên phù hợp với nhiều loại đất trồng khác nhau. Khi được chăm sóc đúng cách, Lan Ý có thể nở hoa quanh năm, đặc biệt là mùa xuân và mùa hè. Cây cũng thích hợp làm quà tặng trong các dịp khai trương, tân gia hay lễ kỷ niệm vì mang ý nghĩa hòa bình và sung túc.

Với sự kết hợp giữa tính thẩm mỹ và công dụng tuyệt vời, Lan Ý được xem là lựa chọn hoàn hảo cho mọi không gian. Đây là loài cây lý tưởng cho những ai muốn sở hữu một loại cây đẹp, tinh tế, dễ chăm sóc nhưng vẫn mang lại giá trị phong thủy và sức khỏe.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (9, 'Thiên Điểu – Vẻ đẹp mạnh mẽ và sang trọng như cánh chim trời', 'Cây Thiên Điểu (Bird of Paradise) là một trong những loài cây cảnh được yêu thích nhất nhờ vẻ đẹp đầy tính nghệ thuật. Hoa Thiên Điểu có cấu trúc độc đáo với những cánh hoa xòe rộng giống như hình dáng một chú chim đang tung cánh trên bầu trời. Đây cũng chính là lý do cây được đặt tên là "Bird of Paradise". Màu hoa rực rỡ với sự kết hợp giữa cam, xanh lam và vàng khiến cây trở thành điểm nhấn nổi bật trong mọi thiết kế sân vườn hoặc nội thất.

Cây Thiên Điểu có thể sống tốt trong nhiều điều kiện ánh sáng, đặc biệt phát triển mạnh dưới ánh nắng tự nhiên. Khi đặt trong nhà, cây vẫn sinh trưởng tốt nếu được cung cấp ánh sáng gián tiếp. Bộ lá xanh đậm, bản lớn, hình mũi mác tạo cảm giác nhiệt đới đầy sức sống.

Ngoài giá trị thẩm mỹ, cây Thiên Điểu còn mang ý nghĩa phong thủy mạnh mẽ. Trong văn hóa phương Đông, cây tượng trưng cho sự tự do, may mắn, thành công và thịnh vượng. Cây thường được trồng trong sân vườn biệt thự, khu nghỉ dưỡng, công viên hoặc làm cây nội thất cao cấp trong các khách sạn, văn phòng sang trọng.

Thiên Điểu là loài cây dễ chăm sóc, ít sâu bệnh và có tuổi thọ cao. Cây thích môi trường thoáng mát, đất tơi xốp và độ ẩm ổn định. Khi chăm sóc đúng cách, cây sẽ cho hoa đều đặn mỗi năm, đặc biệt vào mùa xuân và mùa hè. Với vẻ đẹp độc đáo và sức sống bền bỉ, Thiên Điểu luôn là lựa chọn tuyệt vời cho những ai yêu thích cây cảnh phong cách hiện đại và sang trọng.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (10, 'Bàng Singapore – Biểu tượng của sự sang trọng và thịnh vượng trong không gian sống hiện đại', 'Bàng Singapore (Fiddle Leaf Fig) là một trong những loại cây nội thất nổi tiếng nhất trên thế giới nhờ vẻ ngoài sang trọng, mạnh mẽ và đầy tính thẩm mỹ. Cây có lá lớn hình đàn violin, màu xanh đậm bóng mượt, tạo cảm giác khỏe khoắn và nổi bật trong mọi không gian. Với dáng cây thẳng đứng và tán lá dày, Bàng Singapore thường được sử dụng trong trang trí nội thất hiện đại, đặc biệt tại các căn hộ cao cấp, quán cà phê, khách sạn hoặc văn phòng.

Cây có khả năng lọc không khí tự nhiên, hấp thụ bụi bẩn và các chất độc hại trong môi trường, giúp không gian sống luôn trong lành. Nhờ khả năng thích nghi tốt, Bàng Singapore sinh trưởng tốt ở ánh sáng tán xạ, ánh sáng tự nhiên gần cửa sổ hoặc nơi có bóng râm nhẹ. Đây là lựa chọn lý tưởng cho những gia chủ yêu thích cây cảnh đẹp, dễ chăm sóc nhưng vẫn muốn giữ thẩm mỹ cao.

Theo phong thủy, Bàng Singapore mang ý nghĩa thu hút tài lộc, may mắn và sự thịnh vượng. Cây thường được đặt tại phòng khách, phòng làm việc hoặc sảnh lớn để mang lại nguồn năng lượng tích cực. Với bộ rễ khỏe và sức sống bền bỉ, cây có tuổi thọ cao và phát triển mạnh mẽ khi được chăm sóc đúng cách.

Mặc dù có vẻ ngoài to lớn và sang trọng, Bàng Singapore không yêu cầu chăm sóc quá cầu kỳ. Cây chỉ cần lượng nước vừa phải, đất thoát nước tốt và được lau lá định kỳ để duy trì vẻ đẹp tự nhiên. Đây chính là lý do cây trở thành "ngôi sao" trong thế giới cây nội thất và được nhiều gia đình, doanh nghiệp lựa chọn trang trí lâu dài.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (11, 'Lá Gấm – Sắc màu nghệ thuật cho mọi không gian sống', 'Lá Gấm (Coleus blumei) là một trong những loại cây cảnh nổi tiếng nhờ vẻ đẹp độc đáo của bộ lá đầy màu sắc. Lá cây được ví như những bức tranh sống động với sự pha trộn tinh tế giữa đỏ, tím, vàng, xanh hoặc hồng. Chính sự đa dạng về màu sắc đã biến Lá Gấm trở thành lựa chọn hàng đầu của những người yêu cây cảnh và những không gian cần điểm nhấn nghệ thuật.

Cây có kích thước nhỏ đến trung bình, tán lá xòe rộng, thân mềm và mọng nước. Với tốc độ sinh trưởng nhanh, Lá Gấm có thể phát triển rực rỡ chỉ trong vài tuần khi được chăm sóc đúng cách. Cây phù hợp đặt ở ban công, cửa sổ, bàn làm việc, sân vườn hoặc không gian nội thất có ánh sáng tự nhiên. Lá Gấm cũng thường được dùng trong các chậu mix nghệ thuật nhờ dễ phối màu và tạo chiều sâu thẩm mỹ.

Không chỉ đẹp, Lá Gấm còn rất dễ trồng. Người chơi cây không cần nhiều kinh nghiệm vẫn có thể chăm sóc tốt loại cây này. Cây thích ánh sáng nhẹ đến trung bình, không cần tưới quá nhiều và phát triển mạnh trong đất tơi xốp, thoáng nước. Một điểm đặc biệt là Lá Gấm cực dễ nhân giống: chỉ cần cắt một đoạn thân và ngâm vào nước vài ngày là có thể ra rễ.

Trong phong thủy, Lá Gấm tượng trưng cho sự sáng tạo, may mắn và sinh khí mới. Màu sắc rực rỡ của cây mang lại nguồn năng lượng tích cực, khơi gợi cảm hứng cho người nhìn. Đây là lý do cây thường được đặt trong không gian làm việc hoặc phòng khách để tăng sức sống và tạo cảm giác tươi vui.

Nhờ sự kết hợp giữa vẻ đẹp rực rỡ, dễ chăm sóc và ý nghĩa phong thủy, Lá Gấm ngày càng trở thành loại cây được yêu thích trong trang trí nội - ngoại thất hiện đại.');
INSERT INTO "MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") VALUES (14, 'bằng lăng tím thủy chung', 'đẹp tuyệt vời');
-- Table NhanVien: no data

-- Data for table: TaiKhoan (9 rows)
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (1, 'admin', '$2a$11$/JCOIv.T4SpbsMqoHgmYSeptLVst5oxJQvktHt6tRcpTnkNd.MapW', 'tranmyquyen1012@gmail.com', NULL, 1, 'Hoạt động', '2025-11-11 21:50:59.280000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (2, 'vana', '$2a$11$F.ZX.UTw0yTVPiTEZTLTC.Dcxv8rrzF9C7ONUFtkxu9msqpscLRtu', 'tranmyquyen1212@gmail.com', '0772300910', 2, 'Hoạt động', '2025-11-11 21:50:59.280000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (3, 'Queen', '123', 'Queen@gmail .com', '023446723', 1, 'Hoạt động', '2025-11-12 13:38:10.137000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (4, 'traam', '123', '3224', '0944368112', 2, 'Hoạt động', '2025-11-12 13:44:44.060000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (6, 'thu', '123456', 'thu123@gmail.com', '0944368223', 2, 'Hoạt động', '2025-11-12 17:15:13.467000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (7, 'tram', '123', 'tram@gmail.com', '0944368112', 2, 'Hoạt động', '2025-11-12 19:34:36.757000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (8, 'adbb', 'quyen@10003', 'qưe@gmail.com', '0123456789', 2, 'Hoạt động', '2025-11-12 20:55:40.017000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (9, 'linh', '$2a$11$HAwcM4b6l27BU5k.1fJwruJw2iyZ4N3SxYBpCwpraQRGFHQtmL2aO', 'linh123@gmail.com', '0944368220', 2, 'Hoạt động', '2025-11-30 14:05:11.660000');
INSERT INTO "TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") VALUES (5, 'na', '$2b$12$o30tVa185na8NzCkLxiGP.mDNd7jDgPbvMXpK2/dygYgGJucciG6i', 'na123', '0944', 1, 'Hoạt động', '2025-11-12 14:08:56.517000');
SELECT setval(pg_get_serial_sequence('"TaiKhoan"', 'TaiKhoanID'), (SELECT COALESCE(MAX("TaiKhoanID"), 0) FROM "TaiKhoan"));

-- Data for table: ThongTinKhoaHoc (11 rows)
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (1, 'Haworthia cooperi', 'Asphodelaceae', 'Nam Phi', 'Sen đá pha lê');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (2, 'Sansevieria trifasciata', 'Asparagaceae', 'Tây Phi', 'Cây Lưỡi Hổ, Cây Hổ Vĩ, Snake Plant');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (4, 'Phalaenopsis sp.', 'Orchidaceae', 'Đông Nam Á – từ Indonesia đến Philippines', 'Lan Hồ Điệp tím, Tím Phalaenopsis');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (5, 'Tradescantia fluminensis “Pink Stripe”', 'Commelinaceae', 'Nam Mỹ – chủ yếu Brazil', 'Thài Lài Hồng, Tradescantia Hồng, Cây Sọc Hồng');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (6, 'Aglaonema modestum', 'Araceae', 'Đông Nam Á – Thái Lan, Malaysia, Việt Nam', 'Cây Vạn Niên, Chinese Evergreen');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (7, 'Philodendron oxycardium', 'Araceae (Họ Ráy)', 'Khu vực Nam Mỹ – Brazil, Bolivia', 'Trầu bà Nam Mỹ, Philodendron hình tim');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (8, 'Spathiphyllum wallisii', 'Araceae (Họ Ráy)', 'Khu vực Trung – Nam Mỹ, chủ yếu Colombia', 'Lan Ý, Peace Lily, Huệ Hòa Bình');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (9, 'Strelitzia reginae', 'Strelitziaceae (Họ Chim Thiên Điểu)', 'Nam Phi – vùng khí hậu nhiệt đới và cận nhiệt đới', 'Thiên Điểu, Chim Thiên Đường, Bird of Paradise');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (10, 'Ficus lyrata', 'Moraceae (Họ Dâu Tằm)', 'Châu Phi – Vùng nhiệt đới Tây Phi', 'Bàng Singapore, Fiddle Leaf Fig, Bàng lá violin');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (11, 'Coleus blumei', 'Lamiaceae (Họ Hoa Môi)', 'Trung Quốc, Ấn Độ và Đông Nam Á', 'Lá gấm, Coleus, Cây sò huyết, Cây gấm nghệ thuật');
INSERT INTO "ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") VALUES (14, 'Bằng lăng', NULL, NULL, NULL);

-- Data for table: TieuChi (4 rows)
INSERT INTO "TieuChi" ("MaTieuChi", "TenTieuChi", "TrongSoTieuChi", "CR_PhuongAn") VALUES ('C1', 'Khả năng thích nghi với nhiệt độ trong nhà', 0.263345110771505, 0.012885427562284705);
INSERT INTO "TieuChi" ("MaTieuChi", "TenTieuChi", "TrongSoTieuChi", "CR_PhuongAn") VALUES ('C2', 'Khả năng thích nghi ánh sáng yếu', 0.5578924751719725, 0.020401767228797066);
INSERT INTO "TieuChi" ("MaTieuChi", "TenTieuChi", "TrongSoTieuChi", "CR_PhuongAn") VALUES ('C3', 'Khả năng thích nghi độ ẩm thấp', 0.12187261268142999, 0.019884651935256153);
INSERT INTO "TieuChi" ("MaTieuChi", "TenTieuChi", "TrongSoTieuChi", "CR_PhuongAn") VALUES ('C4', 'Khả năng lọc không khí', 0.05688980137509243, 0.02092821639183234);

-- Data for table: TonKho (7 rows)
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (1, 10, 23, '2025-12-09 13:43:39.210000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (2, 5, 1000, '2025-11-28 21:31:16.053000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (3, 4, 12000, '2025-11-28 21:31:25.913000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (4, 1, 120000, '2025-11-28 21:32:08.147000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (5, 2, 120, '2025-11-28 21:41:03.470000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (6, 9, 113, '2025-12-09 13:54:27.630000');
INSERT INTO "TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") VALUES (7, 11, 100, '2026-02-20 08:45:33.587000');
SELECT setval(pg_get_serial_sequence('"TonKho"', 'TonKhoID'), (SELECT COALESCE(MAX("TonKhoID"), 0) FROM "TonKho"));

-- Data for table: TrongSoPhuongAn (40 rows)
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (1, 'C1', 0.16798775696424678);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (1, 'C2', 0.02167190060861318);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (1, 'C3', 0.240619879996131);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (1, 'C4', 0.039887265659336896);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (2, 'C1', 0.34275086574564967);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (2, 'C2', 0.20577486616856572);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (2, 'C3', 0.240619879996131);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (2, 'C4', 0.20426190491572124);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (4, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (4, 'C2', 0.02167190060861535);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (4, 'C3', 0.021758929969732436);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (4, 'C4', 0.019933920790775904);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (5, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (5, 'C2', 0.0914315936150631);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (5, 'C3', 0.04698707319058565);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (5, 'C4', 0.08919063745087025);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (6, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (6, 'C2', 0.20577486616860688);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (6, 'C3', 0.11142705349883872);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (6, 'C4', 0.20426190491572124);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (7, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (7, 'C2', 0.20577486616860688);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (7, 'C3', 0.11142705349883872);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (7, 'C4', 0.20426190491572124);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (8, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (8, 'C2', 0.09143159361508138);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (8, 'C3', 0.04698707319058565);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (8, 'C4', 0.08919063745087025);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (9, 'C1', 0.025287219025977227);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (9, 'C2', 0.021671900608619683);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (9, 'C3', 0.021758929969732436);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (9, 'C4', 0.019933920790775904);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (10, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (10, 'C2', 0.043364918823137234);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (10, 'C3', 0.11142705349883872);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (10, 'C4', 0.08919063745087025);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (11, 'C1', 0.06628202260916093);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (11, 'C2', 0.09143159361509053);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (11, 'C3', 0.04698707319058565);
INSERT INTO "TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") VALUES (11, 'C4', 0.039887265659336896);

-- Data for table: VaiTro (2 rows)
INSERT INTO "VaiTro" ("VaiTroID", "TenVaiTro", "MoTa") VALUES (1, 'QuanTri', NULL);
INSERT INTO "VaiTro" ("VaiTroID", "TenVaiTro", "MoTa") VALUES (2, 'KhachHang', NULL);
SELECT setval(pg_get_serial_sequence('"VaiTro"', 'VaiTroID'), (SELECT COALESCE(MAX("VaiTroID"), 0) FROM "VaiTro"));