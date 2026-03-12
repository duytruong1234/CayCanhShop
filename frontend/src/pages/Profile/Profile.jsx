import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaUser, FaEdit, FaLock, FaSignOutAlt, FaChevronLeft, FaTimes, FaBox } from 'react-icons/fa'

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [formData, setFormData] = useState({
    ho_ten: '', gioi_tinh: 'Nam', ngay_sinh: '', dia_chi: '', email: '', dien_thoai: ''
  })
  const [passwordData, setPasswordData] = useState({
    mat_khau_cu: '', mat_khau_moi: '', nhap_lai_mat_khau: ''
  })
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  useEffect(() => { fetchProfile(); fetchUserInfo() }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile')
      setProfile(res.data)
      setFormData({
        ho_ten: res.data.ho_ten || '', gioi_tinh: res.data.gioi_tinh || 'Nam',
        ngay_sinh: res.data.ngay_sinh ? res.data.ngay_sinh.split('T')[0] : '',
        dia_chi: res.data.dia_chi || '', email: '', dien_thoai: ''
      })
      setLoading(false)
    } catch (error) { console.error('Error fetching profile:', error); setLoading(false) }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await api.get('/auth/me')
      setUserInfo(res.data)
      setFormData(prev => ({ ...prev, email: res.data.email || '', dien_thoai: res.data.dien_thoai || '' }))
    } catch (error) { console.error('Error fetching user info:', error) }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setPasswordErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleUpdateProfile = async () => {
    setErrors({})
    if (!formData.ho_ten.trim()) { setErrors({ ho_ten: 'Họ tên không được để trống!' }); return }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) { setErrors({ email: 'Email không hợp lệ!' }); return }
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.dien_thoai)) { setErrors({ dien_thoai: 'Số điện thoại phải gồm 10 số!' }); return }
    if (!formData.ngay_sinh) { setErrors({ ngay_sinh: 'Vui lòng chọn ngày sinh!' }); return }
    const birthDate = new Date(formData.ngay_sinh)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    if (birthDate > new Date(today.setFullYear(today.getFullYear() - age))) age--
    if (age < 16) { setErrors({ ngay_sinh: 'Bạn phải đủ 16 tuổi!' }); return }

    try {
      await api.put('/auth/profile', formData)
      alert('Cập nhật thành công!')
      setShowUpdateModal(false)
      fetchProfile(); fetchUserInfo()
    } catch (error) { if (error.response?.data?.detail) alert(error.response.data.detail) }
  }

  const handleChangePassword = async () => {
    setPasswordErrors({})
    const { mat_khau_cu, mat_khau_moi, nhap_lai_mat_khau } = passwordData
    if (!mat_khau_cu) { setPasswordErrors({ mat_khau_cu: 'Vui lòng nhập mật khẩu hiện tại!' }); return }
    if (!mat_khau_moi || mat_khau_moi.length < 6) { setPasswordErrors({ mat_khau_moi: 'Mật khẩu mới phải >= 6 ký tự!' }); return }
    if (mat_khau_moi !== nhap_lai_mat_khau) { setPasswordErrors({ nhap_lai_mat_khau: 'Mật khẩu nhập lại không trùng khớp!' }); return }
    try {
      await api.post('/auth/change-password', passwordData)
      alert('Đổi mật khẩu thành công! Hãy đăng nhập lại.')
      localStorage.removeItem('token'); localStorage.removeItem('user')
      navigate('/dang-nhap')
    } catch (error) { if (error.response?.data?.detail) setPasswordErrors({ mat_khau_cu: error.response.data.detail }) }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    navigate('/dang-nhap')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  if (loading) return <div className="flex justify-center py-24"><div className="spinner" /></div>

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaUser className="text-xs" />
            <span>Tài khoản</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Tài khoản của tôi</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-3xl">
        {/* Avatar Card */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 lg:p-8 border border-gray-100/60 mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-3xl font-heading font-extrabold">
            {(profile?.ho_ten || 'U').charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-800">{profile?.ho_ten}</h3>
          <p className="text-gray-400 text-sm mt-1">{userInfo?.ten_dang_nhap} • {userInfo?.email}</p>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 lg:p-7 border border-gray-100/60 mb-4">
          <h4 className="font-heading font-bold text-gray-800 text-sm mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
            Thông tin cá nhân
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Họ tên', profile?.ho_ten],
              ['Giới tính', profile?.gioi_tinh],
              ['Ngày sinh', formatDate(profile?.ngay_sinh)],
              ['Địa chỉ', profile?.dia_chi],
            ].map(([label, value], i) => (
              <div key={i}>
                <span className="text-gray-400 text-xs">{label}</span>
                <p className="text-gray-700 font-medium mt-1">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Login Info */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 lg:p-7 border border-gray-100/60 mb-6">
          <h4 className="font-heading font-bold text-gray-800 text-sm mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
            Thông tin đăng nhập
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs">Tên đăng nhập</span>
              <p className="text-gray-700 font-medium mt-1">{userInfo?.ten_dang_nhap}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Email</span>
              <p className="text-gray-700 font-medium mt-1">{userInfo?.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => navigate('/don-hang')} className="flex items-center justify-center gap-2.5 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-4 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-600 transition-all duration-300">
            <FaBox className="text-blue-500" /> Đơn hàng của tôi
          </button>
          <button onClick={() => setShowUpdateModal(true)} className="flex items-center justify-center gap-2.5 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-4 text-sm font-semibold text-gray-700 hover:border-amber-200 hover:bg-amber-50/30 hover:text-amber-600 transition-all duration-300">
            <FaEdit className="text-amber-500" /> Cập nhật thông tin
          </button>
          <button onClick={() => setShowPasswordModal(true)} className="flex items-center justify-center gap-2.5 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-4 text-sm font-semibold text-gray-700 hover:border-red-200 hover:bg-red-50/30 hover:text-red-600 transition-all duration-300">
            <FaLock className="text-red-500" /> Đổi mật khẩu
          </button>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2.5 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
            <FaSignOutAlt className="text-gray-400" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-800">Cập nhật thông tin</h3>
              <button onClick={() => setShowUpdateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Họ tên', name: 'ho_ten', type: 'text', error: errors.ho_ten },
                { label: 'Ngày sinh', name: 'ngay_sinh', type: 'date', error: errors.ngay_sinh },
                { label: 'Địa chỉ', name: 'dia_chi', type: 'text' },
                { label: 'Email', name: 'email', type: 'email', error: errors.email },
                { label: 'Số điện thoại', name: 'dien_thoai', type: 'text', error: errors.dien_thoai },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                  <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} className="input-premium py-3 rounded-xl" />
                  {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Giới tính</label>
                <select name="gioi_tinh" value={formData.gioi_tinh} onChange={handleInputChange} className="input-premium py-3 rounded-xl">
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-premium btn-ghost text-sm" onClick={() => setShowUpdateModal(false)}>Hủy</button>
              <button className="btn-premium btn-primary text-sm py-2.5 px-6" onClick={handleUpdateProfile}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-800">Đổi mật khẩu</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Mật khẩu hiện tại', name: 'mat_khau_cu', error: passwordErrors.mat_khau_cu },
                { label: 'Mật khẩu mới', name: 'mat_khau_moi', error: passwordErrors.mat_khau_moi },
                { label: 'Nhập lại mật khẩu mới', name: 'nhap_lai_mat_khau', error: passwordErrors.nhap_lai_mat_khau },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                  <input type="password" name={field.name} value={passwordData[field.name]} onChange={handlePasswordChange} className="input-premium py-3 rounded-xl" />
                  {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-premium btn-ghost text-sm" onClick={() => setShowPasswordModal(false)}>Hủy</button>
              <button className="btn-premium btn-primary text-sm py-2.5 px-6" onClick={handleChangePassword}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
