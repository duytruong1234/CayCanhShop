import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHistory, FaLeaf, FaChevronRight, FaUser, FaArrowLeft } from 'react-icons/fa'
import { ahpService } from '../../services/ahpService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const LichSuAHP = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ahpService.getMyAHPHistory()
        setHistory(data)
      } catch (err) {
        console.error('Lỗi tải lịch sử AHP:', err)
      } finally { setLoading(false) }
    }
    fetchHistory()
  }, [])

  const formatDate = (isoStr) => {
    if (!isoStr) return '—'
    const d = new Date(isoStr)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="flex justify-center py-24"><div className="spinner" /></div>

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaUser className="text-xs" />
            <Link to="/tai-khoan" className="hover:text-primary-200 transition-colors">Tài khoản</Link>
            <FaChevronRight className="text-[8px] text-primary-400/40" />
            <span className="text-primary-200">Lịch sử AHP</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Lịch sử tư vấn AHP</h1>
          <p className="text-primary-300/60 text-sm mt-2">Xem lại các lần đánh giá cây cảnh bằng phương pháp AHP</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-3xl">
        {/* Back button */}
        <Link to="/tai-khoan" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <FaArrowLeft className="text-xs" /> Quay lại tài khoản
        </Link>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-12 text-center">
            <FaLeaf className="text-4xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold text-gray-400 mb-2">Chưa có lịch sử đánh giá</h3>
            <p className="text-gray-400 text-sm mb-6">Hãy thử công cụ tư vấn AHP để tìm cây cảnh phù hợp với bạn</p>
            <Link to="/tu-van-cay" className="btn-premium btn-primary text-sm py-3 px-6 inline-flex gap-2 shadow-md">
              <FaLeaf className="text-xs" /> Bắt đầu tư vấn
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-sm text-gray-400 mb-2">
              Tổng cộng <strong className="text-gray-700">{history.length}</strong> lần đánh giá
            </div>

            {history.map((item, idx) => (
              <div
                key={item.lich_su_ahp_id || idx}
                className="bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-5 lg:p-6 hover:shadow-[var(--shadow-md)] hover:border-primary-100/60 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {history.length - idx}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Lần đánh giá #{history.length - idx}</p>
                      <p className="text-xs text-gray-400">{formatDate(item.ngay_danh_gia)}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${
                    item.cr_tieu_chi < 0.1
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    CR = {item.cr_tieu_chi?.toFixed(4)} {item.cr_tieu_chi < 0.1 ? '✓' : '✗'}
                  </span>
                </div>

                {/* Trọng số tiêu chí */}
                {item.trong_so_tieu_chi && Object.keys(item.trong_so_tieu_chi).length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Trọng số tiêu chí</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.trong_so_tieu_chi).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                          <span className="text-xs text-gray-500">{key}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                              style={{ width: `${Math.min(val * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{(val * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top kết quả */}
                {item.ket_qua && item.ket_qua.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Top kết quả</p>
                    <div className="space-y-2">
                      {item.ket_qua.slice(0, 3).map((plant, pIdx) => (
                        <div
                          key={pIdx}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            pIdx === 0
                              ? 'bg-amber-50/70 border border-amber-200/60'
                              : 'bg-gray-50/50 hover:bg-gray-100/50'
                          }`}
                        >
                          <span className="text-sm font-bold w-6 text-center">
                            {pIdx === 0 ? '🥇' : pIdx === 1 ? '🥈' : '🥉'}
                          </span>
                          <span className={`flex-1 text-sm ${pIdx === 0 ? 'font-semibold text-amber-800' : 'text-gray-700'}`}>
                            {plant.ten_cay}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5 hidden sm:block">
                              <div
                                className={`h-full rounded-full ${pIdx === 0 ? 'bg-amber-400' : 'bg-primary-400'}`}
                                style={{ width: `${plant.score}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${pIdx === 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                              {plant.score}%
                            </span>
                          </div>
                          {plant.cay_canh_id && (
                            <Link
                              to={`/cay-canh/${plant.cay_canh_id}`}
                              className="text-[10px] text-primary-500 hover:text-primary-700 font-semibold px-2 py-1 rounded-md hover:bg-primary-50 transition-colors"
                            >
                              Xem
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LichSuAHP
