import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages - Public
import Home from './pages/Home'
import CayCanhList from './pages/CayCanh/CayCanhList'
import CayCanhDetail from './pages/CayCanh/CayCanhDetail'
import TuVanAHP from './pages/CayCanh/TuVanAHP'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

// Các trang - Khách hàng
import GioHang from './pages/GioHang/GioHang'
import DatHang from './pages/GioHang/DatHang'
import DonHangCuaToi from './pages/DonHang/DonHangCuaToi'
import DonHangChiTiet from './pages/DonHang/DonHangChiTiet'
import Profile from './pages/Profile/Profile'

// Các trang - Admin
import AdminDashboard from './pages/Admin/Dashboard'
import AdminCayCanh from './pages/Admin/CayCanh/AdminCayCanh'
import AdminDonHang from './pages/Admin/DonHang/AdminDonHang'
import AdminKhachHang from './pages/Admin/KhachHang/AdminKhachHang'
import AdminTonKho from './pages/Admin/TonKho/AdminTonKho'
import QuanLyBaiViet from './pages/Admin/BaiViet/QuanLyBaiViet'
import TieuChiAHP from './pages/Admin/AHP/TieuChiAHP'
import PhuongAnAHP from './pages/Admin/AHP/PhuongAnAHP'

// Tuyến bảo vệ (Protected Route)
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Tuyến công khai */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="cay-canh" element={<CayCanhList />} />
        <Route path="cay-canh/:id" element={<CayCanhDetail />} />
        <Route path="tu-van-cay" element={<TuVanAHP />} />

        <Route path="dang-nhap" element={<Login />} />
        <Route path="dang-ky" element={<Register />} />

        {/* Tuyến khách hàng - Được bảo vệ */}
        <Route element={<ProtectedRoute />}>
          <Route path="gio-hang" element={<GioHang />} />
          <Route path="dat-hang" element={<DatHang />} />
          <Route path="don-hang" element={<DonHangCuaToi />} />
          <Route path="don-hang/:id" element={<DonHangChiTiet />} />
          <Route path="tai-khoan" element={<Profile />} />
        </Route>
      </Route>

      {/* Tuyến Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="cay-canh" element={<AdminCayCanh />} />
        <Route path="don-hang" element={<AdminDonHang />} />
        <Route path="khach-hang" element={<AdminKhachHang />} />
        <Route path="ton-kho" element={<AdminTonKho />} />
        <Route path="bai-viet/:cayCanhId" element={<QuanLyBaiViet />} />
        <Route path="quan-ly-dac-diem" element={<TieuChiAHP />} />
        <Route path="quan-ly-dac-diem/:maTieuChi" element={<PhuongAnAHP />} />
      </Route>
    </Routes>
  )
}

export default App
