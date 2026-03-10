import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './DatHang.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DatHang = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [gioHang, setGioHang] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddressPopup, setShowAddressPopup] = useState(false)
    const [showPaymentPopup, setShowPaymentPopup] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        tenKH: '',
        sdtKH: '',
        soNha: '',
        xa: '',
        huyen: '',
        tinh: '',
        phuongThuc: 'Chưa chọn'
    })

    useEffect(() => {
        fetchGioHang()
    }, [])

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

        if (phuongThuc === 'Chưa chọn') {
            alert('Vui lòng chọn phương thức thanh toán!')
            return
        }

        if (!tenKH || !sdtKH || !soNha || !xa || !huyen || !tinh) {
            alert('Vui lòng nhập đầy đủ thông tin giao hàng!')
            return
        }

        const diaChiGiaoHang = `${soNha}, ${xa}, ${huyen}, ${tinh}`

        try {
            await api.post('/don-hang/dat-hang', {
                ten_nguoi_nhan: tenKH,
                sdt_nguoi_nhan: sdtKH,
                dia_chi_giao_hang: diaChiGiaoHang,
                phuong_thuc_thanh_toan: phuongThuc,
                ghi_chu: ''
            })

            alert('Đơn hàng đã đặt và đang chờ xác nhận!')
            navigate('/')
        } catch (error) {
            console.error('Error placing order:', error)
            alert(error.response?.data?.detail || 'Đã có lỗi xảy ra')
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    const getFullAddress = () => {
        const { soNha, xa, huyen, tinh } = formData
        if (soNha && xa && huyen && tinh) {
            return `${soNha}, ${xa}, ${huyen}, ${tinh}`
        }
        return '.......................................'
    }

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    return (
        <div className="dat-hang-container">
            <h1 className="title">Thanh toán</h1>

            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="box">
                <div className="customer-info">
                    <p><strong>Tên khách hàng:</strong> <span>{formData.tenKH || '.......................................'}</span></p>
                    <p><strong>Số điện thoại:</strong> <span>{formData.sdtKH || '.......................................'}</span></p>
                    <p><strong>Địa chỉ giao hàng:</strong> <span>{getFullAddress()}</span></p>
                </div>

                <div className="right-btn">
                    <button className="btn-custom" onClick={() => setShowAddressPopup(true)}>
                        Nhập địa chỉ giao hàng
                    </button>
                </div>
            </div>

            {/* DANH SÁCH ĐƠN HÀNG */}
            <h1 className="title">Đơn hàng của bạn</h1>

            <div id="orderList">
                {gioHang?.chi_tiets?.map((item) => (
                    <div key={item.ghct_id} className="box order-box">
                        <div className="order-left">
                            <img
                                src={`${API_URL}/static/images/${item.hinh_anh}`}
                                alt={item.ten_cay}
                                className="product-img"
                            />
                        </div>

                        <div className="order-right">
                            <p><strong>Tên hàng hóa:</strong> {item.ten_cay}</p>
                            <p><strong>Số lượng:</strong> {item.so_luong}</p>
                            <p><strong>Đơn giá:</strong> {formatPrice(item.don_gia)}</p>
                            <p><strong>Thành tiền:</strong> {formatPrice(item.thanh_tien)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <p className="payment-label">
                <strong>Phương thức thanh toán:</strong>
                <span id="phuongThuc">{formData.phuongThuc}</span>
            </p>

            <div className="payment-method-box">
                <button className="btn-custom" onClick={() => setShowPaymentPopup(true)}>
                    Chọn phương thức thanh toán
                </button>
            </div>

            {/* TỔNG TIỀN */}
            <div className="box total-box">
                <div className="total-flex">
                    <p className="total-text">Tổng cộng: {formatPrice(gioHang?.tong_tien || 0)}</p>
                    <button className="btn-custom" onClick={handleDatHang}>Đặt hàng</button>
                </div>
            </div>

            {/* POPUP NHẬP ĐỊA CHỈ */}
            {showAddressPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Nhập thông tin giao hàng</h2>

                        <label>Họ tên:</label>
                        <input
                            type="text"
                            name="tenKH"
                            value={formData.tenKH}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            name="sdtKH"
                            value={formData.sdtKH}
                            onChange={handleInputChange}
                            className="popup-input"
                            maxLength="10"
                            placeholder="VD: 0912345678"
                        />

                        <label>Số nhà / Đường:</label>
                        <input
                            type="text"
                            name="soNha"
                            value={formData.soNha}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <label>Xã / Phường:</label>
                        <input
                            type="text"
                            name="xa"
                            value={formData.xa}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <label>Huyện / Quận:</label>
                        <input
                            type="text"
                            name="huyen"
                            value={formData.huyen}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <label>Tỉnh / Thành phố:</label>
                        <input
                            type="text"
                            name="tinh"
                            value={formData.tinh}
                            onChange={handleInputChange}
                            className="popup-input"
                        />

                        <div className="popup-btn-group">
                            <button className="btn-cancel" onClick={() => setShowAddressPopup(false)}>
                                Hủy
                            </button>
                            <button className="btn-save" onClick={saveAddress}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP PHƯƠNG THỨC THANH TOÁN */}
            {showPaymentPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Chọn phương thức thanh toán</h2>

                        <div className="payment-option" onClick={() => selectPayment('COD')}>
                            Thanh toán khi nhận hàng (COD)
                        </div>

                        <div className="payment-option" onClick={() => selectPayment('Chuyển khoản')}>
                            Chuyển khoản ngân hàng
                        </div>

                        <div className="popup-btn-group">
                            <button className="btn-cancel" onClick={() => setShowPaymentPopup(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DatHang
