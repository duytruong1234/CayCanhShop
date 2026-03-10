import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './GioHang.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const GioHang = () => {
    const navigate = useNavigate()
    const [gioHang, setGioHang] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        fetchGioHang()
    }, [])

    const fetchGioHang = async () => {
        try {
            const res = await api.get('/gio-hang/')
            setGioHang(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching gio hang:', error)
            setLoading(false)
        }
    }

    const handleUpdateQty = async (ghctId, change) => {
        const item = gioHang.chi_tiets.find(ct => ct.ghct_id === ghctId)
        if (item && item.so_luong <= 1 && change === -1) {
            if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                return
            }
        }

        try {
            await api.put(`/gio-hang/${ghctId}`, { change })
            fetchGioHang()
        } catch (error) {
            console.error('Error updating qty:', error)
        }
    }

    const handleDeleteItem = async (ghctId) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

        try {
            await api.delete(`/gio-hang/${ghctId}`)
            fetchGioHang()
            setSelectedItems(prev => prev.filter(id => id !== ghctId))
        } catch (error) {
            console.error('Error deleting item:', error)
        }
    }

    const handleCheckItem = (ghctId) => {
        setSelectedItems(prev => {
            if (prev.includes(ghctId)) {
                return prev.filter(id => id !== ghctId)
            } else {
                return [...prev, ghctId]
            }
        })
    }

    const handleThanhToan = () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng tick chọn sản phẩm bạn muốn thanh toán!')
            return
        }
        navigate('/dat-hang', { state: { selectedIds: selectedItems } })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    return (
        <div className="gio-hang-container">
            <h2 className="cart-title">Giỏ hàng của bạn</h2>

            <div className="cart-wrapper">
                {/* KHỐI GIỎ HÀNG */}
                <div className="cart-box">
                    {!gioHang || gioHang.chi_tiets.length === 0 ? (
                        <h4 className="empty-cart">Giỏ hàng trống</h4>
                    ) : (
                        gioHang.chi_tiets.map((item) => (
                            <div key={item.ghct_id}>
                                <div className="cart-item">
                                    {/* CHECKBOX */}
                                    <input
                                        type="checkbox"
                                        className="cart-check"
                                        checked={selectedItems.includes(item.ghct_id)}
                                        onChange={() => handleCheckItem(item.ghct_id)}
                                    />

                                    {/* HÌNH */}
                                    <img
                                        src={`${API_URL}/static/images/${item.hinh_anh}`}
                                        alt={item.ten_cay}
                                        className="cart-img"
                                    />

                                    <div className="cart-info">
                                        <h4 className="cart-name">{item.ten_cay}</h4>
                                        <p className="cart-price">{formatPrice(item.don_gia)}</p>
                                    </div>

                                    {/* SỐ LƯỢNG */}
                                    <div className="cart-qty">
                                        <button
                                            className="btn-qty btn-minus"
                                            onClick={() => handleUpdateQty(item.ghct_id, -1)}
                                        >
                                            −
                                        </button>
                                        <span>{item.so_luong}</span>
                                        <button
                                            className="btn-qty btn-plus"
                                            onClick={() => handleUpdateQty(item.ghct_id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* XÓA */}
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteItem(item.ghct_id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                <div className="cart-divider"></div>
                            </div>
                        ))
                    )}
                </div>

                {/* TỔNG TIỀN */}
                <div className="cart-total-box">
                    <div className="total-left">
                        Tổng tiền: <strong>{formatPrice(gioHang?.tong_tien || 0)}</strong>
                        &nbsp;|&nbsp;
                        Tổng số lượng: <strong>{gioHang?.tong_so_luong || 0}</strong>
                    </div>

                    <button className="btn-buy" onClick={handleThanhToan}>
                        Mua hàng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GioHang
