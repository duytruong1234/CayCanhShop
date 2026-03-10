import api from './api'

export const cayCanhService = {
  // Lấy danh sách cây cảnh
  getAll: async (params = {}) => {
    // Lọc bỏ các params rỗng
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )
    const response = await api.get('/cay-canh/', { params: cleanParams })
    return response.data
  },

  // Lấy chi tiết cây cảnh
  getById: async (id) => {
    const response = await api.get(`/cay-canh/${id}`)
    return response.data
  },

  // Lấy danh sách loại cây
  getLoaiCay: async () => {
    const response = await api.get('/cay-canh/loai-cay')
    return response.data
  }
}
