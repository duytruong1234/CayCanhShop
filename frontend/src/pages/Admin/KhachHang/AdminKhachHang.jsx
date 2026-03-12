import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaSearch, FaUsers } from 'react-icons/fa'
import api from '../../../services/api'

const AdminKhachHang = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState({
        ten_dang_nhap: '', mat_khau: '', ho_ten: '', email: '', dien_thoai: '', gioi_tinh: 'Nam', dia_chi: '', vai_tro_id: 2
    })

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

    const filteredUsers = users.filter(u =>
        u.ten_dang_nhap.toLowerCase().includes(search.toLowerCase()) ||
        u.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

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
                                    <button className="admin-btn admin-btn-sm admin-btn-delete" onClick={() => handleDelete(u.user_id)}>
                                        <FaTrash size={11} /> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
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
        </div>
    )
}

export default AdminKhachHang
