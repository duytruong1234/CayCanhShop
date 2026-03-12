import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaTimes } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DatHang = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [gioHang, setGioHang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddressPopup, setShowAddressPopup] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)

  const [formData, setFormData] = useState({
    tenKH: '', sdtKH: '', soNha: '', xa: '', huyen: '', tinh: '', phuongThuc: 'Chưa chọn'
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const saveAddress = () => {
    const { tenKH, sdtKH, soNha, xa, huyen, tinh } = formData
    if (!tenKH || !sdtKH || !soNha || !xa || !huyen || !tinh) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(sdtKH)) {
      alert('Số điện thoại phải gồm 10 số và bắt đầu bằng 0!')
      return
    }
    setShowAddressPopup(false)
  }

  const selectPayment = (method) => {
    setFormData(prev => ({ ...prev, phuongThuc: method }))
    setShowPaymentPopup(false)
  }

  const handleDatHang = async () => {
    const { tenKH, sdtKH, soNha, xa, huyen, tinh, phuongThuc } = formData
    if (phuongThuc === 'Chưa chọn') { alert('Vui lòng chọn phương thức thanh toán!'); return }
    if (!tenKH || !sdtKH || !soNha || !xa || !huyen || !tinh) { alert('Vui lòng nhập đầy đủ thông tin giao hàng!'); return }

    const diaChiGiaoHang = `${soNha}, ${xa}, ${huyen}, ${tinh}`
    try {
      await api.post('/don-hang/dat-hang', {
        ten_nguoi_nhan: tenKH, sdt_nguoi_nhan: sdtKH,
        dia_chi_giao_hang: diaChiGiaoHang, phuong_thuc_thanh_toan: phuongThuc, ghi_chu: ''
      })
      alert('Đơn hàng đã đặt và đang chờ xác nhận!')
      navigate('/')
    } catch (error) {
      console.error('Error placing order:', error)
      alert(error.response?.data?.detail || 'Đã có lỗi xảy ra')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'

  const getFullAddress = () => {
    const { soNha, xa, huyen, tinh } = formData
    return (soNha && xa && huyen && tinh) ? `${soNha}, ${xa}, ${huyen}, ${tinh}` : null
  }

  if (loading) {
    return <div className="flex justify-center py-24"><div className="spinner" /></div>
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaCreditCard className="text-xs" />
            <span>Thanh toán</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Thanh toán</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 border border-gray-100/60">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-primary-500 text-xs" />
                  </div>
                  Thông tin giao hàng
                </h3>
                <button
                  className="btn-premium btn-secondary text-xs py-2 px-4"
                  onClick={() => setShowAddressPopup(true)}
                >
                  {getFullAddress() ? 'Sửa' : 'Nhập địa chỉ'}
                </button>
              </div>

              {getFullAddress() ? (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700"><span className="font-medium text-gray-500 w-32 inline-block">Tên:</span> {formData.tenKH}</p>
                  <p className="text-gray-700"><span className="font-medium text-gray-500 w-32 inline-block">SĐT:</span> {formData.sdtKH}</p>
                  <p className="text-gray-700"><span className="font-medium text-gray-500 w-32 inline-block">Địa chỉ:</span> {getFullAddress()}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Chưa nhập thông tin giao hàng</p>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 border border-gray-100/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-blue-500 text-xs" />
                  </div>
                  Phương thức thanh toán
                </h3>
                <button
                  className="btn-premium btn-secondary text-xs py-2 px-4"
                  onClick={() => setShowPaymentPopup(true)}
                >
                  Chọn
                </button>
              </div>
              <p className={`text-sm ${formData.phuongThuc === 'Chưa chọn' ? 'text-gray-400 italic' : 'text-gray-700 font-medium'}`}>
                {formData.phuongThuc === 'Chưa chọn' ? 'Chưa chọn phương thức' : formData.phuongThuc}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 border border-gray-100/60">
              <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="text-amber-500 text-xs" />
                </div>
                Đơn hàng
              </h3>
              <div className="space-y-3">
                {gioHang?.chi_tiets?.map((item) => (
                  <div key={item.ghct_id} className="flex items-center gap-4 p-3 bg-gray-50/60 rounded-xl">
                    <img src={`${API_URL}/static/images/${item.hinh_anh}`} alt={item.ten_cay} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate">{item.ten_cay}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">SL: {item.so_luong} × {formatPrice(item.don_gia)}</p>
                    </div>
                    <p className="font-bold text-primary-600 text-sm font-heading flex-shrink-0">{formatPrice(item.thanh_tien)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 border border-gray-100/60 sticky top-24">
              <h3 className="font-heading font-bold text-gray-800 mb-5">Tổng cộng</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="text-gray-700">{formatPrice(gioHang?.tong_tien || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí giao hàng</span>
                  <span className="text-primary-600 font-medium">Miễn phí</span>
                </div>
                <div className="h-px bg-gray-100 my-3" />
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-heading font-extrabold text-primary-600">{formatPrice(gioHang?.tong_tien || 0)}</span>
                </div>
              </div>
              <button className="btn-premium btn-primary w-full py-4 text-base shadow-lg hover:shadow-xl" onClick={handleDatHang}>
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Popup */}
      {showAddressPopup && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-800">Thông tin giao hàng</h3>
              <button onClick={() => setShowAddressPopup(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Họ tên', name: 'tenKH', placeholder: 'Nguyễn Văn A' },
                { label: 'Số điện thoại', name: 'sdtKH', placeholder: '0912345678', maxLength: '10' },
                { label: 'Số nhà / Đường', name: 'soNha', placeholder: '123 Nguyễn Văn Cừ' },
                { label: 'Xã / Phường', name: 'xa', placeholder: 'Phường 1' },
                { label: 'Huyện / Quận', name: 'huyen', placeholder: 'Quận 5' },
                { label: 'Tỉnh / Thành phố', name: 'tinh', placeholder: 'TP.HCM' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]} onChange={handleInputChange} className="input-premium py-3 rounded-xl" placeholder={field.placeholder} maxLength={field.maxLength} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-premium btn-ghost text-sm" onClick={() => setShowAddressPopup(false)}>Hủy</button>
              <button className="btn-premium btn-primary text-sm py-2.5 px-6" onClick={saveAddress}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-800">Phương thức thanh toán</h3>
              <button onClick={() => setShowPaymentPopup(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><FaTimes /></button>
            </div>
            <div className="space-y-3">
              {[
                { method: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
                { method: 'Chuyển khoản', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
              ].map((opt) => (
                <button
                  key={opt.method}
                  onClick={() => selectPayment(opt.method)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left text-sm font-medium ${
                    formData.phuongThuc === opt.method
                      ? 'border-primary-400 bg-primary-50/50 text-primary-700'
                      : 'border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatHang
