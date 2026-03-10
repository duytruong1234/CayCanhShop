import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        ho_ten: '',
        gioi_tinh: 'Nam',
        ngay_sinh: '',
        dia_chi: '',
        email: '',
        dien_thoai: ''
    })

    const [passwordData, setPasswordData] = useState({
        mat_khau_cu: '',
        mat_khau_moi: '',
        nhap_lai_mat_khau: ''
    })

    const [errors, setErrors] = useState({})
    const [passwordErrors, setPasswordErrors] = useState({})

    useEffect(() => {
        fetchProfile()
        fetchUserInfo()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile')
            setProfile(res.data)
            setFormData({
                ho_ten: res.data.ho_ten || '',
                gioi_tinh: res.data.gioi_tinh || 'Nam',
                ngay_sinh: res.data.ngay_sinh ? res.data.ngay_sinh.split('T')[0] : '',
                dia_chi: res.data.dia_chi || '',
                email: '',
                dien_thoai: ''
            })
            setLoading(false)
        } catch (error) {
            console.error('Error fetching profile:', error)
            setLoading(false)
        }
    }

    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/auth/me')
            setUserInfo(res.data)
            setFormData(prev => ({
                ...prev,
                email: res.data.email || '',
                dien_thoai: res.data.dien_thoai || ''
            }))
        } catch (error) {
            console.error('Error fetching user info:', error)
        }
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

        // Validation
        if (!formData.ho_ten.trim()) {
            setErrors({ ho_ten: 'Họ tên không được để trống!' })
            return
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(formData.email)) {
            setErrors({ email: 'Email không hợp lệ! (VD: ten@gmail.com)' })
            return
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.dien_thoai)) {
            setErrors({ dien_thoai: 'Số điện thoại phải gồm 10 số!' })
            return
        }

        if (!formData.ngay_sinh) {
            setErrors({ ngay_sinh: 'Vui lòng chọn ngày sinh!' })
            return
        }

        // Check age >= 16
        const birthDate = new Date(formData.ngay_sinh)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        if (birthDate > new Date(today.setFullYear(today.getFullYear() - age))) age--
        if (age < 16) {
            setErrors({ ngay_sinh: 'Bạn phải đủ 16 tuổi!' })
            return
        }

        try {
            await api.put('/auth/profile', formData)
            alert('Cập nhật thành công!')
            setShowUpdateModal(false)
            fetchProfile()
            fetchUserInfo()
        } catch (error) {
            const detail = error.response?.data?.detail
            if (detail) {
                alert(detail)
            }
        }
    }

    const handleChangePassword = async () => {
        setPasswordErrors({})

        const { mat_khau_cu, mat_khau_moi, nhap_lai_mat_khau } = passwordData

        if (!mat_khau_cu) {
            setPasswordErrors({ mat_khau_cu: 'Vui lòng nhập mật khẩu hiện tại!' })
            return
        }

        if (!mat_khau_moi || mat_khau_moi.length < 6) {
            setPasswordErrors({ mat_khau_moi: 'Mật khẩu mới phải >= 6 ký tự!' })
            return
        }

        if (mat_khau_moi !== nhap_lai_mat_khau) {
            setPasswordErrors({ nhap_lai_mat_khau: 'Mật khẩu nhập lại không trùng khớp!' })
            return
        }

        try {
            await api.post('/auth/change-password', passwordData)
            alert('Đổi mật khẩu thành công! Hãy đăng nhập lại.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/dang-nhap')
        } catch (error) {
            const detail = error.response?.data?.detail
            if (detail) {
                setPasswordErrors({ mat_khau_cu: detail })
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/dang-nhap')
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleDateString('vi-VN')
    }

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    return (
        <div className="profile-page">
            <button className="btn-back" onClick={() => navigate('/')}>
                <i className="fa-solid fa-chevron-left"></i> Trang chủ
            </button>

            <h2 className="page-title">Tài khoản của tôi</h2>

            {/* Thông tin cá nhân */}
            <div className="card-box">
                <h4 className="section-title">Thông tin cá nhân</h4>

                <div className="info-row">
                    <span>Họ tên:</span>
                    <p>{profile?.ho_ten}</p>
                </div>

                <div className="info-row">
                    <span>Giới tính:</span>
                    <p>{profile?.gioi_tinh}</p>
                </div>

                <div className="info-row">
                    <span>Ngày sinh:</span>
                    <p>{formatDate(profile?.ngay_sinh)}</p>
                </div>

                <div className="info-row">
                    <span>Địa chỉ:</span>
                    <p>{profile?.dia_chi}</p>
                </div>
            </div>

            {/* Thông tin đăng nhập */}
            <div className="card-box">
                <h4 className="section-title">Thông tin đăng nhập</h4>

                <div className="info-row">
                    <span>Tên đăng nhập:</span>
                    <p>{userInfo?.ten_dang_nhap}</p>
                </div>

                <div className="info-row">
                    <span>Email:</span>
                    <p>{userInfo?.email}</p>
                </div>
            </div>

            {/* Nút bấm */}
            <div className="btn-group-box">
                <button className="big-btn btn-blue" onClick={() => navigate('/don-hang-cua-toi')}>
                    <i className="fa-solid fa-box"></i> Đơn hàng của tôi
                </button>

                <button className="big-btn btn-yellow" onClick={() => setShowUpdateModal(true)}>
                    <i className="fa-solid fa-pen"></i> Cập nhật thông tin
                </button>

                <button className="big-btn btn-red" onClick={() => setShowPasswordModal(true)}>
                    <i className="fa-solid fa-lock"></i> Đổi mật khẩu
                </button>

                <button className="big-btn btn-white" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </button>
            </div>

            {/* Modal Cập nhật thông tin */}
            {showUpdateModal && (
                <div className="popup-bg">
                    <div className="popup-box">
                        <h3 className="popup-title">Cập nhật thông tin</h3>

                        <label>Họ tên</label>
                        <input
                            name="ho_ten"
                            value={formData.ho_ten}
                            onChange={handleInputChange}
                            className="popup-input"
                        />
                        {errors.ho_ten && <small className="error-text">{errors.ho_ten}</small>}

                        <label>Giới tính</label>
                        <select
                            name="gioi_tinh"
                            value={formData.gioi_tinh}
                            onChange={handleInputChange}
                            className="popup-input"
                        >
                            <option>Nam</option>
                            <option>Nữ</option>
                        </select>

                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="ngay_sinh"
                            value={formData.ngay_sinh}
                            onChange={handleInputChange}
                            className="popup-input"
                        />
                        {errors.ngay_sinh && <small className="error-text">{errors.ngay_sinh}</small>}

                        <label>Địa chỉ</label>
                        <input
                            name="dia_chi"
                            value={formData.dia_chi}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <label>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="popup-input"
                        />
                        {errors.email && <small className="error-text">{errors.email}</small>}

                        <label>Số điện thoại</label>
                        <input
                            name="dien_thoai"
                            value={formData.dien_thoai}
                            onChange={handleInputChange}
                            className="popup-input"
                        />
                        {errors.dien_thoai && <small className="error-text">{errors.dien_thoai}</small>}

                        <div className="popup-actions">
                            <button className="btn-cancel" onClick={() => setShowUpdateModal(false)}>
                                Hủy
                            </button>
                            <button className="btn-save" onClick={handleUpdateProfile}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Đổi mật khẩu */}
            {showPasswordModal && (
                <div className="popup-bg">
                    <div className="popup-box">
                        <h3 className="popup-title">Đổi mật khẩu</h3>

                        <label>Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            name="mat_khau_cu"
                            value={passwordData.mat_khau_cu}
                            onChange={handlePasswordChange}
                            className="popup-input"
                        />
                        {passwordErrors.mat_khau_cu && <small className="error-text">{passwordErrors.mat_khau_cu}</small>}

                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="mat_khau_moi"
                            value={passwordData.mat_khau_moi}
                            onChange={handlePasswordChange}
                            className="popup-input"
                        />
                        {passwordErrors.mat_khau_moi && <small className="error-text">{passwordErrors.mat_khau_moi}</small>}

                        <label>Nhập lại mật khẩu mới</label>
                        <input
                            type="password"
                            name="nhap_lai_mat_khau"
                            value={passwordData.nhap_lai_mat_khau}
                            onChange={handlePasswordChange}
                            className="popup-input"
                        />
                        {passwordErrors.nhap_lai_mat_khau && <small className="error-text">{passwordErrors.nhap_lai_mat_khau}</small>}

                        <div className="popup-actions">
                            <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
                                Hủy
                            </button>
                            <button className="btn-save" onClick={handleChangePassword}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
