import { useState, useEffect } from 'react'
import { FaSave, FaCalculator, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Bảng RI chuẩn Saaty
const RI_VALUES = {
    1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
    6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}

const TieuChiAHP = () => {
    const navigate = useNavigate()
    const [matrix, setMatrix] = useState({})
    const [tieuChis, setTieuChis] = useState([])
    const [cr, setCr] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [calculating, setCalculating] = useState(false)

    // Tải dữ liệu ma trận khi khởi động
    useEffect(() => {
        fetchMatrix()
    }, [])

    // Tính CR trực tiếp mỗi khi ma trận thay đổi (live update)
    useEffect(() => {
        const keys = tieuChis.map(tc => tc.ma_tieu_chi)
        const n = keys.length
        if (n < 3 || Object.keys(matrix).length === 0) return

        // Bước 1: Tính tổng cột
        const colSums = {}
        keys.forEach(col => {
            colSums[col] = keys.reduce((sum, row) => sum + (matrix[row]?.[col] || 1), 0) || 1
        })

        // Bước 2: Chuẩn hóa và tính trọng số (trung bình dòng)
        const weightsArr = []
        keys.forEach(row => {
            let rowAvg = 0
            keys.forEach(col => {
                rowAvg += (matrix[row]?.[col] || 1) / colSums[col]
            })
            weightsArr.push(rowAvg / n)
        })

        // Bước 3: Tính λ_max → CI → CR
        let lambdaMax = 0
        for (let i = 0; i < n; i++) {
            let weightedSum = 0
            for (let j = 0; j < n; j++) {
                weightedSum += (matrix[keys[i]]?.[keys[j]] || 1) * weightsArr[j]
            }
            if (weightsArr[i] > 0) lambdaMax += weightedSum / weightsArr[i]
        }
        lambdaMax /= n

        const ci = (lambdaMax - n) / (n - 1)
        const ri = RI_VALUES[n] || 1.49
        const newCr = ri > 0 ? ci / ri : 0
        setCr(Math.max(0, newCr))
    }, [matrix, tieuChis])

    const fetchMatrix = async () => {
        try {
            const res = await fetch(`${API_URL}/tieu-chi/ma-tran`)
            const data = await res.json()
            setMatrix(data.matrix || {})
            setTieuChis(data.tieu_chis || [])
            setCr(data.cr || 0)
        } catch (err) {
            console.error('Error fetching matrix:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCellChange = async (dong, cot, value) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) return

        // Update local state
        setMatrix(prev => ({
            ...prev,
            [dong]: {
                ...prev[dong],
                [cot]: numValue
            },
            // Auto-update reciprocal
            [cot]: {
                ...prev[cot],
                [dong]: dong !== cot ? 1 / numValue : 1
            }
        }))
    }

    const saveMatrix = async () => {
        setSaving(true)
        try {
            const cells = []
            const keys = tieuChis.map(tc => tc.ma_tieu_chi)

            for (const dong of keys) {
                for (const cot of keys) {
                    if (dong <= cot) { // Only upper triangle + diagonal
                        cells.push({
                            dong,
                            cot,
                            gia_tri: matrix[dong]?.[cot] || 1
                        })
                    }
                }
            }

            await fetch(`${API_URL}/tieu-chi/ma-tran`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cells })
            })

            alert('Lưu ma trận thành công!')
        } catch (err) {
            console.error(err)
            alert('Lỗi khi lưu')
        } finally {
            setSaving(false)
        }
    }

    const calculateWeights = async () => {
        setCalculating(true)
        try {
            const res = await fetch(`${API_URL}/tieu-chi/tinh-trong-so`, {
                method: 'POST'
            })
            const data = await res.json()

            setCr(data.cr)

            // Refresh to get updated weights
            await fetchMatrix()

            if (data.is_consistent) {
                alert(`Tính trọng số thành công! CR = ${data.cr.toFixed(4)} (Hợp lệ)`)
            } else {
                alert(`Cảnh báo: CR = ${data.cr.toFixed(4)} >= 0.1. Dữ liệu không nhất quán!`)
            }
        } catch (err) {
            console.error(err)
            alert('Lỗi khi tính trọng số')
        } finally {
            setCalculating(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Đang tải...</div>
    }

    const keys = tieuChis.map(tc => tc.ma_tieu_chi)

    return (
        <div className="p-6 bg-[#A3B18A] min-h-screen">
            <div className="mb-6">
                <button className="bg-[#6A8455] text-white px-6 py-3 rounded-lg font-semibold shadow-md">
                    Nhóm tiêu chí
                </button>
            </div>

            {/* CR Display */}
            <div className="mb-6 flex">
                <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200 font-semibold">
                    Chỉ số CR : {cr.toFixed(4)}
                </div>
            </div>

            <div className="overflow-x-auto mb-6 bg-white rounded-lg shadow-lg border-2 border-purple-500 p-1">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-200 p-4 text-left"></th>
                            {keys.map(k => (
                                <th key={k} className="border-b border-gray-200 p-4 text-center font-bold text-lg">{k}</th>
                            ))}
                            <th className="border-b border-gray-200 p-4 text-center font-bold text-lg">Trọng số</th>
                            <th className="border-b border-gray-200 p-4 text-center font-bold text-lg">Tiêu chí đánh giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((dong, i) => {
                            const tc = tieuChis.find(t => t.ma_tieu_chi === dong)
                            return (
                                <tr key={dong} className="border-b border-gray-100">
                                    <td className="p-4 font-bold text-lg">{dong}</td>
                                    {keys.map((cot, j) => {
                                        const isDiagonal = dong === cot
                                        const isUpperTriangle = i < j
                                        const value = matrix[dong]?.[cot] || 1

                                        return (
                                            <td key={cot} className="p-2 text-center">
                                                {isDiagonal ? (
                                                    <span className="block text-center text-gray-500">1.000</span>
                                                ) : isUpperTriangle ? (
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        min="0.111"
                                                        max="9"
                                                        value={value.toFixed(3)}
                                                        onChange={(e) => handleCellChange(dong, cot, e.target.value)}
                                                        className="w-full p-2 text-center border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                ) : (
                                                    <span className="block text-center text-gray-700">
                                                        {value.toFixed(3)}
                                                    </span>
                                                )}
                                            </td>
                                        )
                                    })}
                                    <td className="p-4 text-center font-medium text-lg">
                                        {(tc?.trong_so || 0).toFixed(3)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => navigate(`/admin/quan-ly-dac-diem/${tc.ma_tieu_chi}`)}
                                            className="w-full px-4 py-3 bg-[#6A8455] text-white rounded-lg hover:bg-[#5a7048] transition shadow-md font-medium"
                                        >
                                            {tc?.ten_tieu_chi || ''}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={saveMatrix}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <FaSave />
                    {saving ? 'Đang lưu...' : 'Lưu ma trận'}
                </button>
                <button
                    onClick={calculateWeights}
                    disabled={calculating}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    <FaCalculator />
                    {calculating ? 'Đang tính...' : 'Tính trọng số'}
                </button>
            </div>

            {
                /* Removed Help Text */
            }
        </div>
    )
}

export default TieuChiAHP
