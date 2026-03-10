import api from './api'

export const donHangService = {
  // Lấy danh sách đơn hàng
  getAll: async (trangThai = null) => {
    const params = trangThai ? { trang_thai: trangThai } : {}
    const response = await api.get('/don-hang', { params })
    return response.data
  },

  // Lấy chi tiết đơn hàng
  getById: async (id) => {
    const response = await api.get(`/don-hang/${id}`)
    return response.data
  },

  // Đặt hàng
  datHang: async (data) => {
    const response = await api.post('/don-hang/dat-hang', {
      ten_nguoi_nhan: data.tenNguoiNhan,
      sdt_nguoi_nhan: data.sdtNguoiNhan,
      dia_chi_giao_hang: data.diaChiGiaoHang,
      ghi_chu: data.ghiChu,
      phuong_thuc_thanh_toan: data.phuongThucThanhToan
    })
    return response.data
  },

  // Hủy đơn
  huy: async (id, lyDo) => {
    const response = await api.post(`/don-hang/${id}/huy`, { ly_do: lyDo })
    return response.data
  },

  // Xác nhận đã nhận
  daNhan: async (id) => {
    const response = await api.post(`/don-hang/${id}/da-nhan`)
    return response.data
  }
}
