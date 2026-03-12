--
-- PostgreSQL database dump
--

\restrict 4cFZcsWoGJHYgT0JlP0Hlg71mal9xMXUKJhuMrwAfiyhY9IaSlJM36GORV5aAtn

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-03-12 21:07:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 25079)
-- Name: AHP_ThongSoTieuChi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AHP_ThongSoTieuChi" (
    "MaThongSo" character varying(50) NOT NULL,
    "GiaTri" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."AHP_ThongSoTieuChi" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25174)
-- Name: BinhLuan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BinhLuan" (
    "BinhLuanID" integer NOT NULL,
    "CayCanhID" integer NOT NULL,
    "TaiKhoanID" integer NOT NULL,
    "NoiDung" character varying(1000),
    "SoSao" integer,
    "NgayBinhLuan" timestamp without time zone DEFAULT now(),
    "HinhAnh" character varying(255),
    "DonHangID" integer NOT NULL,
    CONSTRAINT "BinhLuan_SoSao_check" CHECK ((("SoSao" >= 1) AND ("SoSao" <= 5)))
);


ALTER TABLE public."BinhLuan" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 25173)
-- Name: BinhLuan_BinhLuanID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BinhLuan_BinhLuanID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BinhLuan_BinhLuanID_seq" OWNER TO postgres;

--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 242
-- Name: BinhLuan_BinhLuanID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BinhLuan_BinhLuanID_seq" OWNED BY public."BinhLuan"."BinhLuanID";


--
-- TOC entry 241 (class 1259 OID 25157)
-- Name: CT_DonHang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CT_DonHang" (
    "CTDonHangID" integer NOT NULL,
    "DonHangID" integer,
    "CayCanhID" integer,
    "SoLuong" integer,
    "DonGia" numeric(18,2),
    "ThanhTien" numeric(18,2)
);


ALTER TABLE public."CT_DonHang" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 25156)
-- Name: CT_DonHang_CTDonHangID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CT_DonHang_CTDonHangID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CT_DonHang_CTDonHangID_seq" OWNER TO postgres;

--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 240
-- Name: CT_DonHang_CTDonHangID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CT_DonHang_CTDonHangID_seq" OWNED BY public."CT_DonHang"."CTDonHangID";


--
-- TOC entry 252 (class 1259 OID 25257)
-- Name: CachChamSoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CachChamSoc" (
    "ID" integer NOT NULL,
    "CayCanhID" integer,
    "TieuDe" character varying(200),
    "NoiDung" text
);


ALTER TABLE public."CachChamSoc" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 25256)
-- Name: CachChamSoc_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CachChamSoc_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CachChamSoc_ID_seq" OWNER TO postgres;

--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 251
-- Name: CachChamSoc_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CachChamSoc_ID_seq" OWNED BY public."CachChamSoc"."ID";


--
-- TOC entry 230 (class 1259 OID 25039)
-- Name: CayCanh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CayCanh" (
    "CayCanhID" integer NOT NULL,
    "TenCay" character varying(100) NOT NULL,
    "Gia" numeric(18,2) NOT NULL,
    "MoTa" character varying(500),
    "HinhAnh" character varying(255),
    "LoaiCayID" integer
);


ALTER TABLE public."CayCanh" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25038)
-- Name: CayCanh_CayCanhID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CayCanh_CayCanhID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CayCanh_CayCanhID_seq" OWNER TO postgres;

--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 229
-- Name: CayCanh_CayCanhID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CayCanh_CayCanhID_seq" OWNED BY public."CayCanh"."CayCanhID";


--
-- TOC entry 232 (class 1259 OID 25057)
-- Name: CayCanh_DacDiem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CayCanh_DacDiem" (
    "CayCanhID" integer NOT NULL,
    "MaDacDiem" character varying(20) NOT NULL
);


ALTER TABLE public."CayCanh_DacDiem" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24994)
-- Name: ChucVu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChucVu" (
    "ChucVuID" integer NOT NULL,
    "TenChucVu" character varying(100) NOT NULL,
    "MoTa" character varying(255)
);


ALTER TABLE public."ChucVu" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24993)
-- Name: ChucVu_ChucVuID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChucVu_ChucVuID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChucVu_ChucVuID_seq" OWNER TO postgres;

--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 221
-- Name: ChucVu_ChucVuID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChucVu_ChucVuID_seq" OWNED BY public."ChucVu"."ChucVuID";


--
-- TOC entry 231 (class 1259 OID 25052)
-- Name: DacDiem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DacDiem" (
    "MaDacDiem" character varying(20) NOT NULL,
    "TenDacDiem" character varying(50) NOT NULL
);


ALTER TABLE public."DacDiem" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 25271)
-- Name: DacDiemNoiBat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DacDiemNoiBat" (
    "ID" integer NOT NULL,
    "CayCanhID" integer,
    "NoiDung" character varying(300)
);


ALTER TABLE public."DacDiemNoiBat" OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 25270)
-- Name: DacDiemNoiBat_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DacDiemNoiBat_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DacDiemNoiBat_ID_seq" OWNER TO postgres;

--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 253
-- Name: DacDiemNoiBat_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DacDiemNoiBat_ID_seq" OWNED BY public."DacDiemNoiBat"."ID";


--
-- TOC entry 239 (class 1259 OID 25137)
-- Name: DonHang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DonHang" (
    "DonHangID" integer NOT NULL,
    "KhachHangID" integer,
    "NgayDat" timestamp without time zone,
    "TongTien" numeric(18,2),
    "TrangThai" character varying(50) DEFAULT 'Chờ xác nhận'::character varying,
    "NgayDuyet" timestamp without time zone,
    "NguoiDuyet" integer,
    "NgayHuy" timestamp without time zone,
    "TenNguoiNhan" character varying(100),
    "SDTNguoiNhan" character varying(20),
    "DiaChiGiaoHang" character varying(255),
    "GhiChu" character varying(255),
    "PhuongThucThanhToan" character varying(50),
    "NgayGiaoHang" timestamp without time zone,
    "NgayHoanThanh" timestamp without time zone
);


ALTER TABLE public."DonHang" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25136)
-- Name: DonHang_DonHangID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DonHang_DonHangID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DonHang_DonHangID_seq" OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 238
-- Name: DonHang_DonHangID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DonHang_DonHangID_seq" OWNED BY public."DonHang"."DonHangID";


--
-- TOC entry 245 (class 1259 OID 25200)
-- Name: GioHang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GioHang" (
    "GioHangID" integer NOT NULL,
    "TaiKhoanID" integer NOT NULL,
    "NgayCapNhat" timestamp without time zone DEFAULT now()
);


ALTER TABLE public."GioHang" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 25213)
-- Name: GioHangChiTiet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GioHangChiTiet" (
    "GHCTID" integer NOT NULL,
    "GioHangID" integer NOT NULL,
    "CayCanhID" integer NOT NULL,
    "SoLuong" integer DEFAULT 1 NOT NULL,
    "DonGia" numeric(18,2) NOT NULL
);


ALTER TABLE public."GioHangChiTiet" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25212)
-- Name: GioHangChiTiet_GHCTID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GioHangChiTiet_GHCTID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GioHangChiTiet_GHCTID_seq" OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 246
-- Name: GioHangChiTiet_GHCTID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GioHangChiTiet_GHCTID_seq" OWNED BY public."GioHangChiTiet"."GHCTID";


--
-- TOC entry 244 (class 1259 OID 25199)
-- Name: GioHang_GioHangID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GioHang_GioHangID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GioHang_GioHangID_seq" OWNER TO postgres;

--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 244
-- Name: GioHang_GioHangID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GioHang_GioHangID_seq" OWNED BY public."GioHang"."GioHangID";


--
-- TOC entry 226 (class 1259 OID 25020)
-- Name: KhachHang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KhachHang" (
    "KhachHangID" integer NOT NULL,
    "TaiKhoanID" integer,
    "HoTen" character varying(100),
    "GioiTinh" character varying(10),
    "NgaySinh" date,
    "DiaChi" character varying(255)
);


ALTER TABLE public."KhachHang" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25019)
-- Name: KhachHang_KhachHangID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."KhachHang_KhachHangID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."KhachHang_KhachHangID_seq" OWNER TO postgres;

--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 225
-- Name: KhachHang_KhachHangID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."KhachHang_KhachHangID_seq" OWNED BY public."KhachHang"."KhachHangID";


--
-- TOC entry 228 (class 1259 OID 25032)
-- Name: LoaiCay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoaiCay" (
    "LoaiCayID" integer NOT NULL,
    "TenLoai" character varying(100) NOT NULL,
    "MoTa" character varying(255)
);


ALTER TABLE public."LoaiCay" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25031)
-- Name: LoaiCay_LoaiCayID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LoaiCay_LoaiCayID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LoaiCay_LoaiCayID_seq" OWNER TO postgres;

--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 227
-- Name: LoaiCay_LoaiCayID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LoaiCay_LoaiCayID_seq" OWNED BY public."LoaiCay"."LoaiCayID";


--
-- TOC entry 236 (class 1259 OID 25100)
-- Name: MaTranPhuongAn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaTranPhuongAn" (
    "MaTieuChi" character varying(10) NOT NULL,
    "CayDongID" integer NOT NULL,
    "CayCotID" integer NOT NULL,
    "GiaTriPhuongAn" double precision NOT NULL
);


ALTER TABLE public."MaTranPhuongAn" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25085)
-- Name: MaTranSoSanh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaTranSoSanh" (
    "TieuChiDong" character varying(10) NOT NULL,
    "TieuChiCot" character varying(10) NOT NULL,
    "GiaTriTieuChi" double precision NOT NULL
);


ALTER TABLE public."MaTranSoSanh" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25244)
-- Name: MoTaChiTiet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MoTaChiTiet" (
    "CayCanhID" integer NOT NULL,
    "TieuDe" character varying(200),
    "NoiDung" text
);


ALTER TABLE public."MoTaChiTiet" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25001)
-- Name: NhanVien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NhanVien" (
    "NhanVienID" integer NOT NULL,
    "TaiKhoanID" integer,
    "HoTen" character varying(100),
    "GioiTinh" character varying(10),
    "NgaySinh" date,
    "DiaChi" character varying(255),
    "DienThoai" character varying(20),
    "Email" character varying(100),
    "ChucVuID" integer
);


ALTER TABLE public."NhanVien" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25000)
-- Name: NhanVien_NhanVienID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NhanVien_NhanVienID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NhanVien_NhanVienID_seq" OWNER TO postgres;

--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 223
-- Name: NhanVien_NhanVienID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NhanVien_NhanVienID_seq" OWNED BY public."NhanVien"."NhanVienID";


--
-- TOC entry 220 (class 1259 OID 24977)
-- Name: TaiKhoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TaiKhoan" (
    "TaiKhoanID" integer NOT NULL,
    "TenDangNhap" character varying(50) NOT NULL,
    "MatKhau" character varying(255) NOT NULL,
    "Email" character varying(100),
    "DienThoai" character varying(20),
    "VaiTroID" integer NOT NULL,
    "TrangThai" character varying(30) DEFAULT 'Hoạt động'::character varying,
    "NgayTao" timestamp without time zone DEFAULT now(),
    CONSTRAINT "TaiKhoan_TrangThai_check" CHECK ((("TrangThai")::text = ANY ((ARRAY['Hoạt động'::character varying, 'Bị khóa'::character varying])::text[])))
);


ALTER TABLE public."TaiKhoan" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24976)
-- Name: TaiKhoan_TaiKhoanID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TaiKhoan_TaiKhoanID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TaiKhoan_TaiKhoanID_seq" OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 219
-- Name: TaiKhoan_TaiKhoanID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TaiKhoan_TaiKhoanID_seq" OWNED BY public."TaiKhoan"."TaiKhoanID";


--
-- TOC entry 255 (class 1259 OID 25282)
-- Name: ThongTinKhoaHoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ThongTinKhoaHoc" (
    "CayCanhID" integer NOT NULL,
    "TenKhoaHoc" character varying(200),
    "HoThucVat" character varying(200),
    "NguonGoc" character varying(300),
    "TenGoiKhac" character varying(300)
);


ALTER TABLE public."ThongTinKhoaHoc" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25072)
-- Name: TieuChi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TieuChi" (
    "MaTieuChi" character varying(10) NOT NULL,
    "TenTieuChi" character varying(200) NOT NULL,
    "TrongSoTieuChi" double precision DEFAULT 0 NOT NULL,
    "CR_PhuongAn" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."TieuChi" OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25231)
