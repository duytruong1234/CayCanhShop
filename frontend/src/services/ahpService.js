import api from './api'

export const ahpService = {
  // Lấy danh sách tiêu chí và đặc điểm (hộp kiểm)
  getFilterOptions: async () => {
    const response = await api.get('/ahp-recommend/tieu-chi-va-dac-diem')
    return response.data
  },

  // Gợi ý cây theo tiêu chí, đặc điểm và trọng số tùy chỉnh (nếu có)
  getRecommendations: async (selectedCriteria, selectedDacDiem, customWeights = null) => {
    const response = await api.post('/ahp-recommend/goi-y', {
      selected_criteria: selectedCriteria,
      selected_dac_diem: selectedDacDiem,
      ...(customWeights ? { custom_weights: customWeights } : {})
    })
    return response.data
  },

  // Lọc cây theo đặc điểm, giá, loại cây (cho wizard tư vấn)
  filterPlants: async (selectedDacDiem, excludedDacDiem = [], giaMin = null, giaMax = null, loaiCayId = null) => {
    const response = await api.post('/ahp-recommend/loc-cay', {
      selected_dac_diem: selectedDacDiem,
      excluded_dac_diem: excludedDacDiem,
      ...(giaMin !== null ? { gia_min: giaMin } : {}),
      ...(giaMax !== null ? { gia_max: giaMax } : {}),
      ...(loaiCayId !== null ? { loai_cay_id: loaiCayId } : {})
    })
    return response.data
  },

  // Lấy ma trận tiêu chí (4x4)
  getCriteriaMatrix: async () => {
    const response = await api.get('/tieu-chi/ma-tran')
    return response.data
  },

  // Lấy ma trận phương án (10x10) theo tiêu chí
  getPlantMatrix: async (maTieuChi) => {
    const response = await api.get(`/phuong-an/${maTieuChi}`)
    return response.data
  },

  // Lưu lịch sử đánh giá AHP
  saveAHPHistory: async (data) => {
    const response = await api.post('/lich-su-ahp/', data)
    return response.data
  },

  // Lấy lịch sử AHP của user hiện tại
  getMyAHPHistory: async () => {
    const response = await api.get('/lich-su-ahp/')
    return response.data
  },

  // Admin: Lấy lịch sử AHP của 1 khách hàng
  getAHPHistoryByUser: async (taiKhoanId) => {
    const response = await api.get(`/admin/lich-su-ahp/${taiKhoanId}`)
    return response.data
  },

  // AI: Gợi ý điểm đánh giá AHP
  getAISuggestion: async (plants, tieuChi, tenTieuChi) => {
    const response = await api.post('/ai-suggest/goi-y-diem', {
      plants: plants.map(p => ({
        cay_canh_id: p.cay_canh_id,
        ten_cay: p.ten_cay,
        gia: p.gia || 0,
        mo_ta: p.mo_ta || '',
        loai_cay: p.loai_cay || null,
        dac_diems: p.dac_diems || []
      })),
      tieu_chi: tieuChi,
      ten_tieu_chi: tenTieuChi
    })
    return response.data
  }
}