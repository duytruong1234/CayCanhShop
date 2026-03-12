import { useState, useEffect } from 'react'
import { FaEye, FaCheck, FaTruck, FaTimes, FaShoppingBag } from 'react-icons/fa'
import api from '../../../services/api'

const AdminDonHang = () => {
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({ tong_don: 0, don_thanh_cong: 0, doanh_thu: 0 })
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => { fetchStats(); fetchOrders() }, [filterStatus])

    const fetchStats = async () => {
        try { const res = await api.get('/admin/don-hang/stats'); setStats(res.data) }
        catch (error) { console.error('Error stats:', error) }
    }

    const fetchOrders = async () => {
        setLoading(true)
        try { const res = await api.get('/admin/don-hang/', { params: { trang_thai: filterStatus } }); setOrders(res.data) }
        catch (error) { console.error('Error orders:', error) }
        finally { setLoading(false) }
    }

    const handleOpenDetail = async (id) => {
        try { const res = await api.get(`/admin/don-hang/${id}`); setSelectedOrder(res.data); setShowModal(true) }
        catch { alert('Không thể tải chi tiết đơn hàng') }
    }

    const handleUpdateStatus = async (action) => {
        if (!selectedOrder || !window.confirm('Bạn có chắc muốn cập nhật trạng thái này?')) return
        try {
            await api.post(`/admin/don-hang/${selectedOrder.don_hang_id}/status`, null, { params: { status: action } })
            alert('Cập nhật thành công!')
            setShowModal(false); fetchStats(); fetchOrders()
        } catch (error) { alert(error.response?.data?.detail || 'Lỗi cập nhật') }
    }

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' đ'

    // Normalize corrupted Vietnamese status from SQL Server VARCHAR column
    const normalizeStatus = (s) => {
        if (!s) return s
        const map = {
            'Ch? xác nh?n': 'Chờ xác nhận',
            'Cho xac nhan': 'Chờ xác nhận',
            'Đã xác nh?n': 'Đã xác nhận',
            'Đang giao hàng': 'Đang giao hàng',
            'Đã nh?n hàng': 'Đã nhận hàng',
            'Da nhan hang': 'Đã nhận hàng',
            'Đã h?y': 'Đã hủy',
            'Da huy': 'Đã hủy',
        }
        return map[s] || s
    }

    const getStatusBadge = (status) => {
        const ns = normalizeStatus(status)
        const map = {
            'Chờ xác nhận': 'admin-badge-yellow',
            'Đã xác nhận': 'admin-badge-orange',
            'Đang giao hàng': 'admin-badge-purple',
            'Đã nhận hàng': 'admin-badge-green',
            'Đã hủy': 'admin-badge-red'
        }
        return `admin-badge ${map[ns] || 'admin-badge-gray'}`
    }


    const statCards = [
        { label: 'Tổng đơn', value: stats.tong_don, color: 'bg-blue-50 text-blue-600', icon: FaShoppingBag },
        { label: 'Thành công', value: stats.don_thanh_cong, color: 'bg-emerald-50 text-emerald-600', icon: FaCheck },
        { label: 'Doanh thu', value: formatPrice(stats.doanh_thu), color: 'bg-amber-50 text-amber-600', icon: FaTruck },
    ]

    const filters = ['all', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Đã nhận hàng', 'Đã hủy']

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header"><h1>Quản lý đơn hàng</h1></div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statCards.map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className={`admin-stat-icon ${s.color}`}><s.icon size={18} /></div>
                        <div>
                            <p className="label">{s.label}</p>
                            <p className="value text-lg">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="admin-filters">
                {filters.map(st => (
                    <button key={st} className={`admin-filter-pill ${filterStatus === st ? 'active' : ''}`} onClick={() => setFilterStatus(st)}>
                        {st === 'all' ? 'Tất cả' : st}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
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
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">Đang tải...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">Không có đơn hàng nào</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.don_hang_id}>
                                <td className="font-medium">#{order.don_hang_id}</td>
                                <td>
                                    <div className="font-semibold text-sm">{order.ten_nguoi_nhan}</div>
                                    <div className="text-xs text-gray-400">{order.sdt_nguoi_nhan}</div>
                                </td>
                                <td className="text-sm">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</td>
                                <td className="font-semibold text-primary-600">{formatPrice(order.tong_tien)}</td>
                                <td><span className={getStatusBadge(order.trang_thai)}>{normalizeStatus(order.trang_thai)}</span></td>
                                <td>
                                    <button className="admin-btn admin-btn-sm admin-btn-info" onClick={() => handleOpenDetail(order.don_hang_id)}>
                                        <FaEye size={11} /> Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && selectedOrder && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Chi tiết đơn hàng #{selectedOrder.don_hang_id}</h3>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
                                <div className="space-y-2">
                                    <p><span className="text-gray-400">Người nhận:</span> <strong>{selectedOrder.ten_nguoi_nhan}</strong></p>
                                    <p><span className="text-gray-400">SĐT:</span> <strong>{selectedOrder.sdt_nguoi_nhan}</strong></p>
                                    <p><span className="text-gray-400">Địa chỉ:</span> <strong>{selectedOrder.dia_chi_giao_hang}</strong></p>
                                    <p><span className="text-gray-400">Thanh toán:</span> <strong>{selectedOrder.phuong_thuc_thanh_toan}</strong></p>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="text-gray-400">Ngày đặt:</span> <strong>{new Date(selectedOrder.ngay_dat).toLocaleString('vi-VN')}</strong></p>
                                    <p><span className="text-gray-400">Trạng thái:</span> <span className={getStatusBadge(selectedOrder.trang_thai)}>{normalizeStatus(selectedOrder.trang_thai)}</span></p>
                                    <p><span className="text-gray-400">Tài khoản:</span> <strong>{selectedOrder.ten_user || 'Khách vãng lai'}</strong></p>
                                    {selectedOrder.ghi_chu && <p><span className="text-gray-400">Ghi chú:</span> <strong>{selectedOrder.ghi_chu}</strong></p>}
                                </div>
                            </div>

                            <h4 className="font-bold text-sm mb-3 text-gray-800">Sản phẩm</h4>
                            <div className="admin-table-wrap mb-4">
                                <table className="admin-table">
                                    <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                                    <tbody>
                                        {selectedOrder.chi_tiets.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="font-medium">{item.ten_cay}</td>
                                                <td>{item.so_luong}</td>
                                                <td>{formatPrice(item.don_gia)}</td>
                                                <td className="font-semibold">{formatPrice(item.thanh_tien)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end items-center gap-2 mb-4">
                                <span className="text-sm text-gray-500">Tổng cộng:</span>
                                <span className="text-lg font-bold text-primary-600">{formatPrice(selectedOrder.tong_tien)}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                {normalizeStatus(selectedOrder.trang_thai) === 'Chờ xác nhận' && (
                                    <>
                                        <button className="admin-btn admin-btn-primary" onClick={() => handleUpdateStatus('xac-nhan')}><FaCheck size={12} /> Xác nhận đơn</button>
                                        <button className="admin-btn admin-btn-delete" onClick={() => handleUpdateStatus('huy')}><FaTimes size={12} /> Hủy đơn</button>
                                    </>
                                )}
                                {normalizeStatus(selectedOrder.trang_thai) === 'Đã xác nhận' && (
                                    <button className="admin-btn admin-btn-info" onClick={() => handleUpdateStatus('giao-hang')}><FaTruck size={12} /> Giao hàng</button>
                                )}
                                {normalizeStatus(selectedOrder.trang_thai) === 'Đang giao hàng' && (
                                    <>
                                        <button className="admin-btn admin-btn-primary" onClick={() => handleUpdateStatus('hoan-thanh')}><FaCheck size={12} /> Đã giao (Hoàn tất)</button>
                                        <button className="admin-btn admin-btn-delete" onClick={() => handleUpdateStatus('huy')}><FaTimes size={12} /> Hủy (Giao thất bại)</button>
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
