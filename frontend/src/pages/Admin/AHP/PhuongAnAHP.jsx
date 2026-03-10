import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaSave, FaCalculator, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    const [calculating, setCalculating] = useState(false)

    // Fetch criteria list
    useEffect(() => {
        fetchTieuChis()
    }, [])

    // Update selectedTieuChi when param changes
    useEffect(() => {
        if (maTieuChi) {
            setSelectedTieuChi(maTieuChi)
        }
    }, [maTieuChi])

    // Fetch matrix when criterion changes
    useEffect(() => {
        if (selectedTieuChi) {
            fetchMatrix(selectedTieuChi)
        }
    }, [selectedTieuChi])

    const fetchTieuChis = async () => {
        try {
            const res = await fetch(`${API_URL}/tieu-chi`)
            const data = await res.json()
            setTieuChis(data)
            if (!maTieuChi && data.length > 0) {
                setSelectedTieuChi(data[0].ma_tieu_chi)
            }
        } catch (err) {
            console.error('Error fetching criteria:', err)
        }
    }

    const fetchMatrix = async (maTieuChi) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/phuong-an/${maTieuChi}`)
            const data = await res.json()
            setMatrix(data.matrix || {})
            setPlants(data.plants || [])
            setWeights(data.weights || {})
            setCr(data.cr || 0)
        } catch (err) {
            console.error('Error fetching matrix:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCellChange = (dongId, cotId, value) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) return

        setMatrix(prev => ({
            ...prev,
            [dongId]: {
                ...prev[dongId],
                [cotId]: numValue
            },
            [cotId]: {
                ...prev[cotId],
                [dongId]: dongId !== cotId ? 1 / numValue : 1
            }
        }))
    }

    // RI values for CR calculation
    const RI_VALUES = {
        1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
        6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
    }

    // Live calculation of weights and CR whenever matrix changes
    useEffect(() => {
        if (Object.keys(matrix).length === 0 || plants.length === 0) return

        const plantIds = plants.map(p => p.cay_canh_id)
        const n = plantIds.length

        // 1. Calculate Weights (Column Sum Normalization - matches Excel)
        // Step 1: Sum each column
        const colSums = {}
        plantIds.forEach(colId => {
            let sum = 0
            plantIds.forEach(rowId => {
                sum += matrix[rowId]?.[colId] || 1
            })
            colSums[colId] = sum || 1
        })

        // Step 2: Normalize each cell by column sum, then average each row
        const newWeights = {}
        const weightsArr = []
        plantIds.forEach(rowId => {
            let rowAvg = 0
            plantIds.forEach(colId => {
                const val = matrix[rowId]?.[colId] || 1
                rowAvg += val / colSums[colId]
            })
            rowAvg /= n
            newWeights[rowId] = rowAvg
            weightsArr.push(rowAvg)
        })

        setWeights(newWeights)

        // 2. Calculate CR
        if (n > 2) {
            let lambdaMax = 0
            // Calculate weighted sum vector: A * w
            for (let i = 0; i < n; i++) {
                let weightedSum = 0
                for (let j = 0; j < n; j++) {
                    const rowId = plantIds[i]
                    const colId = plantIds[j]
                    const val = matrix[rowId]?.[colId] || 1
                    weightedSum += val * weightsArr[j]
                }
                if (weightsArr[i] > 0) {
                    lambdaMax += weightedSum / weightsArr[i]
                }
            }
            lambdaMax /= n

            const ci = (lambdaMax - n) / (n - 1)
            const ri = RI_VALUES[n] || 1.49
            const newCr = ri > 0 ? ci / ri : 0
            setCr(Math.max(0, newCr))
        } else {
            setCr(0)
        }

    }, [matrix, plants])

    const saveMatrix = async () => {
        setSaving(true)
        try {
            const cells = []
            const plantIds = plants.map(p => p.cay_canh_id)

            for (let i = 0; i < plantIds.length; i++) {
                for (let j = i; j < plantIds.length; j++) {
                    const dongId = plantIds[i]
                    const cotId = plantIds[j]
                    cells.push({
                        cay_dong_id: dongId,
                        cay_cot_id: cotId,
                        gia_tri: matrix[dongId]?.[cotId] || 1
                    })
                }
            }

            // Save Matrix
            await fetch(`${API_URL}/phuong-an/${selectedTieuChi}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cells })
            })

            // Trigger backend calculation to persist weights
            await fetch(`${API_URL}/phuong-an/${selectedTieuChi}/tinh-trong-so`, {
                method: 'POST'
            })

            alert('Lưu và cập nhật trọng số thành công!')
        } catch (err) {
            console.error(err)
            alert('Lỗi khi lưu')
        } finally {
            setSaving(false)
        }
    }


    const currentTieuChi = tieuChis.find(tc => tc.ma_tieu_chi === selectedTieuChi)

    const getCRStatusColor = (crVal) => {
        if (crVal < 0.1) return 'text-green-600'
        return 'text-red-600'
    }

    return (
        <div className="p-6 bg-[#A3B18A] min-h-screen">

            {/* Header / Title */}
            <div className="mb-6">
                <button className="bg-[#6A8455] text-white px-6 py-3 rounded-lg font-semibold shadow-md">
                    {currentTieuChi?.ten_tieu_chi || 'Quản lý so sánh'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-white">Đang tải...</div>
            ) : (
                <div className="space-y-6">

                    {/* Main Matrix and Controls */}
                    <div className="bg-[#A3B18A] p-2 rounded-lg">
                        {/* Matrix Table */}
                        <div className="overflow-x-auto bg-white border border-green-700 rounded-sm mb-6">
                            <table className="min-w-full border-collapse text-xs md:text-sm">
                                <thead>
                                    <tr>
                                        <th className="border border-green-600 p-1 bg-gray-50 min-w-[150px] sticky left-0 z-10">
                                            {currentTieuChi?.ma_tieu_chi}_{currentTieuChi?.ten_tieu_chi?.split(' ')[1] || 'Tiêu chí'}
                                        </th>
                                        {plants.map(p => (
                                            <th key={p.cay_canh_id} className="border border-green-600 p-1 bg-white font-normal min-w-[60px]">
                                                {p.ten_cay}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {plants.map((pDong, i) => (
                                        <tr key={pDong.cay_canh_id}>
                                            <td className="border border-green-600 p-1 bg-white font-normal sticky left-0 z-10 whitespace-nowrap">
                                                {pDong.ten_cay}
                                            </td>
                                            {plants.map((pCot, j) => {
                                                const isDiagonal = pDong.cay_canh_id === pCot.cay_canh_id
                                                const isUpperTriangle = i < j
                                                const value = matrix[pDong.cay_canh_id]?.[pCot.cay_canh_id] || 1

                                                return (
                                                    <td key={pCot.cay_canh_id} className="border border-green-600 p-0 text-center">
                                                        {isDiagonal ? (
                                                            <div className="p-1">1</div>
                                                        ) : isUpperTriangle ? (
                                                            /* Using text input to allow 1/5 style entry if needed but storing decimal */
                                                            <input
                                                                type="text"
                                                                value={value < 1 ? `1/${Math.round(1 / value)}` : value}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    if (val.includes('/')) {
                                                                        const [num, den] = val.split('/');
                                                                        if (den && parseInt(den) !== 0) handleCellChange(pDong.cay_canh_id, pCot.cay_canh_id, parseInt(num) / parseInt(den));
                                                                    } else {
                                                                        handleCellChange(pDong.cay_canh_id, pCot.cay_canh_id, val);
                                                                    }
                                                                }}
                                                                className="w-full text-center py-1 focus:outline-none focus:bg-blue-50"
                                                            />
                                                        ) : (
                                                            /* Readonly Lower Triangle */
                                                            <div className="py-1 text-gray-600">
                                                                {value < 1 ? `1/${Math.round(1 / value)}` : value}
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Section: Weights & CR */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Weights Table (Left) */}
                            <div className="bg-white border rounded shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2 text-left text-lg font-medium">Tên cây</th>
                                            <th className="p-2 text-right text-lg font-medium">Trọng số :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plants.map(p => (
                                            <tr key={p.cay_canh_id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-2 text-lg">{p.ten_cay}</td>
                                                <td className="p-2 text-right font-medium text-lg">
                                                    {weights[p.cay_canh_id] !== undefined ? `${(weights[p.cay_canh_id] * 100).toFixed(0)}%` : '0%'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Right Side: CR & Help & Actions */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white px-6 py-3 rounded-lg shadow-sm border font-semibold">
                                        Chỉ số CR : {cr.toFixed(3)}
                                    </div>

                                    <button
                                        onClick={saveMatrix}
                                        disabled={saving}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                                    >
                                        <FaSave className="inline mr-2" /> Lưu
                                    </button>
                                </div>

                                {
                                    /* Removed Help Box */
                                }
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PhuongAnAHP
