import { useState, useEffect } from 'react'
import api from '../../../services/api'
import './AdminDonHang.css'

const AdminDonHang = () => {
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({ tong_don: 0, don_thanh_cong: 0, doanh_thu: 0 })
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchStats()
        fetchOrders()
    }, [filterStatus])

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/don-hang/stats')
            setStats(res.data)
        } catch (error) {
            console.error('Error stats:', error)
        }
    }

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/don-hang/', { params: { trang_thai: filterStatus } })
            setOrders(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error orders:', error)
            setLoading(false)
        }
    }

    const handleOpenDetail = async (id) => {
        try {
            const res = await api.get(`/admin/don-hang/${id}`)
            setSelectedOrder(res.data)
            setShowModal(true)
        } catch (error) {
            alert('Không thể tải chi tiết đơn hàng')
        }
    }

    const handleUpdateStatus = async (action) => {
        if (!selectedOrder) return
        if (!window.confirm('Bạn có chắc muốn cập nhật trạng thái này?')) return

        try {
            await api.post(`/admin/don-hang/${selectedOrder.don_hang_id}/status`, null, {
                params: { status: action }
            })
            alert('Cập nhật thành công!')
            setShowModal(false)
            fetchStats()
            fetchOrders()
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi cập nhật')
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    const getStatusClass = (status) => {
        const map = {
            'Chờ xác nhận': 'badge-yellow',
            'Đã xác nhận': 'badge-orange',
            'Đang giao hàng': 'badge-purple',
            'Đã nhận hàng': 'badge-green',
            'Đã hủy': 'badge-red'
        }
        return map[status] || 'badge-gray'
    }

    return (
        <div className="admin-donhang">
            <h2 className="page-title">Quản lý đơn hàng</h2>

            {/* THỐNG KÊ */}
            <div className="stats-row">
                <div className="stat-card">
                    <p>Tổng đơn hàng</p>
                    <h3>{stats.tong_don}</h3>
                </div>
                <div className="stat-card">
                    <p>Đơn thành công</p>
                    <h3>{stats.don_thanh_cong}</h3>
                </div>
                <div className="stat-card">
                    <p>Tổng doanh thu</p>
                    <h3 className="money">{formatPrice(stats.doanh_thu)}</h3>
                </div>
            </div>

            {/* BỘ LỌC */}
            <div className="filter-row">
                {['all', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Đã nhận hàng', 'Đã hủy'].map(st => (
                    <button
                        key={st}
                        className={`filter-btn ${filterStatus === st ? 'active' : ''}`}
                        onClick={() => setFilterStatus(st)}
                    >
                        {st === 'all' ? 'Tất cả' : st}
                    </button>
                ))}
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Đang tải...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">Không có đơn hàng nào</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.don_hang_id}>
                                    <td>#{order.don_hang_id}</td>
                                    <td>
                                        <div className="user-info">
                                            <b>{order.ten_nguoi_nhan}</b>
                                            <span>{order.sdt_nguoi_nhan}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</td>
                                    <td className="price-text">{formatPrice(order.tong_tien)}</td>
                                    <td>
                                        <span className={`badge ${getStatusClass(order.trang_thai)}`}>
                                            {order.trang_thai}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-detail" onClick={() => handleOpenDetail(order.don_hang_id)}>
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL CHI TIẾT */}
            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-box large-modal">
                        <div className="modal-header">
                            <h4>Chi tiết đơn hàng #{selectedOrder.don_hang_id}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="info-grid">
                                <div>
                                    <p><b>Người nhận:</b> {selectedOrder.ten_nguoi_nhan}</p>
                                    <p><b>SĐT:</b> {selectedOrder.sdt_nguoi_nhan}</p>
                                    <p><b>Địa chỉ:</b> {selectedOrder.dia_chi_giao_hang}</p>
                                    <p><b>Thanh toán:</b> {selectedOrder.phuong_thuc_thanh_toan}</p>
                                    <p><b>Tài khoản:</b> {selectedOrder.ten_user || 'Khách vãng lai'}</p>
                                </div>
                                <div>
                                    <p><b>Ngày đặt:</b> {new Date(selectedOrder.ngay_dat).toLocaleString('vi-VN')}</p>
                                    <p><b>Trạng thái:</b> <span className={`badge ${getStatusClass(selectedOrder.trang_thai)}`}>{selectedOrder.trang_thai}</span></p>
                                    <p><b>Ghi chú:</b> {selectedOrder.ghi_chu || 'Không'}</p>
                                </div>
                            </div>

                            <h5 className="mt-3">Sản phẩm</h5>
                            <table className="sub-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>SL</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.chi_tiets.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.ten_cay}</td>
                                            <td>{item.so_luong}</td>
                                            <td>{formatPrice(item.don_gia)}</td>
                                            <td>{formatPrice(item.thanh_tien)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="total-row">
                                <b>Tổng cộng: </b> <span className="price-text">{formatPrice(selectedOrder.tong_tien)}</span>
                            </div>

                            <div className="action-row">
                                {selectedOrder.trang_thai === 'Chờ xác nhận' && (
                                    <>
                                        <button className="btn-action confirm" onClick={() => handleUpdateStatus('xac-nhan')}>Xác nhận đơn</button>
                                        <button className="btn-action cancel" onClick={() => handleUpdateStatus('huy')}>Hủy đơn</button>
                                    </>
                                )}
                                {selectedOrder.trang_thai === 'Đã xác nhận' && (
                                    <button className="btn-action ship" onClick={() => handleUpdateStatus('giao-hang')}>Giao hàng</button>
                                )}
                                {selectedOrder.trang_thai === 'Đang giao hàng' && (
                                    <>
                                        <button className="btn-action complete" onClick={() => handleUpdateStatus('hoan-thanh')}>Đã giao hàng (Hoàn tất)</button>
                                        <button className="btn-action cancel" onClick={() => handleUpdateStatus('huy')}>Hủy (Giao thất bại)</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDonHang
