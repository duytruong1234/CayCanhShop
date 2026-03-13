import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ahpService } from '../../services/ahpService'
import { FaLeaf, FaArrowRight, FaArrowLeft, FaChevronRight, FaCheckCircle, FaExclamationTriangle, FaRedo, FaShoppingCart, FaInfoCircle, FaChevronDown, FaChevronUp, FaSeedling, FaSearch } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ===== AHP Scale Options =====
const AHP_SCALE_OPTIONS = [
  { value: 1 / 9, label: '1/9' }, { value: 1 / 8, label: '1/8' },
  { value: 1 / 7, label: '1/7' }, { value: 1 / 6, label: '1/6' },
  { value: 1 / 5, label: '1/5' }, { value: 1 / 4, label: '1/4' },
  { value: 1 / 3, label: '1/3' }, { value: 1 / 2, label: '1/2' },
  { value: 1, label: '1' },
  { value: 2, label: '2' }, { value: 3, label: '3' },
  { value: 4, label: '4' }, { value: 5, label: '5' },
  { value: 6, label: '6' }, { value: 7, label: '7' },
  { value: 8, label: '8' }, { value: 9, label: '9' }
]

const getScaleLabel = (val) => {
  let closest = AHP_SCALE_OPTIONS[0]
  let minDiff = Math.abs(val - closest.value)
  for (const opt of AHP_SCALE_OPTIONS) {
    const diff = Math.abs(val - opt.value)
    if (diff < minDiff) { minDiff = diff; closest = opt }
  }
  return closest.value
}

const getScaleDisplayLabel = (val) => {
  let closest = AHP_SCALE_OPTIONS[0]
  let minDiff = Math.abs(val - closest.value)
  for (const opt of AHP_SCALE_OPTIONS) {
    const diff = Math.abs(val - opt.value)
    if (diff < minDiff) { minDiff = diff; closest = opt }
  }
  return closest.label
}

const RI_VALUES = {
  1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
  6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}

const calcWeightsAndCR = (matrix, keys) => {
  const n = keys.length
  if (n === 0) return { weights: {}, cr: 0 }
  if (n === 1) return { weights: { [keys[0]]: 1 }, cr: 0 }

  const colSums = {}
  keys.forEach(col => {
    colSums[col] = keys.reduce((sum, row) => sum + (matrix[row]?.[col] || 1), 0) || 1
  })

  const weightsArr = []
  const weightsMap = {}
  keys.forEach((row, i) => {
    let rowAvg = 0
    keys.forEach(col => { rowAvg += (matrix[row]?.[col] || 1) / colSums[col] })
    weightsArr[i] = rowAvg / n
    weightsMap[row] = weightsArr[i]
  })

  let lambdaMax = 0
  for (let i = 0; i < n; i++) {
    let weightedSum = 0
    for (let j = 0; j < n; j++) { weightedSum += (matrix[keys[i]]?.[keys[j]] || 1) * weightsArr[j] }
    if (weightsArr[i] > 0) lambdaMax += weightedSum / weightsArr[i]
  }
  lambdaMax /= n
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0
  const ri = RI_VALUES[n] || 1.49
  const cr = ri > 0 ? Math.max(0, ci / ri) : 0
  return { weights: weightsMap, cr }
}

const snapToAHPScale = (val) => {
  const scales = [1/9, 1/8, 1/7, 1/6, 1/5, 1/4, 1/3, 1/2, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let closest = scales[0]
  let minDiff = Math.abs(val - closest)
  for (const s of scales) {
    const diff = Math.abs(val - s)
    if (diff < minDiff) { minDiff = diff; closest = s }
  }
  return closest
}

const findInconsistentPairs = (matrix, keys) => {
  const n = keys.length
  if (n < 3) return []
  const issues = []
  const seen = new Set()
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = keys[i], b = keys[j], c = keys[k]
        const ab = matrix[a]?.[b] || 1, bc = matrix[b]?.[c] || 1, ac = matrix[a]?.[c] || 1
        const expectedAC = ab * bc
        const ratio = ac / expectedAC
        if (ratio > 3 || ratio < 1 / 3) {
          // Xác định ô nào sai nhất: so sánh 3 khả năng sửa
          const fixOptions = [
            { fixRow: a, fixCol: c, current: ac, suggested: snapToAHPScale(ab * bc), via: [a, b, c], viaAB: ab, viaBC: bc, deviation: Math.abs(Math.log(ac / (ab * bc))) },
            { fixRow: a, fixCol: b, current: ab, suggested: snapToAHPScale(ac / bc), via: [a, c, b], viaAB: ac, viaBC: 1/bc, deviation: Math.abs(Math.log(ab / (ac / bc))) },
            { fixRow: b, fixCol: c, current: bc, suggested: snapToAHPScale(ac / ab), via: [b, a, c], viaAB: 1/ab, viaBC: ac, deviation: Math.abs(Math.log(bc / (ac / ab))) },
          ]
          // Chọn ô có độ lệch lớn nhất để gợi ý sửa
          fixOptions.sort((x, y) => y.deviation - x.deviation)
          const best = fixOptions[0]
          const key = `${best.fixRow}-${best.fixCol}`
          if (!seen.has(key)) {
            seen.add(key)
            issues.push({
              a, b, c, ab, bc, ac, expectedAC,
              fixRow: best.fixRow,
              fixCol: best.fixCol,
              current: best.current,
              suggested: best.suggested
            })
          }
        }
      }
    }
  }
  return issues
}

const QUESTIONS = [
  { question: 'Bạn thích một chậu cây có hoa rực rỡ hay chỉ cần lá xanh mát mắt?', optionA: 'Thích cây có hoa rực rỡ', optionB: 'Chỉ cần lá xanh mát mắt', dacDiemCode: 'HOA', excludeOnB: true },
  { question: 'Nhà bạn có trẻ nhỏ hoặc thú cưng không?', optionA: 'Có, tôi cần cây không độc hại', optionB: 'Không, tôi có thể để cây ở nơi an toàn', dacDiemCode: 'KHONG_DOC' },
  { question: "Bạn có thường xuyên bận rộn và cần cây 'tự lập', dễ chăm sóc không?", optionA: 'Rất bận, chọn cây dễ chăm sóc', optionB: 'Có thời gian để chăm sóc kỹ hơn', dacDiemCode: 'DE_CHAM' },
  { question: 'Bạn có nhạy cảm với mùi hương không?', optionA: 'Chọn cây ít mùi/không mùi', optionB: 'Mùi hương nhẹ nhàng không sao', dacDiemCode: 'IT_MUI' },
  { question: 'Bạn muốn tìm loại cây kháng sâu bệnh tốt?', optionA: 'Ưu tiên cây kháng sâu bệnh tốt', optionB: 'Bình thường, tôi có thể xử lý được', dacDiemCode: 'IT_SAU' }
]

