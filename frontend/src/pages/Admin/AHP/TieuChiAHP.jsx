import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaList } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TieuChiAHP = () => {
    const navigate = useNavigate()
    const [tieuChis, setTieuChis] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTieuChis = async () => {
            try {
                const res = await fetch(`${API_URL}/tieu-chi/ma-tran`)
                const data = await res.json()
                setTieuChis(data.tieu_chis || [])
            } catch (err) { 
                console.error('Error fetching criteria:', err) 
            } finally { 
                setLoading(false) 
            }
        }
        fetchTieuChis()
    }, [])

    if (loading) return (
        <div className="admin-page flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1>Quản lý Tiêu chí Đánh giá</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 italic">Hệ thống trọng số AHP đã được thiết lập cố định</span>
                </div>
            </div>

            {/* Criteria List Table */}
            <div className="admin-table-wrap mb-6">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="w-24 text-center">Mã Tiêu Chí</th>
                            <th>Tên Tiêu Chí (Khía cạnh đánh giá)</th>
                            <th className="w-32 text-center">Trọng số AHP</th>
                            <th className="w-40 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tieuChis.map((tc) => (
                            <tr key={tc.ma_tieu_chi}>
                                <td className="text-center font-bold text-gray-600">{tc.ma_tieu_chi}</td>
                                <td className="font-semibold text-gray-800">{tc.ten_tieu_chi}</td>
                                <td className="text-center font-bold text-primary-600">
                                    {(tc.trong_so || 0).toFixed(3)}
                                </td>
                                <td>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => navigate(`/admin/quan-ly-dac-diem/${tc.ma_tieu_chi}`)}
                                            className="admin-btn admin-btn-sm admin-btn-primary"
                                        >
                                            <FaList size={12} className="mr-1.5" /> Quản lý đặc điểm
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TieuChiAHP
