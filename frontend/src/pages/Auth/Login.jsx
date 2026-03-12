import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { FaLeaf } from 'react-icons/fa'

const Login = () => {
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loading, setLoading] = useState(false)

  const [showForgotPopup, setShowForgotPopup] = useState(false)
  const [showResetPopup, setShowResetPopup] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetData, setResetData] = useState({ email: '', otp: '', matKhauMoi: '' })
  const [forgotError, setForgotError] = useState('')
  const [resetErrors, setResetErrors] = useState({})

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(tenDangNhap, matKhau)
      toast.success('Đăng nhập thành công!')
      if (data.user.vai_tro_id === 1) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail) {
      setForgotError('Vui lòng nhập email!')
      return
    }
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail })
      toast.success('Mã xác nhận đã được gửi đến email!')
      setShowForgotPopup(false)
      setResetData(prev => ({ ...prev, email: res.data.email }))
      setShowResetPopup(true)
    } catch (error) {
      setForgotError(error.response?.data?.detail || 'Có lỗi xảy ra')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetErrors({})
    try {
      await api.post('/auth/verify-otp', {
        email: resetData.email,
        otp: resetData.otp,
        mat_khau_moi: resetData.matKhauMoi
      })
      toast.success('Đổi mật khẩu thành công!')
      setShowResetPopup(false)
      setResetData({ email: '', otp: '', matKhauMoi: '' })
    } catch (error) {
      const detail = error.response?.data?.detail
      if (detail?.includes('OTP')) {
        setResetErrors({ otp: detail })
      } else if (detail?.includes('mật khẩu')) {
        setResetErrors({ matKhauMoi: detail })
      } else {
        setResetErrors({ otp: detail || 'Có lỗi xảy ra' })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-5 bg-gradient-to-br from-[#022c22] via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute -top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-1/4 -left-10 w-[400px] h-[400px] bg-primary-400/8 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[var(--shadow-2xl)] p-10 sm:p-12 w-full max-w-[440px] relative z-10 animate-[scaleIn_0.4s_ease-out] border border-white/50">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLeaf className="text-white text-xl" />
          </div>
          <h2 className="text-[26px] font-heading font-extrabold text-gray-800 tracking-tight">Đăng nhập</h2>
          <p className="text-gray-400 text-sm mt-1">Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tên đăng nhập</label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              placeholder="Nhập tên đăng nhập hoặc email"
              className="input-premium py-3.5 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mật khẩu</label>
            <input
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder="••••••••"
              className="input-premium py-3.5 rounded-xl"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Link to="/dang-ky" className="text-primary-600 text-sm font-semibold hover:text-primary-700 transition-colors">
              Đăng ký
            </Link>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPopup(true) }} className="text-gray-400 text-sm font-medium hover:text-primary-600 transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-heading font-bold text-base hover:shadow-[0_8px_30px_rgba(5,150,105,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <h3 className="text-xl font-heading font-bold text-gray-800 text-center mb-6">Quên mật khẩu</h3>
            <form onSubmit={handleForgotPassword}>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email đăng ký</label>
              <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="input-premium py-3 rounded-xl" placeholder="Nhập email của bạn" />
              {forgotError && <p className="text-red-500 text-xs mt-2">{forgotError}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn-premium btn-ghost text-sm" onClick={() => setShowForgotPopup(false)}>Hủy</button>
                <button type="submit" className="btn-premium btn-primary text-sm py-2.5 px-6">Gửi mã</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Popup */}
      {showResetPopup && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <h3 className="text-xl font-heading font-bold text-gray-800 text-center mb-6">Đặt lại mật khẩu</h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mã xác nhận (OTP)</label>
                <input type="text" value={resetData.otp} onChange={(e) => setResetData(prev => ({ ...prev, otp: e.target.value }))} className="input-premium py-3 rounded-xl" placeholder="Nhập mã OTP từ email" />
                {resetErrors.otp && <p className="text-red-500 text-xs mt-1.5">{resetErrors.otp}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mật khẩu mới</label>
                <input type="password" value={resetData.matKhauMoi} onChange={(e) => setResetData(prev => ({ ...prev, matKhauMoi: e.target.value }))} className="input-premium py-3 rounded-xl" placeholder="Nhập mật khẩu mới" />
                {resetErrors.matKhauMoi && <p className="text-red-500 text-xs mt-1.5">{resetErrors.matKhauMoi}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-premium btn-ghost text-sm" onClick={() => setShowResetPopup(false)}>Hủy</button>
                <button type="submit" className="btn-premium btn-primary text-sm py-2.5 px-6">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
