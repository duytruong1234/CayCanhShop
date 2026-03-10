import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './DonHang.css'

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
        cayCanhId: null,
        tenCay: '',
        soSao: 5,
        noiDung: '',
        hinhAnh: null
    })

    useEffect(() => {
        fetchDonHang()
    }, [id])

    const fetchDonHang = async () => {
        try {
            const res = await api.get(`/don-hang/${id}`)
            setDonHang(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching order:', error)
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    const getStatusClass = (status) => {
        const statusMap = {
            'Chờ xác nhận': 'status-pending',
            'Đã xác nhận': 'status-confirmed',
            'Đang giao hàng': 'status-shipping',
            'Đã nhận hàng': 'status-completed',
            'Đã hủy': 'status-cancelled'
        }
        return statusMap[status] || ''
    }

    const handleHuyDon = async () => {
        const reason = cancelReason === 'Khác' ? cancelReasonOther : cancelReason

        try {
            await api.post(`/don-hang/${id}/huy`, { ly_do: reason })
            alert('Hủy đơn thành công!')
            setShowCancelModal(false)
            fetchDonHang()
        } catch (error) {
            alert(error.response?.data?.detail || 'Không thể hủy đơn hàng')
        }
    }

    const handleDaNhanHang = async () => {
        try {
            await api.post(`/don-hang/${id}/da-nhan`)
            alert('Bạn đã xác nhận nhận hàng!')
            fetchDonHang()
        } catch (error) {
            alert(error.response?.data?.detail || 'Có lỗi xảy ra')
        }
    }

    const openDanhGiaModal = (cayCanhId, tenCay) => {
        setDanhGiaData({
            cayCanhId,
            tenCay,
            soSao: 5,
            noiDung: '',
            hinhAnh: null
        })
        setShowDanhGiaModal(true)
    }

    const handleSubmitDanhGia = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', danhGiaData.cayCanhId)
        formData.append('don_hang_id', id)
        formData.append('so_sao', danhGiaData.soSao)
        formData.append('noi_dung', danhGiaData.noiDung)
        if (danhGiaData.hinhAnh) {
            formData.append('hinh_anh', danhGiaData.hinhAnh)
        }

        try {
            await api.post('/binh-luan/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('Đánh giá thành công!')
            setShowDanhGiaModal(false)
            fetchDonHang()
        } catch (error) {
            alert(error.response?.data?.detail || 'Không thể đánh giá')
        }
    }

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    if (!donHang) {
        return <div className="loading">Không tìm thấy đơn hàng</div>
    }

    return (
        <div className="order-detail">
            {/* TIÊU ĐỀ */}
            <div className="top-title">
                <h2>Đơn hàng #{donHang.don_hang_id}</h2>
                <span className={`status-badge ${getStatusClass(donHang.trang_thai)}`}>
                    {donHang.trang_thai}
                </span>
            </div>

            {/* THÔNG TIN CHUNG */}
            <div className="section">
                <h4>Thông tin đơn hàng</h4>
                <p><b>Ngày đặt:</b> {formatDate(donHang.ngay_dat)}</p>
                {donHang.ngay_giao_hang && <p><b>Ngày giao:</b> {formatDate(donHang.ngay_giao_hang)}</p>}
                {donHang.ngay_hoan_thanh && <p><b>Hoàn thành:</b> {formatDate(donHang.ngay_hoan_thanh)}</p>}
                {donHang.ngay_huy && <p><b>Ngày hủy:</b> {formatDate(donHang.ngay_huy)}</p>}
            </div>

            {/* THÔNG TIN GIAO HÀNG */}
            <div className="section">
                <h4>Thông tin giao hàng</h4>
                <p><b>Người nhận:</b> {donHang.ten_nguoi_nhan}</p>
                <p><b>Số điện thoại:</b> {donHang.sdt_nguoi_nhan}</p>
                <p><b>Địa chỉ:</b> {donHang.dia_chi_giao_hang}</p>
                <p><b>Thanh toán:</b> {donHang.phuong_thuc_thanh_toan}</p>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="section">
                <h4>Sản phẩm trong đơn</h4>

                {donHang.chi_tiets?.map((ct) => (
                    <div key={ct.ct_don_hang_id} className="product-item">
                        <img
                            src={`${API_URL}/static/images/${ct.hinh_anh}`}
                            alt={ct.ten_cay}
                            className="product-thumb"
                        />

                        <div className="product-info">
                            <p className="name">{ct.ten_cay}</p>
                            <p className="qty">Số lượng: {ct.so_luong}</p>
                            <p className="price">{formatPrice(ct.don_gia)}</p>
                        </div>

                        <div className="product-right">
                            <div className="product-total">{formatPrice(ct.thanh_tien)}</div>

                            {donHang.trang_thai === 'Đã nhận hàng' && (
                                <div className="product-action">
                                    <button
                                        className="btn-review"
                                        onClick={() => openDanhGiaModal(ct.cay_canh_id, ct.ten_cay)}
                                    >
                                        Đánh giá
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* TỔNG TIỀN */}
            <div className="section total-box">
                <div className="total-row">
                    <span>Tổng tiền:</span>
                    <span className="total">{formatPrice(donHang.tong_tien)}</span>
                </div>
            </div>

            {/* GHI CHÚ */}
            {donHang.ghi_chu && (
                <div className="section">
                    <h4>Ghi chú</h4>
                    <p>{donHang.ghi_chu}</p>
                </div>
            )}

            {/* BUTTON */}
            <div className="bottom-actions">
                {(donHang.trang_thai === 'Chờ xác nhận' || donHang.trang_thai === 'Đã xác nhận') && (
                    <>
                        <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn btn-zalo">
                            Liên hệ shop
                        </a>
                        <button onClick={() => setShowCancelModal(true)} className="btn btn-cancel-order">
                            Hủy đơn
                        </button>
                    </>
                )}

                {donHang.trang_thai === 'Đang giao hàng' && (
                    <>
                        <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn btn-zalo">
                            Chat với shop
                        </a>
                        <button onClick={handleDaNhanHang} className="btn btn-success">
                            Tôi đã nhận hàng
                        </button>
                    </>
                )}

                {donHang.trang_thai === 'Đã nhận hàng' && (
                    <button className="btn btn-rebuy" onClick={() => navigate('/')}>
                        Tiếp tục mua sắm
                    </button>
                )}

                {donHang.trang_thai === 'Đã hủy' && (
                    <>
                        <p className="cancel-note">
                            Đơn hàng đã được hủy. Nếu có thắc mắc vui lòng liên hệ shop.
                        </p>
                        <a href="https://zalo.me/0944368230" target="_blank" rel="noreferrer" className="btn btn-zalo">
                            Chat với shop
                        </a>
                    </>
                )}
            </div>

            {/* MODAL HỦY ĐƠN */}
            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h4>Lý do hủy đơn</h4>

                        <select
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="form-select"
                        >
                            <option value="Đổi ý không mua nữa">Đổi ý không mua nữa</option>
                            <option value="Thời gian giao hàng quá lâu">Thời gian giao hàng quá lâu</option>
                            <option value="Muốn thay đổi sản phẩm">Muốn thay đổi sản phẩm</option>
                            <option value="Khác">Khác...</option>
                        </select>

                        {cancelReason === 'Khác' && (
                            <textarea
                                value={cancelReasonOther}
                                onChange={(e) => setCancelReasonOther(e.target.value)}
                                className="form-textarea"
                                placeholder="Nhập lý do khác..."
                            />
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setShowCancelModal(false)} className="btn-modal-cancel">
                                Đóng
                            </button>
                            <button onClick={handleHuyDon} className="btn-modal-confirm">
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ĐÁNH GIÁ */}
            {showDanhGiaModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h4>Đánh giá: {danhGiaData.tenCay}</h4>

                        <label>Đánh giá sao</label>
                        <select
                            value={danhGiaData.soSao}
                            onChange={(e) => setDanhGiaData(prev => ({ ...prev, soSao: parseInt(e.target.value) }))}
                            className="form-select"
                        >
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>
                        </select>

                        <label>Nội dung đánh giá</label>
                        <textarea
                            value={danhGiaData.noiDung}
                            onChange={(e) => setDanhGiaData(prev => ({ ...prev, noiDung: e.target.value }))}
                            className="form-textarea"
                            rows="4"
                            placeholder="Nhận xét sản phẩm..."
                        />

                        <label>Hình ảnh</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setDanhGiaData(prev => ({ ...prev, hinhAnh: e.target.files[0] }))}
                            className="form-input"
                        />

                        <div className="modal-actions">
                            <button onClick={() => setShowDanhGiaModal(false)} className="btn-modal-cancel">
                                Hủy
                            </button>
                            <button onClick={handleSubmitDanhGia} className="btn-modal-success">
                                Gửi đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DonHangChiTiet