-- Name: TonKho; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TonKho" (
    "TonKhoID" integer NOT NULL,
    "CayCanhID" integer NOT NULL,
    "SoLuongTon" integer DEFAULT 0 NOT NULL,
    "NgayCapNhat" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."TonKho" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25230)
-- Name: TonKho_TonKhoID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TonKho_TonKhoID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TonKho_TonKhoID_seq" OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 248
-- Name: TonKho_TonKhoID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TonKho_TonKhoID_seq" OWNED BY public."TonKho"."TonKhoID";


--
-- TOC entry 237 (class 1259 OID 25120)
-- Name: TrongSoPhuongAn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrongSoPhuongAn" (
    "CayCanhID" integer NOT NULL,
    "MaTieuChi" character varying(10) NOT NULL,
    "TrongSoPhuongAn" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."TrongSoPhuongAn" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24970)
-- Name: VaiTro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VaiTro" (
    "VaiTroID" integer NOT NULL,
    "TenVaiTro" character varying(50),
    "MoTa" character varying(200)
);


ALTER TABLE public."VaiTro" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24969)
-- Name: VaiTro_VaiTroID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VaiTro_VaiTroID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VaiTro_VaiTroID_seq" OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 217
-- Name: VaiTro_VaiTroID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VaiTro_VaiTroID_seq" OWNED BY public."VaiTro"."VaiTroID";


--
-- TOC entry 4864 (class 2604 OID 25177)
-- Name: BinhLuan BinhLuanID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinhLuan" ALTER COLUMN "BinhLuanID" SET DEFAULT nextval('public."BinhLuan_BinhLuanID_seq"'::regclass);


--
-- TOC entry 4863 (class 2604 OID 25160)
-- Name: CT_DonHang CTDonHangID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CT_DonHang" ALTER COLUMN "CTDonHangID" SET DEFAULT nextval('public."CT_DonHang_CTDonHangID_seq"'::regclass);


--
-- TOC entry 4873 (class 2604 OID 25260)
-- Name: CachChamSoc ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CachChamSoc" ALTER COLUMN "ID" SET DEFAULT nextval('public."CachChamSoc_ID_seq"'::regclass);


--
-- TOC entry 4856 (class 2604 OID 25042)
-- Name: CayCanh CayCanhID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh" ALTER COLUMN "CayCanhID" SET DEFAULT nextval('public."CayCanh_CayCanhID_seq"'::regclass);


--
-- TOC entry 4852 (class 2604 OID 24997)
-- Name: ChucVu ChucVuID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChucVu" ALTER COLUMN "ChucVuID" SET DEFAULT nextval('public."ChucVu_ChucVuID_seq"'::regclass);


--
-- TOC entry 4874 (class 2604 OID 25274)
-- Name: DacDiemNoiBat ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DacDiemNoiBat" ALTER COLUMN "ID" SET DEFAULT nextval('public."DacDiemNoiBat_ID_seq"'::regclass);


--
-- TOC entry 4861 (class 2604 OID 25140)
-- Name: DonHang DonHangID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonHang" ALTER COLUMN "DonHangID" SET DEFAULT nextval('public."DonHang_DonHangID_seq"'::regclass);


--
-- TOC entry 4866 (class 2604 OID 25203)
-- Name: GioHang GioHangID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHang" ALTER COLUMN "GioHangID" SET DEFAULT nextval('public."GioHang_GioHangID_seq"'::regclass);


--
-- TOC entry 4868 (class 2604 OID 25216)
-- Name: GioHangChiTiet GHCTID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHangChiTiet" ALTER COLUMN "GHCTID" SET DEFAULT nextval('public."GioHangChiTiet_GHCTID_seq"'::regclass);


--
-- TOC entry 4854 (class 2604 OID 25023)
-- Name: KhachHang KhachHangID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhachHang" ALTER COLUMN "KhachHangID" SET DEFAULT nextval('public."KhachHang_KhachHangID_seq"'::regclass);


--
-- TOC entry 4855 (class 2604 OID 25035)
-- Name: LoaiCay LoaiCayID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoaiCay" ALTER COLUMN "LoaiCayID" SET DEFAULT nextval('public."LoaiCay_LoaiCayID_seq"'::regclass);


--
-- TOC entry 4853 (class 2604 OID 25004)
-- Name: NhanVien NhanVienID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanVien" ALTER COLUMN "NhanVienID" SET DEFAULT nextval('public."NhanVien_NhanVienID_seq"'::regclass);


--
-- TOC entry 4849 (class 2604 OID 24980)
-- Name: TaiKhoan TaiKhoanID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan" ALTER COLUMN "TaiKhoanID" SET DEFAULT nextval('public."TaiKhoan_TaiKhoanID_seq"'::regclass);


--
-- TOC entry 4870 (class 2604 OID 25234)
-- Name: TonKho TonKhoID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TonKho" ALTER COLUMN "TonKhoID" SET DEFAULT nextval('public."TonKho_TonKhoID_seq"'::regclass);


--
-- TOC entry 4848 (class 2604 OID 24973)
-- Name: VaiTro VaiTroID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaiTro" ALTER COLUMN "VaiTroID" SET DEFAULT nextval('public."VaiTro_VaiTroID_seq"'::regclass);


--
-- TOC entry 5120 (class 0 OID 25079)
-- Dependencies: 234
-- Data for Name: AHP_ThongSoTieuChi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AHP_ThongSoTieuChi" ("MaThongSo", "GiaTri") FROM stdin;
CR_TieuChi_TongThe	0.04387617228057044
\.


--
-- TOC entry 5129 (class 0 OID 25174)
-- Dependencies: 243
-- Data for Name: BinhLuan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BinhLuan" ("BinhLuanID", "CayCanhID", "TaiKhoanID", "NoiDung", "SoSao", "NgayBinhLuan", "HinhAnh", "DonHangID") FROM stdin;
11	4	2	săner phẩm ok	5	2025-12-15 19:56:36.257	\N	17
12	4	2	\N	5	2025-12-15 20:04:25.253	\N	17
13	2	2	\N	5	2025-12-15 21:52:00.277	\N	17
\.


--
-- TOC entry 5127 (class 0 OID 25157)
-- Dependencies: 241
-- Data for Name: CT_DonHang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CT_DonHang" ("CTDonHangID", "DonHangID", "CayCanhID", "SoLuong", "DonGia", "ThanhTien") FROM stdin;
3	2	1	2	45000.00	90000.00
4	3	5	2	123000.00	246000.00
5	12	2	1	120000.00	120000.00
6	12	5	2	123000.00	246000.00
7	13	1	1	45000.00	45000.00
8	13	2	1	120000.00	120000.00
9	14	2	1	120000.00	120000.00
10	15	4	1	23000.00	23000.00
11	16	1	1	45000.00	45000.00
12	17	4	1	23000.00	23000.00
13	17	2	1	120000.00	120000.00
14	18	2	1	120000.00	120000.00
15	19	2	1	120000.00	120000.00
16	20	2	2	120000.00	240000.00
17	21	4	1	23000.00	23000.00
18	22	1	3	45000.00	135000.00
19	22	5	2	123000.00	246000.00
20	22	4	1	23000.00	23000.00
21	23	2	1	120000.00	120000.00
22	24	1	1	45000.00	45000.00
23	25	1	3	45000.00	135000.00
24	25	5	2	123000.00	246000.00
25	25	4	1	23000.00	23000.00
26	26	1	3	45000.00	135000.00
27	26	5	2	123000.00	246000.00
28	26	4	1	23000.00	23000.00
29	27	4	2	23000.00	46000.00
30	28	1	1	45000.00	45000.00
31	29	1	1	45000.00	45000.00
32	29	2	1	120000.00	120000.00
\.


--
-- TOC entry 5138 (class 0 OID 25257)
-- Dependencies: 252
-- Data for Name: CachChamSoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CachChamSoc" ("ID", "CayCanhID", "TieuDe", "NoiDung") FROM stdin;
1	1	Ánh sáng	Ưa ánh sáng nhẹ, tránh nắng gắt trực tiếp.
2	1	Tưới nước	Tưới 1–2 lần/tuần khi đất khô hoàn toàn.
3	1	Đất trồng	Đất tơi xốp, thoát nước tốt (tro trấu + perlite).
4	1	Nhiệt độ	18–30°C, chịu tốt máy lạnh.
5	1	Bón phân	Bón phân hữu cơ 1 lần/tuần
6	2	Ánh sáng	Sống tốt trong ánh sáng yếu, nhưng phát triển mạnh ở nơi có ánh sáng tự nhiên.
7	2	Tưới nước	Chỉ tưới khi đất thật khô; trung bình 7–14 ngày tưới một lần.
8	2	Đất trồng	Nên dùng đất thoát nước tốt: hỗn hợp đất thịt + cát + xơ dừa hoặc đất xương rồng.
9	2	Độ ẩm	Không cần độ ẩm cao, tránh để nước đọng gây úng rễ.
10	2	Bón phân	 Nên bón phân hữu cơ hoặc NPK loãng mỗi 1–2 tháng trong mùa sinh trưởng.
11	4	Ánh sáng	Lan tím ưa sáng nhẹ, tránh nắng gắt trực tiếp; đặt cạnh cửa sổ có rèm là tốt nhất.
12	4	Tưới nước	Tưới 2–3 lần/tuần; chỉ tưới khi giá thể khô, tránh để úng làm thối rễ.
13	4	Đất trồng / giá thể	Dùng vỏ thông, than gỗ hoặc dớn — giúp thông thoáng và thoát nước nhanh.
14	4	Độ ẩm & nhiệt độ	Duy trì độ ẩm khoảng 50–70%; nhiệt độ lý tưởng 20–28°C.
15	4	Bón phân	Bón phân NPK 30-10-10 hoặc phân lan chuyên dụng 2 lần/tháng vào mùa sinh trưởng.
41	5	Ánh sáng	Cây ưa sáng nhẹ; để nơi có ánh sáng gián tiếp giúp lá giữ màu hồng đẹp nhất.
42	5	Tưới nước	Tưới 2–3 lần/tuần; giữ đất luôn hơi ẩm nhưng không để đọng nước.
43	5	Đất trồng	Dùng đất tơi xốp, thoát nước tốt; có thể trộn đất tribat + perlite + xơ dừa.
44	5	Độ ẩm & nhiệt độ	Cây thích độ ẩm 60–80% và nhiệt độ 18–28°C; tránh khí lạnh trực tiếp.
45	5	Nhân giống	Rất dễ nhân giống bằng cách cắt ngọn và giâm xuống đất ẩm hoặc nước.
46	6	Ánh sáng	Cây chịu bóng tốt, nên đặt nơi có ánh sáng gián tiếp. Tránh nắng gắt trực tiếp.
47	6	Tưới nước	Tưới 1–2 lần/tuần. Chỉ tưới khi đất khô để tránh úng rễ.
48	6	Đất trồng	Nên dùng đất tơi xốp, thoát nước tốt như hỗn hợp tribat + vỏ thông + perlite.
49	6	Nhiệt độ & độ ẩm	Sống tốt trong khoảng 20–32°C; thích độ ẩm trung bình.
50	6	Phòng bệnh	Tránh để nước đọng ở gốc; lau lá thường xuyên giúp cây quang hợp tốt.
51	7	Ánh sáng	Cây ưa bóng nhẹ hoặc sáng tán xạ. Không đặt dưới nắng gắt vì dễ cháy lá.
52	7	Nước tưới	Tưới 2–3 lần/tuần. Giữ đất ẩm nhưng không ngập úng. Đặt cây ở vị trí thoáng khí.
53	7	Đất trồng	Sử dụng đất tơi xốp, thoát nước tốt, có trộn xơ dừa hoặc tro trấu để cây phát triển khỏe.
54	7	Phân bón	Bón phân hữu cơ hoặc NPK loãng mỗi 30 ngày để kích thích lá xanh và mọc nhanh.
55	7	Nhân giống	Cắt cành có 2–3 đốt lá và giâm vào nước hoặc đất. Tỷ lệ sống rất cao và dễ chăm.
56	8	Ánh sáng	Cây ưa bóng râm hoặc ánh sáng tán xạ. Không để dưới nắng trực tiếp vì dễ cháy lá.
57	8	Nước tưới	Tưới 2–3 lần/tuần. Giữ đất ẩm nhẹ, không để cây bị úng nước. Khi lá rũ xuống là dấu hiệu cần tưới.
58	8	Đất trồng	Dùng đất tơi xốp, thoát nước tốt. Có thể pha trộn đất + xơ dừa + perlite để cây phát triển tốt hơn.
59	8	Phân bón	Bón phân hữu cơ hoặc NPK loãng 20-30 ngày/lần giúp lá xanh và kích thích ra hoa.
60	8	Không khí & Độ ẩm	Cây thích môi trường mát và độ ẩm cao. Có thể xịt phun sương nhẹ lên lá vào buổi sáng.
61	9	Ánh sáng	Cây ưa ánh sáng mạnh. Đặt ở nơi có nắng buổi sáng để kích thích ra hoa.
62	9	Nước tưới	Tưới 2–3 lần/tuần. Đảm bảo đất luôn ẩm nhưng không bị úng.
63	9	Đất trồng	Nên dùng hỗn hợp đất tơi xốp gồm đất thịt, mùn và perlite để thoát nước tốt.
64	9	Phân bón	Bón phân hữu cơ hoặc NPK 20-20-15 mỗi 30 ngày để lá xanh và hoa nhiều.
65	9	Không khí & Độ ẩm	Cây thích không gian thoáng, gió nhẹ. Có thể xịt sương giúp lá bóng và tăng độ ẩm.
66	10	Ánh sáng	Cây thích ánh sáng gián tiếp mạnh. Đặt gần cửa sổ, tránh nắng gắt buổi trưa.
67	10	Tưới nước	Tưới 1–2 lần/tuần. Đảm bảo đất khô 50% bề mặt rồi mới tưới lại. Không để úng.
68	10	Đất trồng	Sử dụng đất tơi xốp, nhiều mùn, trộn perlite hoặc xơ dừa để thoát nước tốt.
69	10	Phân bón	Bón phân hữu cơ hoặc NPK 20-20-20 mỗi 30 ngày để cây phát triển ổn định.
70	10	Sức khỏe cây	Lau lá định kỳ, kiểm tra nấm và rệp sáp. Đặt nơi thoáng mát, gió nhẹ để cây khỏe.
71	11	Ánh sáng	Cây thích ánh sáng khuếch tán hoặc bóng râm nhẹ. Tránh nắng gắt gây cháy lá.
72	11	Tưới nước	Tưới 2–3 lần/tuần. Đảm bảo đất ẩm nhẹ nhưng không đọng nước.
73	11	Đất trồng	Sử dụng đất tơi xốp, thoát nước tốt. Trộn tro trấu, xơ dừa để giúp cây phát triển khỏe.
74	11	Phân bón	Bón phân hữu cơ hoặc phân vi sinh định kỳ 20–30 ngày giúp lá lên màu đẹp.
75	11	Nhân giống	Cắt cành và ngâm nước 5–7 ngày để ra rễ, sau đó trồng vào đất. Tỷ lệ sống rất cao.
76	14	Ánh sáng	để dưới ánh sáng trực tiếp
77	14	Tưới nước	Lâu lâu tưới 1 lần 
78	14	Đất trồng	
79	14	Nhiệt độ	
80	14	Bón phân	
\.


