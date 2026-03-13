import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaChevronLeft, FaTimes, FaStar } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DonHangChiTiet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [donHang, setDonHang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDanhGiaModal, setShowDanhGiaModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('Đổi ý không mua nữa')
  const [cancelReasonOther, setCancelReasonOther] = useState('')
  const [danhGiaData, setDanhGiaData] = useState({
    cayCanhId: null, tenCay: '', soSao: 5, noiDung: '', hinhAnh: null
  })

  useEffect(() => { fetchDonHang() }, [id])

  const fetchDonHang = async () => {
    try {
      const res = await api.get(`/don-hang/${id}`)
      setDonHang(res.data)
      setLoading(false)
    } catch (error) { console.error('Error fetching order:', error); setLoading(false) }
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

  const statusStyles = {
    'Chờ xác nhận': 'bg-amber-50 text-amber-700 border-amber-200',
    'Đã xác nhận': 'bg-blue-50 text-blue-700 border-blue-200',
    'Đang giao hàng': 'bg-purple-50 text-purple-700 border-purple-200',
    'Đã nhận hàng': 'bg-green-50 text-green-700 border-green-200',
    'Đã hủy': 'bg-red-50 text-red-700 border-red-200',
  }

  const handleHuyDon = async () => {
    const reason = cancelReason === 'Khác' ? cancelReasonOther : cancelReason
    try {
      await api.post(`/don-hang/${id}/huy`, { ly_do: reason })
      alert('Hủy đơn thành công!')
      setShowCancelModal(false)
      fetchDonHang()
    } catch (error) { alert(error.response?.data?.detail || 'Không thể hủy đơn hàng') }
  }

  const handleDaNhanHang = async () => {
    try {
      await api.post(`/don-hang/${id}/da-nhan`)
      alert('Bạn đã xác nhận nhận hàng!')
      fetchDonHang()
    } catch (error) { alert(error.response?.data?.detail || 'Có lỗi xảy ra') }
  }

  const openDanhGiaModal = (cayCanhId, tenCay) => {
    setDanhGiaData({ cayCanhId, tenCay, soSao: 5, noiDung: '', hinhAnh: null })
    setShowDanhGiaModal(true)
  }

  const handleSubmitDanhGia = async () => {
    const formData = new FormData()
    formData.append('cay_canh_id', danhGiaData.cayCanhId)
    formData.append('don_hang_id', id)
    formData.append('so_sao', danhGiaData.soSao)
    formData.append('noi_dung', danhGiaData.noiDung)
    if (danhGiaData.hinhAnh) formData.append('hinh_anh', danhGiaData.hinhAnh)
    try {
      await api.post('/binh-luan/', formData)
      alert('Đánh giá thành công!')
      setShowDanhGiaModal(false)
      fetchDonHang()
    } catch (error) { alert(error.response?.data?.detail || 'Không thể đánh giá') }
  }

  if (loading) return <div className="flex justify-center py-24"><div className="spinner" /></div>
  if (!donHang) return <div className="text-center py-24 text-gray-400">Không tìm thấy đơn hàng</div>

  return (
    <div className="page-enter">
      {/* Back */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100/60">
        <div className="container mx-auto px-4 lg:px-6 py-3.5">
          <button onClick={() => navigate('/don-hang')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors group">
            <FaChevronLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" /> Đơn hàng của tôi
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50/80 to-primary-50/30 rounded-2xl p-5 lg:p-6 flex items-center justify-between mb-6 border border-primary-100/40">
          <h2 className="font-heading font-extrabold text-primary-900 text-xl lg:text-2xl">
            Đơn hàng #{donHang.don_hang_id}
          </h2>
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${statusStyles[normalizeStatus(donHang.trang_thai)] || ''}`}>
            {normalizeStatus(donHang.trang_thai)}
          </span>
        </div>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60">
            <h4 className="font-heading font-bold text-gray-800 text-sm mb-4 pb-3 border-b border-gray-100">Thông tin đơn hàng</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Ngày đặt:</span> <span className="text-gray-700 font-medium ml-1">{formatDate(donHang.ngay_dat)}</span></div>
              {donHang.ngay_giao_hang && <div><span className="text-gray-400">Ngày giao:</span> <span className="text-gray-700 font-medium ml-1">{formatDate(donHang.ngay_giao_hang)}</span></div>}
              {donHang.ngay_hoan_thanh && <div><span className="text-gray-400">Hoàn thành:</span> <span className="text-gray-700 font-medium ml-1">{formatDate(donHang.ngay_hoan_thanh)}</span></div>}
              {donHang.ngay_huy && <div><span className="text-gray-400">Ngày hủy:</span> <span className="text-red-500 font-medium ml-1">{formatDate(donHang.ngay_huy)}</span></div>}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60">
            <h4 className="font-heading font-bold text-gray-800 text-sm mb-4 pb-3 border-b border-gray-100">Thông tin giao hàng</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Người nhận:</span> <span className="text-gray-700 font-medium ml-1">{donHang.ten_nguoi_nhan}</span></div>
              <div><span className="text-gray-400">SĐT:</span> <span className="text-gray-700 font-medium ml-1">{donHang.sdt_nguoi_nhan}</span></div>
              <div className="sm:col-span-2"><span className="text-gray-400">Địa chỉ:</span> <span className="text-gray-700 font-medium ml-1">{donHang.dia_chi_giao_hang}</span></div>
              <div><span className="text-gray-400">Thanh toán:</span> <span className="text-gray-700 font-medium ml-1">{donHang.phuong_thuc_thanh_toan}</span></div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60">
            <h4 className="font-heading font-bold text-gray-800 text-sm mb-4 pb-3 border-b border-gray-100">Sản phẩm trong đơn</h4>
            <div className="space-y-3">
              {donHang.chi_tiets?.map((ct) => (
                <div key={ct.ct_don_hang_id} className="flex items-center gap-4 p-3 bg-gray-50/60 rounded-xl hover:bg-primary-50/20 transition-all">
                  <img src={`${API_URL}/static/images/${ct.hinh_anh}`} alt={ct.ten_cay} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='60' fill='%2322c55e'%3E🌿%3C/text%3E%3Ctext x='200' y='230' text-anchor='middle' font-size='16' fill='%2386efac'%3EKhông có hình ảnh%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{ct.ten_cay}</p>
                    <p className="text-gray-400 text-xs mt-0.5">SL: {ct.so_luong} × {formatPrice(ct.don_gia)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary-700 font-heading">{formatPrice(ct.thanh_tien)}</p>
                    {normalizeStatus(donHang.trang_thai) === 'Đã nhận hàng' && (
                      <button onClick={() => openDanhGiaModal(ct.cay_canh_id, ct.ten_cay)} className="mt-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-all">
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Tổng tiền:</span>
              <span className="text-2xl font-heading font-extrabold text-primary-600">{formatPrice(donHang.tong_tien)}</span>
            </div>
          </div>

          {/* Notes */}
          {donHang.ghi_chu && (
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 lg:p-6 border border-gray-100/60">
              <h4 className="font-heading font-bold text-gray-800 text-sm mb-3">Ghi chú</h4>
              <p className="text-gray-600 text-sm">{donHang.ghi_chu}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {(normalizeStatus(donHang.trang_thai) === 'Chờ xác nhận' || normalizeStatus(donHang.trang_thai) === 'Đã xác nhận') && (
              <>
                <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn-premium text-sm py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
                  Liên hệ shop
                </a>
                <button onClick={() => setShowCancelModal(true)} className="btn-premium text-sm py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]">
                  Hủy đơn
                </button>
              </>
            )}
            {normalizeStatus(donHang.trang_thai) === 'Đang giao hàng' && (
              <>
                <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn-premium text-sm py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
                  Chat với shop
                </a>
                <button onClick={handleDaNhanHang} className="btn-premium btn-primary text-sm py-3 px-6">
                  Tôi đã nhận hàng
                </button>
              </>
            )}
            {normalizeStatus(donHang.trang_thai) === 'Đã nhận hàng' && (
              <button className="btn-premium text-sm py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)]" onClick={() => navigate('/')}>
                Tiếp tục mua sắm
              </button>
            )}
            {normalizeStatus(donHang.trang_thai) === 'Đã hủy' && (
              <>
                <p className="text-red-500 text-sm w-full">Đơn hàng đã được hủy. Nếu có thắc mắc vui lòng liên hệ shop.</p>
                <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn-premium text-sm py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
                  Chat với shop
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-heading font-bold text-gray-800">Lý do hủy đơn</h4>
              <button onClick={() => setShowCancelModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="input-premium py-3 rounded-xl mb-3">
              <option value="Đổi ý không mua nữa">Đổi ý không mua nữa</option>
              <option value="Thời gian giao hàng quá lâu">Thời gian giao hàng quá lâu</option>
              <option value="Muốn thay đổi sản phẩm">Muốn thay đổi sản phẩm</option>
              <option value="Khác">Khác...</option>
            </select>
            {cancelReason === 'Khác' && (
              <textarea value={cancelReasonOther} onChange={(e) => setCancelReasonOther(e.target.value)} className="input-premium py-3 rounded-xl resize-none" rows="3" placeholder="Nhập lý do khác..." />
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button className="btn-premium btn-ghost text-sm" onClick={() => setShowCancelModal(false)}>Đóng</button>
              <button className="btn-premium text-sm py-2.5 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white" onClick={handleHuyDon}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showDanhGiaModal && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-heading font-bold text-gray-800">Đánh giá sản phẩm</h4>
              <button onClick={() => setShowDanhGiaModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Sản phẩm: <span className="font-semibold text-gray-700">{danhGiaData.tenCay}</span></p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Đánh giá sao</label>
                <select value={danhGiaData.soSao} onChange={(e) => setDanhGiaData(prev => ({ ...prev, soSao: parseInt(e.target.value) }))} className="input-premium py-3 rounded-xl">
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nội dung đánh giá</label>
                <textarea value={danhGiaData.noiDung} onChange={(e) => setDanhGiaData(prev => ({ ...prev, noiDung: e.target.value }))} className="input-premium py-3 rounded-xl resize-none" rows="4" placeholder="Nhận xét sản phẩm..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hình ảnh</label>
                <input type="file" accept="image/*" onChange={(e) => setDanhGiaData(prev => ({ ...prev, hinhAnh: e.target.files[0] }))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-premium btn-ghost text-sm" onClick={() => setShowDanhGiaModal(false)}>Hủy</button>
              <button className="btn-premium btn-primary text-sm py-2.5 px-6" onClick={handleSubmitDanhGia}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonHangChiTiet
