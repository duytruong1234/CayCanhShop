import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaNewspaper, FaLeaf } from 'react-icons/fa'
import api from '../../../services/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AdminCayCanh = () => {
    const navigate = useNavigate()
    const [cayCanhs, setCayCanhs] = useState([])
    const [loaiCays, setLoaiCays] = useState([])
    const [dacDiems, setDacDiems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedCay, setSelectedCay] = useState(null)
    const [formData, setFormData] = useState({ ten_cay: '', gia: '', loai_cay_id: '', hinh_anh: null, dac_diems: [] })

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [resCay, resLoai, resDacDiem] = await Promise.all([
                api.get('/admin/cay-canh/'),
                api.get('/admin/cay-canh/loai-cay'),
                api.get('/dac-diem')
            ])
            setCayCanhs(resCay.data)
            setLoaiCays(resLoai.data)
            setDacDiems(resDacDiem.data)
        } catch (error) { console.error('Error fetching data:', error) }
        finally { setLoading(false) }
    }

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'

    const openAddModal = () => {
        setFormData({ ten_cay: '', gia: '', loai_cay_id: loaiCays[0]?.loai_cay_id || '', hinh_anh: null, dac_diems: [] })
        setShowAddModal(true)
    }

    const toggleDacDiem = (ma) => {
        setFormData(prev => {
            const current = prev.dac_diems || []
            return { ...prev, dac_diems: current.includes(ma) ? current.filter(x => x !== ma) : [...current, ma] }
        })
    }

    const getErrorMessage = (error) => {
        const detail = error.response?.data?.detail
        if (!detail) return 'Có lỗi xảy ra'
        if (typeof detail === 'string') return detail
        if (Array.isArray(detail)) return detail.map(d => d.msg || JSON.stringify(d)).join(', ')
        return JSON.stringify(detail)
    }

    const handleAddSubmit = async () => {
        const data = new FormData()
        data.append('ten_cay', formData.ten_cay)
        data.append('gia', formData.gia)
        data.append('loai_cay_id', formData.loai_cay_id)
        if (formData.hinh_anh) data.append('hinh_anh', formData.hinh_anh)
        if (formData.dac_diems?.length > 0) formData.dac_diems.forEach(ma => data.append('dac_diems', ma))
        try {
            await api.post('/admin/cay-canh/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            alert('Thêm cây thành công!')
            setShowAddModal(false)
            fetchData()
        } catch (error) { alert(getErrorMessage(error)) }
    }

    const openEditModal = (cay) => {
        setSelectedCay(cay)
        setFormData({ ten_cay: cay.ten_cay, gia: cay.gia, loai_cay_id: cay.loai_cay_id, hinh_anh: null, dac_diems: cay.dac_diems || [] })
        setShowEditModal(true)
    }

    const handleEditSubmit = async () => {
        const data = new FormData()
        data.append('ten_cay', formData.ten_cay)
        data.append('gia', formData.gia)
        data.append('loai_cay_id', formData.loai_cay_id)
        if (formData.hinh_anh) data.append('hinh_anh', formData.hinh_anh)
        if (formData.dac_diems) formData.dac_diems.forEach(ma => data.append('dac_diems', ma))
        try {
            await api.put(`/admin/cay-canh/${selectedCay.cay_canh_id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
            alert('Cập nhật thành công!')
            setShowEditModal(false)
            fetchData()
        } catch (error) { alert(getErrorMessage(error)) }
    }

    const openDeleteModal = (cay) => { setSelectedCay(cay); setShowDeleteModal(true) }

    const handleDeleteSubmit = async () => {
        try {
            await api.delete(`/admin/cay-canh/${selectedCay.cay_canh_id}`)
            alert('Xóa thành công!')
            setShowDeleteModal(false)
            fetchData()
        } catch (error) { alert(getErrorMessage(error)) }
    }

    if (loading) return (
        <div className="admin-page flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
    )

    // Form fields component
    const FormFields = () => (
        <>
            <div className="admin-form-group">
                <label className="admin-form-label">Tên cây</label>
                <input className="admin-form-input" value={formData.ten_cay} onChange={e => setFormData({ ...formData, ten_cay: e.target.value })} />
            </div>
            <div className="admin-form-group">
                <label className="admin-form-label">Giá</label>
                <input type="number" className="admin-form-input" value={formData.gia} onChange={e => setFormData({ ...formData, gia: e.target.value })} />
            </div>
            <div className="admin-form-group">
                <label className="admin-form-label">Loại cây</label>
                <select className="admin-form-input" value={formData.loai_cay_id} onChange={e => setFormData({ ...formData, loai_cay_id: e.target.value })}>
                    {loaiCays.map(loai => <option key={loai.loai_cay_id} value={loai.loai_cay_id}>{loai.ten_loai}</option>)}
                </select>
            </div>
            <div className="admin-form-group">
                <label className="admin-form-label">Hình ảnh{showEditModal ? ' mới (nếu thay đổi)' : ''}</label>
                <input type="file" className="admin-form-input" onChange={e => setFormData({ ...formData, hinh_anh: e.target.files[0] })} />
            </div>
            <div className="admin-form-group">
                <label className="admin-form-label">Đặc điểm nổi bật</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    {dacDiems.map(dd => (
                        <label key={dd.ma_dac_diem} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={(formData.dac_diems || []).includes(dd.ma_dac_diem)}
                                onChange={() => toggleDacDiem(dd.ma_dac_diem)}
                                className="w-4 h-4 rounded accent-emerald-500"
                            />
                            {dd.ten_dac_diem}
                        </label>
                    ))}
                </div>
            </div>
        </>
    )

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1><FaLeaf className="inline text-primary-500 mr-2 text-lg" />Quản lý cây cảnh</h1>
                <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
                    <FaPlus size={12} /> Thêm cây cảnh
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên cây</th>
                            <th>Giá</th>
                            <th>Loại cây</th>
                            <th>Đặc điểm</th>
                            <th>Hình ảnh</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cayCanhs.map(item => (
                            <tr key={item.cay_canh_id}>
                                <td className="font-semibold">{item.ten_cay}</td>
                                <td className="text-primary-600 font-semibold">{formatPrice(item.gia)}</td>
                                <td>{item.loai_cay?.ten_loai}</td>
                                <td>
                                    <div className="flex flex-wrap gap-1">
                                        {(item.dac_diems || []).map(ma => {
                                            const dd = dacDiems.find(d => d.ma_dac_diem === ma)
                                            return dd ? <span key={ma} className="admin-badge admin-badge-green">{dd.ten_dac_diem}</span> : null
                                        })}
                                    </div>
                                </td>
                                <td>
                                    {item.hinh_anh && <img src={`${API_URL}/static/images/${item.hinh_anh}`} className="thumb-img" alt="" />}
                                </td>
                                <td>
                                    <div className="flex gap-1">
                                        <button className="admin-btn admin-btn-sm admin-btn-edit" onClick={() => openEditModal(item)}><FaEdit size={11} /> Sửa</button>
                                        <button className="admin-btn admin-btn-sm admin-btn-delete" onClick={() => openDeleteModal(item)}><FaTrash size={11} /> Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {cayCanhs.length === 0 && <tr><td colSpan="7" className="text-center text-gray-400 py-8">Chưa có dữ liệu</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm */}
            {showAddModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Thêm cây cảnh mới</h3>
                            <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body"><FormFields /></div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowAddModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleAddSubmit}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sửa */}
            {showEditModal && (
                <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Cập nhật cây cảnh</h3>
                            <button className="admin-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body"><FormFields /></div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowEditModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleEditSubmit}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {showDeleteModal && (
                <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="admin-modal-header">
                            <h3 className="text-red-600">Xác nhận xóa</h3>
                            <button className="admin-modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <p className="text-sm text-gray-600">Bạn có chắc muốn xóa cây <strong>{selectedCay?.ten_cay}</strong> không?</p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-delete" onClick={handleDeleteSubmit}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCayCanh
