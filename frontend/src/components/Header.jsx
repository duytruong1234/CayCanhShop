import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaLeaf } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Header = () => {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const [keyword, setKeyword] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)

  // Theo dõi cuộn trang để thay đổi kiểu header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/cay-canh?keyword=${encodeURIComponent(keyword)}`)
      setMobileOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/dang-nhap')
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow-green transition-all duration-300 group-hover:scale-105">
                <FaLeaf className="text-white text-sm" />
              </div>
              <span className="text-xl font-heading font-bold gradient-text">Queen</span>
            </Link>

            {/* Điều hướng Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Trang chủ
              </Link>
              <Link
                to="/cay-canh"
                className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Cây cảnh
              </Link>
              <Link
                to="/tu-van-cay"
                className="px-4 py-2 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200 flex items-center gap-1.5"
              >
                <FaLeaf className="text-xs" />
                Tư vấn chọn cây
              </Link>
            </nav>

            {/* Tìm kiếm Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm cây cảnh..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-56 lg:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-primary-400 focus:w-72 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors"
                >
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </form>

            {/* Hành động bên phải */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Giỏ hàng */}
                  <Link
                    to="/gio-hang"
                    className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                  >
                    <FaShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-scale-in">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Menu người dùng */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {(user.ho_ten || user.ten_dang_nhap || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                        {user.ho_ten || user.ten_dang_nhap}
                      </span>
                    </button>

                    {/* Dropdown */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-premium py-2 animate-fade-in-down border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user.ho_ten || user.ten_dang_nhap}</p>
                          <p className="text-xs text-gray-400">{isAdmin() ? 'Quản trị viên' : 'Khách hàng'}</p>
                        </div>

                        {isAdmin() && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            Quản trị
                          </Link>
                        )}
                        <Link
                          to="/don-hang"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          to="/tai-khoan"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          Tài khoản
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <FaSignOutAlt className="text-xs" /> Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="btn-premium btn-primary text-sm py-2.5 px-5"
                >
                  <FaUser size={13} /> Đăng nhập
                </Link>
              )}

              {/* Nút Hamburger Mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Tìm kiếm Mobile */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm cây cảnh..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-gray-400"
                >
                  <FaSearch className="text-sm" />
                </button>
              </form>

              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                Trang chủ
              </Link>
              <Link to="/cay-canh" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                Cây cảnh
              </Link>
              <Link to="/tu-van-cay" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <FaLeaf className="text-xs" /> Tư vấn chọn cây
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
