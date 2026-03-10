import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../../services/cayCanhService'
import { toast } from 'react-toastify'
import { FaShoppingCart, FaLeaf, FaSun, FaTint, FaCheckCircle, FaTimesCircle, FaChevronLeft } from 'react-icons/fa'
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
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    )
  }

  if (!cay) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Không tìm thấy cây cảnh</p>
        <Link to="/cay-canh" className="text-primary-600 hover:underline mt-4 inline-block">← Quay lại</Link>
      </div>
    )
  }

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <FaChevronLeft className="text-xs" /> Quay lại
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Hình ảnh */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-card">
              <img
                src={cay.hinh_anh ? `${API_URL}/static/images/${cay.hinh_anh}` : '/placeholder.jpg'}
                alt={cay.ten_cay}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Thông tin */}
          <div className="flex flex-col">
            {cay.loai_cay && (
              <span className="badge badge-success w-fit mb-3 text-xs">{cay.loai_cay.ten_loai}</span>
            )}

            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-3">{cay.ten_cay}</h1>

            {cay.thong_tin_khoa_hoc && (
              <p className="text-gray-400 italic text-sm mb-4">
                {cay.thong_tin_khoa_hoc.ten_khoa_hoc}
              </p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-3xl font-heading font-extrabold text-primary-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cay.gia)}
              </p>
            </div>

            <div className="mb-6">
              {cay.so_luong_ton > 0 ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium">
                  <FaCheckCircle className="text-primary-500" /> Còn hàng ({cay.so_luong_ton} sản phẩm)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
                  <FaTimesCircle className="text-red-500" /> Hết hàng
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cay.so_luong_ton === 0}
              className="btn-premium btn-primary w-full md:w-auto py-4 px-10 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group"
            >
              <FaShoppingCart className="group-hover:scale-110 transition-transform" /> Thêm vào giỏ hàng
            </button>

            {/* Thông tin nhanh */}
            {cay.thong_tin_khoa_hoc && (
              <div className="mt-8 p-5 bg-gray-50 rounded-2xl space-y-3">
                <h4 className="font-heading font-semibold text-gray-700 text-sm">Thông tin nhanh</h4>
                <div className="grid grid-cols-2 gap-3">
                  {cay.thong_tin_khoa_hoc.ho_thuc_vat && (
                    <div className="text-xs">
                      <span className="text-gray-400">Họ thực vật</span>
                      <p className="font-medium text-gray-700 mt-0.5">{cay.thong_tin_khoa_hoc.ho_thuc_vat}</p>
                    </div>
                  )}
                  {cay.thong_tin_khoa_hoc.nguon_goc && (
                    <div className="text-xs">
                      <span className="text-gray-400">Nguồn gốc</span>
                      <p className="font-medium text-gray-700 mt-0.5">{cay.thong_tin_khoa_hoc.nguon_goc}</p>
                    </div>
                  )}
                  {cay.thong_tin_khoa_hoc.ten_goi_khac && (
                    <div className="text-xs col-span-2">
                      <span className="text-gray-400">Tên gọi khác</span>
                      <p className="font-medium text-gray-700 mt-0.5">{cay.thong_tin_khoa_hoc.ten_goi_khac}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Các phần nội dung */}
        <div className="mt-12 space-y-6">
          {/* Mô tả */}
          {cay.mo_ta_chi_tiet && (
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
                📖 {cay.mo_ta_chi_tiet.tieu_de}
              </h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{cay.mo_ta_chi_tiet.noi_dung}</p>
            </div>
          )}

          {/* Đặc điểm nổi bật */}
          {cay.dac_diem_noi_bats?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-5 flex items-center gap-2">
                <FaLeaf className="text-primary-500" /> Đặc điểm nổi bật
              </h2>
              <ul className="space-y-3">
                {cay.dac_diem_noi_bats.map((dd, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <FaCheckCircle className="text-primary-500 mt-0.5 flex-shrink-0 text-sm" />
                    <span>{dd.noi_dung}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cách chăm sóc */}
          {cay.cach_cham_socs?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-5">🌱 Hướng dẫn chăm sóc</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cay.cach_cham_socs.map((cs, index) => (
                  <div key={index} className="bg-primary-50/50 rounded-xl p-5 border border-primary-100">
                    <h3 className="font-heading font-semibold text-primary-700 mb-2 text-sm">{cs.tieu_de}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{cs.noi_dung}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thông tin khoa học */}
          {cay.thong_tin_khoa_hoc && (
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-5">🔬 Thông tin khoa học</h2>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">
                  <tbody>
                    {[
                      ['Tên khoa học', cay.thong_tin_khoa_hoc.ten_khoa_hoc, true],
                      ['Họ thực vật', cay.thong_tin_khoa_hoc.ho_thuc_vat],
                      ['Nguồn gốc', cay.thong_tin_khoa_hoc.nguon_goc],
                      ['Tên gọi khác', cay.thong_tin_khoa_hoc.ten_goi_khac],
                    ].map(([label, value, italic], i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-3.5 px-5 font-medium text-gray-500 text-sm bg-gray-50/50 w-40">{label}</td>
                        <td className={`py-3.5 px-5 text-gray-700 text-sm ${italic ? 'italic' : ''}`}>{value}</td>
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
