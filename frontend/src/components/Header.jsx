import { Link, useLocation } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaLeaf, FaBox } from 'react-icons/fa'
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
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/cay-canh', label: 'Cây cảnh' },
    { to: '/tu-van-cay', label: 'Tư vấn chọn cây', highlight: true },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/70 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-white/50'
          : 'bg-white/95 backdrop-blur-md'
          }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[14px] flex items-center justify-center shadow-md group-hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] transition-all duration-500 group-hover:scale-105 group-hover:rotate-[-4deg]">
                <FaLeaf className="text-white text-[15px] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="text-[22px] font-heading font-extrabold gradient-text tracking-tight">Queen</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2.5 font-medium rounded-xl transition-all duration-300 text-[15px] ${
                    isActive(link.to)
                      ? 'text-primary-700 bg-primary-50/80'
                      : link.highlight
                        ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50/60'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
                  } flex items-center gap-1.5`}
                >
                  {link.highlight && <FaLeaf className="text-[10px]" />}
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm cây cảnh..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-52 lg:w-60 pl-10 pr-4 py-2.5 bg-gray-50/80 border-2 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary-300 focus:w-72 focus:shadow-[0_0_0_4px_rgba(5,150,105,0.08)] transition-all duration-400"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300"
                >
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {user ? (
                <>
                  {/* Cart */}
                  <Link
                    to="/gio-hang"
                    className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50/80 rounded-xl transition-all duration-300"
                  >
                    <FaShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white animate-[scaleIn_0.3s_ease-out]">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center gap-2 px-2.5 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50/80 rounded-xl transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[10px] flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {(user.ho_ten || user.ten_dang_nhap || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                        {user.ho_ten || user.ten_dang_nhap}
                      </span>
                    </button>

                    {/* Dropdown */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] py-2 border border-gray-100/80 animate-[fadeInDown_0.2s_ease-out]">
                        <div className="px-4 py-3 border-b border-gray-100/80">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user.ho_ten || user.ten_dang_nhap}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{isAdmin() ? '✨ Quản trị viên' : '🌿 Khách hàng'}</p>
                        </div>

                        <div className="py-1">
                          {isAdmin() && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50/80 hover:text-primary-600 transition-all duration-200 mx-1 rounded-lg"
                              onClick={() => setShowMenu(false)}
                            >
                              <span className="text-base">⚙️</span> Quản trị
                            </Link>
                          )}
                          <Link
                            to="/don-hang"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50/80 hover:text-primary-600 transition-all duration-200 mx-1 rounded-lg"
                            onClick={() => setShowMenu(false)}
                          >
                            <FaBox className="text-sm text-gray-400" /> Đơn hàng của tôi
                          </Link>
                          <Link
                            to="/tai-khoan"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50/80 hover:text-primary-600 transition-all duration-200 mx-1 rounded-lg"
                            onClick={() => setShowMenu(false)}
                          >
                            <FaUser className="text-sm text-gray-400" /> Tài khoản
                          </Link>
                        </div>

                        <div className="border-t border-gray-100/80 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/80 transition-all duration-200 mx-1 rounded-lg"
                            style={{ width: 'calc(100% - 8px)' }}
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
                  className="btn-premium btn-primary text-sm py-2.5 px-6 shadow-md hover:shadow-[0_8px_25px_rgba(5,150,105,0.4)]"
                >
                  <FaUser size={12} /> Đăng nhập
                </Link>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50/80 rounded-xl transition-all"
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Slide Overlay */}
        <div className={`md:hidden transition-all duration-400 overflow-hidden ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100/50">
            <div className="container mx-auto px-4 py-5 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm cây cảnh..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/80 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all border border-gray-100"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400"
                >
                  <FaSearch className="text-sm" />
                </button>
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary-50/80 text-primary-700'
                      : link.highlight
                        ? 'text-primary-600 hover:bg-primary-50/60'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.highlight && <FaLeaf className="text-xs" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
