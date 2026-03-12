import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FaHome, FaLeaf, FaShoppingBag, FaUsers, FaBoxes, FaSignOutAlt, FaTags, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard', exact: true },
    { path: '/admin/cay-canh', icon: FaLeaf, label: 'Quản lý cây cảnh' },
    { path: '/admin/quan-ly-dac-diem', icon: FaTags, label: 'Quản lý đặc điểm' },
    { path: '/admin/don-hang', icon: FaShoppingBag, label: 'Quản lý đơn hàng' },
    { path: '/admin/khach-hang', icon: FaUsers, label: 'Quản lý khách hàng' },
    { path: '/admin/ton-kho', icon: FaBoxes, label: 'Quản lý tồn kho' },
  ]

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/dang-nhap')
  }

  const handleNavClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col fixed h-full z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-green transition-all duration-300">
              <FaLeaf className="text-white text-sm" />
            </div>
            <div>
              <span className="text-lg font-heading font-bold text-white">Queen</span>
              <span className="block text-[10px] text-primary-400 font-medium tracking-wider uppercase">Admin Panel</span>
            </div>
          </Link>
          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${active
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-400 rounded-r-full" />
                )}
                <item.icon size={16} className={active ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-primary-400/30">
              {user?.ten_dang_nhap?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.ten_dang_nhap}</p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
          >
            <FaSignOutAlt className="text-xs" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-auto min-h-screen">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 sticky top-0 z-30 flex items-center gap-3">
          {/* Hamburger button on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaBars className="text-lg" />
          </button>
          <h1 className="text-base lg:text-lg font-heading font-bold text-gray-800">
            {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Admin'}
          </h1>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