--
-- TOC entry 5116 (class 0 OID 25039)
-- Dependencies: 230
-- Data for Name: CayCanh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CayCanh" ("CayCanhID", "TenCay", "Gia", "MoTa", "HinhAnh", "LoaiCayID") FROM stdin;
1	Sen đá kim cương	45000.00	\N	6a424f4c-a772-4293-91ac-c4d4698ca9ed.jpg	1
2	Lưỡi hổ	120000.00	\N	dd69aac3-2b79-4153-b603-b65cbf716374.jpg	2
4	Hoa Lan Tím	23000.00	\N	ef26b69a-b01d-4128-ba13-ebd49186788c.jpg	2
5	Cây Thài Lài Sọc Hồng	123000.00	\N	82bc4ca8-2d6b-443b-a754-f9e799cfad17.jpg	2
6	Vạn Niên Thanh	125000.00	\N	24f87c83-2599-4ea4-ba17-602855c898f5.jpg	2
7	Trầu Bà Nam Mỹ	200000.00	\N	72eeb814-be27-485b-8db4-3a6f3a90a526.jpg	1
8	Lan Ý	240000.00	\N	70ddeb88-2f94-4c1a-9354-c06173f485fd.jpg	2
9	Thiên Điểu	230000.00	\N	31c28a23-fc6e-41c4-b522-e1ba27482a55.jpg	2
10	Cây Bàng Singapore	300000.00	\N	afa4a58d-0629-4115-8a8d-ed6340cb4213.jpg	2
11	Lá Gấm	230000.00	\N	2faecb8e-ef61-489d-81b5-c2d3a4d26a7a.jpg	1
14	Bằng lăng	123.00	\N	84f7ef77-2117-488e-9dfa-21794815126e.jpg	2
\.


--
-- TOC entry 5118 (class 0 OID 25057)
-- Dependencies: 232
-- Data for Name: CayCanh_DacDiem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CayCanh_DacDiem" ("CayCanhID", "MaDacDiem") FROM stdin;
1	DE_CHAM
1	IT_MUI
1	IT_SAU
1	KHONG_DOC
2	DE_CHAM
2	IT_MUI
2	IT_SAU
4	HOA
4	IT_MUI
4	KHONG_DOC
5	DE_CHAM
5	IT_MUI
5	IT_SAU
5	KHONG_DOC
6	DE_CHAM
6	IT_MUI
6	IT_SAU
7	DE_CHAM
7	IT_MUI
7	IT_SAU
8	DE_CHAM
8	HOA
8	IT_MUI
8	IT_SAU
9	HOA
9	IT_MUI
9	IT_SAU
9	KHONG_DOC
10	DE_CHAM
10	IT_MUI
10	IT_SAU
10	KHONG_DOC
11	DE_CHAM
11	IT_MUI
11	KHONG_DOC
\.


--
-- TOC entry 5108 (class 0 OID 24994)
-- Dependencies: 222
-- Data for Name: ChucVu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChucVu" ("ChucVuID", "TenChucVu", "MoTa") FROM stdin;
\.


--
-- TOC entry 5117 (class 0 OID 25052)
-- Dependencies: 231
-- Data for Name: DacDiem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DacDiem" ("MaDacDiem", "TenDacDiem") FROM stdin;
DE_CHAM	Dễ chăm sóc
HOA	Có hoa
IT_MUI	Ít mùi
IT_SAU	Ít sâu bệnh
KHONG_DOC	Không độc
\.


--
-- TOC entry 5140 (class 0 OID 25271)
-- Dependencies: 254
-- Data for Name: DacDiemNoiBat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DacDiemNoiBat" ("ID", "CayCanhID", "NoiDung") FROM stdin;
1	1	Lá mọng nước hình hoa thị, màu xanh ngọc trong đặc trưng
2	1	Chịu hạn tốt, sống khỏe trong môi trường khô nóng
3	1	Ít cần chăm sóc, phù hợp người bận rộn
4	1	Ý nghĩa phong thủy hút tài lộc, may mắn
5	1	Dễ nhân giống từ lá, tốc độ phát triển ổn định
11	4	Hoa nở lâu, giữ màu đẹp từ 6–10 tuần
12	4	Màu tím sang trọng – biểu tượng của sự quý phái và may mắn
13	4	Phù hợp trang trí phòng khách, lễ tân, quán café, tiệc cưới
14	4	Dễ chăm sóc hơn nhiều loại lan khác, phù hợp người mới chơi
15	4	Hương thơm nhẹ nhàng, tinh khiết, tạo cảm giác thư giãn
41	5	Lá xanh kết hợp vệt hồng tím đẹp mắt, nổi bật trong mọi không gian
42	5	Dễ trồng, phát triển nhanh và thích hợp với người mới chơi cây
43	5	Có thể sống tốt cả trong nhà và ngoài trời
44	5	Thanh lọc không khí nhẹ, giúp không gian tươi mát hơn
45	5	Ứa sự sinh sôi, may mắn trong phong thủy – phù hợp đặt trên bàn làm việc
46	6	Lá lớn, xanh mướt quanh năm, mang lại cảm giác mát mắt và sang trọng
47	6	Sống bền bỉ, chịu được môi trường thiếu sáng – cực phù hợp văn phòng
48	6	Khả năng lọc không khí tốt, hấp thụ độc tố từ thiết bị điện tử
49	6	Ý nghĩa phong thủy: mang may mắn, bình an và trường thọ
50	6	Cây dễ chăm, phù hợp người mới bắt đầu
51	7	Lá hình tim mềm mại, mọc rủ rất đẹp
52	7	Rất dễ trồng, phát triển tốt trong bóng râm
53	7	Lọc khí tốt, hấp thụ độc tố trong phòng
54	7	Sống khỏe cả trong nước và đất
55	7	Tốc độ sinh trưởng nhanh, dễ nhân giống
56	9	Hoa hình dáng độc đáo giống chú chim đang tung cánh
57	9	Màu sắc rực rỡ, nổi bật trong mọi không gian
58	9	Chịu nắng tốt, sống khỏe ngoài trời lẫn trong nhà
59	9	Tuổi thọ cao, ít sâu bệnh và dễ chăm sóc
60	9	Mang ý nghĩa may mắn, sung túc và thịnh vượng
61	10	Lá to bản, hình đàn violin cực kỳ sang trọng
62	10	Thu hút ánh nhìn, phù hợp trang trí nhà, văn phòng, sảnh lớn
63	10	Lọc không khí tốt, cải thiện chất lượng không gian sống
64	10	Dễ chăm sóc, sống khỏe trong ánh sáng gián tiếp
65	10	Tượng trưng cho may mắn, thịnh vượng và năng lượng tích cực
66	11	Họa tiết lá nhiều màu sắc cực bắt mắt
67	11	Dễ trồng, thích nghi tốt với mọi môi trường
68	11	Phù hợp trang trí bàn làm việc, ban công, sân vườn
69	11	Tốc độ sinh trưởng nhanh, dễ nhân giống
70	11	Giúp không gian trở nên sinh động và tươi sáng
71	8	Khả năng thanh lọc không khí cực tốt – nằm trong TOP cây lọc độc tố theo NASA.
72	8	Dễ sống, chịu bóng, phù hợp với phòng máy lạnh hoặc ánh sáng yếu.
73	8	Hoa trắng thanh lịch, nở bền và dễ chăm, mang vẻ đẹp sang trọng.
74	8	Ý nghĩa phong thủy tốt: giúp cân bằng năng lượng, thu hút may mắn.
75	8	Chăm sóc đơn giản – chỉ cần tưới 1–2 lần/tuần, ít bị sâu bệnh.
76	2	Thanh lọc không khí cực tốt – hấp thụ khí độc như formaldehyde
77	2	Dễ sống, chịu hạn mạnh, phù hợp người bận rộn
78	2	Sinh trưởng tốt cả trong nhà và văn phòng ánh sáng yếu
79	2	Hình dáng sang trọng, lá cứng khỏe, họa tiết khỏe
80	2	Ý nghĩa phong thủy: mang lại may mắn và bảo vệ gia chủ
\.


