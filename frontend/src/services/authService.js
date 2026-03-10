import api from './api'

export const authService = {
  // Đăng nhập
  login: async (tenDangNhap, matKhau) => {
    const response = await api.post('/auth/login', {
      ten_dang_nhap: tenDangNhap,
      mat_khau: matKhau
    })
    return response.data
  },

  // Đăng ký
  register: async (data) => {
    const response = await api.post('/auth/register', {
      ho_ten: data.hoTen,
      gioi_tinh: data.gioiTinh,
      ngay_sinh: data.ngaySinh,
      dia_chi: data.diaChi,
      email: data.email,
      dien_thoai: data.dienThoai,
      ten_dang_nhap: data.tenDangNhap,
      mat_khau: data.matKhau
    })
    return response.data
  },

  // Lấy thông tin user hiện tại
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Lấy profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Cập nhật profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  }
}
