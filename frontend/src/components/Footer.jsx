import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLeaf, FaHeart, FaPaperPlane } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0a2016] via-[#0d2f1f] to-[#0a2016] text-white mt-auto relative overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-[3px] bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300" />

      <div className="container mx-auto px-4 lg:px-6 py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[14px] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_24px_rgba(5,150,105,0.4)] transition-all duration-500">
                <FaLeaf className="text-white text-base" />
              </div>
              <span className="text-2xl font-heading font-extrabold text-white tracking-tight">Queen</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[280px]">
              Mang thiên nhiên vào không gian sống của bạn với bộ sưu tập cây cảnh đa dạng, chất lượng hàng đầu.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, hoverBg: 'hover:bg-blue-500', label: 'Facebook' },
                { icon: FaInstagram, hoverBg: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500', label: 'Instagram' },
                { icon: SiZalo, hoverBg: 'hover:bg-blue-400', label: 'Zalo' },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className={`w-10 h-10 bg-white/[0.07] ${social.hoverBg} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-5 text-base tracking-tight">Khám phá</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/cay-canh', label: 'Cây cảnh' },
                { to: '/tu-van-cay', label: 'Tư vấn chọn cây' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-all duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-5 text-base tracking-tight">Hỗ trợ</h4>
            <ul className="space-y-3">
              {[
                { to: '/don-hang', label: 'Đơn hàng của tôi' },
                { to: '/gio-hang', label: 'Giỏ hàng' },
                { to: '/tai-khoan', label: 'Tài khoản' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-all duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-semibold text-white mb-5 text-base tracking-tight">Liên hệ</h4>
            <ul className="space-y-3.5 mb-6">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-primary-400 text-xs" />
                </div>
                <span className="leading-relaxed">123 Hoa Cảnh, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-primary-400 text-xs" />
                </div>
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-primary-400 text-xs" />
                </div>
                <span>queen@caycanh.vn</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email nhận tin..."
                className="flex-1 bg-white/[0.07] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.1] transition-all duration-300"
              />
              <button className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-sm font-medium hover:shadow-[0_4px_16px_rgba(5,150,105,0.3)] transition-all duration-300 hover:scale-105">
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Queen CayCanhShop. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Made with <FaHeart className="text-red-400 text-xs animate-pulse" /> in Vietnam
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 -right-32 w-80 h-80 bg-primary-500/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-52 h-52 bg-primary-500/[0.03] rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-primary-400/[0.02] rounded-full blur-3xl" />
    </footer>
  )
}

export default Footer