--
-- TOC entry 5125 (class 0 OID 25137)
-- Dependencies: 239
-- Data for Name: DonHang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DonHang" ("DonHangID", "KhachHangID", "NgayDat", "TongTien", "TrangThai", "NgayDuyet", "NguoiDuyet", "NgayHuy", "TenNguoiNhan", "SDTNguoiNhan", "DiaChiGiaoHang", "GhiChu", "PhuongThucThanhToan", "NgayGiaoHang", "NgayHoanThanh") FROM stdin;
2	2	2025-11-27 13:26:50.97	90000.00	Đã nhận hàng	\N	\N	\N	Quyên	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	COD	2025-11-28 14:35:40.873	2025-11-28 14:40:55.273
3	2	2025-11-27 13:53:06.553	246000.00	Ðã nh?n hàng	2025-11-28 14:36:00.967	\N	\N	Quyên	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	Chuyển khoản	2025-11-29 14:16:10.52	2026-01-28 08:22:17.73
12	5	2025-11-28 12:27:36.347	366000.00	Đã nhận hàng	\N	\N	\N	Quyên	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	COD	\N	2025-11-28 14:36:58.23
13	1	2025-11-28 22:23:17.167	165000.00	Đã hủy	\N	\N	2025-12-15 12:13:48.787	Quyên	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	Lý do hủy: Muốn thay đổi sản phẩm	COD	\N	\N
14	1	2025-11-29 01:19:03.187	120000.00	Đã nhận hàng	2025-11-29 14:15:58.33	\N	\N	Quyên	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	COD	2025-11-29 14:20:30.513	2025-12-12 12:35:20.157
15	5	2025-11-29 14:13:44.303	23000.00	Đã hủy	\N	\N	2025-11-29 14:14:00.667	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	Lý do hủy: Muốn thay đổi sản phẩm	COD	\N	\N
16	1	2025-12-09 12:11:03.43	45000.00	Đã hủy	2025-12-09 15:11:01.723	\N	2025-12-15 20:07:10.147	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	Lý do hủy: Đổi ý không mua nữa	Chuyển khoản	\N	\N
17	1	2025-12-15 18:16:16.42	143000.00	Đã nhận hàng	2025-12-15 18:16:58.477	\N	\N	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	COD	2025-12-15 18:17:02.197	2025-12-15 18:17:06.39
18	1	2025-12-15 21:59:14.213	120000.00	Đã nhận hàng	2025-12-15 22:00:23.327	\N	\N	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	COD	2025-12-15 22:00:26.757	2025-12-15 22:00:29.5
19	1	2025-12-15 23:39:14.717	120000.00	Chờ xác nhận	\N	\N	\N	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	Chuyển khoản	\N	\N
20	1	2025-12-18 12:08:09.333	240000.00	Đã xác nhận	2025-12-18 12:08:59.63	\N	\N	Thư	0094436823	124 Cau Trương, Hảo Đước, Chau tHành, Tay Ninh	\N	Chuyển khoản	\N	\N
21	4	2026-01-18 20:31:16.987	23000.00	Ch? xác nh?n	\N	\N	\N	dddd	0127580182	ddd, dd, dd, dd		COD	\N	\N
22	1	2026-01-18 20:33:28.757	404000.00	Ch? xác nh?n	\N	\N	\N	Test User	0909090909	Test Address	Test Note	COD	\N	\N
23	4	2026-01-18 20:35:05.77	120000.00	Ch? xác nh?n	\N	\N	\N	sddd	0345678671	sâsas, sâsas, sâsas, sffffff		COD	\N	\N
24	4	2026-01-18 20:35:57.137	45000.00	Ch? xác nh?n	\N	\N	\N	sdddd	0161237896	dddyuuuuuuu, gghhjh, geeeee, wwwww		COD	\N	\N
25	1	2026-01-18 20:37:33.55	404000.00	Ch? xác nh?n	\N	\N	\N	Test User	0909090909	Test Address	Test Note	COD	\N	\N
26	1	2026-01-18 20:38:11.723	404000.00	Ch? xác nh?n	\N	\N	\N	Debug API User	0123456789	Debug Address API	Debug API Note	COD	\N	\N
27	4	2026-01-18 20:41:15.267	46000.00	Ch? xác nh?n	\N	\N	\N	eweew	0345670123	sâss, ssssss, ssssss, sssss		COD	\N	\N
28	1	2026-01-18 20:42:10.217	45000.00	Ch? xác nh?n	\N	\N	\N	Debug Router User	0123456789	Debug Address Router	Debug Note	COD	\N	\N
29	4	2026-01-18 20:44:09.503	165000.00	Ch? xác nh?n	\N	\N	\N	xxxxxxx	0127580182	xxxxxxxx, xxxxxxxxxxxxxx, xxxxxxxxxxxxxxx, xxxxxxxxxxxxxxxxx		COD	\N	\N
\.


--
-- TOC entry 5131 (class 0 OID 25200)
-- Dependencies: 245
-- Data for Name: GioHang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GioHang" ("GioHangID", "TaiKhoanID", "NgayCapNhat") FROM stdin;
6	2	2025-12-18 12:07:50.007
7	2	2025-11-26 02:58:01.817
8	6	2025-11-29 14:12:47.353
1009	7	2026-02-20 09:12:05.157
9	5	2026-03-12 21:06:46.214835
\.


--
-- TOC entry 5133 (class 0 OID 25213)
-- Dependencies: 247
-- Data for Name: GioHangChiTiet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GioHangChiTiet" ("GHCTID", "GioHangID", "CayCanhID", "SoLuong", "DonGia") FROM stdin;
25	7	2	1	120000.00
\.


--
-- TOC entry 5112 (class 0 OID 25020)
-- Dependencies: 226
-- Data for Name: KhachHang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KhachHang" ("KhachHangID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi") FROM stdin;
1	2	Nguyễn Văn A	Nam	1999-06-15	123 Lê Lợi, Q1, TP.HCM
2	3	Trần Mỹ Quyên	Nữ	2005-07-10	236 Le Van Sy
4	5	na	Nữ	2002-01-02	124 cau trương
5	6	thu	Nữ	2006-07-06	123 Lê Lợi, Q1, TP.HCM
18	7	tram	Nữ	2004-10-09	ta quang buu
19	8	tram	Nam	2003-10-09	caolo
24	\N	tram	Nữ	2004-12-10	hoa thanh
26	\N	tram	Nữ	2005-12-31	\N
27	9	linh	Nữ	1999-06-08	124 Lê Lợi, Q1, TP.HCM
\.


--
-- TOC entry 5114 (class 0 OID 25032)
-- Dependencies: 228
-- Data for Name: LoaiCay; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoaiCay" ("LoaiCayID", "TenLoai", "MoTa") FROM stdin;
1	Cây để bàn	\N
2	Cây phong thủy	\N
\.


--
-- TOC entry 5122 (class 0 OID 25100)
-- Dependencies: 236
-- Data for Name: MaTranPhuongAn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaTranPhuongAn" ("MaTieuChi", "CayDongID", "CayCotID", "GiaTriPhuongAn") FROM stdin;
C1	1	1	1
C1	1	2	0.2
C1	1	4	3
C1	1	5	3
C1	1	6	3
C1	1	7	3
C1	1	8	3
C1	1	9	5
C1	1	10	3
C1	1	11	3
C1	2	1	5
C1	2	2	1
C1	2	4	5
C1	2	5	5
C1	2	6	5
C1	2	7	5
C1	2	8	5
C1	2	9	7
C1	2	10	5
C1	2	11	5
C1	4	1	0.333333333333
C1	4	2	0.2
C1	4	4	1
C1	4	5	1
C1	4	6	1
C1	4	7	1
C1	4	8	1
C1	4	9	3
C1	4	10	1
C1	4	11	1
C1	5	1	0.333333333333
C1	5	2	0.2
C1	5	4	1
C1	5	5	1
C1	5	6	1
C1	5	7	1
C1	5	8	1
C1	5	9	3
C1	5	10	1
C1	5	11	1
C1	6	1	0.333333333333
C1	6	2	0.2
C1	6	4	1
C1	6	5	1
C1	6	6	1
C1	6	7	1
C1	6	8	1
C1	6	9	3
C1	6	10	1
C1	6	11	1
C1	7	1	0.333333333333
C1	7	2	0.2
C1	7	4	1
C1	7	5	1
C1	7	6	1
C1	7	7	1
C1	7	8	1
C1	7	9	3
C1	7	10	1
C1	7	11	1
C1	8	1	0.333333333333
C1	8	2	0.2
C1	8	4	1
C1	8	5	1
C1	8	6	1
C1	8	7	1
C1	8	8	1
C1	8	9	3
C1	8	10	1
C1	8	11	1
C1	9	1	0.2
C1	9	2	0.142857142857
C1	9	4	0.333333333333
C1	9	5	0.333333333333
C1	9	6	0.333333333333
C1	9	7	0.333333333333
C1	9	8	0.333333333333
C1	9	9	1
C1	9	10	0.333333333333
C1	9	11	0.333333333333
C1	10	1	0.333333333333
C1	10	2	0.2
C1	10	4	1
C1	10	5	1
C1	10	6	1
C1	10	7	1
C1	10	8	1
C1	10	9	3
C1	10	10	1
C1	10	11	1
C1	11	1	0.333333333333
C1	11	2	0.2
C1	11	4	1
C1	11	5	1
C1	11	6	1
C1	11	7	1
C1	11	8	1
C1	11	9	3
C1	11	10	1
C1	11	11	1
C2	1	1	1
C2	1	2	0.142857142857
C2	1	4	1
C2	1	5	0.2
C2	1	6	0.142857142857
C2	1	7	0.142857142857
C2	1	8	0.2
C2	1	9	1
C2	1	10	0.333333333333
C2	1	11	0.2
C2	2	1	7.000000000007001
C2	2	2	1
C2	2	4	7
C2	2	5	3
C2	2	6	1
C2	2	7	1
C2	2	8	3
C2	2	9	7
C2	2	10	5
C2	2	11	3
C2	4	1	1
C2	4	2	0.14285714285714285
C2	4	4	1
C2	4	5	0.2
C2	4	6	0.142857142857
C2	4	7	0.142857142857
C2	4	8	0.2
C2	4	9	1
C2	4	10	0.333333333333
C2	4	11	0.2
C2	5	1	5
C2	5	2	0.3333333333333333
C2	5	4	5
C2	5	5	1
C2	5	6	0.333333333333
C2	5	7	0.333333333333
C2	5	8	1
C2	5	9	5
C2	5	10	3
C2	5	11	1
C2	6	1	7.000000000007001
C2	6	2	1
C2	6	4	7.000000000007001
C2	6	5	3.000000000003
C2	6	6	1
C2	6	7	1
C2	6	8	3
C2	6	9	7
C2	6	10	5
C2	6	11	3
C2	7	1	7.000000000007001
C2	7	2	1
C2	7	4	7.000000000007001
C2	7	5	3.000000000003
C2	7	6	1
C2	7	7	1
C2	7	8	3
C2	7	9	7
C2	7	10	5
C2	7	11	3
C2	8	1	5
C2	8	2	0.3333333333333333
C2	8	4	5
C2	8	5	1
C2	8	6	0.3333333333333333
C2	8	7	0.3333333333333333
C2	8	8	1
C2	8	9	5
C2	8	10	3
C2	8	11	1
C2	9	1	1
C2	9	2	0.14285714285714285
C2	9	4	1
C2	9	5	0.2
C2	9	6	0.14285714285714285
C2	9	7	0.14285714285714285
C2	9	8	0.2
C2	9	9	1
C2	9	10	0.333333333333
C2	9	11	0.2
C2	10	1	3.000000000003
C2	10	2	0.2
C2	10	4	3.000000000003
C2	10	5	0.3333333333333333
C2	10	6	0.2
C2	10	7	0.2
C2	10	8	0.3333333333333333
C2	10	9	3.000000000003
C2	10	10	1
C2	10	11	0.333333333333
C2	11	1	5
C2	11	2	0.3333333333333333
C2	11	4	5
C2	11	5	1
C2	11	6	0.3333333333333333
C2	11	7	0.3333333333333333
C2	11	8	1
C2	11	9	5
C2	11	10	3.000000000003
C2	11	11	1
C3	1	1	1
C3	1	2	1
C3	1	4	7
C3	1	5	5
C3	1	6	3
C3	1	7	3
C3	1	8	5
C3	1	9	7
C3	1	10	3
C3	1	11	5
C3	2	1	1
C3	2	2	1
C3	2	4	7
C3	2	5	5
C3	2	6	3
C3	2	7	3
C3	2	8	5
C3	2	9	7
C3	2	10	3
C3	2	11	5
C3	4	1	0.142857142857
C3	4	2	0.142857142857
C3	4	4	1
C3	4	5	0.333333333333
C3	4	6	0.2
C3	4	7	0.2
C3	4	8	0.333333333333
C3	4	9	1
C3	4	10	0.2
C3	4	11	0.333333333333
C3	5	1	0.2
C3	5	2	0.2
C3	5	4	3
C3	5	5	1
C3	5	6	0.333333333333
C3	5	7	0.333333333333
C3	5	8	1
C3	5	9	3
C3	5	10	0.333333333333
C3	5	11	1
C3	6	1	0.333333333333
C3	6	2	0.333333333333
C3	6	4	5
C3	6	5	3
C3	6	6	1
C3	6	7	1
C3	6	8	3
C3	6	9	5
C3	6	10	1
C3	6	11	3
C3	7	1	0.333333333333
C3	7	2	0.333333333333
C3	7	4	5
C3	7	5	3
C3	7	6	1
C3	7	7	1
C3	7	8	3
C3	7	9	5
C3	7	10	1
C3	7	11	3
C3	8	1	0.2
C3	8	2	0.2
C3	8	4	3
C3	8	5	1
C3	8	6	0.333333333333
C3	8	7	0.333333333333
C3	8	8	1
C3	8	9	3
C3	8	10	0.333333333333
C3	8	11	1
C3	9	1	0.142857142857
C3	9	2	0.142857142857
C3	9	4	1
C3	9	5	0.333333333333
C3	9	6	0.2
C3	9	7	0.2
C3	9	8	0.333333333333
C3	9	9	1
C3	9	10	0.2
C3	9	11	0.333333333333
C3	10	1	0.333333333333
C3	10	2	0.333333333333
C3	10	4	5
C3	10	5	3
C3	10	6	1
C3	10	7	1
C3	10	8	3
C3	10	9	5
C3	10	10	1
C3	10	11	3
C3	11	1	0.2
C3	11	2	0.2
C3	11	4	3
C3	11	5	1
C3	11	6	0.333333333333
C3	11	7	0.333333333333
C3	11	8	1
C3	11	9	3
C3	11	10	0.333333333333
C3	11	11	1
C4	1	1	1
C4	1	2	0.2
C4	1	4	3
C4	1	5	0.333333333333
C4	1	6	0.2
C4	1	7	0.2
C4	1	8	0.333333333333
C4	1	9	3
C4	1	10	0.333333333333
C4	1	11	1
C4	2	1	5
C4	2	2	1
C4	2	4	7
C4	2	5	3
C4	2	6	1
C4	2	7	1
C4	2	8	3
C4	2	9	7
C4	2	10	3
C4	2	11	5
C4	4	1	0.333333333333
C4	4	2	0.142857142857
C4	4	4	1
C4	4	5	0.2
C4	4	6	0.142857142857
C4	4	7	0.142857142857
C4	4	8	0.2
C4	4	9	1
C4	4	10	0.2
C4	4	11	0.333333333333
C4	5	1	3
C4	5	2	0.333333333333
C4	5	4	5
C4	5	5	1
C4	5	6	0.333333333333
C4	5	7	0.333333333333
C4	5	8	1
C4	5	9	5
C4	5	10	1
C4	5	11	3
C4	6	1	5
C4	6	2	1
C4	6	4	7
C4	6	5	3
C4	6	6	1
C4	6	7	1
C4	6	8	3
C4	6	9	7
C4	6	10	3
C4	6	11	5
C4	7	1	5
C4	7	2	1
C4	7	4	7
C4	7	5	3
C4	7	6	1
C4	7	7	1
C4	7	8	3
C4	7	9	7
C4	7	10	3
C4	7	11	5
C4	8	1	3
C4	8	2	0.333333333333
C4	8	4	5
C4	8	5	1
C4	8	6	0.333333333333
C4	8	7	0.333333333333
C4	8	8	1
C4	8	9	5
C4	8	10	1
C4	8	11	3
C4	9	1	0.333333333333
C4	9	2	0.142857142857
C4	9	4	1
C4	9	5	0.2
C4	9	6	0.142857142857
C4	9	7	0.142857142857
C4	9	8	0.2
C4	9	9	1
C4	9	10	0.2
C4	9	11	0.333333333333
C4	10	1	3
C4	10	2	0.333333333333
C4	10	4	5
C4	10	5	1
C4	10	6	0.333333333333
C4	10	7	0.333333333333
C4	10	8	1
C4	10	9	5
C4	10	10	1
C4	10	11	3
C4	11	1	1
C4	11	2	0.2
C4	11	4	3
C4	11	5	0.333333333333
C4	11	6	0.2
C4	11	7	0.2
C4	11	8	0.333333333333
C4	11	9	3
C4	11	10	0.333333333333
C4	11	11	1
\.


