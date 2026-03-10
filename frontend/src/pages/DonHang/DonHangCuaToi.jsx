import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './DonHang.css'

const DonHangCuaToi = () => {
    const navigate = useNavigate()
    const [donHangs, setDonHangs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('')

    useEffect(() => {
        fetchDonHangs()
    }, [filterStatus])

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

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    return (
        <div className="don-hang-container">
            <h2 className="page-title">Đơn hàng của tôi</h2>

            {/* Filter */}
            <div className="filter-box">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
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
                <p className="empty-text">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="order-list">
                    {donHangs.map((dh) => (
                        <div key={dh.don_hang_id} className="order-item">
                            <div className="order-header">
                                <h5>Đơn hàng #{dh.don_hang_id}</h5>
                                <span className={`status-badge ${getStatusClass(dh.trang_thai)}`}>
                                    {dh.trang_thai}
                                </span>
                            </div>

                            <p><b>Ngày đặt:</b> {formatDate(dh.ngay_dat)}</p>
                            <p><b>Tổng tiền:</b> {formatPrice(dh.tong_tien)}</p>
                            <p><b>Số sản phẩm:</b> {dh.so_san_pham}</p>

                            <button
                                className="btn-detail"
                                onClick={() => navigate(`/don-hang/${dh.don_hang_id}`)}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DonHangCuaToi
