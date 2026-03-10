import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { FaLeaf, FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaVenusMars } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    gioiTinh: 'Nam',
    ngaySinh: '',
    diaChi: '',
    email: '',
    dienThoai: '',
    tenDangNhap: '',
    matKhau: '',
    xacNhanMatKhau: ''
  })
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return
    }

    setLoading(true)
    try {
      await register({
        ho_ten: formData.hoTen,
        gioi_tinh: formData.gioiTinh,
        ngay_sinh: formData.ngaySinh,
        dia_chi: formData.diaChi,
        email: formData.email,
        dien_thoai: formData.dienThoai,
        ten_dang_nhap: formData.tenDangNhap,
        mat_khau: formData.matKhau
      })
      toast.success('Đăng ký thành công!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Đăng ký thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
      {/* Các vòng tròn trang trí */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-premium p-8 w-full max-w-xl relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <FaLeaf className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-gray-800">Tạo tài khoản</h2>
          <p className="text-gray-500 text-sm mt-1">Đăng ký để bắt đầu mua sắm cây cảnh</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Họ tên</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              required
              className="input-premium"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Hàng: Giới tính + Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Giới tính</label>
              <select
                name="gioiTinh"
                value={formData.gioiTinh}
                onChange={handleChange}
                className="input-premium"
              >
                <option>Nam</option>
                <option>Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ngày sinh</label>
              <input
                type="date"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Địa chỉ</label>
            <input
              type="text"
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              className="input-premium"
              placeholder="Số nhà, đường, quận..."
            />
          </div>

          {/* Hàng: Email + SĐT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-premium"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
              <input
                type="text"
                name="dienThoai"
                value={formData.dienThoai}
                onChange={handleChange}
                required
                className="input-premium"
                placeholder="0912345678"
              />
            </div>
          </div>

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tên đăng nhập</label>
            <input
              type="text"
              name="tenDangNhap"
              value={formData.tenDangNhap}
              onChange={handleChange}
              required
              className="input-premium"
              placeholder="Username"
            />
          </div>

          {/* Hàng: Mật khẩu + Xác nhận */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                required
                className="input-premium"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Xác nhận MK</label>
              <input
                type="password"
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                required
                className="input-premium"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-heading font-bold text-base hover:shadow-glow-green transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
          >
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="text-primary-600 font-semibold hover:text-primary-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