--
-- TOC entry 5121 (class 0 OID 25085)
-- Dependencies: 235
-- Data for Name: MaTranSoSanh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaTranSoSanh" ("TieuChiDong", "TieuChiCot", "GiaTriTieuChi") FROM stdin;
C1	C1	1
C1	C2	0.333333333333
C1	C3	3
C1	C4	5
C2	C1	3.000000000003
C2	C2	1
C2	C3	5
C2	C4	7
C3	C1	0.3333333333333333
C3	C2	0.2
C3	C3	1
C3	C4	3
C4	C1	0.2
C4	C2	0.14285714285714285
C4	C3	0.3333333333333333
C4	C4	1
\.


--
-- TOC entry 5136 (class 0 OID 25244)
-- Dependencies: 250
-- Data for Name: MoTaChiTiet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MoTaChiTiet" ("CayCanhID", "TieuDe", "NoiDung") FROM stdin;
1	Sen đá kim cương – vẻ đẹp độc đáo và cực kỳ dễ chăm	Sen đá kim Cương (Haworthia cooperi) là một trong những dòng sen đá được yêu thích nhất nhờ vẻ đẹp độc đáo và khả năng sinh trưởng mạnh mẽ. Cây có bộ lá mọng nước xếp thành hoa thị, trong suốt như pha lê, tạo hiệu ứng ánh sáng rất cuốn hút khi nhìn từ nhiều góc độ. Đây là loại sen đá có nguồn gốc từ châu Phi, thích nghi hoàn hảo với điều kiện khí hậu khô nóng và thiếu nước, vì vậy rất phù hợp với môi trường sống trong nhà, văn phòng hoặc nơi có máy lạnh.\n\nNgoài thẩm mỹ cao, sen đá kim cương còn mang ý nghĩa phong thủy may mắn: tượng trưng cho sự bền bỉ, kiên trì và thu hút tài lộc. Cây thường được đặt trên bàn làm việc, quầy thu ngân, phòng khách hoặc làm quà tặng khai trương, sinh nhật vô cùng ý nghĩa.\n\nƯu điểm nổi bật của sen đá kim cương là cực kỳ dễ sống. Chỉ cần tưới nước 1–2 lần/tuần, tránh ánh nắng gắt và dùng đất tơi thoáng là cây phát triển tốt quanh năm. Sen đá cũng ít sâu bệnh, ít phải thay chậu và có thể nhân giống dễ dàng bằng lá hoặc tách bụi.\n\nNhờ hội tụ đầy đủ các yếu tố đẹp – bền – rẻ – dễ trồng, sen đá kim cương luôn nằm trong top cây cảnh mini được yêu thích nhất hiện nay.
2	Cây lưỡi hổ – lá mạnh mẽ, lọc không khí tuyệt vời	Cây lưỡi hổ (Sansevieria) là một trong những loại cây cảnh trong nhà được yêu thích nhất trên thế giới nhờ vào khả năng sinh trưởng mạnh mẽ, dễ chăm sóc và hình dáng sang trọng. Với những chiếc lá thẳng đứng, cứng cáp, mang họa tiết sọc xanh – vàng đặc trưng, cây lưỡi hổ không chỉ đẹp mắt mà còn truyền tải cảm giác mạnh mẽ và kiên cường. Đây là loại cây phù hợp để trang trí phòng khách, phòng ngủ, văn phòng, quán cà phê hoặc các không gian tối giản hiện đại.\n\nMột trong những đặc điểm nổi bật nhất của cây lưỡi hổ là khả năng lọc không khí vượt trội. Theo nghiên cứu của NASA, lưỡi hổ có thể hấp thụ khí độc như formaldehyde, xylene, toluene và sản sinh oxy ngay cả vào ban đêm. Điều này giúp cải thiện chất lượng không khí và tạo môi trường sống thoải mái, đặc biệt trong các không gian kín có điều hòa.\n\nCây lưỡi hổ cũng rất dễ chăm sóc, gần như "bất tử" đối với người ít kinh nghiệm. Cây chịu hạn tốt, chỉ cần tưới 1–2 tuần/lần và ít gặp sâu bệnh. Lưỡi hổ sống được trong nhiều điều kiện ánh sáng khác nhau, từ nơi có ánh sáng mạnh đến văn phòng ít ánh sáng. Đây là lựa chọn tuyệt vời cho người bận rộn hoặc những ai muốn có cây cảnh đẹp mà không tốn thời gian chăm sóc.\n\nVề phong thủy, lưỡi hổ mang ý nghĩa xua đuổi tà khí, mang lại may mắn và sự bảo vệ cho gia chủ. Với dáng lá hướng lên tượng trưng cho sự phát triển và thăng tiến, cây thường được dùng làm quà tặng khai trương, tân gia hoặc đặt ở bàn làm việc để thu hút năng lượng tích cực.\n\nNhờ sự kết hợp hoàn hảo giữa tính thẩm mỹ, công dụng lọc khí và phong thủy, cây lưỡi hổ luôn là lựa chọn hàng đầu trong danh sách cây cảnh trong nhà của nhiều gia đình hiện đại.
4	Hoa lan tím – sang trọng, tinh tế và bền bỉ	Hoa lan tím (Phalaenopsis tím) là một trong những dòng lan được yêu thích nhất nhờ vẻ đẹp quý phái, màu sắc nổi bật và khả năng nở hoa lâu. Với sắc tím tự nhiên từ nhạt đến đậm tùy giống, lan tím luôn tạo cảm giác mềm mại, lãng mạn nhưng đầy sự sang trọng. Đây là loại lan được dùng phổ biến để trang trí phòng khách, bàn làm việc, khách sạn, nhà hàng hoặc làm quà tặng trong những dịp trọng đại như sinh nhật, lễ khai trương, lễ tình nhân và ngày kỷ niệm.\n\nMột trong những ưu điểm nổi bật nhất của lan tím là thời gian nở hoa rất lâu, có thể từ 6 đến 10 tuần nếu chăm sóc tốt. Cánh hoa mềm mịn như nhung cùng mùi hương nhẹ, dễ chịu giúp lan tím trở thành lựa chọn lý tưởng cho những người yêu hoa nhưng không có nhiều thời gian để chăm sóc. Thân cây khỏe, lá dày bóng và bộ rễ bám chắc là những đặc điểm giúp cây sống tốt trong điều kiện ánh sáng vừa phải và môi trường trong nhà.\n\nLan tím thuộc nhóm lan hồ điệp – dòng lan được mệnh danh là "nữ hoàng của các loài lan" bởi vẻ đẹp thanh lịch và dễ chăm sóc hơn nhiều loại lan khác. Cây ưa môi trường thoáng khí, đất trồng tơi xốp như vỏ thông hoặc dớn. Lan cũng không yêu cầu tưới nước nhiều, tránh úng rễ và có khả năng thích nghi tốt với nhiệt độ phòng.\n\nVề ý nghĩa phong thủy, lan tím tượng trưng cho sự thủy chung, thịnh vượng và tài lộc. Màu tím còn mang ý nghĩa tinh khiết, sang trọng và sự trân trọng trong các mối quan hệ — vì vậy lan tím thường được chọn để làm quà tặng cho người thân, bạn bè hoặc đối tác quan trọng. Với vẻ đẹp tinh tế, bền bỉ cùng dễ chăm sóc, hoa lan tím luôn xứng đáng có mặt trong mọi không gian sống hiện đại.
5	Thài Lài Sọc Hồng – nhỏ nhắn nhưng cực kỳ nổi bật	Thài Lài Sọc Hồng (Tradescantia Pink Stripe) là dòng cây cảnh mini được yêu thích hàng đầu nhờ vẻ ngoài độc đáo với sự kết hợp giữa màu xanh, hồng và tím trên từng chiếc lá. Cây nhỏ gọn, mềm mại và sinh trưởng nhanh nên thường được sử dụng để trang trí bàn làm việc, kệ sách, ban công hoặc đặt trong các chậu treo nhỏ. Cây mang lại cảm giác tươi mới, trẻ trung và rất phù hợp với những không gian năng động.\n\nĐiểm đặc trưng của Thài Lài Sọc Hồng chính là các sọc hồng tím chạy dọc theo gân lá, tạo nên vẻ đẹp nổi bật mà hiếm loại cây mini nào có được. Cây có khả năng lan nhanh, đâm chồi liên tục, giúp tán cây ngày càng sum suê. Chính vì thế, cây tượng trưng cho sự sinh sôi, phát triển và thường được chọn làm cây phong thủy mang lại may mắn trong công việc lẫn cuộc sống.\n\nMột ưu điểm lớn của Thài Lài Sọc Hồng là khả năng thích nghi rất tốt. Cây sống khỏe trong nhiều điều kiện ánh sáng khác nhau, từ ánh sáng gián tiếp trong nhà cho đến ngoài trời râm mát. Cây cũng không đòi hỏi chăm sóc quá cầu kỳ, chỉ cần tưới nước điều độ và giữ độ ẩm vừa phải là đủ để cây phát triển xanh tốt. Vì vậy, cây rất phù hợp với người mới bắt đầu chơi cây cảnh hoặc những ai bận rộn không có nhiều thời gian chăm sóc.\n\nKhông chỉ đẹp, Thài Lài Sọc Hồng còn giúp thanh lọc không khí nhẹ, hấp thụ bụi mịn và giúp cải thiện không gian làm việc trở nên thoáng đãng hơn. Với giá thành phải chăng, màu sắc bắt mắt và ý nghĩa phong thủy tích cực, cây luôn nằm trong danh sách best–seller tại các cửa hàng cây cảnh. Nếu bạn đang cần một loại cây mini xinh đẹp, nổi bật, dễ trồng và dễ chăm sóc, Thài Lài Sọc Hồng chắc chắn là lựa chọn tuyệt vời cho mọi không gian.
6	Vạn Niên Thanh – Biểu tượng của sự bình an và thịnh vượng	Vạn Niên Thanh (Aglaonema) là một trong những loại cây cảnh nội thất được yêu thích nhất tại Việt Nam nhờ vẻ đẹp xanh mướt, bền bỉ và rất dễ chăm. Cây có bộ lá to bản, màu xanh đậm xen các đường vân sáng tinh tế, tạo nên vẻ ngoài sang trọng nhưng vẫn rất gần gũi. Chỉ cần đặt một chậu Vạn Niên Thanh trong phòng khách, văn phòng hay quán cà phê, không gian lập tức trở nên xanh mát và hài hòa hơn.\n\nMột trong những đặc điểm đáng giá nhất của Vạn Niên Thanh là khả năng thích nghi mạnh mẽ. Cây sống tốt trong điều kiện ánh sáng thấp – điều mà rất ít cây lá lớn làm được. Bạn có thể đặt cây ở khu vực cách cửa sổ khá xa, trong phòng máy lạnh hoặc hành lang mà cây vẫn xanh tốt. Nhờ đặc tính này, Vạn Niên Thanh là lựa chọn hàng đầu cho dân văn phòng hoặc những người bận rộn ít có thời gian chăm sóc.\n\nKhông chỉ đẹp, Vạn Niên Thanh còn là một trong những loài cây có khả năng lọc không khí được NASA khuyến nghị. Cây giúp hấp thụ các chất độc phổ biến trong môi trường nhà ở như formaldehyde, benzen hoặc các chất bay hơi phát sinh từ sơn tường và nội thất. Điều này góp phần cải thiện chất lượng không khí và tạo cảm giác dễ chịu khi bạn ở trong phòng.\n\nTrong phong thủy, Vạn Niên Thanh tượng trưng cho sự cát tường, phú quý, bình an và trường thọ. Cây thường được chọn làm quà tặng trong dịp tân gia, khai trương hoặc các sự kiện quan trọng. Tên gọi "Vạn Niên" thể hiện sự bền vững, phát triển lâu dài – rất phù hợp để đặt trong phòng khách hoặc bàn làm việc nhằm thu hút vận khí tốt.\n\nNgoài ra, Vạn Niên Thanh còn có tốc độ sinh trưởng ổn định, thân lá chắc và ít sâu bệnh. Cây không đòi hỏi tưới nước nhiều và chỉ cần một chế độ ánh sáng gián tiếp đơn giản là đã luôn giữ được màu xanh mượt mà. Với vẻ đẹp sang trọng, ý nghĩa phong thủy tốt và khả năng sống khỏe, Vạn Niên Thanh là một trong những loại cây nội thất "quốc dân" mà bất kỳ ai cũng có thể sở hữu.
7	Trầu bà Nam Mỹ – Cây nội thất dễ trồng, đẹp và lọc khí tốt	Trầu bà Nam Mỹ (Philodendron oxycardium) là một trong những loại cây nội thất được yêu thích nhất nhờ vẻ đẹp nhẹ nhàng và khả năng sống khỏe trong nhiều điều kiện khác nhau. Lá cây có dạng hình tim mềm mại, xanh bóng tự nhiên, tạo cảm giác dễ chịu và mang đến màu xanh mát cho mọi không gian.\n\nCây phát triển theo dạng leo hoặc rủ, vì vậy bạn có thể đặt trong chậu treo, để trên kệ, hoặc cho cây leo cột đều rất đẹp. Trầu bà Nam Mỹ đặc biệt phù hợp với người bận rộn vì không cần chăm sóc nhiều, chịu được bóng râm tốt và ít bị sâu bệnh.\n\nKhông chỉ có giá trị trang trí, cây còn nổi tiếng với khả năng lọc khí hiệu quả. Theo nghiên cứu của NASA, nhóm cây Philodendron có khả năng hấp thụ các khí độc phổ biến trong nhà như formaldehyde, xylene hay toluene – những chất thường xuất hiện trong nội thất và thiết bị điện tử.\n\nCây phù hợp cho phòng khách, phòng ngủ, bàn làm việc, quán cà phê và cả không gian văn phòng. Với vẻ đẹp mềm mại cùng ý nghĩa phong thủy mang lại sự bình an và thư thái, Trầu bà Nam Mỹ là lựa chọn hoàn hảo cho người yêu cây, cả người mới bắt đầu lẫn người chơi lâu năm.
8	Mô tả chi tiết cây Lan Ý	Lan Ý (Peace Lily) là một trong những loại cây nội thất được yêu thích nhất bởi vẻ đẹp sang trọng, thanh lịch và khả năng thanh lọc không khí vượt trội. Cây sở hữu tán lá xanh đậm, bóng mượt cùng những bông hoa trắng tinh khôi vươn lên cao đầy trang nhã. Lan Ý phù hợp đặt ở phòng khách, bàn làm việc, quầy lễ tân, phòng ngủ và cả trong các không gian văn phòng hiện đại. Đây là loại cây có khả năng sống tốt trong môi trường thiếu sáng, ít cần chăm sóc và phù hợp cả với người mới bắt đầu chơi cây cảnh.\n\nLan Ý còn được xem là biểu tượng của sự bình yên, cân bằng và may mắn trong phong thủy. Việc đặt một chậu Lan Ý trong nhà giúp mang lại nguồn năng lượng tích cực, thu hút tài lộc và xua tan căng thẳng. Theo nhiều nghiên cứu, Lan Ý được xếp vào nhóm cây có khả năng lọc các chất độc hại trong không khí như benzene, formaldehyde, toluene… giúp không gian sống trở nên trong lành hơn.\n\nNgoài vẻ đẹp nhẹ nhàng, Lan Ý rất dễ sống và ít cần chăm sóc. Cây ưa bóng râm, chịu được ánh sáng yếu, đồng thời chỉ cần tưới nước khoảng 1–2 lần mỗi tuần. Rễ cây khá mạnh nên phù hợp với nhiều loại đất trồng khác nhau. Khi được chăm sóc đúng cách, Lan Ý có thể nở hoa quanh năm, đặc biệt là mùa xuân và mùa hè. Cây cũng thích hợp làm quà tặng trong các dịp khai trương, tân gia hay lễ kỷ niệm vì mang ý nghĩa hòa bình và sung túc.\n\nVới sự kết hợp giữa tính thẩm mỹ và công dụng tuyệt vời, Lan Ý được xem là lựa chọn hoàn hảo cho mọi không gian. Đây là loài cây lý tưởng cho những ai muốn sở hữu một loại cây đẹp, tinh tế, dễ chăm sóc nhưng vẫn mang lại giá trị phong thủy và sức khỏe.
9	Thiên Điểu – Vẻ đẹp mạnh mẽ và sang trọng như cánh chim trời	Cây Thiên Điểu (Bird of Paradise) là một trong những loài cây cảnh được yêu thích nhất nhờ vẻ đẹp đầy tính nghệ thuật. Hoa Thiên Điểu có cấu trúc độc đáo với những cánh hoa xòe rộng giống như hình dáng một chú chim đang tung cánh trên bầu trời. Đây cũng chính là lý do cây được đặt tên là "Bird of Paradise". Màu hoa rực rỡ với sự kết hợp giữa cam, xanh lam và vàng khiến cây trở thành điểm nhấn nổi bật trong mọi thiết kế sân vườn hoặc nội thất.\n\nCây Thiên Điểu có thể sống tốt trong nhiều điều kiện ánh sáng, đặc biệt phát triển mạnh dưới ánh nắng tự nhiên. Khi đặt trong nhà, cây vẫn sinh trưởng tốt nếu được cung cấp ánh sáng gián tiếp. Bộ lá xanh đậm, bản lớn, hình mũi mác tạo cảm giác nhiệt đới đầy sức sống.\n\nNgoài giá trị thẩm mỹ, cây Thiên Điểu còn mang ý nghĩa phong thủy mạnh mẽ. Trong văn hóa phương Đông, cây tượng trưng cho sự tự do, may mắn, thành công và thịnh vượng. Cây thường được trồng trong sân vườn biệt thự, khu nghỉ dưỡng, công viên hoặc làm cây nội thất cao cấp trong các khách sạn, văn phòng sang trọng.\n\nThiên Điểu là loài cây dễ chăm sóc, ít sâu bệnh và có tuổi thọ cao. Cây thích môi trường thoáng mát, đất tơi xốp và độ ẩm ổn định. Khi chăm sóc đúng cách, cây sẽ cho hoa đều đặn mỗi năm, đặc biệt vào mùa xuân và mùa hè. Với vẻ đẹp độc đáo và sức sống bền bỉ, Thiên Điểu luôn là lựa chọn tuyệt vời cho những ai yêu thích cây cảnh phong cách hiện đại và sang trọng.
10	Bàng Singapore – Biểu tượng của sự sang trọng và thịnh vượng trong không gian sống hiện đại	Bàng Singapore (Fiddle Leaf Fig) là một trong những loại cây nội thất nổi tiếng nhất trên thế giới nhờ vẻ ngoài sang trọng, mạnh mẽ và đầy tính thẩm mỹ. Cây có lá lớn hình đàn violin, màu xanh đậm bóng mượt, tạo cảm giác khỏe khoắn và nổi bật trong mọi không gian. Với dáng cây thẳng đứng và tán lá dày, Bàng Singapore thường được sử dụng trong trang trí nội thất hiện đại, đặc biệt tại các căn hộ cao cấp, quán cà phê, khách sạn hoặc văn phòng.\n\nCây có khả năng lọc không khí tự nhiên, hấp thụ bụi bẩn và các chất độc hại trong môi trường, giúp không gian sống luôn trong lành. Nhờ khả năng thích nghi tốt, Bàng Singapore sinh trưởng tốt ở ánh sáng tán xạ, ánh sáng tự nhiên gần cửa sổ hoặc nơi có bóng râm nhẹ. Đây là lựa chọn lý tưởng cho những gia chủ yêu thích cây cảnh đẹp, dễ chăm sóc nhưng vẫn muốn giữ thẩm mỹ cao.\n\nTheo phong thủy, Bàng Singapore mang ý nghĩa thu hút tài lộc, may mắn và sự thịnh vượng. Cây thường được đặt tại phòng khách, phòng làm việc hoặc sảnh lớn để mang lại nguồn năng lượng tích cực. Với bộ rễ khỏe và sức sống bền bỉ, cây có tuổi thọ cao và phát triển mạnh mẽ khi được chăm sóc đúng cách.\n\nMặc dù có vẻ ngoài to lớn và sang trọng, Bàng Singapore không yêu cầu chăm sóc quá cầu kỳ. Cây chỉ cần lượng nước vừa phải, đất thoát nước tốt và được lau lá định kỳ để duy trì vẻ đẹp tự nhiên. Đây chính là lý do cây trở thành "ngôi sao" trong thế giới cây nội thất và được nhiều gia đình, doanh nghiệp lựa chọn trang trí lâu dài.
11	Lá Gấm – Sắc màu nghệ thuật cho mọi không gian sống	Lá Gấm (Coleus blumei) là một trong những loại cây cảnh nổi tiếng nhờ vẻ đẹp độc đáo của bộ lá đầy màu sắc. Lá cây được ví như những bức tranh sống động với sự pha trộn tinh tế giữa đỏ, tím, vàng, xanh hoặc hồng. Chính sự đa dạng về màu sắc đã biến Lá Gấm trở thành lựa chọn hàng đầu của những người yêu cây cảnh và những không gian cần điểm nhấn nghệ thuật.\n\nCây có kích thước nhỏ đến trung bình, tán lá xòe rộng, thân mềm và mọng nước. Với tốc độ sinh trưởng nhanh, Lá Gấm có thể phát triển rực rỡ chỉ trong vài tuần khi được chăm sóc đúng cách. Cây phù hợp đặt ở ban công, cửa sổ, bàn làm việc, sân vườn hoặc không gian nội thất có ánh sáng tự nhiên. Lá Gấm cũng thường được dùng trong các chậu mix nghệ thuật nhờ dễ phối màu và tạo chiều sâu thẩm mỹ.\n\nKhông chỉ đẹp, Lá Gấm còn rất dễ trồng. Người chơi cây không cần nhiều kinh nghiệm vẫn có thể chăm sóc tốt loại cây này. Cây thích ánh sáng nhẹ đến trung bình, không cần tưới quá nhiều và phát triển mạnh trong đất tơi xốp, thoáng nước. Một điểm đặc biệt là Lá Gấm cực dễ nhân giống: chỉ cần cắt một đoạn thân và ngâm vào nước vài ngày là có thể ra rễ.\n\nTrong phong thủy, Lá Gấm tượng trưng cho sự sáng tạo, may mắn và sinh khí mới. Màu sắc rực rỡ của cây mang lại nguồn năng lượng tích cực, khơi gợi cảm hứng cho người nhìn. Đây là lý do cây thường được đặt trong không gian làm việc hoặc phòng khách để tăng sức sống và tạo cảm giác tươi vui.\n\nNhờ sự kết hợp giữa vẻ đẹp rực rỡ, dễ chăm sóc và ý nghĩa phong thủy, Lá Gấm ngày càng trở thành loại cây được yêu thích trong trang trí nội - ngoại thất hiện đại.
14	bằng lăng tím thủy chung	đẹp tuyệt vời
\.


