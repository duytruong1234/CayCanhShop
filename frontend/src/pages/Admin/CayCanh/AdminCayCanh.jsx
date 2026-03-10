import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './AdminCayCanh.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AdminCayCanh = () => {
    const navigate = useNavigate()
    const [cayCanhs, setCayCanhs] = useState([])
    const [loaiCays, setLoaiCays] = useState([])
    const [loading, setLoading] = useState(true)

    // Trạng thái Modal
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Danh sách dữ liệu
    const [dacDiems, setDacDiems] = useState([]) // Mới: Danh sách đặc điểm

    // Dữ liệu sửa/xóa
    const [selectedCay, setSelectedCay] = useState(null)

    // Dữ liệu Form
    const [formData, setFormData] = useState({
        ten_cay: '',
        gia: '',
        loai_cay_id: '',
        hinh_anh: null,
        dac_diems: [] // Mới: Đặc điểm đã chọn
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [resCay, resLoai, resDacDiem] = await Promise.all([
                api.get('/admin/cay-canh/'),
                api.get('/admin/cay-canh/loai-cay'),
                api.get('/dac-diem') // Lấy danh sách đặc điểm
            ])
            setCayCanhs(resCay.data)
            setLoaiCays(resLoai.data)
            setDacDiems(resDacDiem.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    // Thêm mới
    const openAddModal = () => {
        setFormData({
            ten_cay: '',
            gia: '',
            loai_cay_id: loaiCays[0]?.loai_cay_id || '',
            hinh_anh: null,
            dac_diems: []
        })
        setShowAddModal(true)
    }

    const toggleDacDiem = (ma) => {
        setFormData(prev => {
            const current = prev.dac_diems || []
            if (current.includes(ma)) {
                return { ...prev, dac_diems: current.filter(x => x !== ma) }
            } else {
                return { ...prev, dac_diems: [...current, ma] }
            }
        })
    }

    const handleAddSubmit = async () => {
        const data = new FormData()
        data.append('ten_cay', formData.ten_cay)
        data.append('gia', formData.gia)
        data.append('loai_cay_id', formData.loai_cay_id)
        if (formData.hinh_anh) {
            data.append('hinh_anh', formData.hinh_anh)
        }
        // Thêm dac_diems
        if (formData.dac_diems && formData.dac_diems.length > 0) {
            formData.dac_diems.forEach(ma => data.append('dac_diems', ma))
        }

        try {
            await api.post('/admin/cay-canh/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('🌿 Thêm cây thành công!')
            setShowAddModal(false)
            fetchData()
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi khi thêm cây')
        }
    }

    // Chỉnh sửa
    const openEditModal = (cay) => {
        setSelectedCay(cay)
        setFormData({
            ten_cay: cay.ten_cay,
            gia: cay.gia,
            loai_cay_id: cay.loai_cay_id,
            hinh_anh: null,
            dac_diems: cay.dac_diems || [] // Cập nhật đặc điểm hiện có
        })
        setShowEditModal(true)
    }

    const handleEditSubmit = async () => {
        const data = new FormData()
        data.append('ten_cay', formData.ten_cay)
        data.append('gia', formData.gia)
        data.append('loai_cay_id', formData.loai_cay_id)
        if (formData.hinh_anh) {
            data.append('hinh_anh', formData.hinh_anh)
        }
        // Append dac_diems
        if (formData.dac_diems) {
            formData.dac_diems.forEach(ma => data.append('dac_diems', ma))
        }

        try {
            await api.put(`/admin/cay-canh/${selectedCay.cay_canh_id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('✅ Cập nhật thành công!')
            setShowEditModal(false)
            fetchData()
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi khi cập nhật')
        }
    }

    // Xóa
    const openDeleteModal = (cay) => {
        setSelectedCay(cay)
        setShowDeleteModal(true)
    }

    const handleDeleteSubmit = async () => {
        try {
            await api.delete(`/admin/cay-canh/${selectedCay.cay_canh_id}`)
            alert('🗑️ Xóa thành công!')
            setShowDeleteModal(false)
            fetchData()
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi khi xóa')
        }
    }

    if (loading) return <div className="loading">Đang tải...</div>

    return (
        <div className="admin-cay-canh">
            <div className="admin-header">
                <h3>🌿 Quản lý cây cảnh</h3>
                <button className="btn-add" onClick={openAddModal}>
                    <i className="fa fa-plus"></i> Thêm cây cảnh
                </button>
            </div>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên cây</th>
                            <th>Giá</th>
                            <th>Loại cây</th>
                            <th>Đặc điểm nổi bật</th>
                            <th>Hình ảnh</th>
                            <th>Thao tác</th>
                            <th>Quản lý bài viết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cayCanhs.map(item => (
                            <tr key={item.cay_canh_id}>
                                <td>{item.ten_cay}</td>
                                <td>{formatPrice(item.gia)}</td>
                                <td>{item.ten_loai}</td>
                                <td>
                                    <div className="flex flex-wrap gap-1">
                                        {(item.dac_diems || []).map(ma => {
                                            const dd = dacDiems.find(d => d.ma_dac_diem === ma)
                                            return dd ? (
                                                <span key={ma} style={{ fontSize: '0.8em', background: '#e0e0e0', padding: '2px 5px', borderRadius: '4px', marginRight: '4px' }}>
                                                    {dd.ten_dac_diem}
                                                </span>
                                            ) : null
                                        })}
                                    </div>
                                </td>
                                <td>
                                    {item.hinh_anh && (
                                        <img
                                            src={`${API_URL}/static/images/${item.hinh_anh}`}
                                            className="thumb-img"
                                            alt="hinh ao"
                                        />
                                    )}
                                </td>
                                <td>
                                    <button className="btn-sm btn-edit" onClick={() => openEditModal(item)}>
                                        <i className="fa fa-edit"></i> Sửa
                                    </button>
                                    <button className="btn-sm btn-delete" onClick={() => openDeleteModal(item)}>
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn-sm btn-info"
                                        onClick={() => navigate(`/admin/bai-viet/${item.cay_canh_id}`)}
                                    >
                                        Quản lý bài viết
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cayCanhs.length === 0 && (
                            <tr><td colSpan="6" className="text-center">Chưa có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL THÊM */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowAddModal(false)}>✖</span>
                        <h4 className="modal-title">Thêm cây cảnh mới</h4>

                        <label>Tên cây</label>
                        <input
                            className="input-field"
                            value={formData.ten_cay}
                            onChange={e => setFormData({ ...formData, ten_cay: e.target.value })}
                        />

                        <label>Giá</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.gia}
                            onChange={e => setFormData({ ...formData, gia: e.target.value })}
                        />

                        <label>Loại cây</label>
                        <select
                            className="input-field"
                            value={formData.loai_cay_id}
                            onChange={e => setFormData({ ...formData, loai_cay_id: e.target.value })}
                        >
                            {loaiCays.map(loai => (
                                <option key={loai.loai_cay_id} value={loai.loai_cay_id}>
                                    {loai.ten_loai}
                                </option>
                            ))}
                        </select>

                        <label>Hình ảnh</label>
                        <input
                            type="file"
                            className="input-field"
                            onChange={e => setFormData({ ...formData, hinh_anh: e.target.files[0] })}
                        />

                        <label>Đặc điểm nổi bật</label>
                        <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px', marginBottom: '15px' }}>
                            {dacDiems.map(dd => (
                                <label key={dd.ma_dac_diem} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={(formData.dac_diems || []).includes(dd.ma_dac_diem)}
                                        onChange={() => toggleDacDiem(dd.ma_dac_diem)}
                                    />
                                    {dd.ten_dac_diem}
                                </label>
                            ))}
                        </div>

                        <button className="modal-btn btn-success" onClick={handleAddSubmit}>Lưu</button>
                    </div>
                </div>
            )}

            {/* MODAL SỬA */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowEditModal(false)}>✖</span>
                        <h4 className="modal-title">Cập nhật cây cảnh</h4>

                        <label>Tên cây</label>
                        <input
                            className="input-field"
                            value={formData.ten_cay}
                            onChange={e => setFormData({ ...formData, ten_cay: e.target.value })}
                        />

                        <label>Giá</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.gia}
                            onChange={e => setFormData({ ...formData, gia: e.target.value })}
                        />

                        <label>Loại cây</label>
                        <select
                            className="input-field"
                            value={formData.loai_cay_id}
                            onChange={e => setFormData({ ...formData, loai_cay_id: e.target.value })}
                        >
                            {loaiCays.map(loai => (
                                <option key={loai.loai_cay_id} value={loai.loai_cay_id}>
                                    {loai.ten_loai}
                                </option>
                            ))}
                        </select>

                        <label>Hình ảnh mới (nếu thay đổi)</label>
                        <input
                            type="file"
                            className="input-field"
                            onChange={e => setFormData({ ...formData, hinh_anh: e.target.files[0] })}
                        />

                        <label>Đặc điểm nổi bật</label>
                        <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px', marginBottom: '15px' }}>
                            {dacDiems.map(dd => (
                                <label key={dd.ma_dac_diem} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={(formData.dac_diems || []).includes(dd.ma_dac_diem)}
                                        onChange={() => toggleDacDiem(dd.ma_dac_diem)}
                                    />
                                    {dd.ten_dac_diem}
                                </label>
                            ))}
                        </div>

                        <button className="modal-btn btn-warning" onClick={handleEditSubmit}>Cập nhật</button>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h4 className="modal-title text-danger">Xác nhận xóa</h4>
                        <p>Bạn có chắc muốn xóa cây <b>{selectedCay?.ten_cay}</b> không?</p>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                            <button className="btn-delete-confirm" onClick={handleDeleteSubmit}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminCayCanh
