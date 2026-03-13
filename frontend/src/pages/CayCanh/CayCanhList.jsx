import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../../services/cayCanhService'
import { FaFilter, FaTimes, FaSearch, FaShoppingCart, FaLeaf } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CayCanhList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const loaiCayId = searchParams.get('loai_cay_id') || ''
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    keyword,
    loai_cay_id: loaiCayId
  })

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      loai_cay_id: searchParams.get('loai_cay_id') || ''
    })
  }, [searchParams])

  const { data: cayCanhs, isLoading } = useQuery({
    queryKey: ['cayCanh', filters],
    queryFn: () => cayCanhService.getAll(filters)
  })

  const { data: loaiCays } = useQuery({
    queryKey: ['loaiCay'],
    queryFn: cayCanhService.getLoaiCay
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (newFilters.keyword) params.set('keyword', newFilters.keyword)
    if (newFilters.loai_cay_id) params.set('loai_cay_id', newFilters.loai_cay_id)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({ keyword: '', loai_cay_id: '' })
    setSearchParams({})
  }

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

  const hasActiveFilters = filters.keyword || filters.loai_cay_id

  return (
    <div className="page-enter bg-gray-50/30">
      {/* Page Header - Modern UI 2025 */}
      <div className="bg-gradient-to-b from-primary-50/80 to-transparent pt-10 pb-6 border-b border-primary-100/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 text-primary-700 text-sm font-semibold mb-4 shadow-[0_2px_10px_rgba(5,150,105,0.08)] backdrop-blur-md border border-primary-100">
              <FaLeaf className="text-primary-500" />
              <span>Bộ sưu tập</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">
              Danh sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-400">cây cảnh</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg">
              Khám phá bộ sưu tập đa dạng, mang không gian xanh tươi và nghệ thuật thiên nhiên vào phong cách sống của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 sticky top-24 border border-gray-100/60">
              <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2.5 mb-6 text-lg">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FaFilter className="text-primary-500 text-xs" />
                </div>
                Bộ lọc
              </h3>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="Tên cây..."
                    className="input-premium pl-10 py-3 rounded-xl"
                  />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  Loại cây
                </label>
                <select
                  value={filters.loai_cay_id}
                  onChange={(e) => handleFilterChange('loai_cay_id', e.target.value)}
                  className="input-premium py-3 rounded-xl"
                >
                  <option value="">Tất cả loại cây</option>
                  {loaiCays?.map((loai) => (
                    <option key={loai.loai_cay_id} value={loai.loai_cay_id}>
                      {loai.ten_loai}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50/80 py-3 rounded-xl transition-all font-medium"
                >
                  <FaTimes className="text-xs" /> Xóa bộ lọc
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {!isLoading && cayCanhs && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-400">
                  Hiển thị <span className="font-semibold text-gray-700">{cayCanhs.length}</span> sản phẩm
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-24">
                <div className="spinner" />
              </div>
            ) : cayCanhs?.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-[var(--shadow-sm)] border border-gray-100/60">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <FaSearch className="text-gray-300 text-2xl" />
                </div>
                <p className="text-gray-600 text-lg font-semibold mb-2">Không tìm thấy cây cảnh nào</p>
                <p className="text-gray-400 text-sm mb-5">Thử thay đổi bộ lọc để tìm kiếm</p>
                <button onClick={clearFilters} className="btn-premium btn-secondary text-sm py-2.5 px-6">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                      {/* Stock badge */}
                      <div className="absolute top-3 left-3">
                        {cay.so_luong_ton > 0 ? (
                          <span className="badge badge-success text-[10px]">Còn hàng</span>
                        ) : (
                          <span className="badge badge-danger text-[10px]">Hết hàng</span>
                        )}
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      {/* Quick add */}
                      {cay.so_luong_ton > 0 && (
                        <button
                          onClick={(e) => handleQuickAdd(e, cay.cay_canh_id)}
                          className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          <FaShoppingCart className="text-xs" />
                        </button>
                      )}
                    </div>
                    <div className="p-4 lg:p-5">
                      <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wider font-medium">
                        {cay.loai_cay?.ten_loai || 'Chưa phân loại'}
                      </p>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default CayCanhList