--
-- TOC entry 5110 (class 0 OID 25001)
-- Dependencies: 224
-- Data for Name: NhanVien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NhanVien" ("NhanVienID", "TaiKhoanID", "HoTen", "GioiTinh", "NgaySinh", "DiaChi", "DienThoai", "Email", "ChucVuID") FROM stdin;
\.


--
-- TOC entry 5106 (class 0 OID 24977)
-- Dependencies: 220
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TaiKhoan" ("TaiKhoanID", "TenDangNhap", "MatKhau", "Email", "DienThoai", "VaiTroID", "TrangThai", "NgayTao") FROM stdin;
1	admin	$2a$11$/JCOIv.T4SpbsMqoHgmYSeptLVst5oxJQvktHt6tRcpTnkNd.MapW	tranmyquyen1012@gmail.com	\N	1	Hoạt động	2025-11-11 21:50:59.28
2	vana	$2a$11$F.ZX.UTw0yTVPiTEZTLTC.Dcxv8rrzF9C7ONUFtkxu9msqpscLRtu	tranmyquyen1212@gmail.com	0772300910	2	Hoạt động	2025-11-11 21:50:59.28
3	Queen	123	Queen@gmail .com	023446723	1	Hoạt động	2025-11-12 13:38:10.137
4	traam	123	3224	0944368112	2	Hoạt động	2025-11-12 13:44:44.06
5	na	123	na123	0944	1	Hoạt động	2025-11-12 14:08:56.517
6	thu	123456	thu123@gmail.com	0944368223	2	Hoạt động	2025-11-12 17:15:13.467
7	tram	123	tram@gmail.com	0944368112	2	Hoạt động	2025-11-12 19:34:36.757
8	adbb	quyen@10003	qưe@gmail.com	0123456789	2	Hoạt động	2025-11-12 20:55:40.017
9	linh	$2a$11$HAwcM4b6l27BU5k.1fJwruJw2iyZ4N3SxYBpCwpraQRGFHQtmL2aO	linh123@gmail.com	0944368220	2	Hoạt động	2025-11-30 14:05:11.66
\.


