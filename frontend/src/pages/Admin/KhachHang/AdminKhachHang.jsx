import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaSearch, FaUsers, FaHistory, FaLeaf } from 'react-icons/fa'
import api from '../../../services/api'
import { ahpService } from '../../../services/ahpService'

const AdminKhachHang = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState({
        ten_dang_nhap: '', mat_khau: '', ho_ten: '', email: '', dien_thoai: '', gioi_tinh: 'Nam', dia_chi: '', vai_tro_id: 2
    })

    // AHP History modal
    const [showAHPModal, setShowAHPModal] = useState(false)
    const [ahpHistory, setAhpHistory] = useState(null)
    const [ahpLoading, setAhpLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => { fetchUsers() }, [])

    const fetchUsers = async () => {
        try { const res = await api.get('/admin/khach-hang/'); setUsers(res.data) }
        catch (error) { console.error(error) }
        finally { setLoading(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return
        try { await api.delete(`/admin/khach-hang/${id}`); alert('Xóa thành công!'); fetchUsers() }
        catch (error) { alert(error.response?.data?.detail || 'Không thể xóa') }
    }

    const handleCreate = async () => {
        try {
            if (!formData.ten_dang_nhap || !formData.mat_khau) { alert('Vui lòng nhập đầy đủ thông tin'); return }
            await api.post('/admin/khach-hang/', formData)
            alert('Thêm tài khoản thành công!')
            setShowAddModal(false); fetchUsers()
            setFormData({ ten_dang_nhap: '', mat_khau: '', ho_ten: '', email: '', dien_thoai: '', gioi_tinh: 'Nam', dia_chi: '', vai_tro_id: 2 })
        } catch (error) { alert(error.response?.data?.detail || 'Lỗi khi thêm') }
    }

    const handleViewAHP = async (user) => {
        setSelectedUser(user)
        setShowAHPModal(true)
        setAhpLoading(true)
        try {
            const data = await ahpService.getAHPHistoryByUser(user.user_id)
            setAhpHistory(data)
        } catch (error) {
            console.error('Lỗi tải lịch sử AHP:', error)
            setAhpHistory({ lich_su: [], tong_so_lan: 0 })
        } finally { setAhpLoading(false) }
    }

    const filteredUsers = users.filter(u =>
        u.ten_dang_nhap.toLowerCase().includes(search.toLowerCase()) ||
        u.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (isoStr) => {
        if (!isoStr) return '—'
        const d = new Date(isoStr)
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1><FaUsers className="inline text-purple-500 mr-2 text-lg" />Quản lý khách hàng</h1>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowAddModal(true)}>
                    <FaPlus size={12} /> Thêm tài khoản
                </button>
            </div>

            {/* Search */}
            <div className="mb-5">
                <div className="relative max-w-sm">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search pl-10 w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên đăng nhập</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">Đang tải...</td></tr>
                        ) : filteredUsers.map(u => (
                            <tr key={u.user_id}>
                                <td className="text-gray-400 text-sm">{u.user_id}</td>
                                <td className="font-semibold">{u.ten_dang_nhap}</td>
                                <td>{u.ho_ten}</td>
                                <td className="text-sm text-gray-500">{u.email}</td>
                                <td>
                                    <span className={`admin-badge ${u.vai_tro_id === 1 ? 'admin-badge-purple' : 'admin-badge-blue'}`}>
                                        {u.ten_vai_tro}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="admin-btn admin-btn-sm"
                                            style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '11px' }}
                                            onClick={() => handleViewAHP(u)}
                                            title="Xem lịch sử đánh giá AHP"
                                        >
                                            <FaHistory size={11} /> AHP
                                        </button>
                                        <button className="admin-btn admin-btn-sm admin-btn-delete" onClick={() => handleDelete(u.user_id)}>
                                            <FaTrash size={11} /> Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Account Modal */}
            {showAddModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Thêm tài khoản mới</h3>
                            <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                {[
                                    { label: 'Tên đăng nhập', key: 'ten_dang_nhap' },
                                    { label: 'Mật khẩu', key: 'mat_khau', type: 'password' },
                                    { label: 'Họ tên', key: 'ho_ten' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Điện thoại', key: 'dien_thoai' },
                                ].map(f => (
                                    <div key={f.key} className="admin-form-group">
                                        <label className="admin-form-label">{f.label}</label>
                                        <input
                                            className="admin-form-input"
                                            type={f.type || 'text'}
                                            value={formData[f.key]}
                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Vai trò</label>
                                    <select className="admin-form-input" value={formData.vai_tro_id} onChange={e => setFormData({ ...formData, vai_tro_id: parseInt(e.target.value) })}>
                                        <option value={2}>Khách hàng</option>
                                        <option value={1}>Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowAddModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleCreate}>Thêm mới</button>
                        </div>
                    </div>
                </div>
            )}

            {/* AHP History Modal */}
            {showAHPModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAHPModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
                        <div className="admin-modal-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaHistory style={{ color: '#16a34a' }} />
                                Lịch sử AHP — {selectedUser?.ho_ten || selectedUser?.ten_dang_nhap}
                            </h3>
                            <button className="admin-modal-close" onClick={() => setShowAHPModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {ahpLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Đang tải...</div>
                            ) : !ahpHistory || ahpHistory.tong_so_lan === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                    <FaLeaf style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3, display: 'inline-block' }} />
                                    <p>Khách hàng này chưa có lịch sử đánh giá AHP</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                        Tổng cộng <strong style={{ color: '#374151' }}>{ahpHistory.tong_so_lan}</strong> lần đánh giá
                                    </div>
                                    {ahpHistory.lich_su.map((item, idx) => (
                                        <div key={idx} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            background: '#fafafa'
                                        }}>
                                            {/* Header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{
                                                    fontSize: '12px', fontWeight: 600,
                                                    background: '#e0f2fe', color: '#0369a1',
                                                    padding: '4px 10px', borderRadius: '8px'
                                                }}>
                                                    Lần {ahpHistory.tong_so_lan - idx}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                    {formatDate(item.ngay_danh_gia)}
                                                </span>
                                            </div>

                                            {/* CR */}
                                            <div style={{ marginBottom: '10px' }}>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 600,
                                                    padding: '3px 8px', borderRadius: '6px',
                                                    background: item.cr_tieu_chi < 0.1 ? '#dcfce7' : '#fef2f2',
                                                    color: item.cr_tieu_chi < 0.1 ? '#16a34a' : '#dc2626'
                                                }}>
                                                    CR = {item.cr_tieu_chi?.toFixed(4)} {item.cr_tieu_chi < 0.1 ? '✓' : '✗'}
                                                </span>
                                            </div>

                                            {/* Trọng số tiêu chí */}
                                            {item.trong_so_tieu_chi && Object.keys(item.trong_so_tieu_chi).length > 0 && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Trọng số tiêu chí:</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {Object.entries(item.trong_so_tieu_chi).map(([key, val]) => (
                                                            <span key={key} style={{
                                                                fontSize: '11px', padding: '3px 8px',
                                                                background: '#f3f4f6', borderRadius: '6px',
                                                                color: '#374151'
                                                            }}>
                                                                {key}: <strong>{(val * 100).toFixed(1)}%</strong>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Top 3 kết quả */}
                                            {item.ket_qua && item.ket_qua.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Top kết quả:</div>
                                                    {item.ket_qua.slice(0, 3).map((plant, pIdx) => (
                                                        <div key={pIdx} style={{
                                                            display: 'flex', alignItems: 'center', gap: '8px',
                                                            padding: '6px 10px', borderRadius: '8px',
                                                            background: pIdx === 0 ? '#fffbeb' : 'transparent',
                                                            border: pIdx === 0 ? '1px solid #fde68a' : 'none',
                                                            marginBottom: '4px'
                                                        }}>
                                                            <span style={{
                                                                fontSize: '13px', fontWeight: 700, minWidth: '20px',
                                                                color: pIdx === 0 ? '#d97706' : '#9ca3af'
                                                            }}>
                                                                {pIdx === 0 ? '🥇' : pIdx === 1 ? '🥈' : '🥉'}
                                                            </span>
                                                            <span style={{ flex: 1, fontSize: '13px', color: '#374151', fontWeight: pIdx === 0 ? 600 : 400 }}>
                                                                {plant.ten_cay}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '12px', fontWeight: 700,
                                                                color: pIdx === 0 ? '#d97706' : '#6b7280'
                                                            }}>
                                                                {plant.score}%
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowAHPModal(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminKhachHang
