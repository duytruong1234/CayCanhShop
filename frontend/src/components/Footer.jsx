import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLeaf, FaHeart } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto relative overflow-hidden">
      {/* Đường viền trang trí phía trên */}
      <div className="h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Thương hiệu */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-green transition-all duration-300">
                <FaLeaf className="text-white text-sm" />
              </div>
              <span className="text-2xl font-heading font-bold text-white">Queen</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Mang thiên nhiên vào không gian sống của bạn với bộ sưu tập cây cảnh đa dạng, chất lượng.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <SiZalo className="text-sm" />
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-lg">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/cay-canh', label: 'Cây cảnh' },
                { to: '/tu-van-cay', label: 'Tư vấn chọn cây' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Khách hàng */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-lg">Hỗ trợ</h4>
            <ul className="space-y-3">
              {[
                { to: '/don-hang', label: 'Đơn hàng của tôi' },
                { to: '/gio-hang', label: 'Giỏ hàng' },
                { to: '/tai-khoan', label: 'Tài khoản' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-lg">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>123 Hoa Cảnh, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhoneAlt className="text-primary-400 flex-shrink-0 text-xs" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-primary-400 flex-shrink-0 text-xs" />
                <span>queen@caycanh.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần dưới cùng */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Queen CayCanhShop. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-400 text-xs" /> in Vietnam
          </p>
        </div>
      </div>

      {/* Vòng tròn mờ trang trí */}
      <div className="absolute top-20 -right-20 w-60 h-60 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-40 h-40 bg-primary-500/5 rounded-full blur-2xl" />
    </footer>
  )
}

export default Footer