--
-- TOC entry 5141 (class 0 OID 25282)
-- Dependencies: 255
-- Data for Name: ThongTinKhoaHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ThongTinKhoaHoc" ("CayCanhID", "TenKhoaHoc", "HoThucVat", "NguonGoc", "TenGoiKhac") FROM stdin;
1	Haworthia cooperi	Asphodelaceae	Nam Phi	Sen đá pha lê
2	Sansevieria trifasciata	Asparagaceae	Tây Phi	Cây Lưỡi Hổ, Cây Hổ Vĩ, Snake Plant
4	Phalaenopsis sp.	Orchidaceae	Đông Nam Á – từ Indonesia đến Philippines	Lan Hồ Điệp tím, Tím Phalaenopsis
5	Tradescantia fluminensis “Pink Stripe”	Commelinaceae	Nam Mỹ – chủ yếu Brazil	Thài Lài Hồng, Tradescantia Hồng, Cây Sọc Hồng
6	Aglaonema modestum	Araceae	Đông Nam Á – Thái Lan, Malaysia, Việt Nam	Cây Vạn Niên, Chinese Evergreen
7	Philodendron oxycardium	Araceae (Họ Ráy)	Khu vực Nam Mỹ – Brazil, Bolivia	Trầu bà Nam Mỹ, Philodendron hình tim
8	Spathiphyllum wallisii	Araceae (Họ Ráy)	Khu vực Trung – Nam Mỹ, chủ yếu Colombia	Lan Ý, Peace Lily, Huệ Hòa Bình
9	Strelitzia reginae	Strelitziaceae (Họ Chim Thiên Điểu)	Nam Phi – vùng khí hậu nhiệt đới và cận nhiệt đới	Thiên Điểu, Chim Thiên Đường, Bird of Paradise
10	Ficus lyrata	Moraceae (Họ Dâu Tằm)	Châu Phi – Vùng nhiệt đới Tây Phi	Bàng Singapore, Fiddle Leaf Fig, Bàng lá violin
11	Coleus blumei	Lamiaceae (Họ Hoa Môi)	Trung Quốc, Ấn Độ và Đông Nam Á	Lá gấm, Coleus, Cây sò huyết, Cây gấm nghệ thuật
14	Bằng lăng	\N	\N	\N
\.


--
-- TOC entry 5119 (class 0 OID 25072)
-- Dependencies: 233
-- Data for Name: TieuChi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TieuChi" ("MaTieuChi", "TenTieuChi", "TrongSoTieuChi", "CR_PhuongAn") FROM stdin;
C1	Khả năng thích nghi với nhiệt độ trong nhà	0.263345110771505	0.012885427562284705
C2	Khả năng thích nghi ánh sáng yếu	0.5578924751719725	0.020401767228797066
C3	Khả năng thích nghi độ ẩm thấp	0.12187261268142999	0.019884651935256153
C4	Khả năng lọc không khí	0.05688980137509243	0.02092821639183234
\.


--
-- TOC entry 5135 (class 0 OID 25231)
-- Dependencies: 249
-- Data for Name: TonKho; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TonKho" ("TonKhoID", "CayCanhID", "SoLuongTon", "NgayCapNhat") FROM stdin;
1	10	23	2025-12-09 13:43:39.21
2	5	1000	2025-11-28 21:31:16.053
3	4	12000	2025-11-28 21:31:25.913
4	1	120000	2025-11-28 21:32:08.147
5	2	120	2025-11-28 21:41:03.47
6	9	113	2025-12-09 13:54:27.63
7	11	100	2026-02-20 08:45:33.587
\.


--
-- TOC entry 5123 (class 0 OID 25120)
-- Dependencies: 237
-- Data for Name: TrongSoPhuongAn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrongSoPhuongAn" ("CayCanhID", "MaTieuChi", "TrongSoPhuongAn") FROM stdin;
1	C1	0.16798775696424678
1	C2	0.02167190060861318
1	C3	0.240619879996131
1	C4	0.039887265659336896
2	C1	0.34275086574564967
2	C2	0.20577486616856572
2	C3	0.240619879996131
2	C4	0.20426190491572124
4	C1	0.06628202260916093
4	C2	0.02167190060861535
4	C3	0.021758929969732436
4	C4	0.019933920790775904
5	C1	0.06628202260916093
5	C2	0.0914315936150631
5	C3	0.04698707319058565
5	C4	0.08919063745087025
6	C1	0.06628202260916093
6	C2	0.20577486616860688
6	C3	0.11142705349883872
6	C4	0.20426190491572124
7	C1	0.06628202260916093
7	C2	0.20577486616860688
7	C3	0.11142705349883872
7	C4	0.20426190491572124
8	C1	0.06628202260916093
8	C2	0.09143159361508138
8	C3	0.04698707319058565
8	C4	0.08919063745087025
9	C1	0.025287219025977227
9	C2	0.021671900608619683
9	C3	0.021758929969732436
9	C4	0.019933920790775904
10	C1	0.06628202260916093
10	C2	0.043364918823137234
10	C3	0.11142705349883872
10	C4	0.08919063745087025
11	C1	0.06628202260916093
11	C2	0.09143159361509053
11	C3	0.04698707319058565
11	C4	0.039887265659336896
\.


--
-- TOC entry 5104 (class 0 OID 24970)
-- Dependencies: 218
-- Data for Name: VaiTro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VaiTro" ("VaiTroID", "TenVaiTro", "MoTa") FROM stdin;
1	QuanTri	\N
2	KhachHang	\N
\.


--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 242
-- Name: BinhLuan_BinhLuanID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BinhLuan_BinhLuanID_seq"', 13, true);


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 240
-- Name: CT_DonHang_CTDonHangID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CT_DonHang_CTDonHangID_seq"', 32, true);


--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 251
-- Name: CachChamSoc_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CachChamSoc_ID_seq"', 80, true);


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 229
-- Name: CayCanh_CayCanhID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CayCanh_CayCanhID_seq"', 14, true);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 221
-- Name: ChucVu_ChucVuID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChucVu_ChucVuID_seq"', 1, false);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 253
-- Name: DacDiemNoiBat_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DacDiemNoiBat_ID_seq"', 80, true);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 238
-- Name: DonHang_DonHangID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DonHang_DonHangID_seq"', 29, true);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 246
-- Name: GioHangChiTiet_GHCTID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GioHangChiTiet_GHCTID_seq"', 26, true);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 244
-- Name: GioHang_GioHangID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GioHang_GioHangID_seq"', 1009, true);


--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 225
-- Name: KhachHang_KhachHangID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KhachHang_KhachHangID_seq"', 27, true);


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 227
-- Name: LoaiCay_LoaiCayID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LoaiCay_LoaiCayID_seq"', 2, true);


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 223
-- Name: NhanVien_NhanVienID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NhanVien_NhanVienID_seq"', 1, false);


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 219
-- Name: TaiKhoan_TaiKhoanID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TaiKhoan_TaiKhoanID_seq"', 9, true);


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 248
-- Name: TonKho_TonKhoID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TonKho_TonKhoID_seq"', 7, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 217
-- Name: VaiTro_VaiTroID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VaiTro_VaiTroID_seq"', 2, true);


--
-- TOC entry 4902 (class 2606 OID 25084)
-- Name: AHP_ThongSoTieuChi AHP_ThongSoTieuChi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AHP_ThongSoTieuChi"
    ADD CONSTRAINT "AHP_ThongSoTieuChi_pkey" PRIMARY KEY ("MaThongSo");


--
-- TOC entry 4914 (class 2606 OID 25183)
-- Name: BinhLuan BinhLuan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinhLuan"
    ADD CONSTRAINT "BinhLuan_pkey" PRIMARY KEY ("BinhLuanID");


--
-- TOC entry 4912 (class 2606 OID 25162)
-- Name: CT_DonHang CT_DonHang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CT_DonHang"
    ADD CONSTRAINT "CT_DonHang_pkey" PRIMARY KEY ("CTDonHangID");


--
-- TOC entry 4924 (class 2606 OID 25264)
-- Name: CachChamSoc CachChamSoc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CachChamSoc"
    ADD CONSTRAINT "CachChamSoc_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4898 (class 2606 OID 25061)
-- Name: CayCanh_DacDiem CayCanh_DacDiem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh_DacDiem"
    ADD CONSTRAINT "CayCanh_DacDiem_pkey" PRIMARY KEY ("CayCanhID", "MaDacDiem");


--
-- TOC entry 4894 (class 2606 OID 25046)
-- Name: CayCanh CayCanh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh"
    ADD CONSTRAINT "CayCanh_pkey" PRIMARY KEY ("CayCanhID");


--
-- TOC entry 4884 (class 2606 OID 24999)
-- Name: ChucVu ChucVu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChucVu"
    ADD CONSTRAINT "ChucVu_pkey" PRIMARY KEY ("ChucVuID");


