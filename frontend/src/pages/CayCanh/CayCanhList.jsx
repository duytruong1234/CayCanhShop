import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cayCanhService } from '../../services/cayCanhService'
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CayCanhList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const loaiCayId = searchParams.get('loai_cay_id') || ''

  const [filters, setFilters] = useState({
    keyword,
    loai_cay_id: loaiCayId
  })

  // Đồng bộ bộ lọc với URL params
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

  const hasActiveFilters = filters.keyword || filters.loai_cay_id

  return (
    <div className="page-enter">
      {/* Tiêu đề trang */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-2">Danh sách cây cảnh</h1>
          <p className="text-primary-100 text-sm">Khám phá bộ sưu tập cây cảnh đa dạng và phong phú</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Bộ lọc Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2 mb-5 text-lg">
                <FaFilter className="text-primary-500 text-sm" /> Bộ lọc
              </h3>

              {/* Tìm kiếm */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="Tên cây..."
                    className="input-premium pl-10 py-3"
                  />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Loại cây */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Loại cây
                </label>
                <select
                  value={filters.loai_cay_id}
                  onChange={(e) => handleFilterChange('loai_cay_id', e.target.value)}
                  className="input-premium py-3"
                >
                  <option value="">Tất cả loại cây</option>
                  {loaiCays?.map((loai) => (
                    <option key={loai.loai_cay_id} value={loai.loai_cay_id}>
                      {loai.ten_loai}
                    </option>
                  ))}
                </select>
              </div>

              {/* Xóa bộ lọc */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-all"
                >
                  <FaTimes className="text-xs" /> Xóa bộ lọc
                </button>
              )}
            </div>
          </aside>

          {/* Lưới sản phẩm */}
          <div className="flex-1">
            {/* Số lượng kết quả */}
            {!isLoading && cayCanhs && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  Hiển thị <span className="font-semibold text-gray-800">{cayCanhs.length}</span> sản phẩm
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="spinner" />
              </div>
            ) : cayCanhs?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-card">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-300 text-2xl" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy cây cảnh nào</p>
                <p className="text-gray-400 text-sm mb-4">Thử thay đổi bộ lọc để tìm kiếm</p>
                <button onClick={clearFilters} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
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
                        src={cay.hinh_anh ? `${API_URL}/static/images/${cay.hinh_anh}` : '/placeholder.jpg'}
                        alt={cay.ten_cay}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Huy hiệu tồn kho */}
                      <div className="absolute top-3 left-3">
                        {cay.so_luong_ton > 0 ? (
                          <span className="badge badge-success text-[10px]">Còn hàng</span>
                        ) : (
                          <span className="badge badge-danger text-[10px]">Hết hàng</span>
                        )}
                      </div>
                      {/* Lớp phủ khi hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        {cay.loai_cay?.ten_loai || 'Chưa phân loại'}
                      </p>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm group-hover:text-primary-600 transition-colors">
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
