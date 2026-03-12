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

  // Lọc cây theo đặc điểm (cho wizard tư vấn)
  filterPlants: async (selectedDacDiem, excludedDacDiem = []) => {
    const response = await api.post('/ahp-recommend/loc-cay', {
      selected_dac_diem: selectedDacDiem,
      excluded_dac_diem: excludedDacDiem
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
  }
}