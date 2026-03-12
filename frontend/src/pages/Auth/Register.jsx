import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { FaLeaf } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    hoTen: '', gioiTinh: 'Nam', ngaySinh: '', diaChi: '',
    email: '', dienThoai: '', tenDangNhap: '', matKhau: '', xacNhanMatKhau: ''
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
        ho_ten: formData.hoTen, gioi_tinh: formData.gioiTinh,
        ngay_sinh: formData.ngaySinh, dia_chi: formData.diaChi,
        email: formData.email, dien_thoai: formData.dienThoai,
        ten_dang_nhap: formData.tenDangNhap, mat_khau: formData.matKhau
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
    <div className="min-h-screen flex items-center justify-center py-12 px-5 bg-gradient-to-br from-[#022c22] via-primary-900 to-primary-800 relative overflow-hidden">
      <div className="absolute -top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-1/4 -left-10 w-[400px] h-[400px] bg-primary-400/8 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[var(--shadow-2xl)] p-8 sm:p-10 w-full max-w-xl relative z-10 animate-[scaleIn_0.4s_ease-out] border border-white/50">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLeaf className="text-white text-xl" />
          </div>
          <h2 className="text-[26px] font-heading font-extrabold text-gray-800 tracking-tight">Tạo tài khoản</h2>
          <p className="text-gray-400 text-sm mt-1">Đăng ký để bắt đầu mua sắm cây cảnh</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Họ tên</label>
            <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="Nguyễn Văn A" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Giới tính</label>
              <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} className="input-premium py-3 rounded-xl">
                <option>Nam</option>
                <option>Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ngày sinh</label>
              <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} className="input-premium py-3 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Địa chỉ</label>
            <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} className="input-premium py-3 rounded-xl" placeholder="Số nhà, đường, quận..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Số điện thoại</label>
              <input type="text" name="dienThoai" value={formData.dienThoai} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="0912345678" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tên đăng nhập</label>
            <input type="text" name="tenDangNhap" value={formData.tenDangNhap} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="Username" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mật khẩu</label>
              <input type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Xác nhận MK</label>
              <input type="password" name="xacNhanMatKhau" value={formData.xacNhanMatKhau} onChange={handleChange} required className="input-premium py-3 rounded-xl" placeholder="••••••••" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-heading font-bold text-base hover:shadow-[0_8px_30px_rgba(5,150,105,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
          >
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
