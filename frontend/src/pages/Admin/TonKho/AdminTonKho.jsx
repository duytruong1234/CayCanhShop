import { useState, useEffect } from 'react'
import { FaPlus, FaBoxes } from 'react-icons/fa'
import api from '../../../services/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AdminTonKho = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [importQty, setImportQty] = useState(10)

    useEffect(() => { fetchItems() }, [])

    const fetchItems = async () => {
        try { const res = await api.get('/admin/ton-kho/'); setItems(res.data) }
        catch (error) { console.error(error) }
        finally { setLoading(false) }
    }

    const handleOpenImport = (item) => { setSelectedItem(item); setImportQty(10); setShowModal(true) }

    const handleImport = async () => {
        if (importQty <= 0) { alert('Số lượng nhập phải > 0'); return }
        try {
            await api.post('/admin/ton-kho/nhap', { cay_canh_id: selectedItem.cay_canh_id, so_luong_nhap: parseInt(importQty) })
            alert('Nhập kho thành công!')
            setShowModal(false); fetchItems()
        } catch (error) { alert(error.response?.data?.detail || 'Lỗi nhập kho') }
    }

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' đ'

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1><FaBoxes className="inline text-orange-500 mr-2 text-lg" />Quản lý tồn kho</h1>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên cây</th>
                            <th>Hình ảnh</th>
                            <th>Giá bán</th>
                            <th>Số lượng tồn</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">Đang tải...</td></tr>
                        ) : items.map(item => (
                            <tr key={item.cay_canh_id}>
                                <td className="text-gray-400 text-sm">{item.cay_canh_id}</td>
                                <td className="font-semibold">{item.ten_cay}</td>
                                <td>
                                    <img src={`${API_URL}/static/images/${item.hinh_anh}`} className="thumb-img" alt="" />
                                </td>
                                <td className="text-primary-600 font-semibold">{formatPrice(item.gia)}</td>
                                <td>
                                    <span className={`admin-badge ${(item.so_luong_con || 0) < 10 ? 'admin-badge-red' : 'admin-badge-green'}`}>
                                        {item.so_luong_con || 0}
                                    </span>
                                </td>
                                <td>
                                    <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleOpenImport(item)}>
                                        <FaPlus size={11} /> Nhập hàng
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && selectedItem && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="admin-modal-header">
                            <h3>Nhập kho: {selectedItem.ten_cay}</h3>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <p className="text-sm text-gray-500 mb-4">Số lượng tồn hiện tại: <strong className="text-gray-800">{selectedItem.so_luong_con || 0}</strong></p>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Số lượng nhập thêm</label>
                                <input type="number" className="admin-form-input" value={importQty} onChange={(e) => setImportQty(e.target.value)} min="1" />
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleImport}>Xác nhận nhập</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminTonKho
