import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../services/cayCanhService'
import { FaLeaf, FaShippingFast, FaHeadset, FaArrowRight, FaStar } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const Home = () => {
  const { data: cayCanhs, isLoading } = useQuery({
    queryKey: ['cayCanh', 'featured'],
    queryFn: () => cayCanhService.getAll({ limit: 8 })
  })

  return (
    <div className="page-enter">
      {/* Phần Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        {/* Các yếu tố trang trí */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6 animate-fade-in border border-white/10">
              <FaLeaf className="text-primary-300 text-xs" />
              <span className="text-primary-100">Cửa hàng cây cảnh #1 Việt Nam</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 animate-fade-in-up leading-tight">
              Mang thiên nhiên vào
              <span className="block text-primary-300"> không gian sống</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-100/80 mb-10 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Khám phá bộ sưu tập cây cảnh tuyển chọn, với dịch vụ tư vấn chuyên nghiệp giúp bạn chọn cây phù hợp nhất
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/cay-canh"
                className="btn-premium bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 text-base font-bold shadow-xl hover:shadow-2xl"
              >
                Khám phá ngay
                <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/tu-van-cay"
                className="btn-premium border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base"
              >
                <FaLeaf className="text-sm" />
                Tư vấn chọn cây
              </Link>
            </div>
          </div>
        </div>

        {/* Sóng dưới cùng */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0,40 C360,0 1080,80 1440,20 L1440,60 L0,60 Z" fill="#f8faf9" />
          </svg>
        </div>
      </section>

      {/* Tính năng nổi bật */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: FaLeaf,
                title: 'Cây cảnh chất lượng',
                desc: 'Tuyển chọn kỹ lưỡng từ nguồn uy tín, đảm bảo cây khỏe mạnh',
                color: 'from-primary-400 to-primary-600'
              },
              {
                icon: FaShippingFast,
                title: 'Giao hàng nhanh',
                desc: 'Giao hàng toàn quốc, đóng gói cẩn thận và chuyên nghiệp',
                color: 'from-blue-400 to-blue-600'
              },
              {
                icon: FaHeadset,
                title: 'Hỗ trợ 24/7',
                desc: 'Tư vấn chăm sóc cây miễn phí từ đội ngũ chuyên gia',
                color: 'from-amber-400 to-amber-600'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Cây cảnh nổi bật</h2>
            <p className="section-subtitle">Những sản phẩm được yêu thích và đánh giá cao nhất</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
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
                      src={cay.hinh_anh ? `${API_URL}/static/images/${cay.hinh_anh}` : '/placeholder.jpg'}
                      alt={cay.ten_cay}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Lớp phủ khi hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Nút xem nhanh */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="btn-premium btn-primary w-full text-xs py-2">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 text-sm group-hover:text-primary-600 transition-colors">
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

          <div className="text-center mt-12">
            <Link
              to="/cay-canh"
              className="btn-premium btn-primary px-10 py-3.5 text-base"
            >
              Xem tất cả sản phẩm
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Gợi ý AHP */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-sage-50" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-sage-200/40 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
              <FaLeaf className="text-white text-2xl" />
            </div>
            <h2 className="section-heading">Không biết chọn cây nào?</h2>
            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
              Hãy để chúng tôi giúp bạn! Hệ thống tư vấn thông minh sẽ gợi ý
              loại cây phù hợp nhất với không gian và nhu cầu của bạn.
            </p>
            <Link
              to="/tu-van-cay"
              className="btn-premium btn-primary px-10 py-4 text-lg"
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
