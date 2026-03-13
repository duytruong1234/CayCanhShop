import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../../services/cayCanhService'
import { toast } from 'react-toastify'
import { FaShoppingCart, FaLeaf, FaCheckCircle, FaTimesCircle, FaChevronLeft } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CayCanhDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const { data: cay, isLoading } = useQuery({
    queryKey: ['cayCanh', id],
    queryFn: () => cayCanhService.getById(id)
  })

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng')
      navigate('/dang-nhap')
      return
    }

    try {
      await addToCart(cay.cay_canh_id)
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="spinner" />
      </div>
    )
  }

  if (!cay) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FaLeaf className="text-gray-300 text-2xl" />
        </div>
        <p className="text-gray-500 text-lg font-medium mb-3">Không tìm thấy cây cảnh</p>
        <Link to="/cay-canh" className="text-primary-600 hover:text-primary-700 font-medium">← Quay lại</Link>
      </div>
    )
  }

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100/60">
        <div className="container mx-auto px-4 lg:px-6 py-3.5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors duration-300 group">
            <FaChevronLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" /> Quay lại
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Image */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-[var(--shadow-md)] group border border-gray-100/60">
              <img
                src={cay.hinh_anh ? `${API_URL}/static/images/${cay.hinh_anh}` : ''}
                alt={cay.ten_cay}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='60' fill='%2322c55e'%3E🌿%3C/text%3E%3Ctext x='200' y='230' text-anchor='middle' font-size='16' fill='%2386efac'%3EKhông có hình ảnh%3C/text%3E%3C/svg%3E"
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {cay.loai_cay && (
              <span className="badge badge-success w-fit mb-4">{cay.loai_cay.ten_loai}</span>
            )}

            <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">{cay.ten_cay}</h1>

            {cay.thong_tin_khoa_hoc && (
              <p className="text-gray-400 italic text-sm mb-5">
                {cay.thong_tin_khoa_hoc.ten_khoa_hoc}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-7">
              <p className="text-3xl lg:text-4xl font-heading font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cay.gia)}
              </p>
            </div>

            <div className="mb-7">
              {cay.so_luong_ton > 0 ? (
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary-50/80 text-primary-700 rounded-2xl text-sm font-medium border border-primary-100/50">
                  <FaCheckCircle className="text-primary-500" /> Còn hàng ({cay.so_luong_ton} sản phẩm)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-red-50/80 text-red-700 rounded-2xl text-sm font-medium border border-red-100/50">
                  <FaTimesCircle className="text-red-500" /> Hết hàng
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cay.so_luong_ton === 0}
              className="btn-premium btn-primary w-full md:w-auto py-4 px-10 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group shadow-lg hover:shadow-xl"
            >
              <FaShoppingCart className="group-hover:scale-110 transition-transform duration-300" /> Thêm vào giỏ hàng
            </button>

            {/* Quick Info */}
            {cay.thong_tin_khoa_hoc && (
              <div className="mt-10 p-6 bg-gray-50/80 rounded-2xl space-y-4 border border-gray-100/60">
                <h4 className="font-heading font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FaLeaf className="text-primary-500 text-[9px]" />
                  </div>
                  Thông tin nhanh
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {cay.thong_tin_khoa_hoc.ho_thuc_vat && (
                    <div className="text-xs">
                      <span className="text-gray-400">Họ thực vật</span>
                      <p className="font-medium text-gray-700 mt-1">{cay.thong_tin_khoa_hoc.ho_thuc_vat}</p>
                    </div>
                  )}
                  {cay.thong_tin_khoa_hoc.nguon_goc && (
                    <div className="text-xs">
                      <span className="text-gray-400">Nguồn gốc</span>
                      <p className="font-medium text-gray-700 mt-1">{cay.thong_tin_khoa_hoc.nguon_goc}</p>
                    </div>
                  )}
                  {cay.thong_tin_khoa_hoc.ten_goi_khac && (
                    <div className="text-xs col-span-2">
                      <span className="text-gray-400">Tên gọi khác</span>
                      <p className="font-medium text-gray-700 mt-1">{cay.thong_tin_khoa_hoc.ten_goi_khac}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-14 space-y-6">
          {/* Description */}
          {cay.mo_ta_chi_tiet && (
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] p-7 lg:p-9 border border-gray-100/60">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-5 flex items-center gap-3">
                <span className="text-2xl">📖</span> {cay.mo_ta_chi_tiet.tieu_de}
              </h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{cay.mo_ta_chi_tiet.noi_dung}</p>
            </div>
          )}

          {/* Features */}
          {cay.dac_diem_noi_bats?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] p-7 lg:p-9 border border-gray-100/60">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FaLeaf className="text-primary-500 text-sm" />
                </div>
                Đặc điểm nổi bật
              </h2>
              <ul className="space-y-3.5">
                {cay.dac_diem_noi_bats.map((dd, index) => (
                  <li key={index} className="flex items-start gap-3.5 text-gray-600">
                    <FaCheckCircle className="text-primary-500 mt-0.5 flex-shrink-0 text-sm" />
                    <span className="leading-relaxed">{dd.noi_dung}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Care Guide */}
          {cay.cach_cham_socs?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] p-7 lg:p-9 border border-gray-100/60">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">🌱</span> Hướng dẫn chăm sóc
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cay.cach_cham_socs.map((cs, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary-50/60 to-primary-50/20 rounded-2xl p-6 border border-primary-100/40 hover:border-primary-200/60 transition-colors duration-300">
                    <h3 className="font-heading font-semibold text-primary-700 mb-2.5 text-sm">{cs.tieu_de}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{cs.noi_dung}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scientific Info */}
          {cay.thong_tin_khoa_hoc && (
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] p-7 lg:p-9 border border-gray-100/60">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">🔬</span> Thông tin khoa học
              </h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full">
                  <tbody>
                    {[
                      ['Tên khoa học', cay.thong_tin_khoa_hoc.ten_khoa_hoc, true],
                      ['Họ thực vật', cay.thong_tin_khoa_hoc.ho_thuc_vat],
                      ['Nguồn gốc', cay.thong_tin_khoa_hoc.nguon_goc],
                      ['Tên gọi khác', cay.thong_tin_khoa_hoc.ten_goi_khac],
                    ].map(([label, value, italic], i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-400 text-sm bg-gray-50/30 w-44">{label}</td>
                        <td className={`py-4 px-6 text-gray-700 text-sm ${italic ? 'italic' : ''}`}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CayCanhDetail
