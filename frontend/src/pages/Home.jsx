import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../services/cayCanhService'
import { FaLeaf, FaShippingFast, FaHeadset, FaArrowRight, FaStar, FaShoppingCart } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const Home = () => {
  const { data: cayCanhs, isLoading } = useQuery({
    queryKey: ['cayCanh', 'featured'],
    queryFn: () => cayCanhService.getAll({ limit: 8 })
  })
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleQuickAdd = async (e, cayId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng')
      navigate('/dang-nhap')
      return
    }
    try {
      await addToCart(cayId)
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra')
    }
  }

  return (
    <div className="page-enter">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#022c22] via-primary-900 to-primary-800 text-white">
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-primary-300/8 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-full px-5 py-2 text-sm mb-8 border border-white/[0.08] animate-[fadeIn_0.6s_ease-out]">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-primary-200 font-medium">Cửa hàng cây cảnh #1 Việt Nam</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold mb-7 animate-[fadeInUp_0.7s_ease-out] leading-[1.1] tracking-tight">
              Mang thiên nhiên vào
              <span className="block mt-2 bg-gradient-to-r from-primary-300 via-primary-200 to-primary-400 bg-clip-text text-transparent">không gian sống</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-100/70 mb-12 max-w-2xl mx-auto animate-[fadeInUp_0.8s_ease-out] leading-relaxed font-light">
              Khám phá bộ sưu tập cây cảnh tuyển chọn, với dịch vụ tư vấn chuyên nghiệp giúp bạn chọn cây phù hợp nhất
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_0.9s_ease-out]">
              <Link
                to="/cay-canh"
                className="btn-premium bg-white text-primary-800 hover:bg-primary-50 px-8 py-4 text-base font-bold shadow-xl hover:shadow-2xl"
              >
                Khám phá ngay
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/tu-van-cay"
                className="btn-premium border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-base backdrop-blur-sm"
              >
                <FaLeaf className="text-sm" />
                Tư vấn chọn cây
              </Link>
            </div>

            {/* Stats bar */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 animate-[fadeIn_1.1s_ease-out]">
              {[
                { num: '500+', label: 'Loại cây' },
                { num: '10K+', label: 'Khách hàng' },
                { num: '4.9★', label: 'Đánh giá' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-heading font-extrabold text-white">{stat.num}</p>
                  <p className="text-primary-300/60 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0,50 C360,0 1080,80 1440,30 L1440,80 L0,80 Z" fill="#f6f8f7" />
          </svg>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: FaLeaf,
                title: 'Cây cảnh chất lượng',
                desc: 'Tuyển chọn kỹ lưỡng từ nguồn uy tín, đảm bảo cây khỏe mạnh',
                color: 'from-primary-400 to-primary-600',
                bg: 'bg-primary-50/50',
              },
              {
                icon: FaShippingFast,
                title: 'Giao hàng nhanh',
                desc: 'Giao hàng toàn quốc, đóng gói cẩn thận và chuyên nghiệp',
                color: 'from-blue-400 to-blue-600',
                bg: 'bg-blue-50/50',
              },
              {
                icon: FaHeadset,
                title: 'Hỗ trợ 24/7',
                desc: 'Tư vấn chăm sóc cây miễn phí từ đội ngũ chuyên gia',
                color: 'from-amber-400 to-amber-600',
                bg: 'bg-amber-50/50',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} rounded-3xl p-8 lg:p-9 transition-all duration-500 hover:-translate-y-2 text-center group border border-white/60 hover:shadow-lg hover:border-white`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-800 mb-2.5">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-primary-600 text-sm font-semibold tracking-wider uppercase mb-3">Bộ sưu tập</span>
            <h2 className="section-heading">Cây cảnh nổi bật</h2>
            <p className="section-subtitle">Những sản phẩm được yêu thích và đánh giá cao nhất</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {cayCanhs?.map((cay) => (
                <Link
                  key={cay.cay_canh_id}
                  to={`/cay-canh/${cay.cay_canh_id}`}
                  className="card-premium group"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={cay.hinh_anh ? `${API_URL}/static/images/${cay.hinh_anh}` : ''}
                      alt={cay.ten_cay}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='60' fill='%2322c55e'%3E🌿%3C/text%3E%3Ctext x='200' y='230' text-anchor='middle' font-size='16' fill='%2386efac'%3EKhông có hình ảnh%3C/text%3E%3C/svg%3E"
                      }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    {/* Quick actions */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400">
                      <span className="flex-1 btn-premium btn-primary text-xs py-2.5 text-center">
                        Xem chi tiết
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, cay.cay_canh_id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <FaShoppingCart className="text-xs" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 lg:p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm group-hover:text-primary-600 transition-colors duration-300">
                      {cay.ten_cay}
                    </h3>
                    <p className="text-lg font-heading font-bold text-primary-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cay.gia)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              to="/cay-canh"
              className="btn-premium btn-primary px-10 py-4 text-base shadow-lg hover:shadow-xl"
            >
              Xem tất cả sản phẩm
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA AHP Section ===== */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-sage-50/50" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-52 h-52 bg-sage-200/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="w-18 h-18 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ width: '72px', height: '72px', animation: 'float 6s ease-in-out infinite' }}>
              <FaLeaf className="text-white text-2xl" />
            </div>

            <span className="inline-block text-primary-600 text-sm font-semibold tracking-wider uppercase mb-3">Tính năng đặc biệt</span>
            <h2 className="section-heading">Không biết chọn cây nào?</h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
              Hãy để chúng tôi giúp bạn! Hệ thống tư vấn thông minh sẽ gợi ý
              loại cây phù hợp nhất với không gian và nhu cầu của bạn.
            </p>
            <Link
              to="/tu-van-cay"
              className="btn-premium btn-primary px-10 py-4 text-lg shadow-lg hover:shadow-xl"
            >
              <FaStar className="text-sm" />
              Tư vấn chọn cây phù hợp
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
