import api from './api'

export const gioHangService = {
  // Lấy giỏ hàng
  get: async () => {
    const response = await api.get('/gio-hang')
    return response.data
  },

  // Thêm vào giỏ
  add: async (cayCanhId, soLuong = 1) => {
    const response = await api.post('/gio-hang/them', {
      cay_canh_id: cayCanhId,
      so_luong: soLuong
    })
    return response.data
  },

  // Cập nhật số lượng
  updateQty: async (ghctId, change) => {
    const response = await api.put(`/gio-hang/${ghctId}`, { change })
    return response.data
  },

  // Xóa sản phẩm
  remove: async (ghctId) => {
    const response = await api.delete(`/gio-hang/${ghctId}`)
    return response.data
  },

  // Xóa toàn bộ giỏ
  clear: async () => {
    const response = await api.delete('/gio-hang')
    return response.data
  }
}