// ===== Step Progress =====
const StepProgress = ({ current, total, labels }) => (
  <div className="overflow-x-auto mb-8 -mx-4 px-4">
    <div className="flex items-center justify-center gap-0.5 sm:gap-1 min-w-0">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500 flex-shrink-0 ${
            i < current ? 'bg-primary-500 text-white shadow-md' :
            i === current ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg scale-110' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <FaCheckCircle className="text-[10px]" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-4 sm:w-8 lg:w-12 mx-0.5 sm:mx-1 rounded transition-all duration-500 ${
              i < current ? 'bg-primary-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  </div>
)

// ===== Back / Next Buttons =====
const WizardNav = ({ onBack, onNext, nextDisabled, loading, nextText = 'Tiếp theo', showBack = true }) => (
  <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
    {showBack ? (
      <button onClick={onBack} className="btn-premium btn-ghost text-sm py-3 px-6 gap-2 text-gray-500 hover:text-gray-700">
        <FaArrowLeft className="text-xs" /> Quay lại
      </button>
    ) : <div />}
    <button
      onClick={onNext}
      disabled={nextDisabled || loading}
      className="btn-premium btn-primary py-3 px-8 text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none gap-2"
    >
      {loading ? 'Đang xử lý...' : nextText}
      {!loading && <FaArrowRight className="text-xs" />}
    </button>
  </div>
)

// ===== AHP Scale Visual =====
const AHPScaleVisual = ({ showAB = false }) => {
  const dots = [
    { val: '1/9', color: '#D97706', label: 'Vô\ncùng ít\nquan trọng' },
    { val: '1/8', color: '#D97706' },
    { val: '1/7', color: '#B45309', label: 'Rất\nít\nquan trọng' },
    { val: '1/6', color: '#92400E' },
    { val: '1/5', color: '#3B82F6', label: 'Ít\nquan trọng\nnhiều hơn' },
    { val: '1/4', color: '#3B82F6' },
    { val: '1/3', color: '#EAB308', label: 'Ít\nquan trọng\nhơn' },
    { val: '1/2', color: '#22C55E' },
    { val: '1', color: '#16A34A', center: true, label: 'Quan\ntrọng\nnhư nhau' },
    { val: '2', color: '#F97316' },
    { val: '3', color: '#F97316', label: 'Quan\ntrọng\nhơn' },
    { val: '4', color: '#EF4444' },
    { val: '5', color: '#EF4444', label: 'Quan\ntrọng\nnhiều hơn' },
    { val: '6', color: '#DC2626' },
    { val: '7', color: '#B91C1C', label: 'Rất\nquan\ntrọng hơn' },
    { val: '8', color: '#991B1B' },
    { val: '9', color: '#7F1D1D', label: 'Vô\ncùng\nquan trọng\nhơn' },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-[var(--shadow-sm)]">
      {showAB && (
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-3xl font-extrabold text-red-500 font-heading" style={{ fontFamily: 'serif' }}>A</span>
          <span className="text-3xl font-extrabold text-amber-500 font-heading" style={{ fontFamily: 'serif' }}>B</span>
        </div>
      )}
      <div className="relative py-2">
        {/* Line with arrow */}
        <div className="absolute top-[18px] left-2 right-2 flex items-center">
          <div className="flex-1 h-[3px] bg-gray-800" />
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-gray-800 -ml-px" />
        </div>
        {/* Dots */}
        <div className="flex items-start justify-between relative z-10 px-1">
          {dots.map((dot, i) => (
            <div key={i} className="flex flex-col items-center" style={{ minWidth: 0, flex: '1 1 0' }}>
              <div
                className="rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{
                  width: dot.center ? 14 : 10,
                  height: dot.center ? 14 : 10,
                  backgroundColor: dot.color,
                  marginTop: dot.center ? -2 : 0,
                }}
              />
              <span className="text-[11px] font-bold text-gray-700 mt-3 leading-none">{dot.val}</span>
              {dot.label && (
                <span className="text-[9px] text-gray-500 mt-1 leading-tight text-center whitespace-pre-line">{dot.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== Weight Bar =====
const WeightBar = ({ label, value, maxValue = 1 }) => {
  const pct = Math.min((value / maxValue) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 flex-shrink-0 w-16 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-800 w-16 text-right">{(value * 100).toFixed(1)}%</span>
    </div>
  )
}

// ===== CR Badge =====
const CRBadge = ({ value }) => {
  const good = value < 0.1
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
      good ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {good ? <FaCheckCircle className="text-green-500" /> : <FaExclamationTriangle className="text-red-500" />}
      CR = {value.toFixed(4)} {good ? '✓ Nhất quán' : '✗ Chưa nhất quán'}
    </div>
  )
}

// ===== CR Error Details (expandable) =====
const CRErrorDetails = ({ crValue, issues, nameMap, getLabel }) => {
  const [showDetails, setShowDetails] = useState(false)
  if (crValue < 0.1) return null
  return (
    <div className="mt-4 w-full">
      {/* Main error box with suggestions */}
      <div className="bg-red-50 rounded-xl p-4 text-sm border border-red-200">
        <p className="text-red-700 font-semibold mb-3 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          Hãy điều chỉnh để CR &lt; 0.1
        </p>
        {issues.length > 0 && (
          <div className="space-y-2">
            {issues.slice(0, 4).map((issue, idx) => (
              <div key={idx} className="bg-white/70 rounded-lg p-3 border border-red-100">
                <p className="text-red-700 text-xs">
                  <strong>{nameMap[issue.fixRow]}</strong> vs <strong>{nameMap[issue.fixCol]}</strong>: đang là{' '}
                  <span className="bg-red-100 px-1.5 py-0.5 rounded font-bold">{getLabel(issue.current)}</span>{' '}
                  → nên đổi thành{' '}
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{getLabel(issue.suggested)}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Toggle details button */}
        <button
          onClick={() => setShowDetails(prev => !prev)}
          className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors duration-200 group"
        >
          <FaInfoCircle className="text-red-400 group-hover:text-red-600 transition-colors" />
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết — Tại sao xảy ra lỗi này?'}
          {showDetails ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
        </button>

        {/* Expandable details section */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-xl p-4 border border-red-100 space-y-3 text-xs text-gray-700">
            <div>
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold text-[10px]">?</span>
                CR (Consistency Ratio) là gì?
              </h4>
              <p className="leading-relaxed">
                CR đo lường mức độ <strong>nhất quán</strong> trong các đánh giá so sánh cặp của bạn.  
                Trong phương pháp AHP, khi bạn so sánh nhiều cặp tiêu chí, các đánh giá cần phải <em>logic với nhau</em>.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-amber-100 rounded-md flex items-center justify-center text-amber-600 font-bold text-[10px]">!</span>
                Ví dụ về lỗi nhất quán
              </h4>
              <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-100">
                <p className="leading-relaxed">
                  Giả sử bạn đánh giá: <strong>A</strong> quan trọng gấp <strong className="text-blue-600">3 lần</strong> B, 
                  và <strong>B</strong> quan trọng gấp <strong className="text-blue-600">3 lần</strong> C.
                  <br />
                  → Theo logic, A phải quan trọng gấp khoảng <strong className="text-green-600">9 lần</strong> C.
                  <br />
                  Nhưng nếu bạn lại đánh giá A chỉ quan trọng gấp <strong className="text-red-600">2 lần</strong> C → <strong className="text-red-600">Mâu thuẫn!</strong>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center text-green-600 font-bold text-[10px]">✓</span>
                Cách sửa lỗi
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed">
                <li>Hãy xem các <strong>gợi ý sửa</strong> ở trên và điều chỉnh giá trị theo đề xuất.</li>
                <li>Khi đánh giá A vs C, hãy nghĩ xem: <em>"Nếu A hơn B x lần, B hơn C y lần, thì A nên hơn C khoảng x×y lần."</em></li>
                <li>CR cần <strong>&lt; 0.1</strong> (tức &lt; 10%) thì đánh giá mới được coi là đáng tin cậy.</li>
                <li>Giá trị CR hiện tại: <strong className="text-red-600">{crValue.toFixed(4)}</strong> ({(crValue * 100).toFixed(1)}%) — vượt ngưỡng cho phép.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== MAIN COMPONENT =====
const TuVanAHP = () => {
  const [phase, setPhase] = useState('intro')
  const [wizardStep, setWizardStep] = useState(0)
  const [tieuChis, setTieuChis] = useState([])
  const [dacDiems, setDacDiems] = useState([])
  const [criteriaMatrix, setCriteriaMatrix] = useState({})
  const [criteriaWeights, setCriteriaWeights] = useState({})
  const [criteriaCR, setCriteriaCR] = useState(0)
  const [answers, setAnswers] = useState({})
  const [filteredPlants, setFilteredPlants] = useState([])
  const [loadingPlants, setLoadingPlants] = useState(false)
  const [altMatrices, setAltMatrices] = useState({})
  const [altWeights, setAltWeights] = useState({})
  const [altCRs, setAltCRs] = useState({})
  const [finalResults, setFinalResults] = useState([])

  const { data: options } = useQuery({
    queryKey: ['ahp-options'],
    queryFn: ahpService.getFilterOptions
  })

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await ahpService.getCriteriaMatrix()
        setCriteriaMatrix(data.matrix || {})
        setTieuChis(data.tieu_chis || [])
      } catch (err) { console.error('Lỗi tải ma trận:', err) }
    }
    fetchMatrix()
  }, [])

  useEffect(() => { if (options) setDacDiems(options.dac_diems || []) }, [options])

  useEffect(() => {
    const keys = tieuChis.map(tc => tc.ma_tieu_chi)
    if (keys.length < 2 || Object.keys(criteriaMatrix).length === 0) return
    const { weights, cr } = calcWeightsAndCR(criteriaMatrix, keys)
    setCriteriaWeights(weights)
    setCriteriaCR(cr)
  }, [criteriaMatrix, tieuChis])

  const handleCriteriaCellChange = (dong, cot, value) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return
    setCriteriaMatrix(prev => ({
      ...prev,
      [dong]: { ...prev[dong], [cot]: numValue },
      [cot]: { ...prev[cot], [dong]: 1 / numValue }
    }))
  }

  const handleAnswer = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: prev[qIndex] === option ? null : option }))
  }

  const doFilterPlants = async () => {
    setLoadingPlants(true)
    try {
      const selectedFeatures = []
      const excludedFeatures = []
      QUESTIONS.forEach((q, idx) => {
        if (answers[idx] === 'A') selectedFeatures.push(q.dacDiemCode)
        else if (answers[idx] === 'B' && q.excludeOnB) excludedFeatures.push(q.dacDiemCode)
      })

      const plants = await ahpService.filterPlants(selectedFeatures, excludedFeatures)
      setFilteredPlants(plants)
      const pIds = plants.map(p => String(p.cay_canh_id))
      const newMat = {}, newW = {}, newCR = {}

      for (const tc of tieuChis) {
        let dbMatrix = null
        try { dbMatrix = await ahpService.getPlantMatrix(tc.ma_tieu_chi) }
        catch (err) { console.error(`Lỗi tải ma trận ${tc.ma_tieu_chi}:`, err) }

        const mat = {}
        pIds.forEach(r => {
          mat[r] = {}
          pIds.forEach(c => {
            if (r === c) mat[r][c] = 1.0
            else if (dbMatrix?.matrix?.[r]?.[c] != null) mat[r][c] = dbMatrix.matrix[r][c]
            else {
              const rNum = parseInt(r), cNum = parseInt(c)
              if (dbMatrix?.matrix?.[rNum]?.[cNum] != null) mat[r][c] = dbMatrix.matrix[rNum][cNum]
              else mat[r][c] = 1.0
            }
          })
        })
        newMat[tc.ma_tieu_chi] = mat
        const { weights, cr } = calcWeightsAndCR(mat, pIds)
        newW[tc.ma_tieu_chi] = weights
        newCR[tc.ma_tieu_chi] = cr
      }
      setAltMatrices(newMat); setAltWeights(newW); setAltCRs(newCR)
    } catch (err) { console.error('Lỗi lọc cây:', err) }
    finally { setLoadingPlants(false) }
  }

  const handleAltCellChange = (criterionCode, dong, cot, value) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return
    setAltMatrices(prev => {
      const updated = {
        ...prev,
        [criterionCode]: {
          ...prev[criterionCode],
          [dong]: { ...prev[criterionCode]?.[dong], [cot]: numValue },
          [cot]: { ...prev[criterionCode]?.[cot], [dong]: 1 / numValue }
        }
      }
      const pIds = filteredPlants.map(p => String(p.cay_canh_id))
      const { weights, cr } = calcWeightsAndCR(updated[criterionCode], pIds)
      setAltWeights(pw => ({ ...pw, [criterionCode]: weights }))
      setAltCRs(pc => ({ ...pc, [criterionCode]: cr }))
      return updated
    })
  }

  const calculateFinalResults = () => {
    const results = filteredPlants.map(plant => {
      const pId = String(plant.cay_canh_id)
      let totalScore = 0
      tieuChis.forEach(tc => {
        totalScore += (criteriaWeights[tc.ma_tieu_chi] || 0) * (altWeights[tc.ma_tieu_chi]?.[pId] || 0)
      })
      return { ...plant, score: Math.round(totalScore * 1000) / 10 }
    })
    results.sort((a, b) => b.score - a.score)
    setFinalResults(results)
  }

  const STEP_GUIDE = 0, STEP_CRITERIA = 1, STEP_QUESTIONS = 2, STEP_ALT_START = 3
  const STEP_RESULTS = 3 + tieuChis.length
  const totalWizardSteps = STEP_RESULTS + 1

  const handleBack = () => { setWizardStep(prev => Math.max(0, prev - 1)); window.scrollTo(0, 0) }
  const handleNext = async () => {
    if (wizardStep === STEP_QUESTIONS) await doFilterPlants()
    if (wizardStep === STEP_RESULTS - 1) calculateFinalResults()
    setWizardStep(prev => prev + 1); window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (filteredPlants.length === 1 && wizardStep > STEP_QUESTIONS && wizardStep < STEP_RESULTS) {
      setFinalResults([{ ...filteredPlants[0], score: 100 }])
      setWizardStep(STEP_RESULTS); window.scrollTo(0, 0)
    }
  }, [filteredPlants, wizardStep])

  const criteriaKeys = tieuChis.map(tc => tc.ma_tieu_chi)
  const plantKeys = filteredPlants.map(p => String(p.cay_canh_id))
  const plantNameMap = {}
  filteredPlants.forEach(p => { plantNameMap[String(p.cay_canh_id)] = p.ten_cay })
  const currentAltIndex = wizardStep - STEP_ALT_START
  const currentCriterion = tieuChis[currentAltIndex]

  // ===========================
  // INTRO PHASE
  // ===========================
  if (phase === 'intro') {
    return (
      <div className="page-enter">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#022c22] via-primary-900 to-primary-800 text-white py-24 lg:py-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/8 rounded-full blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
            {/* Floating leaf decorations */}
            <div className="absolute top-16 left-[10%] text-primary-400/20 text-4xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <FaSeedling />
            </div>
            <div className="absolute top-24 right-[15%] text-primary-300/15 text-3xl" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>
              <FaLeaf />
            </div>
            <div className="absolute bottom-28 left-[20%] text-primary-400/15 text-2xl" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>
              <FaLeaf />
            </div>
          </div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center max-w-3xl">
            {/* Decorative pills */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/15 text-primary-200">
                <FaSeedling className="text-primary-300" /> Phân tích đa tiêu chí
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/15 text-primary-200">
                <FaSearch className="text-primary-300" /> Tìm kiếm thông minh
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold mb-6 leading-[1.1] tracking-tight uppercase">
              Hãy cùng Queen giúp bạn lựa cây cảnh phù hợp với bạn
            </h1>
            <p className="text-primary-200/80 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Sử dụng phương pháp phân tích AHP chuyên nghiệp để tìm ra loại cây cảnh hoàn hảo dựa trên chính ưu tiên của bạn.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0,50 C360,0 1080,80 1440,30 L1440,80 L0,80 Z" fill="#f6f8f7" /></svg>
          </div>
        </section>

        {/* ===== LỰA CHỌN THÔNG MINH CÙNG CÔNG NGHỆ AHP ===== */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            {/* Featured intro card */}
            <div className="relative rounded-3xl overflow-hidden mb-14" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 30%, #fde68a 100%)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-[60px]" />
              <div className="relative p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-md">
                    <FaLeaf className="text-sm" />
                  </span>
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-900 tracking-tight">LỰA CHỌN THÔNG MINH CÙNG CÔNG NGHỆ AHP</h2>
                </div>
                <p className="text-gray-700 text-base leading-relaxed max-w-3xl">
                  Việc chọn một chậu cây vừa đẹp, vừa hợp túi tiền lại dễ chăm sóc đôi khi thật khó khăn. Với công cụ AHP, chúng tôi biến những ưu tiên của bạn thành những con số biết nói. Bạn chỉ cần cho chúng tôi biết bạn coi trọng yếu tố nào hơn, thuật toán sẽ tự động phân tích và đề xuất sản phẩm tốt nhất. AHP biến sự phức tạp thành sự đơn giản, giúp bạn chọn được cây ưng ý chỉ trong vài bước thực hiện
                </p>
              </div>
            </div>

            {/* Scale visual */}
            <div className="mb-6">
              <h3 className="text-xl font-heading font-extrabold text-gray-900 mb-5 uppercase flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 text-sm">
                  <FaInfoCircle />
                </span>
                Thang chấm điểm AHP
              </h3>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <AHPScaleVisual showAB />
              </div>
            </div>
          </div>
        </section>

        {/* ===== GIỚI THIỆU VỀ PHƯƠNG PHÁP AHP ===== */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 uppercase">Giới thiệu về phương pháp AHP</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mt-4" />
            </div>

            {/* Grid of info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              {/* Card 1: AHP là gì? */}
              <div className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-7 border border-gray-100 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-200">1</span>
                  <h3 className="text-lg font-heading font-extrabold text-gray-900">AHP là gì?</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  AHP (Analytic Hierarchy Process) – hay còn gọi là Quy trình Phân tích Thứ bậc – là một phương pháp toán học được giáo sư Thomas L. Saaty phát triển nhằm giúp con người đưa ra các quyết định phức tạp dựa trên nhiều tiêu chí khác nhau. Thay vì chỉ chọn lựa theo cảm tính, AHP giúp bạn "định lượng" các ưu tiên của mình để tìm ra lựa chọn tối ưu nhất.
                </p>
              </div>

              {/* Card 2: Tại sao sử dụng AHP? */}
              <div className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-7 border border-gray-100 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-200">2</span>
                  <h3 className="text-lg font-heading font-extrabold text-gray-900">Tại sao chúng tôi sử dụng AHP?</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Trong việc lựa chọn cây cảnh, có rất nhiều yếu tố khiến bạn phân vân như: Giá thành, Vẻ đẹp, Độ bền, và Ý nghĩa phong thủy. AHP giúp bạn:
                </p>
                <ul className="space-y-2">
                  {[
                    ['Loại bỏ sự mơ hồ', 'Chuyển đổi các cảm nhận định tính thành những con số cụ thể.'],
                    ['Tính khách quan cao', 'Đảm bảo các tiêu chí được cân bằng đúng với mong muốn thực tế của bạn.'],
                    ['Kiểm tra tính nhất quán', 'Hệ thống sẽ tự động phát hiện nếu các lựa chọn của bạn có sự mâu thuẫn trong logic chấm điểm.'],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-primary-400 flex-shrink-0 mt-0.5 text-xs" />
                      <span><strong className="text-gray-700">{title}:</strong> {desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Thang đo chuẩn của Saaty */}
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-amber-200">3</span>
                <h3 className="text-xl font-heading font-extrabold text-gray-900">Thang đo chuẩn của Saaty (1 - 9)</h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-6 pl-[52px]">
                Để hệ thống hiểu được mong muốn của bạn, chúng tôi sử dụng thang điểm từ 1 đến 9 để so sánh giữa hai yếu tố:
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-200/80 shadow-[var(--shadow-md)]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-600 to-primary-700">
                      <th className="p-4 text-left font-heading font-bold text-sm text-white w-28">Điểm số</th>
                      <th className="p-4 text-left font-heading font-bold text-sm text-white w-52">Mức độ quan trọng</th>
                      <th className="p-4 text-left font-heading font-bold text-sm text-white">Ý nghĩa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['1', 'Bằng nhau', 'Hai tiêu chí có tầm ảnh hưởng như nhau đến quyết định của bạn.', 'bg-blue-50'],
                      ['3', 'Hơi quan trọng hơn', 'Kinh nghiệm hoặc trực giác của bạn ưu tiên tiêu chí này hơn một chút.', 'bg-white'],
                      ['5', 'Quan trọng hơn', 'Bạn ưu tiên rõ rệt tiêu chí này hơn tiêu chí kia.', 'bg-blue-50'],
                      ['7', 'Rất quan trọng', 'Một tiêu chí chiếm ưu thế gần như hoàn toàn.', 'bg-white'],
                      ['9', 'Quan trọng tuyệt đối', 'Sự ưu tiên là mức cao nhất, không thể bàn cãi.', 'bg-blue-50'],
                      ['2, 4, 6, 8', 'Mức trung gian', 'Sử dụng khi bạn cần một sự thỏa hiệp giữa các mức điểm trên.', 'bg-white'],
                    ].map(([score, level, meaning, bgColor], i) => (
                      <tr key={i} className={`border-t border-gray-100 ${bgColor} hover:bg-primary-50/40 transition-colors`}>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-100 text-primary-700 font-bold text-sm">{score}</span>
                        </td>
                        <td className="p-4 font-semibold text-gray-700 text-sm">{level}</td>
                        <td className="p-4 text-gray-500 text-sm">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Cách thức hoạt động — Timeline Design */}
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-purple-200">4</span>
                <h3 className="text-xl font-heading font-extrabold text-gray-900">Cách thức hoạt động tại Queen</h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-8 pl-[52px]">Quy trình giúp bạn tìm ra loại cây hoàn hảo chỉ qua 3 bước:</p>

              {/* Timeline steps */}
              <div className="relative pl-8 ml-5 border-l-[3px] border-primary-200 space-y-8 mb-10">
                {[
                  {
                    step: '1',
                    title: 'So sánh cặp',
                    desc: 'Bạn sẽ so sánh từng cặp tiêu chí (ví dụ: So giữa Giá cả và Vẻ đẹp, bạn chọn cái nào quan trọng hơn?).',
                    color: 'from-blue-500 to-blue-600',
                    shadow: 'shadow-blue-200',
                  },
                  {
                    step: '2',
                    title: 'Tính toán trọng số',
                    desc: 'Thuật toán AHP sẽ tính toán tỷ lệ ưu tiên dựa trên các câu trả lời của bạn.',
                    color: 'from-emerald-500 to-emerald-600',
                    shadow: 'shadow-emerald-200',
                  },
                  {
                    step: '3',
                    title: 'Kết quả tối ưu',
                    desc: 'Hệ thống tự động đề xuất danh sách cây cảnh phù hợp nhất với bảng trọng số mà bạn vừa thiết lập.',
                    color: 'from-amber-500 to-orange-500',
                    shadow: 'shadow-amber-200',
                  },
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[calc(2rem+8px)] w-[18px] h-[18px] rounded-full bg-gradient-to-br ${item.color} border-[3px] border-white shadow-md ${item.shadow} transition-transform duration-300 group-hover:scale-125`} />
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] hover:border-primary-100/60 transition-all duration-300">
                      <h4 className="font-heading font-bold text-gray-800 text-[15px] mb-1.5">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured callout */}
              <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/15 rounded-full blur-[50px]" />
                <div className="relative p-6 lg:p-8 flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-primary-200">
                    <FaSeedling className="text-base" />
                  </span>
                  <div>
                    <p className="font-bold text-primary-800 mb-1 text-[15px]">Lời kết</p>
                    <p className="text-primary-700 text-sm leading-relaxed">
                      Với sự hỗ trợ của công cụ AHP, việc sở hữu một không gian xanh không chỉ là mua sắm, mà là một quyết định khoa học và đúng đắn nhất dành riêng cho bạn!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button with glow */}
            <div className="text-center mt-14">
              <button
                onClick={() => { setPhase('wizard'); window.scrollTo(0, 0) }}
                className="btn-premium btn-primary px-12 py-4 text-base shadow-lg hover:shadow-xl uppercase font-bold tracking-wide group relative"
                style={{ boxShadow: '0 0 30px rgba(5, 150, 105, 0.3), 0 8px 30px rgba(5, 150, 105, 0.25)' }}
              >
                <FaSeedling className="text-sm group-hover:rotate-12 transition-transform duration-300" />
                Bắt đầu lựa chọn cây
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <p className="text-gray-400 text-xs mt-4">Chỉ mất vài phút • Hoàn toàn miễn phí</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ===========================
  // WIZARD PHASE
  // ===========================
  return (
    <div className="page-enter">
      {/* Enhanced page header */}
      <div className="page-header relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-[10%] w-32 h-32 bg-primary-400/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-[15%] w-24 h-24 bg-emerald-300/10 rounded-full blur-[40px]" />
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center gap-2 text-primary-300/70 text-sm mb-2">
            <FaLeaf className="text-xs" /> <span>Tư vấn chọn cây</span>
            <FaChevronRight className="text-[8px] text-primary-400/40" />
            <span className="text-primary-200">
              {wizardStep === STEP_GUIDE && 'Hướng dẫn'}
              {wizardStep === STEP_CRITERIA && 'Tiêu chí'}
              {wizardStep === STEP_QUESTIONS && 'Lọc cây'}
              {wizardStep >= STEP_ALT_START && wizardStep < STEP_RESULTS && 'Đánh giá'}
              {wizardStep === STEP_RESULTS && 'Kết quả'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">
            {wizardStep === STEP_GUIDE && 'Hướng dẫn chấm điểm'}
            {wizardStep === STEP_CRITERIA && 'Đánh giá các tiêu chí'}
            {wizardStep === STEP_QUESTIONS && 'Câu hỏi lọc cây'}
            {wizardStep >= STEP_ALT_START && wizardStep < STEP_RESULTS && currentCriterion && `Đánh giá theo ${currentCriterion.ten_tieu_chi}`}
            {wizardStep === STEP_RESULTS && 'Kết quả xếp hạng'}
          </h1>
          <p className="text-primary-300/50 text-sm mt-1">
            Bước {wizardStep + 1} / {Math.min(totalWizardSteps, 8)}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10 max-w-5xl">
        <StepProgress current={wizardStep} total={Math.min(totalWizardSteps, 8)} />

        {/* STEP 0: Guide */}
        {wizardStep === STEP_GUIDE && (
          <div className="bg-white rounded-3xl shadow-[var(--shadow-md)] border border-gray-100/60 p-6 lg:p-9">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-200">
                  <FaInfoCircle className="text-sm" />
                </span>
                <h2 className="text-2xl font-heading font-extrabold text-gray-800 uppercase">Hướng dẫn chấm theo thang điểm AHP</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-50/60 to-primary-50/40 rounded-2xl p-5 mb-6 border border-blue-100/50">
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Chào bạn! Để hệ thống có thể tìm ra loại cây trồng lý tưởng nhất cho bạn, hãy thực hiện so sánh mức độ quan trọng giữa hai tiêu chí <strong className="text-blue-600">A</strong> và <strong className="text-red-600">B</strong> bằng cách chọn một điểm trên thang đo dưới đây:
                </p>
              </div>
              <p className="font-semibold text-gray-800 mb-4 text-[15px]">Cách chọn mức điểm phù hợp:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    title: 'Mức điểm 1',
                    subtitle: 'Quan trọng như nhau',
                    desc: 'Bạn thấy cả tiêu chí A và tiêu chí B đều quan trọng ngang nhau trong việc ra quyết định.',
                    color: 'from-green-500 to-emerald-500',
                    bg: 'bg-green-50',
                    border: 'border-green-100',
                    icon: '=',
                  },
                  {
                    title: 'Mức điểm 2→9',
                    subtitle: 'Nghiêng về phía B',
                    desc: 'Bạn ưu tiên tiêu chí B hơn tiêu chí A. Độ ưu tiên tăng dần từ "hơn một chút" (mức 3) đến "quan trọng tuyệt đối" (mức 9).',
                    color: 'from-amber-500 to-orange-500',
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    icon: 'B',
                  },
                  {
                    title: 'Mức điểm 1/2→1/9',
                    subtitle: 'Nghiêng về phía A',
                    desc: 'Bạn ưu tiên tiêu chí A hơn tiêu chí B. Điểm càng nhỏ (về phía 1/9) thể hiện tiêu chí A càng chiếm ưu thế so với B.',
                    color: 'from-blue-500 to-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                    icon: 'A',
                  },
                ].map((card, i) => (
                  <div key={i} className={`${card.bg} rounded-2xl p-5 border ${card.border} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
                        {card.icon}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm leading-tight">{card.title}</p>
                        <p className="text-gray-500 text-[11px]">{card.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto mb-2">
                <div className="min-w-[600px]">
                  <AHPScaleVisual showAB />
                </div>
              </div>
            </div>
            <WizardNav onNext={handleNext} showBack={false} />
          </div>
        )}

        {/* STEP 1: Criteria Matrix */}
        {wizardStep === STEP_CRITERIA && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6 lg:p-8">
              {/* Criteria Legend */}
              <div className="flex flex-wrap gap-3 mb-6">
                {tieuChis.map(tc => (
                  <span key={tc.ma_tieu_chi} className="badge badge-info text-xs">
                    {tc.ma_tieu_chi} — {tc.ten_tieu_chi}
                  </span>
                ))}
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 border-b border-r border-gray-200 min-w-[90px] sticky left-0 z-20 bg-gray-50 font-heading font-bold text-sm text-gray-500" />
                      {criteriaKeys.map(k => (
                        <th key={k} className="p-3 border-b border-gray-200 text-center font-heading font-bold text-sm text-gray-700 min-w-[80px]">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteriaKeys.map((dong, i) => (
                      <tr key={dong} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 border-r border-b border-gray-200 font-heading font-bold text-sm text-gray-700 sticky left-0 bg-white z-10">{dong}</td>
                        {criteriaKeys.map((cot, j) => {
                          const isDiag = i === j, isUpper = i < j
                          const value = criteriaMatrix[dong]?.[cot] || 1
                          return (
                            <td key={cot} className="p-2 border-b border-gray-100 text-center">
                              {isDiag ? (
                                <span className="text-gray-400 font-medium text-sm">1</span>
                              ) : isUpper ? (
                                <select
                                  value={getScaleLabel(value)}
                                  onChange={e => handleCriteriaCellChange(dong, cot, e.target.value)}
                                  className="w-full px-2 py-2 text-center font-bold text-sm bg-primary-50 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 cursor-pointer text-primary-700 transition-all"
                                >
                                  {AHP_SCALE_OPTIONS.map(opt => (
                                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-gray-400 text-sm">{getScaleDisplayLabel(value)}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weights + CR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6">
                <h3 className="font-heading font-bold text-gray-800 text-sm mb-5">Trọng số tiêu chí</h3>
                <div className="space-y-3">
                  {criteriaKeys.map(k => (
                    <WeightBar key={k} label={k} value={criteriaWeights[k] || 0} />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6 flex flex-col justify-center items-center">
                <h3 className="font-heading font-bold text-gray-800 text-sm mb-4">Chỉ số nhất quán</h3>
                <CRBadge value={criteriaCR} />
                {(() => {
                  const issues = findInconsistentPairs(criteriaMatrix, criteriaKeys)
                  const tcNameMap = {}
                  tieuChis.forEach(tc => { tcNameMap[tc.ma_tieu_chi] = tc.ten_tieu_chi })
                  return (
                    <CRErrorDetails
                      crValue={criteriaCR}
                      issues={issues}
                      nameMap={tcNameMap}
                      getLabel={getScaleDisplayLabel}
                    />
                  )
                })()}
              </div>
            </div>
            <WizardNav onBack={handleBack} onNext={handleNext} nextDisabled={criteriaCR >= 0.1} />
          </div>
        )}

        {/* STEP 2: Questions */}
        {wizardStep === STEP_QUESTIONS && (
          <div className="bg-white rounded-3xl shadow-[var(--shadow-md)] border border-gray-100/60 p-6 lg:p-9">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-100 mb-4">
                <FaSeedling className="text-primary-500 text-lg" />
              </div>
              <h2 className="text-xl font-heading font-extrabold text-gray-800">Hãy cho chúng tôi biết nhu cầu của bạn</h2>
              <p className="text-gray-400 text-sm mt-1">Chọn câu trả lời phù hợp nhất với bạn</p>
            </div>
            <div className="space-y-5 max-w-2xl mx-auto">
              {QUESTIONS.map((q, idx) => (
                <div key={idx} className={`rounded-2xl p-5 border-2 transition-all duration-300 ${
                  answers[idx] ? 'bg-primary-50/30 border-primary-100' : 'bg-gray-50/60 border-gray-100/60 hover:border-gray-200'
                }`}>
                  <p className="font-semibold text-gray-800 mb-4 flex items-start gap-3 text-[15px]">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm transition-all ${
                      answers[idx]
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}>{idx + 1}</span>
                    <span>{q.question}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                    {['A', 'B'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(idx, opt)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                          answers[idx] === opt
                            ? 'border-primary-400 bg-white text-primary-700 shadow-md shadow-primary-100/50 -translate-y-0.5'
                            : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          answers[idx] === opt ? 'bg-primary-500 border-primary-500 scale-110' : 'border-gray-300'
                        }`}>
                          {answers[idx] === opt && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        {opt === 'A' ? q.optionA : q.optionB}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <WizardNav onBack={handleBack} onNext={handleNext} loading={loadingPlants} />
          </div>
        )}

        {/* STEP 3..N: Alt Matrices */}
        {wizardStep >= STEP_ALT_START && wizardStep < STEP_RESULTS && currentCriterion && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FaLeaf className="text-primary-500 text-sm" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-gray-800">Đánh giá theo: {currentCriterion.ten_tieu_chi}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Mã: {currentCriterion.ma_tieu_chi} • Bước {currentAltIndex + 1}/{tieuChis.length}</p>
                </div>
              </div>

              {filteredPlants.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="relative w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <FaSeedling className="text-3xl text-primary-300" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center shadow-sm border border-amber-100">
                      <FaSearch className="text-xs text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-700 mb-2">Không tìm thấy cây phù hợp</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                    Hãy thử điều chỉnh các câu trả lời để mở rộng phạm vi tìm kiếm
                  </p>
                  <button
                    onClick={() => { setWizardStep(STEP_QUESTIONS); window.scrollTo(0, 0) }}
                    className="btn-premium btn-primary text-sm py-3 px-6 gap-2 shadow-md hover:shadow-lg"
                  >
                    <FaArrowLeft className="text-xs" /> Quay lại điều chỉnh
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 border-b border-r border-gray-200 min-w-[200px] sticky left-0 z-20 bg-gray-50 font-heading font-bold text-xs text-gray-500" />
                        {plantKeys.map(pId => (
                          <th key={pId} className="p-3 border-b border-gray-200 text-center font-heading font-bold text-xs text-gray-700 min-w-[130px] whitespace-nowrap">{plantNameMap[pId]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plantKeys.map((dong, i) => (
                        <tr key={dong} className="hover:bg-gray-50/50">
                          <td className="p-3 border-r border-b border-gray-200 font-semibold text-sm text-gray-700 sticky left-0 bg-white z-10 whitespace-nowrap">{plantNameMap[dong]}</td>
                          {plantKeys.map((cot, j) => {
                            const isDiag = i === j, isUpper = i < j
                            const mat = altMatrices[currentCriterion.ma_tieu_chi]
                            const value = mat?.[dong]?.[cot] || 1
                            return (
                              <td key={cot} className="p-2 border-b border-gray-100 text-center">
                                {isDiag ? (
                                  <span className="text-gray-400 text-sm">1</span>
                                ) : isUpper ? (
                                  <select
                                    value={getScaleLabel(value)}
                                    onChange={e => handleAltCellChange(currentCriterion.ma_tieu_chi, dong, cot, e.target.value)}
                                    className="w-full px-2 py-2 text-center font-bold text-sm bg-primary-50 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400 cursor-pointer text-primary-700 transition-all"
                                  >
                                    {AHP_SCALE_OPTIONS.map(opt => (
                                      <option key={opt.label} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-gray-400 text-sm">{getScaleDisplayLabel(value)}</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {filteredPlants.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6">
                  <h3 className="font-heading font-bold text-gray-800 text-sm mb-5">Trọng số phương án theo {currentCriterion.ma_tieu_chi}</h3>
                  <div className="space-y-3">
                    {plantKeys.map(pId => (
                      <WeightBar key={pId} label={plantNameMap[pId]} value={altWeights[currentCriterion.ma_tieu_chi]?.[pId] || 0} />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] border border-gray-100/60 p-6 flex flex-col justify-center items-center">
                  <h3 className="font-heading font-bold text-gray-800 text-sm mb-4">Chỉ số nhất quán</h3>
                  <CRBadge value={altCRs[currentCriterion.ma_tieu_chi] || 0} />
                  {(() => {
                    const currentMat = altMatrices[currentCriterion.ma_tieu_chi] || {}
                    const issues = findInconsistentPairs(currentMat, plantKeys)
                    return (
                      <CRErrorDetails
                        crValue={altCRs[currentCriterion.ma_tieu_chi] || 0}
                        issues={issues}
                        nameMap={plantNameMap}
                        getLabel={getScaleDisplayLabel}
                      />
                    )
                  })()}
                </div>
              </div>
            )}
            <WizardNav onBack={handleBack} onNext={handleNext} nextDisabled={(altCRs[currentCriterion?.ma_tieu_chi] || 0) >= 0.1} />
          </div>
        )}

        {/* FINAL: Results */}
        {wizardStep === STEP_RESULTS && (
          <div className="bg-white rounded-3xl shadow-[var(--shadow-md)] border border-gray-100/60 p-6 lg:p-9 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary-50/40 rounded-full blur-[80px] -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-50/40 rounded-full blur-[60px] translate-y-1/2" />

            {finalResults.length === 0 ? (
              <div className="text-center py-16 px-6 relative z-10">
                <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full" />
                  <div className="relative w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <FaLeaf className="text-3xl text-gray-300" />
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-700 mb-2">Không có kết quả để hiển thị</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                  Vui lòng quay lại và hoàn tất các bước đánh giá để xem kết quả xếp hạng
                </p>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h2 className="text-2xl font-heading font-extrabold text-gray-800 mb-2">Kết quả xếp hạng</h2>
                  <p className="text-gray-400 text-sm">Dựa trên ưu tiên của bạn, dưới đây là những cây cảnh phù hợp nhất</p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {finalResults.map((plant, index) => (
                    <div
                      key={plant.cay_canh_id}
                      className={`relative p-4 sm:p-5 pr-24 sm:pr-40 rounded-2xl border-2 transition-all duration-300 ${
                        index === 0
                          ? 'border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50/60 to-amber-50/30 shadow-lg shadow-amber-100/50 -translate-y-0.5'
                          : index === 1
                          ? 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50/40 shadow-md'
                          : index === 2
                          ? 'border-amber-200/60 bg-gradient-to-r from-orange-50/30 to-amber-50/20 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Top row: rank + image + name */}
                      <div className="flex items-center gap-3 sm:gap-5">
                        {/* Rank Medal */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-heading font-extrabold text-base sm:text-lg ${
                            index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-200' :
                            index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md shadow-slate-200' :
                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-200' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </div>
                          {index === 0 && (
                            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-md shadow-sm">TOP</span>
                          )}
                        </div>

                        {/* Image */}
                        <img
                          src={plant.hinh_anh ? `${API_URL}/static/images/${plant.hinh_anh}` : ''}
                          alt={plant.ten_cay}
                          className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0 ${
                            index === 0 ? 'shadow-md ring-2 ring-amber-200' : 'shadow-sm'
                          }`}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='60' fill='%2322c55e'%3E🌿%3C/text%3E%3Ctext x='200' y='230' text-anchor='middle' font-size='16' fill='%2386efac'%3EKhông có hình ảnh%3C/text%3E%3C/svg%3E"
                          }}
                        />

                        {/* Name + Score */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm sm:text-[15px] truncate ${
                            index === 0 ? 'text-amber-800' : 'text-gray-800'
                          }`}>{plant.ten_cay}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                  index === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                                  index === 1 ? 'bg-gradient-to-r from-slate-400 to-gray-400' :
                                  'bg-gradient-to-r from-primary-400 to-primary-500'
                                }`}
                                style={{ width: `${plant.score}%` }}
                              />
                            </div>
                            <span className={`text-xs sm:text-sm font-bold flex-shrink-0 ${
                              index === 0 ? 'text-amber-600' : 'text-primary-600'
                            }`}>{plant.score}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Action button - full width on mobile */}
                      <div className="mt-3 sm:mt-0 sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2">
                        <Link
                          to={`/cay-canh/${plant.cay_canh_id}`}
                          className={`btn-premium text-xs py-2.5 px-5 gap-1.5 w-full sm:w-auto justify-center ${
                            index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200 hover:shadow-lg' : 'btn-primary shadow-md'
                          }`}
                        >
                          <FaShoppingCart className="text-[10px]" /> Xem & Mua
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-10 pt-6 border-t border-gray-100 relative z-10">
              <button
                onClick={() => {
                  if (filteredPlants.length <= 1) setWizardStep(STEP_QUESTIONS)
                  else setWizardStep(STEP_RESULTS - 1)
                  setFinalResults([]); window.scrollTo(0, 0)
                }}
                className="btn-premium btn-ghost text-sm py-3 px-6 gap-2"
              >
                <FaArrowLeft className="text-xs" /> Quay lại
              </button>
              <button
                onClick={() => {
                  setPhase('intro'); setWizardStep(0); setAnswers({})
                  setFilteredPlants([]); setAltMatrices({}); setAltWeights({})
                  setAltCRs({}); setFinalResults([]); window.scrollTo(0, 0)
                }}
                className="btn-premium btn-primary text-sm py-3 px-6 gap-2 shadow-md"
              >
                <FaRedo className="text-xs" /> Làm lại từ đầu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TuVanAHP
