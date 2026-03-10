import { createContext, useContext, useState, useEffect } from 'react'
import { gioHangService } from '../services/gioHangService'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cartCount, setCartCount] = useState(0)

    // Lấy số lượng giỏ hàng khi user thay đổi
    useEffect(() => {
        if (user) {
            fetchCartCount()
        } else {
            setCartCount(0)
        }
    }, [user])

    const fetchCartCount = async () => {
        try {
            const cart = await gioHangService.get()
            // cart.tong_so_luong từ backend
            setCartCount(cart.tong_so_luong || 0)
        } catch (error) {
            console.error('Failed to fetch cart count', error)
            setCartCount(0) // Giá trị mặc định an toàn
        }
    }

    const addToCart = async (cayCanhId, soLuong = 1) => {
        try {
            await gioHangService.add(cayCanhId, soLuong)
            await fetchCartCount() // Cập nhật lại số lượng
            return true
        } catch (error) {
            throw error
        }
    }

    const updateCart = async () => {
        await fetchCartCount()
    }

    return (
        <CartContext.Provider value={{ cartCount, addToCart, updateCart }}>
            {children}
        </CartContext.Provider>
    )
}