--
-- TOC entry 4926 (class 2606 OID 25276)
-- Name: DacDiemNoiBat DacDiemNoiBat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DacDiemNoiBat"
    ADD CONSTRAINT "DacDiemNoiBat_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4896 (class 2606 OID 25056)
-- Name: DacDiem DacDiem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DacDiem"
    ADD CONSTRAINT "DacDiem_pkey" PRIMARY KEY ("MaDacDiem");


--
-- TOC entry 4910 (class 2606 OID 25145)
-- Name: DonHang DonHang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonHang"
    ADD CONSTRAINT "DonHang_pkey" PRIMARY KEY ("DonHangID");


--
-- TOC entry 4918 (class 2606 OID 25219)
-- Name: GioHangChiTiet GioHangChiTiet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHangChiTiet"
    ADD CONSTRAINT "GioHangChiTiet_pkey" PRIMARY KEY ("GHCTID");


--
-- TOC entry 4916 (class 2606 OID 25206)
-- Name: GioHang GioHang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHang"
    ADD CONSTRAINT "GioHang_pkey" PRIMARY KEY ("GioHangID");


--
-- TOC entry 4890 (class 2606 OID 25025)
-- Name: KhachHang KhachHang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhachHang"
    ADD CONSTRAINT "KhachHang_pkey" PRIMARY KEY ("KhachHangID");


--
-- TOC entry 4892 (class 2606 OID 25037)
-- Name: LoaiCay LoaiCay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoaiCay"
    ADD CONSTRAINT "LoaiCay_pkey" PRIMARY KEY ("LoaiCayID");


--
-- TOC entry 4906 (class 2606 OID 25104)
-- Name: MaTranPhuongAn MaTranPhuongAn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranPhuongAn"
    ADD CONSTRAINT "MaTranPhuongAn_pkey" PRIMARY KEY ("MaTieuChi", "CayDongID", "CayCotID");


--
-- TOC entry 4904 (class 2606 OID 25089)
-- Name: MaTranSoSanh MaTranSoSanh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranSoSanh"
    ADD CONSTRAINT "MaTranSoSanh_pkey" PRIMARY KEY ("TieuChiDong", "TieuChiCot");


--
-- TOC entry 4922 (class 2606 OID 25250)
-- Name: MoTaChiTiet MoTaChiTiet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MoTaChiTiet"
    ADD CONSTRAINT "MoTaChiTiet_pkey" PRIMARY KEY ("CayCanhID");


--
-- TOC entry 4886 (class 2606 OID 25008)
-- Name: NhanVien NhanVien_TaiKhoanID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanVien"
    ADD CONSTRAINT "NhanVien_TaiKhoanID_key" UNIQUE ("TaiKhoanID");


--
-- TOC entry 4888 (class 2606 OID 25006)
-- Name: NhanVien NhanVien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanVien"
    ADD CONSTRAINT "NhanVien_pkey" PRIMARY KEY ("NhanVienID");


--
-- TOC entry 4880 (class 2606 OID 24987)
-- Name: TaiKhoan TaiKhoan_TenDangNhap_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_TenDangNhap_key" UNIQUE ("TenDangNhap");


--
-- TOC entry 4882 (class 2606 OID 24985)
-- Name: TaiKhoan TaiKhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY ("TaiKhoanID");


--
-- TOC entry 4928 (class 2606 OID 25288)
-- Name: ThongTinKhoaHoc ThongTinKhoaHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ThongTinKhoaHoc"
    ADD CONSTRAINT "ThongTinKhoaHoc_pkey" PRIMARY KEY ("CayCanhID");


--
-- TOC entry 4900 (class 2606 OID 25078)
-- Name: TieuChi TieuChi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TieuChi"
    ADD CONSTRAINT "TieuChi_pkey" PRIMARY KEY ("MaTieuChi");


--
-- TOC entry 4920 (class 2606 OID 25238)
-- Name: TonKho TonKho_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TonKho"
    ADD CONSTRAINT "TonKho_pkey" PRIMARY KEY ("TonKhoID");


--
-- TOC entry 4908 (class 2606 OID 25125)
-- Name: TrongSoPhuongAn TrongSoPhuongAn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrongSoPhuongAn"
    ADD CONSTRAINT "TrongSoPhuongAn_pkey" PRIMARY KEY ("CayCanhID", "MaTieuChi");


--
-- TOC entry 4878 (class 2606 OID 24975)
-- Name: VaiTro VaiTro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaiTro"
    ADD CONSTRAINT "VaiTro_pkey" PRIMARY KEY ("VaiTroID");


--
-- TOC entry 4947 (class 2606 OID 25184)
-- Name: BinhLuan BinhLuan_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinhLuan"
    ADD CONSTRAINT "BinhLuan_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4948 (class 2606 OID 25194)
-- Name: BinhLuan BinhLuan_DonHangID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinhLuan"
    ADD CONSTRAINT "BinhLuan_DonHangID_fkey" FOREIGN KEY ("DonHangID") REFERENCES public."DonHang"("DonHangID");


--
-- TOC entry 4949 (class 2606 OID 25189)
-- Name: BinhLuan BinhLuan_TaiKhoanID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinhLuan"
    ADD CONSTRAINT "BinhLuan_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES public."TaiKhoan"("TaiKhoanID");


--
-- TOC entry 4945 (class 2606 OID 25168)
-- Name: CT_DonHang CT_DonHang_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CT_DonHang"
    ADD CONSTRAINT "CT_DonHang_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4946 (class 2606 OID 25163)
-- Name: CT_DonHang CT_DonHang_DonHangID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CT_DonHang"
    ADD CONSTRAINT "CT_DonHang_DonHangID_fkey" FOREIGN KEY ("DonHangID") REFERENCES public."DonHang"("DonHangID");


--
-- TOC entry 4955 (class 2606 OID 25265)
-- Name: CachChamSoc CachChamSoc_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CachChamSoc"
    ADD CONSTRAINT "CachChamSoc_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4934 (class 2606 OID 25062)
-- Name: CayCanh_DacDiem CayCanh_DacDiem_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh_DacDiem"
    ADD CONSTRAINT "CayCanh_DacDiem_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4935 (class 2606 OID 25067)
-- Name: CayCanh_DacDiem CayCanh_DacDiem_MaDacDiem_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh_DacDiem"
    ADD CONSTRAINT "CayCanh_DacDiem_MaDacDiem_fkey" FOREIGN KEY ("MaDacDiem") REFERENCES public."DacDiem"("MaDacDiem");


--
-- TOC entry 4933 (class 2606 OID 25047)
-- Name: CayCanh CayCanh_LoaiCayID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CayCanh"
    ADD CONSTRAINT "CayCanh_LoaiCayID_fkey" FOREIGN KEY ("LoaiCayID") REFERENCES public."LoaiCay"("LoaiCayID");


--
-- TOC entry 4956 (class 2606 OID 25277)
-- Name: DacDiemNoiBat DacDiemNoiBat_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DacDiemNoiBat"
    ADD CONSTRAINT "DacDiemNoiBat_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4943 (class 2606 OID 25146)
-- Name: DonHang DonHang_KhachHangID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonHang"
    ADD CONSTRAINT "DonHang_KhachHangID_fkey" FOREIGN KEY ("KhachHangID") REFERENCES public."KhachHang"("KhachHangID");


--
-- TOC entry 4944 (class 2606 OID 25151)
-- Name: DonHang DonHang_NguoiDuyet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonHang"
    ADD CONSTRAINT "DonHang_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES public."NhanVien"("NhanVienID");


--
-- TOC entry 4951 (class 2606 OID 25225)
-- Name: GioHangChiTiet GioHangChiTiet_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHangChiTiet"
    ADD CONSTRAINT "GioHangChiTiet_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4952 (class 2606 OID 25220)
-- Name: GioHangChiTiet GioHangChiTiet_GioHangID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHangChiTiet"
    ADD CONSTRAINT "GioHangChiTiet_GioHangID_fkey" FOREIGN KEY ("GioHangID") REFERENCES public."GioHang"("GioHangID");


--
-- TOC entry 4950 (class 2606 OID 25207)
-- Name: GioHang GioHang_TaiKhoanID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GioHang"
    ADD CONSTRAINT "GioHang_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES public."TaiKhoan"("TaiKhoanID");


--
-- TOC entry 4932 (class 2606 OID 25026)
-- Name: KhachHang KhachHang_TaiKhoanID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhachHang"
    ADD CONSTRAINT "KhachHang_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES public."TaiKhoan"("TaiKhoanID");


--
-- TOC entry 4938 (class 2606 OID 25115)
-- Name: MaTranPhuongAn MaTranPhuongAn_CayCotID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranPhuongAn"
    ADD CONSTRAINT "MaTranPhuongAn_CayCotID_fkey" FOREIGN KEY ("CayCotID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4939 (class 2606 OID 25110)
-- Name: MaTranPhuongAn MaTranPhuongAn_CayDongID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranPhuongAn"
    ADD CONSTRAINT "MaTranPhuongAn_CayDongID_fkey" FOREIGN KEY ("CayDongID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4940 (class 2606 OID 25105)
-- Name: MaTranPhuongAn MaTranPhuongAn_MaTieuChi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranPhuongAn"
    ADD CONSTRAINT "MaTranPhuongAn_MaTieuChi_fkey" FOREIGN KEY ("MaTieuChi") REFERENCES public."TieuChi"("MaTieuChi");


--
-- TOC entry 4936 (class 2606 OID 25095)
-- Name: MaTranSoSanh MaTranSoSanh_TieuChiCot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranSoSanh"
    ADD CONSTRAINT "MaTranSoSanh_TieuChiCot_fkey" FOREIGN KEY ("TieuChiCot") REFERENCES public."TieuChi"("MaTieuChi");


--
-- TOC entry 4937 (class 2606 OID 25090)
-- Name: MaTranSoSanh MaTranSoSanh_TieuChiDong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaTranSoSanh"
    ADD CONSTRAINT "MaTranSoSanh_TieuChiDong_fkey" FOREIGN KEY ("TieuChiDong") REFERENCES public."TieuChi"("MaTieuChi");


--
-- TOC entry 4954 (class 2606 OID 25251)
-- Name: MoTaChiTiet MoTaChiTiet_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MoTaChiTiet"
    ADD CONSTRAINT "MoTaChiTiet_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4930 (class 2606 OID 25014)
-- Name: NhanVien NhanVien_ChucVuID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanVien"
    ADD CONSTRAINT "NhanVien_ChucVuID_fkey" FOREIGN KEY ("ChucVuID") REFERENCES public."ChucVu"("ChucVuID");


--
-- TOC entry 4931 (class 2606 OID 25009)
-- Name: NhanVien NhanVien_TaiKhoanID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanVien"
    ADD CONSTRAINT "NhanVien_TaiKhoanID_fkey" FOREIGN KEY ("TaiKhoanID") REFERENCES public."TaiKhoan"("TaiKhoanID");


--
-- TOC entry 4929 (class 2606 OID 24988)
-- Name: TaiKhoan TaiKhoan_VaiTroID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_VaiTroID_fkey" FOREIGN KEY ("VaiTroID") REFERENCES public."VaiTro"("VaiTroID");


--
-- TOC entry 4957 (class 2606 OID 25289)
-- Name: ThongTinKhoaHoc ThongTinKhoaHoc_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ThongTinKhoaHoc"
    ADD CONSTRAINT "ThongTinKhoaHoc_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4953 (class 2606 OID 25239)
-- Name: TonKho TonKho_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TonKho"
    ADD CONSTRAINT "TonKho_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID") ON DELETE CASCADE;


--
-- TOC entry 4941 (class 2606 OID 25126)
-- Name: TrongSoPhuongAn TrongSoPhuongAn_CayCanhID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrongSoPhuongAn"
    ADD CONSTRAINT "TrongSoPhuongAn_CayCanhID_fkey" FOREIGN KEY ("CayCanhID") REFERENCES public."CayCanh"("CayCanhID");


--
-- TOC entry 4942 (class 2606 OID 25131)
-- Name: TrongSoPhuongAn TrongSoPhuongAn_MaTieuChi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrongSoPhuongAn"
    ADD CONSTRAINT "TrongSoPhuongAn_MaTieuChi_fkey" FOREIGN KEY ("MaTieuChi") REFERENCES public."TieuChi"("MaTieuChi");


-- Completed on 2026-03-12 21:07:11

--
-- PostgreSQL database dump complete
--

\unrestrict 4cFZcsWoGJHYgT0JlP0Hlg71mal9xMXUKJhuMrwAfiyhY9IaSlJM36GORV5aAtn

