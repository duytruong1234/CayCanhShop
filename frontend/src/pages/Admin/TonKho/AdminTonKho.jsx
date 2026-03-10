import { useState, useEffect } from 'react'
import api from '../../../services/api'
import './AdminTonKho.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AdminTonKho = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [importQty, setImportQty] = useState(10)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await api.get('/admin/ton-kho/')
            setItems(res.data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleOpenImport = (item) => {
        setSelectedItem(item)
        setImportQty(10)
        setShowModal(true)
    }

    const handleImport = async () => {
        if (importQty <= 0) {
            alert('Số lượng nhập phải > 0')
            return
        }

        try {
            await api.post('/admin/ton-kho/nhap', {
                cay_canh_id: selectedItem.cay_canh_id,
                so_luong_nhap: parseInt(importQty)
            })
            alert('Nhập kho thành công!')
            setShowModal(false)
            fetchItems()
        } catch (error) {
            alert(error.response?.data?.detail || 'Lỗi nhập kho')
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    return (
        <div className="admin-tonkho">
            <h3>Quản lý Tồn kho</h3>

            <div className="table-responsive">
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
                            <tr><td colSpan="6" className="text-center">Đang tải...</td></tr>
                        ) : items.map(item => (
                            <tr key={item.cay_canh_id}>
                                <td>{item.cay_canh_id}</td>
                                <td>{item.ten_cay}</td>
                                <td>
                                    <img
                                        src={`${API_URL}/static/images/${item.hinh_anh}`}
                                        className="thumb-img"
                                        alt="hinh ao"
                                    />
                                </td>
                                <td>{formatPrice(item.gia)}</td>
                                <td>
                                    <span className={`stock-badge ${item.so_luong_con < 10 ? 'low' : 'good'}`}>
                                        {item.so_luong_con || 0}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-import" onClick={() => handleOpenImport(item)}>
                                        <i className="fa fa-plus"></i> Nhập hàng
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedItem && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4>Nhập kho: {selectedItem.ten_cay}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <p>Số lượng tồn hiện tại: <b>{selectedItem.so_luong_con || 0}</b></p>

                        <label>Số lượng nhập thêm:</label>
                        <input
                            type="number"
                            className="input-field"
                            value={importQty}
                            onChange={(e) => setImportQty(e.target.value)}
                            min="1"
                        />

                        <button className="modal-btn btn-success" onClick={handleImport}>
                            Xác nhận nhập
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminTonKho
