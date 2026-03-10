import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../../services/api'
import './Login.css'

const Login = () => {
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loading, setLoading] = useState(false)

  // Trạng thái Popup
  const [showForgotPopup, setShowForgotPopup] = useState(false)
  const [showResetPopup, setShowResetPopup] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetData, setResetData] = useState({
    email: '',
    otp: '',
    matKhauMoi: ''
  })
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

      // Chuyển hướng dựa trên vai trò
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
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              placeholder="Nhập tên đăng nhập hoặc email"
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder="Mật khẩu"
              className="login-input"
              required
            />
          </div>

          <div className="login-links">
            <Link to="/dang-ky" className="link">Đăng ký</Link>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPopup(true) }} className="link">
              Quên mật khẩu
            </a>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>

      {/* POPUP QUÊN MẬT KHẨU */}
      {showForgotPopup && (
        <div className="popup-bg">
          <div className="popup-box signup-box">
            <h3 className="popup-title">Quên mật khẩu</h3>

            <form onSubmit={handleForgotPassword}>
              <label>Email đăng ký</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="popup-input"
                placeholder="Nhập email của bạn"
              />
              {forgotError && <p className="error-text">{forgotError}</p>}

              <div className="popup-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForgotPopup(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">Gửi mã</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP ĐẶT LẠI MẬT KHẨU */}
      {showResetPopup && (
        <div className="popup-bg">
          <div className="popup-box signup-box">
            <h3 className="popup-title">Đặt lại mật khẩu</h3>

            <form onSubmit={handleResetPassword}>
              <label>Mã xác nhận (OTP)</label>
              <input
                type="text"
                value={resetData.otp}
                onChange={(e) => setResetData(prev => ({ ...prev, otp: e.target.value }))}
                className="popup-input"
                placeholder="Nhập mã OTP từ email"
              />
              {resetErrors.otp && <p className="error-text">{resetErrors.otp}</p>}

              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={resetData.matKhauMoi}
                onChange={(e) => setResetData(prev => ({ ...prev, matKhauMoi: e.target.value }))}
                className="popup-input"
                placeholder="Nhập mật khẩu mới"
              />
              {resetErrors.matKhauMoi && <p className="error-text">{resetErrors.matKhauMoi}</p>}

              <div className="popup-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowResetPopup(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
