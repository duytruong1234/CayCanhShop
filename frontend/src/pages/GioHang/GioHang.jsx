import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaLeaf } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const GioHang = () => {
  const navigate = useNavigate()
  const [gioHang, setGioHang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => { fetchGioHang() }, [])

  const fetchGioHang = async () => {
    try {
      const res = await api.get('/gio-hang/')
      setGioHang(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching gio hang:', error)
      setLoading(false)
    }
  }

  const handleUpdateQty = async (ghctId, change) => {
    const item = gioHang.chi_tiets.find(ct => ct.ghct_id === ghctId)
    if (item && item.so_luong <= 1 && change === -1) {
      if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return
    }
    try {
      await api.put(`/gio-hang/${ghctId}`, { change })
      fetchGioHang()
    } catch (error) { console.error('Error updating qty:', error) }
  }

  const handleDeleteItem = async (ghctId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      await api.delete(`/gio-hang/${ghctId}`)
      fetchGioHang()
      setSelectedItems(prev => prev.filter(id => id !== ghctId))
    } catch (error) { console.error('Error deleting item:', error) }
  }

  const handleCheckItem = (ghctId) => {
    setSelectedItems(prev => prev.includes(ghctId) ? prev.filter(id => id !== ghctId) : [...prev, ghctId])
  }

  const handleThanhToan = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng tick chọn sản phẩm bạn muốn thanh toán!')
      return
    }
    navigate('/dat-hang', { state: { selectedIds: selectedItems } })
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaShoppingBag className="text-xs" />
            <span>Mua sắm</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Giỏ hàng của bạn</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] border border-gray-100/60 overflow-hidden">
          {/* Items */}
          <div className="p-5 lg:p-7">
            {!gioHang || gioHang.chi_tiets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <FaShoppingBag className="text-gray-300 text-2xl" />
                </div>
                <p className="text-gray-500 text-lg font-semibold mb-2">Giỏ hàng trống</p>
                <p className="text-gray-400 text-sm mb-5">Hãy khám phá cây cảnh và thêm vào giỏ hàng!</p>
                <button onClick={() => navigate('/cay-canh')} className="btn-premium btn-primary text-sm py-2.5 px-6">
                  <FaLeaf className="text-xs" /> Xem cây cảnh
                </button>
              </div>
            ) : (
              <div className="space-y-3">
              {gioHang.chi_tiets.map((item) => (
                  <div key={item.ghct_id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50/60 rounded-2xl hover:bg-primary-50/30 transition-all duration-300 border border-transparent hover:border-primary-100/50">
                    {/* Top row on mobile: checkbox + image + info */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="w-[18px] h-[18px] cursor-pointer accent-primary-600 flex-shrink-0 rounded"
                        checked={selectedItems.includes(item.ghct_id)}
                        onChange={() => handleCheckItem(item.ghct_id)}
                      />

                      {/* Image */}
                      <img
                        src={`${API_URL}/static/images/${item.hinh_anh}`}
                        alt={item.ten_cay}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0 shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='60' fill='%2322c55e'%3E🌿%3C/text%3E%3Ctext x='200' y='230' text-anchor='middle' font-size='16' fill='%2386efac'%3EKhông có hình ảnh%3C/text%3E%3C/svg%3E"
                        }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-[15px] mb-1 truncate">{item.ten_cay}</h4>
                        <p className="text-primary-600 font-bold text-sm sm:text-[15px] font-heading">{formatPrice(item.don_gia)}</p>
                      </div>
                    </div>

                    {/* Bottom row on mobile: quantity + delete */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 pl-[30px] sm:pl-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-8 h-8 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200 text-xs"
                          onClick={() => handleUpdateQty(item.ghct_id, -1)}
                        >
                          <FaMinus className="text-[9px]" />
                        </button>
                        <span className="w-9 text-center font-semibold text-gray-800 text-sm">{item.so_luong}</span>
                        <button
                          className="w-8 h-8 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200 text-xs"
                          onClick={() => handleUpdateQty(item.ghct_id, 1)}
                        >
                          <FaPlus className="text-[9px]" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        onClick={() => handleDeleteItem(item.ghct_id)}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Bar */}
          {gioHang && gioHang.chi_tiets.length > 0 && (
            <div className="bg-gradient-to-r from-primary-50/80 to-primary-50/40 p-5 lg:p-7 border-t border-primary-100/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-700 text-sm">
                  <span>Tổng tiền: </span>
                  <strong className="text-primary-600 text-xl font-heading ml-1">{formatPrice(gioHang?.tong_tien || 0)}</strong>
                  <span className="text-gray-400 mx-2">|</span>
                  <span>Số lượng: </span>
                  <strong className="text-gray-800">{gioHang?.tong_so_luong || 0}</strong>
                </div>
                <button
                  className="btn-premium btn-primary py-3.5 px-10 text-base shadow-lg hover:shadow-xl"
                  onClick={handleThanhToan}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GioHang
