import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaSave } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const RI_VALUES = {
    1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
    6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}

const PhuongAnAHP = () => {
    const { maTieuChi } = useParams()
    const [tieuChis, setTieuChis] = useState([])
    const [selectedTieuChi, setSelectedTieuChi] = useState(maTieuChi || '')
    const [matrix, setMatrix] = useState({})
    const [plants, setPlants] = useState([])
    const [weights, setWeights] = useState({})
    const [cr, setCr] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => { fetchTieuChis() }, [])
    useEffect(() => { if (maTieuChi) setSelectedTieuChi(maTieuChi) }, [maTieuChi])
    useEffect(() => { if (selectedTieuChi) fetchMatrix(selectedTieuChi) }, [selectedTieuChi])

    const fetchTieuChis = async () => {
        try {
            const res = await fetch(`${API_URL}/tieu-chi`)
            const data = await res.json()
            setTieuChis(data)
            if (!maTieuChi && data.length > 0) setSelectedTieuChi(data[0].ma_tieu_chi)
        } catch (err) { console.error('Error fetching criteria:', err) }
    }

    const fetchMatrix = async (maTieuChi) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/phuong-an/${maTieuChi}`)
            const data = await res.json()
            setMatrix(data.matrix || {}); setPlants(data.plants || []); setWeights(data.weights || {}); setCr(data.cr || 0)
        } catch (err) { console.error('Error fetching matrix:', err) }
        finally { setLoading(false) }
    }

    const handleCellChange = (dongId, cotId, value) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) return
        setMatrix(prev => ({
            ...prev,
            [dongId]: { ...prev[dongId], [cotId]: numValue },
            [cotId]: { ...prev[cotId], [dongId]: dongId !== cotId ? 1 / numValue : 1 }
        }))
    }

    // Live calculation
    useEffect(() => {
        if (Object.keys(matrix).length === 0 || plants.length === 0) return
        const plantIds = plants.map(p => p.cay_canh_id)
        const n = plantIds.length

        const colSums = {}
        plantIds.forEach(colId => {
            let sum = 0
            plantIds.forEach(rowId => { sum += matrix[rowId]?.[colId] || 1 })
            colSums[colId] = sum || 1
        })

        const newWeights = {}; const weightsArr = []
        plantIds.forEach(rowId => {
            let rowAvg = 0
            plantIds.forEach(colId => { rowAvg += (matrix[rowId]?.[colId] || 1) / colSums[colId] })
            rowAvg /= n; newWeights[rowId] = rowAvg; weightsArr.push(rowAvg)
        })
        setWeights(newWeights)

        if (n > 2) {
            let lambdaMax = 0
            for (let i = 0; i < n; i++) {
                let weightedSum = 0
                for (let j = 0; j < n; j++) { weightedSum += (matrix[plantIds[i]]?.[plantIds[j]] || 1) * weightsArr[j] }
                if (weightsArr[i] > 0) lambdaMax += weightedSum / weightsArr[i]
            }
            lambdaMax /= n
            const ci = (lambdaMax - n) / (n - 1)
            const ri = RI_VALUES[n] || 1.49
            setCr(Math.max(0, ri > 0 ? ci / ri : 0))
        } else { setCr(0) }
    }, [matrix, plants])

    const saveMatrix = async () => {
        setSaving(true)
        try {
            const cells = []; const plantIds = plants.map(p => p.cay_canh_id)
            for (let i = 0; i < plantIds.length; i++) {
                for (let j = i; j < plantIds.length; j++) {
                    cells.push({ cay_dong_id: plantIds[i], cay_cot_id: plantIds[j], gia_tri: matrix[plantIds[i]]?.[plantIds[j]] || 1 })
                }
            }
            await fetch(`${API_URL}/phuong-an/${selectedTieuChi}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cells }) })
            await fetch(`${API_URL}/phuong-an/${selectedTieuChi}/tinh-trong-so`, { method: 'POST' })
            alert('Lưu và cập nhật trọng số thành công!')
        } catch (err) { console.error(err); alert('Lỗi khi lưu') }
        finally { setSaving(false) }
    }

    const currentTieuChi = tieuChis.find(tc => tc.ma_tieu_chi === selectedTieuChi)

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1>So sánh phương án: {currentTieuChi?.ten_tieu_chi || selectedTieuChi}</h1>
                <div className="flex items-center gap-3">
                    <span className={`admin-badge ${cr < 0.1 ? 'admin-badge-green' : 'admin-badge-red'}`}>
                        CR = {cr.toFixed(4)} {cr < 0.1 ? '(Hợp lệ)' : '(Không hợp lệ)'}
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="admin-page flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Matrix Table */}
                    <div className="admin-table-wrap mb-6">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-gray-50">{currentTieuChi?.ten_tieu_chi || 'Tiêu chí'}</th>
                                    {plants.map(p => <th key={p.cay_canh_id} className="text-center">{p.ten_cay}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {plants.map((pDong, i) => (
                                    <tr key={pDong.cay_canh_id}>
                                        <td className="font-semibold sticky left-0 z-10 bg-white whitespace-nowrap">{pDong.ten_cay}</td>
                                        {plants.map((pCot, j) => {
                                            const isDiagonal = pDong.cay_canh_id === pCot.cay_canh_id
                                            const isUpperTriangle = i < j
                                            const value = matrix[pDong.cay_canh_id]?.[pCot.cay_canh_id] || 1
                                            return (
                                                <td key={pCot.cay_canh_id} className="text-center" style={{ padding: '6px 4px' }}>
                                                    {isDiagonal ? (
                                                        <span className="text-gray-400">1</span>
                                                    ) : isUpperTriangle ? (
                                                        <input
                                                            type="text"
                                                            value={value < 1 ? `1/${Math.round(1 / value)}` : value}
                                                            onChange={(e) => {
                                                                const val = e.target.value
                                                                if (val.includes('/')) {
                                                                    const [num, den] = val.split('/')
                                                                    if (den && parseInt(den) !== 0) handleCellChange(pDong.cay_canh_id, pCot.cay_canh_id, parseInt(num) / parseInt(den))
                                                                } else { handleCellChange(pDong.cay_canh_id, pCot.cay_canh_id, val) }
                                                            }}
                                                            className="w-16 p-1.5 text-center border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">
                                                            {value < 1 ? `1/${Math.round(1 / value)}` : value}
                                                        </span>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Weights + Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="admin-card">
                            <div className="admin-card-header">Trọng số các phương án</div>
                            <div className="admin-card-body">
                                <div className="space-y-2">
                                    {plants.map(p => (
                                        <div key={p.cay_canh_id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                                            <span className="font-medium">{p.ten_cay}</span>
                                            <span className="font-bold text-primary-600">
                                                {weights[p.cay_canh_id] !== undefined ? `${(weights[p.cay_canh_id] * 100).toFixed(0)}%` : '0%'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex items-start">
                            <button onClick={saveMatrix} disabled={saving} className="admin-btn admin-btn-primary disabled:opacity-50">
                                <FaSave size={13} /> {saving ? 'Đang lưu...' : 'Lưu và cập nhật trọng số'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default PhuongAnAHP
