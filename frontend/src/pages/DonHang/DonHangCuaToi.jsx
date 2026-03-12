import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaBox, FaChevronRight } from 'react-icons/fa'

const DonHangCuaToi = () => {
  const navigate = useNavigate()
  const [donHangs, setDonHangs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => { fetchDonHangs() }, [filterStatus])

  const fetchDonHangs = async () => {
    try {
      const params = filterStatus ? { trang_thai: filterStatus } : {}
      const res = await api.get('/don-hang/', { params })
      setDonHangs(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Normalize corrupted Vietnamese status from SQL Server VARCHAR column
  const normalizeStatus = (s) => {
    if (!s) return s
    const map = {
      'Ch? xác nh?n': 'Chờ xác nhận', 'Cho xac nhan': 'Chờ xác nhận',
      'Đã xác nh?n': 'Đã xác nhận', 'Đã nh?n hàng': 'Đã nhận hàng',
      'Da nhan hang': 'Đã nhận hàng', 'Đã h?y': 'Đã hủy', 'Da huy': 'Đã hủy',
    }
    return map[s] || s
  }

  const statusColors = {
    'Chờ xác nhận': 'bg-amber-50 text-amber-700 border-amber-200',
    'Đã xác nhận': 'bg-blue-50 text-blue-700 border-blue-200',
    'Đang giao hàng': 'bg-purple-50 text-purple-700 border-purple-200',
    'Đã nhận hàng': 'bg-green-50 text-green-700 border-green-200',
    'Đã hủy': 'bg-red-50 text-red-700 border-red-200',
  }

  if (loading) {
    return <div className="flex justify-center py-24"><div className="spinner" /></div>
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaBox className="text-xs" />
            <span>Đơn hàng</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Đơn hàng của tôi</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-4xl">
        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-premium py-3 rounded-xl max-w-[260px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao hàng">Đang giao hàng</option>
            <option value="Đã nhận hàng">Đã nhận hàng</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        {donHangs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-[var(--shadow-sm)] border border-gray-100/60">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaBox className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-500 text-lg font-semibold mb-2">Chưa có đơn hàng nào</p>
            <p className="text-gray-400 text-sm">Hãy bắt đầu mua sắm cây cảnh!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donHangs.map((dh) => (
              <div
                key={dh.don_hang_id}
                className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60 hover:shadow-[var(--shadow-md)] transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/don-hang/${dh.don_hang_id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-base font-heading font-bold text-gray-800">
                    Đơn hàng #{dh.don_hang_id}
                  </h5>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[normalizeStatus(dh.trang_thai)] || 'bg-gray-50 text-gray-600'}`}>
                    {normalizeStatus(dh.trang_thai)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-400 text-xs">Ngày đặt</span>
                    <p className="text-gray-700 font-medium mt-0.5">{formatDate(dh.ngay_dat)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Tổng tiền</span>
                    <p className="text-primary-600 font-bold font-heading mt-0.5">{formatPrice(dh.tong_tien)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Số sản phẩm</span>
                    <p className="text-gray-700 font-medium mt-0.5">{dh.so_san_pham}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end text-primary-600 text-sm font-medium group-hover:gap-2 gap-1 transition-all duration-300">
                  Xem chi tiết <FaChevronRight className="text-[10px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonHangCuaToi
