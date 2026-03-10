import { useState, useEffect } from 'react'
import api from '../../../services/api'
import './AdminKhachHang.css'

const AdminKhachHang = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [search, setSearch] = useState('')

    // Form (Thêm/Sửa) có thể ở đây nhưng hiện tại chỉ liệt kê và xóa như triển khai điển hình
    // Thực tế C# có "ThemTaiKhoan", "CapNhatTaiKhoan". Tôi nên triển khai Thêm.
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        ten_dang_nhap: '',
        mat_khau: '',
        ho_ten: '',
        email: '',
        dien_thoai: '',
        gioi_tinh: 'Nam',
        dia_chi: '',
        vai_tro_id: 2
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/khach-hang/')
            setUsers(res.data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return
        try {
            await api.delete(`/admin/khach-hang/${id}`)
            alert('Xóa thành công!')
            fetchUsers()
        } catch (error) {
            alert(error.response?.data?.detail || 'Không thể xóa')
        }
    }

    const handleCreate = async () => {
        try {
            if (!formData.ten_dang_nhap || !formData.mat_khau) {
                alert('Vui lòng nhập đầy đủ thông tin')
                return
            }
            await api.post('/admin/khach-hang/', formData)
            alert('Thêm tài khoản thành công!')
            setShowAddModal(false)
            fetchUsers()
            setFormData({
                ten_dang_nhap: '',
                mat_khau: '',
                ho_ten: '',
                email: '',
                dien_thoai: '',
                gioi_tinh: 'Nam',
                dia_chi: '',
                vai_tro_id: 2
            })
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi khi thêm')
        }
    }

    const filteredUsers = users.filter(u =>
        u.ten_dang_nhap.toLowerCase().includes(search.toLowerCase()) ||
        u.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="admin-khachhang">
            <div className="header-row">
                <h3>Quản lý Khách hàng / Tài khoản</h3>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Thêm tài khoản</button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-responsive">
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
                            <tr><td colSpan="6" className="text-center">Đang tải...</td></tr>
                        ) : filteredUsers.map(u => (
                            <tr key={u.user_id}>
                                <td>{u.user_id}</td>
                                <td>{u.ten_dang_nhap}</td>
                                <td>{u.ho_ten}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.vai_tro_id === 1 ? 'admin' : 'user'}`}>
                                        {u.ten_vai_tro}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-sm btn-delete" onClick={() => handleDelete(u.user_id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4>Thêm tài khoản mới</h4>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        <div className="form-grid">
                            <div>
                                <label>Tên đăng nhập</label>
                                <input className="input-field" value={formData.ten_dang_nhap} onChange={e => setFormData({ ...formData, ten_dang_nhap: e.target.value })} />
                            </div>
                            <div>
                                <label>Mật khẩu</label>
                                <input className="input-field" type="password" value={formData.mat_khau} onChange={e => setFormData({ ...formData, mat_khau: e.target.value })} />
                            </div>
                            <div>
                                <label>Họ tên</label>
                                <input className="input-field" value={formData.ho_ten} onChange={e => setFormData({ ...formData, ho_ten: e.target.value })} />
                            </div>
                            <div>
                                <label>Email</label>
                                <input className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label>Điện thoại</label>
                                <input className="input-field" value={formData.dien_thoai} onChange={e => setFormData({ ...formData, dien_thoai: e.target.value })} />
                            </div>
                            <div>
                                <label>Vai trò</label>
                                <select className="input-field" value={formData.vai_tro_id} onChange={e => setFormData({ ...formData, vai_tro_id: parseInt(e.target.value) })}>
                                    <option value={2}>Khách hàng</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>
                        </div>

                        <button className="modal-btn btn-success" onClick={handleCreate}>Thêm mới</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminKhachHang
