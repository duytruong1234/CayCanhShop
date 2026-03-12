import { useState, useEffect } from 'react'
import { FaSave, FaCalculator } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

    useEffect(() => { fetchMatrix() }, [])

    useEffect(() => {
        const keys = tieuChis.map(tc => tc.ma_tieu_chi)
        const n = keys.length
        if (n < 3 || Object.keys(matrix).length === 0) return

        const colSums = {}
        keys.forEach(col => { colSums[col] = keys.reduce((sum, row) => sum + (matrix[row]?.[col] || 1), 0) || 1 })

        const weightsArr = []
        keys.forEach(row => {
            let rowAvg = 0
            keys.forEach(col => { rowAvg += (matrix[row]?.[col] || 1) / colSums[col] })
            weightsArr.push(rowAvg / n)
        })

        let lambdaMax = 0
        for (let i = 0; i < n; i++) {
            let weightedSum = 0
            for (let j = 0; j < n; j++) { weightedSum += (matrix[keys[i]]?.[keys[j]] || 1) * weightsArr[j] }
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
            setMatrix(data.matrix || {}); setTieuChis(data.tieu_chis || []); setCr(data.cr || 0)
        } catch (err) { console.error('Error fetching matrix:', err) }
        finally { setLoading(false) }
    }

    const handleCellChange = (dong, cot, value) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) return
        setMatrix(prev => ({
            ...prev,
            [dong]: { ...prev[dong], [cot]: numValue },
            [cot]: { ...prev[cot], [dong]: dong !== cot ? 1 / numValue : 1 }
        }))
    }

    const saveMatrix = async () => {
        setSaving(true)
        try {
            const cells = []
            const keys = tieuChis.map(tc => tc.ma_tieu_chi)
            for (const dong of keys) {
                for (const cot of keys) {
                    if (dong <= cot) { cells.push({ dong, cot, gia_tri: matrix[dong]?.[cot] || 1 }) }
                }
            }
            await fetch(`${API_URL}/tieu-chi/ma-tran`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cells }) })
            alert('Lưu ma trận thành công!')
        } catch (err) { console.error(err); alert('Lỗi khi lưu') }
        finally { setSaving(false) }
    }

    const calculateWeights = async () => {
        setCalculating(true)
        try {
            const res = await fetch(`${API_URL}/tieu-chi/tinh-trong-so`, { method: 'POST' })
            const data = await res.json()
            setCr(data.cr); await fetchMatrix()
            alert(data.is_consistent ? `Tính trọng số thành công! CR = ${data.cr.toFixed(4)} (Hợp lệ)` : `Cảnh báo: CR = ${data.cr.toFixed(4)} >= 0.1. Dữ liệu không nhất quán!`)
        } catch (err) { console.error(err); alert('Lỗi khi tính trọng số') }
        finally { setCalculating(false) }
    }

    if (loading) return (
        <div className="admin-page flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
    )

    const keys = tieuChis.map(tc => tc.ma_tieu_chi)

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1>Ma trận so sánh tiêu chí AHP</h1>
                <div className="flex items-center gap-3">
                    <span className={`admin-badge ${cr < 0.1 ? 'admin-badge-green' : 'admin-badge-red'}`}>
                        CR = {cr.toFixed(4)} {cr < 0.1 ? '(Hợp lệ)' : '(Không hợp lệ)'}
                    </span>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="admin-table-wrap mb-6">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th></th>
                            {keys.map(k => <th key={k} className="text-center">{k}</th>)}
                            <th className="text-center">Trọng số</th>
                            <th className="text-center">Tiêu chí đánh giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((dong, i) => {
                            const tc = tieuChis.find(t => t.ma_tieu_chi === dong)
                            return (
                                <tr key={dong}>
                                    <td className="font-bold">{dong}</td>
                                    {keys.map((cot, j) => {
                                        const isDiagonal = dong === cot
                                        const isUpperTriangle = i < j
                                        const value = matrix[dong]?.[cot] || 1
                                        return (
                                            <td key={cot} className="text-center" style={{ padding: '6px 8px' }}>
                                                {isDiagonal ? (
                                                    <span className="text-gray-400">1.000</span>
                                                ) : isUpperTriangle ? (
                                                    <input
                                                        type="number" step="0.001" min="0.111" max="9"
                                                        value={value.toFixed(3)}
                                                        onChange={(e) => handleCellChange(dong, cot, e.target.value)}
                                                        className="w-20 p-1.5 text-center border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">{value.toFixed(3)}</span>
                                                )}
                                            </td>
                                        )
                                    })}
                                    <td className="text-center font-semibold text-primary-600">{(tc?.trong_so || 0).toFixed(3)}</td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/admin/quan-ly-dac-diem/${tc.ma_tieu_chi}`)}
                                            className="admin-btn admin-btn-sm admin-btn-primary w-full justify-center"
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
            <div className="flex gap-3">
                <button onClick={saveMatrix} disabled={saving} className="admin-btn admin-btn-info disabled:opacity-50">
                    <FaSave size={13} /> {saving ? 'Đang lưu...' : 'Lưu ma trận'}
                </button>
                <button onClick={calculateWeights} disabled={calculating} className="admin-btn admin-btn-primary disabled:opacity-50">
                    <FaCalculator size={13} /> {calculating ? 'Đang tính...' : 'Tính trọng số'}
                </button>
            </div>
        </div>
    )
}

export default TieuChiAHP
