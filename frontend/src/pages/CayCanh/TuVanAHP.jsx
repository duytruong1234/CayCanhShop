import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ahpService } from '../../services/ahpService'

// Các giá trị thang đo AHP cho dropdown
const AHP_SCALE_OPTIONS = [
  { value: 1 / 9, label: '1/9' },
  { value: 1 / 8, label: '1/8' },
  { value: 1 / 7, label: '1/7' },
  { value: 1 / 6, label: '1/6' },
  { value: 1 / 5, label: '1/5' },
  { value: 1 / 4, label: '1/4' },
  { value: 1 / 3, label: '1/3' },
  { value: 1 / 2, label: '1/2' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' }
]

// Tìm giá trị thang đo gần nhất cho select
const getScaleLabel = (val) => {
  let closest = AHP_SCALE_OPTIONS[0]
  let minDiff = Math.abs(val - closest.value)
  for (const opt of AHP_SCALE_OPTIONS) {
    const diff = Math.abs(val - opt.value)
    if (diff < minDiff) {
      minDiff = diff
      closest = opt
    }
  }
  return closest.value
}

// Hiển thị nhãn phân số cho tam giác dưới
const getScaleDisplayLabel = (val) => {
  let closest = AHP_SCALE_OPTIONS[0]
  let minDiff = Math.abs(val - closest.value)
  for (const opt of AHP_SCALE_OPTIONS) {
    const diff = Math.abs(val - opt.value)
    if (diff < minDiff) {
      minDiff = diff
      closest = opt
    }
  }
  return closest.label
}

// Bảng RI chuẩn Saaty
const RI_VALUES = {
  1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
  6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}

// Tính trọng số và CR từ ma trận so sánh
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
    keys.forEach(col => {
      rowAvg += (matrix[row]?.[col] || 1) / colSums[col]
    })
    weightsArr[i] = rowAvg / n
    weightsMap[row] = weightsArr[i]
  })

  let lambdaMax = 0
  for (let i = 0; i < n; i++) {
    let weightedSum = 0
    for (let j = 0; j < n; j++) {
      weightedSum += (matrix[keys[i]]?.[keys[j]] || 1) * weightsArr[j]
    }
    if (weightsArr[i] > 0) lambdaMax += weightedSum / weightsArr[i]
  }
  lambdaMax /= n
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0
  const ri = RI_VALUES[n] || 1.49
  const cr = ri > 0 ? Math.max(0, ci / ri) : 0

  return { weights: weightsMap, cr }
}

// Câu hỏi lọc cây cảnh - dacDiemCode ánh xạ trực tiếp mã đặc điểm trong DB
const QUESTIONS = [
  {
    question: 'Bạn thích một chậu cây có hoa rực rỡ hay chỉ cần lá xanh mát mắt?',
    optionA: 'Thích cây có hoa rực rỡ',
    optionB: 'Chỉ cần lá xanh mát mắt',
    dacDiemCode: 'HOA'
  },
  {
    question: 'Nhà bạn có trẻ nhỏ hoặc thú cưng (chó, mèo...) không?',
    optionA: 'Có, tôi cần cây không độc hại',
    optionB: 'Không, tôi có thể để cây ở nơi an toàn',
    dacDiemCode: 'KHONG_DOC'
  },
  {
    question: "Bạn có thường xuyên bận rộn và cần một loại cây 'tự lập', dễ chăm sóc không?",
    optionA: 'Rất bận, chọn cây dễ chăm sóc',
    optionB: 'Có thời gian để chăm sóc kỹ hơn',
    dacDiemCode: 'DE_CHAM'
  },
  {
    question: 'Bạn có nhạy cảm với mùi hương hoặc muốn không gian hoàn toàn tinh khiết?',
    optionA: 'Chọn cây ít mùi/không mùi',
    optionB: 'Mùi hương nhẹ nhàng không sao',
    dacDiemCode: 'IT_MUI'
  },
  {
    question: 'Bạn muốn tìm loại cây khỏe mạnh, ít gặp vấn đề về sâu bệnh?',
    optionA: 'Ưu tiên cây kháng sâu bệnh tốt',
    optionB: 'Bình thường, tôi có thể xử lý được',
    dacDiemCode: 'IT_SAU'
  }
]

// Component thang đo AHP
const AHPScale = ({ showAB = false }) => {
  const items = [
    { value: '1/9', label: 'Vô cùng ít quan trọng', color: 'bg-amber-400' },
    { value: '1/8', label: '', color: 'bg-amber-400' },
    { value: '1/7', label: 'Rất ít quan trọng', color: 'bg-amber-500' },
    { value: '1/6', label: '', color: 'bg-blue-400' },
    { value: '1/5', label: 'Ít quan trọng nhiều hơn', color: 'bg-blue-400' },
    { value: '1/4', label: '', color: 'bg-blue-400' },
    { value: '1/3', label: '', color: 'bg-yellow-400' },
    { value: '1/2', label: 'Ít quan trọng hơn', color: 'bg-yellow-400' },
    { value: '1', label: 'Quan trọng như nhau', color: 'bg-emerald-500', isCenter: true },
    { value: '2', label: '', color: 'bg-red-700' },
    { value: '3', label: 'Quan trọng hơn', color: 'bg-red-700' },
    { value: '4', label: '', color: 'bg-red-700' },
    { value: '5', label: 'Quan trọng nhiều hơn', color: 'bg-red-600' },
    { value: '6', label: '', color: 'bg-red-600' },
    { value: '7', label: 'Rất quan trọng hơn', color: 'bg-red-800' },
    { value: '8', label: '', color: 'bg-red-800' },
    { value: '9', label: 'Vô cùng quan trọng hơn', color: 'bg-red-900' }
  ]

  return (
    <div>
      {showAB && (
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-5xl font-black text-red-500 drop-shadow">A</span>
          <span className="text-5xl font-black text-yellow-500 drop-shadow">B</span>
        </div>
      )}
      <div className="relative">
        {/* Line */}
        <div className="absolute top-[22px] left-4 right-4 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-red-800 rounded" />
        <div className="flex items-start justify-between relative z-10 px-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center" style={{ minWidth: '40px' }}>
              <span className="text-xs font-bold mb-1 text-gray-700">{item.value}</span>
              <div className={`w-3.5 h-3.5 ${item.color} rounded-full border-2 border-white shadow ${item.isCenter ? 'w-5 h-5 ring-2 ring-emerald-300' : ''}`} />
              {item.label && (
                <p className="text-[10px] text-center mt-1.5 leading-tight text-gray-500 max-w-[60px]">
                  {item.label}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Nút "Tiếp theo"
const NextButton = ({ onClick, disabled, loading, text = 'Tiếp theo =>' }) => (
  <div className="flex justify-end mt-8">
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="bg-gradient-to-r from-emerald-400 to-yellow-300 text-gray-800 font-bold px-8 py-3 rounded-full text-lg hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
    >
      {loading ? 'Đang xử lý...' : text}
    </button>
  </div>
)

// ===== COMPONENT CHÍNH =====
const TuVanAHP = () => {
  const [phase, setPhase] = useState('intro') // 'intro' | 'wizard'
  const [wizardStep, setWizardStep] = useState(0)

  // Dữ liệu API
  const [tieuChis, setTieuChis] = useState([])
  const [dacDiems, setDacDiems] = useState([])

  // Bước đánh giá tiêu chí
  const [criteriaMatrix, setCriteriaMatrix] = useState({})
  const [criteriaWeights, setCriteriaWeights] = useState({})
  const [criteriaCR, setCriteriaCR] = useState(0)

  // Bước trả lời câu hỏi
  const [answers, setAnswers] = useState({})

  // Cây đã lọc
  const [filteredPlants, setFilteredPlants] = useState([])
  const [loadingPlants, setLoadingPlants] = useState(false)

  // Ma trận phương án theo từng tiêu chí
  const [altMatrices, setAltMatrices] = useState({})
  const [altWeights, setAltWeights] = useState({})
  const [altCRs, setAltCRs] = useState({})

  // Kết quả cuối
  const [finalResults, setFinalResults] = useState([])

  // Fetch filter options
  const { data: options } = useQuery({
    queryKey: ['ahp-options'],
    queryFn: ahpService.getFilterOptions
  })

  // Fetch criteria matrix on mount
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await ahpService.getCriteriaMatrix()
        setCriteriaMatrix(data.matrix || {})
        setTieuChis(data.tieu_chis || [])
      } catch (err) {
        console.error('Lỗi tải ma trận:', err)
      }
    }
    fetchMatrix()
  }, [])

  useEffect(() => {
    if (options) setDacDiems(options.dac_diems || [])
  }, [options])

  // Recalc criteria weights when matrix changes
  useEffect(() => {
    const keys = tieuChis.map(tc => tc.ma_tieu_chi)
    if (keys.length < 2 || Object.keys(criteriaMatrix).length === 0) return
    const { weights, cr } = calcWeightsAndCR(criteriaMatrix, keys)
    setCriteriaWeights(weights)
    setCriteriaCR(cr)
  }, [criteriaMatrix, tieuChis])

  // Xử lý thay đổi ô ma trận tiêu chí
  const handleCriteriaCellChange = (dong, cot, value) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return
    setCriteriaMatrix(prev => ({
      ...prev,
      [dong]: { ...prev[dong], [cot]: numValue },
      [cot]: { ...prev[cot], [dong]: 1 / numValue }
    }))
  }

  // Xử lý chọn câu trả lời
  const handleAnswer = (qIndex, option) => {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: prev[qIndex] === option ? null : option
    }))
  }

  // Lọc cây theo đặc điểm và lấy dữ liệu ma trận từ DB
  const doFilterPlants = async () => {
    setLoadingPlants(true)
    try {
      // Sử dụng dacDiemCode từ QUESTIONS thay vì phụ thuộc thứ tự API
      const selectedFeatures = []
      QUESTIONS.forEach((q, idx) => {
        if (answers[idx] === 'A') selectedFeatures.push(q.dacDiemCode)
      })

      console.log('Đặc điểm đã chọn:', selectedFeatures)
      const plants = await ahpService.filterPlants(selectedFeatures)
      console.log('Cây đã lọc:', plants.map(p => `${p.cay_canh_id}-${p.ten_cay}`))
      setFilteredPlants(plants)

      const pIds = plants.map(p => String(p.cay_canh_id))
      const newMat = {}
      const newW = {}
      const newCR = {}

      // Lấy dữ liệu ma trận phương án từ DB cho từng tiêu chí
      for (const tc of tieuChis) {
        let dbMatrix = null
        try {
          dbMatrix = await ahpService.getPlantMatrix(tc.ma_tieu_chi)
          console.log(`Ma trận ${tc.ma_tieu_chi}: loaded, keys=${Object.keys(dbMatrix?.matrix || {}).length}`)
        } catch (err) {
          console.error(`Lỗi tải ma trận phương án ${tc.ma_tieu_chi}:`, err)
        }

        // Xây dựng sub-matrix cho các cây đã lọc, dùng dữ liệu DB nếu có
        const mat = {}
        pIds.forEach(r => {
          mat[r] = {}
          pIds.forEach(c => {
            if (r === c) {
              mat[r][c] = 1.0
            } else if (dbMatrix?.matrix?.[r]?.[c] != null) {
              mat[r][c] = dbMatrix.matrix[r][c]
            } else {
              // Thử key dạng number nếu string không tìm thấy
              const rNum = parseInt(r)
              const cNum = parseInt(c)
              if (dbMatrix?.matrix?.[rNum]?.[cNum] != null) {
                mat[r][c] = dbMatrix.matrix[rNum][cNum]
              } else {
                console.warn(`Không tìm thấy dữ liệu ${tc.ma_tieu_chi}[${r}][${c}], dùng mặc định 1.0`)
                mat[r][c] = 1.0
              }
            }
          })
        })
        newMat[tc.ma_tieu_chi] = mat

        // Tính trọng số và CR từ ma trận thực tế
        const { weights, cr } = calcWeightsAndCR(mat, pIds)
        newW[tc.ma_tieu_chi] = weights
        newCR[tc.ma_tieu_chi] = cr
        console.log(`${tc.ma_tieu_chi} weights:`, weights, 'CR:', cr)
      }

      setAltMatrices(newMat)
      setAltWeights(newW)
      setAltCRs(newCR)
    } catch (err) {
      console.error('Lỗi lọc cây:', err)
    } finally {
      setLoadingPlants(false)
    }
  }

  // Xử lý thay đổi ô ma trận phương án
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

  // Tính kết quả cuối cùng
  const calculateFinalResults = () => {
    const results = filteredPlants.map(plant => {
      const pId = String(plant.cay_canh_id)
      let totalScore = 0
      tieuChis.forEach(tc => {
        const cWeight = criteriaWeights[tc.ma_tieu_chi] || 0
        const pWeight = altWeights[tc.ma_tieu_chi]?.[pId] || 0
        totalScore += cWeight * pWeight
      })
      return { ...plant, score: Math.round(totalScore * 1000) / 10 }
    })
    results.sort((a, b) => b.score - a.score)
    setFinalResults(results)
  }

  // Các bước wizard: 0=hướng dẫn, 1=ma trận tiêu chí, 2=câu hỏi, 3..3+N-1=ma trận phương án, 3+N=kết quả
  const STEP_GUIDE = 0
  const STEP_CRITERIA = 1
  const STEP_QUESTIONS = 2
  const STEP_ALT_START = 3
  const STEP_RESULTS = 3 + tieuChis.length

  const handleNext = async () => {
    if (wizardStep === STEP_QUESTIONS) {
      await doFilterPlants()
    }
    if (wizardStep === STEP_RESULTS - 1) {
      calculateFinalResults()
    }
    setWizardStep(prev => prev + 1)
    window.scrollTo(0, 0)
  }

  const criteriaKeys = tieuChis.map(tc => tc.ma_tieu_chi)
  const plantKeys = filteredPlants.map(p => String(p.cay_canh_id))
  const plantNameMap = {}
  filteredPlants.forEach(p => { plantNameMap[String(p.cay_canh_id)] = p.ten_cay })

  const currentAltIndex = wizardStep - STEP_ALT_START
  const currentCriterion = tieuChis[currentAltIndex]

  // ============================
  // GIAO DIỆN GIỚI THIỆU (Ảnh 1-4)
  // ============================
  if (phase === 'intro') {
    return (
      <div className="page-enter">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          {/* Tiêu đề chính */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-center mb-10 leading-tight tracking-tight">
            HÃY CÙNG QUEEN GIÚP BẠN CHỌN LỰA CÂY CẢNH PHÙ HỢP VỚI BẠN
          </h1>

          {/* Giới thiệu AHP */}
          <div className="mb-10">
            <h2 className="inline text-xl md:text-2xl font-bold leading-relaxed" style={{ backgroundColor: '#FDE047', padding: '2px 8px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
              LỰA CHỌN THÔNG MINH CÙNG CÔNG NGHỆ AHP
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              Việc chọn một chậu cây vừa đẹp, vừa hợp túi tiền lại dễ chăm sóc đôi khi thật khó khăn.
              Với công cụ AHP, chúng tôi biến những ưu tiên của bạn thành những con số biết nói. Bạn
              chỉ cần cho chúng tôi biết bạn coi trọng yếu tố nào hơn, thuật toán sẽ tự động phân tích
              và đề xuất sản phẩm tốt nhất. AHP biến sự phức tạp thành sự đơn giản, giúp bạn chọn
              được cây ưng ý chỉ trong vài bước thực hiện
            </p>
          </div>

          {/* Thang chấm điểm AHP */}
          <div className="mb-12">
            <h2 className="inline text-xl md:text-2xl font-bold leading-relaxed mb-6" style={{ backgroundColor: '#FDE047', padding: '2px 8px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
              THANG CHẤM ĐIỂM AHP
            </h2>
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[700px]">
                <AHPScale />
              </div>
            </div>
          </div>

          {/* Phương pháp AHP */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold italic mb-6">GIỚI THIỆU VỀ PHƯƠNG PHÁP AHP</h2>

            <h3 className="text-xl font-bold mb-3">1. AHP là gì?</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              AHP (Analytic Hierarchy Process) – hay còn gọi là Quy trình Phân tích Thứ bậc – là một
              phương pháp toán học được giáo sư Thomas L. Saaty phát triển nhằm giúp con người đưa
              ra các quyết định phức tạp dựa trên nhiều tiêu chí khác nhau. thay vì chỉ chọn lựa theo
              cảm tính, AHP giúp bạn "định lượng" các ưu tiên của mình để tìm ra lựa chọn tối ưu nhất.
            </p>

            <h3 className="text-xl font-bold mb-3">2. Tại sao chúng tôi sử dụng AHP?</h3>
            <p className="text-gray-700 mb-3">
              Trong việc lựa chọn cây cảnh, có rất nhiều yếu tố khiến bạn phân vân như: Giá thành, Vẻ
              đẹp, Độ bền, và Ý nghĩa phong thủy. AHP giúp bạn:
            </p>
            <ul className="list-disc pl-8 text-gray-700 space-y-2 mb-6">
              <li><strong>Loại bỏ sự mơ hồ:</strong> Chuyển đổi các cảm nhận định tính thành những con số cụ thể.</li>
              <li><strong>Tính khách quan cao:</strong> Đảm bảo các tiêu chí được cân bằng đúng với mong muốn thực tế của bạn.</li>
              <li><strong>Kiểm tra tính nhất quán:</strong> Hệ thống sẽ tự động phát hiện nếu các lựa chọn của bạn có sự mâu thuẫn trong logic chấm điểm.</li>
            </ul>
          </div>

          {/* Thang đo Saaty */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">3. Thang đo chuẩn của Saaty (1 - 9)</h3>
            <p className="text-gray-700 mb-4">
              Để hệ thống hiểu được mong muốn của bạn, chúng tôi sử dụng thang điểm từ 1 đến 9 để
              so sánh giữa hai yếu tố:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-bold">Điểm số</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Mức độ quan trọng</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Ý nghĩa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">1</td>
                    <td className="border border-gray-300 p-3 font-bold">Bằng nhau</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Hai tiêu chí có tầm ảnh hưởng như nhau đến quyết định của bạn.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">3</td>
                    <td className="border border-gray-300 p-3 font-bold">Hơi quan trọng hơn</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Kinh nghiệm hoặc trực giác của bạn ưu tiên tiêu chí này hơn một chút.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">5</td>
                    <td className="border border-gray-300 p-3 font-bold">Quan trọng hơn</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Bạn ưu tiên rõ rệt tiêu chí này hơn tiêu chí kia.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">7</td>
                    <td className="border border-gray-300 p-3 font-bold">Rất quan trọng</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Một tiêu chí chiếm ưu thế gần như hoàn toàn.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">9</td>
                    <td className="border border-gray-300 p-3 font-bold">Quan trọng tuyệt đối</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Sự ưu tiên là mức cao nhất, không thể bàn cãi.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold">2, 4, 6, 8</td>
                    <td className="border border-gray-300 p-3 font-bold">Mức trung gian</td>
                    <td className="border border-gray-300 p-3 text-gray-600">Sử dụng khi bạn cần một sự thỏa hiệp giữa các mức điểm trên.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cách thức hoạt động */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold italic mb-4">4. Cách thức hoạt động tại Queen</h3>
            <p className="text-gray-700 mb-3">Quy trình giúp bạn tìm ra loại cây hoàn hảo chỉ qua 3 bước:</p>
            <ol className="list-decimal pl-8 text-gray-700 space-y-2 mb-6">
              <li><strong>So sánh cặp:</strong> Bạn sẽ so sánh từng cặp tiêu chí (ví dụ: So giữa Giá cả và Vẻ đẹp, bạn chọn cái nào quan trọng hơn?).</li>
              <li><strong>Tính toán trọng số:</strong> Thuật toán AHP sẽ tính toán tỷ lệ ưu tiên dựa trên các câu trả lời của bạn.</li>
              <li><strong>Kết quả tối ưu:</strong> Hệ thống tự động đề xuất danh sách cây cảnh phù hợp nhất với bảng trọng số mà bạn vừa thiết lập.</li>
            </ol>
            <p className="text-gray-700 font-bold mb-10">
              Lời kết: Với sự hỗ trợ của công cụ AHP, việc sở hữu một không gian xanh không chỉ là mua
              sắm, mà là một quyết định khoa học và đúng đắn nhất dành riêng cho bạn!
            </p>

            <div className="text-center">
              <button
                onClick={() => { setPhase('wizard'); window.scrollTo(0, 0) }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg md:text-xl font-bold px-10 md:px-14 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                BẮT ĐẦU LỰA CHỌN CÂY
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================
  // GIAO DIỆN WIZARD (Ảnh 5-12)
  // ============================
  return (
    <div className="page-enter">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ===== BƯỚC 0: HƯỚNG DẪN CHẤM ĐIỂM (Ảnh 5) ===== */}
        {wizardStep === STEP_GUIDE && (
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black mb-6">HƯỚNG DẪN CHẤM THEO THANG ĐIỂM AHP</h2>

            <div className="text-gray-700 space-y-4 mb-8 leading-relaxed">
              <p>
                Chào bạn! Để hệ thống có thể tìm ra loại cây trồng lý tưởng nhất cho bạn, hãy thực hiện
                so sánh mức độ quan trọng giữa hai tiêu chí A và B bằng cách chọn một điểm trên thang
                đo dưới đây:
              </p>
              <p className="font-bold">Cách chọn mức điểm phù hợp:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Mức điểm 1 (Quan trọng như nhau):</strong> Bạn thấy cả tiêu chí A và tiêu chí B đều quan trọng
                  ngang nhau trong việc ra quyết định.
                </li>
                <li>
                  <strong>Mức điểm 2 đến 9 (Nghiêng về phía B):</strong> Bạn ưu tiên tiêu chí B hơn tiêu chí A. Độ ưu tiên
                  tăng dần từ "hơn một chút" (mức 3) đến "quan trọng tuyệt đối" (mức 9).
                </li>
                <li>
                  <strong>Mức điểm 1/2 đến 1/9 (Nghiêng về phía A):</strong> Bạn ưu tiên tiêu chí A hơn tiêu chí B. Điểm
                  càng nhỏ (về phía 1/9) thể hiện tiêu chí A càng chiếm ưu thế so với B.
                </li>
              </ul>
            </div>

            <div className="overflow-x-auto mb-4">
              <div className="min-w-[700px]">
                <AHPScale showAB />
              </div>
            </div>

            <NextButton onClick={handleNext} />
          </div>
        )}

        {/* ===== BƯỚC 1: ĐÁNH GIÁ TIÊU CHÍ (Ảnh 6) ===== */}
        {wizardStep === STEP_CRITERIA && (
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black italic text-center mb-8">ĐÁNH GIÁ CÁC TIÊU CHÍ</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Bên trái: bảng tiêu chí + ma trận */}
              <div className="flex-1">
                {/* Bảng danh sách tiêu chí */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold">Kí hiệu</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Tên tiêu chí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tieuChis.map(tc => (
                        <tr key={tc.ma_tieu_chi}>
                          <td className="border border-gray-300 p-3 font-bold">{tc.ma_tieu_chi}</td>
                          <td className="border border-gray-300 p-3">{tc.ten_tieu_chi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ma trận so sánh */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-400 p-3 w-20"></th>
                        {criteriaKeys.map(k => (
                          <th key={k} className="border border-gray-400 p-3 text-center font-bold min-w-[80px]">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {criteriaKeys.map((dong, i) => (
                        <tr key={dong}>
                          <td className="border border-gray-400 p-3 font-bold bg-gray-100">{dong}</td>
                          {criteriaKeys.map((cot, j) => {
                            const isDiag = i === j
                            const isUpper = i < j
                            const value = criteriaMatrix[dong]?.[cot] || 1
                            return (
                              <td key={cot} className="border border-gray-400 p-2 text-center">
                                {isDiag ? (
                                  <span className="font-medium text-gray-700">1</span>
                                ) : isUpper ? (
                                  <select
                                    value={getScaleLabel(value)}
                                    onChange={e => handleCriteriaCellChange(dong, cot, e.target.value)}
                                    className="w-full px-1 py-1.5 text-center font-semibold bg-yellow-300 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                                  >
                                    {AHP_SCALE_OPTIONS.map(opt => (
                                      <option key={opt.label} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-gray-500 text-sm">{getScaleDisplayLabel(value)}</span>
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

              {/* Bên phải: trọng số + CR */}
              <div className="w-full lg:w-64 space-y-4 flex-shrink-0">
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <h3 className="font-bold text-center p-3 bg-yellow-100 border-b border-gray-300 text-sm">
                    TRỌNG SỐ CÁC TIÊU CHÍ
                  </h3>
                  <div className="p-4 space-y-3">
                    {criteriaKeys.map(k => (
                      <div key={k} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                        <span className="font-medium">{k}</span>
                        <span className="font-bold">{(criteriaWeights[k] || 0).toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <h3 className="font-bold text-center p-3 bg-pink-200 border-b border-gray-300 text-sm">
                    CHỈ SỐ NHẤT QUÁN CR
                  </h3>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">CR</span>
                      <span className={`font-bold ${criteriaCR < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                        {criteriaCR.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextButton onClick={handleNext} />
          </div>
        )}

        {/* ===== BƯỚC 2: CÂU HỎI LỌC CÂY (Ảnh 7) ===== */}
        {wizardStep === STEP_QUESTIONS && (
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">HÃY CHỌN CÂU TRẢ LỜI</h2>

            <div className="space-y-8">
              {QUESTIONS.map((q, idx) => (
                <div key={idx}>
                  <p className="font-bold text-lg mb-3">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="flex flex-wrap gap-6 pl-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                          answers[idx] === 'A' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 group-hover:border-gray-600'
                        }`}
                        onClick={() => handleAnswer(idx, 'A')}
                      >
                        {answers[idx] === 'A' && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700" onClick={() => handleAnswer(idx, 'A')}>{q.optionA}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                          answers[idx] === 'B' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 group-hover:border-gray-600'
                        }`}
                        onClick={() => handleAnswer(idx, 'B')}
                      >
                        {answers[idx] === 'B' && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700" onClick={() => handleAnswer(idx, 'B')}>{q.optionB}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <NextButton onClick={handleNext} loading={loadingPlants} />
          </div>
        )}

        {/* ===== BƯỚC 3..N: MA TRẬN PHƯƠNG ÁN (Ảnh 8-11) ===== */}
        {wizardStep >= STEP_ALT_START && wizardStep < STEP_RESULTS && currentCriterion && (
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            {/* Ghi chú lọc cây (chỉ hiện ở bước đầu) */}
            {currentAltIndex === 0 && filteredPlants.length > 0 && (
              <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-800 italic">
                  Ví dụ lọc ra được {filteredPlants.length} cây: {filteredPlants.map(p => p.ten_cay).join(', ')} tiến hành đánh giá {filteredPlants.length} cây này theo từng tiêu chí
                </p>
              </div>
            )}

            <h2 className="text-xl md:text-2xl font-black italic text-center mb-8">
              ĐÁNH GIÁ CÂY THEO {currentCriterion.ten_tieu_chi.toUpperCase()} ({currentCriterion.ma_tieu_chi})
            </h2>

            {filteredPlants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Không tìm thấy cây phù hợp với bộ lọc.</p>
                <button
                  onClick={() => { setWizardStep(STEP_QUESTIONS); window.scrollTo(0, 0) }}
                  className="text-emerald-600 underline hover:text-emerald-800 font-medium"
                >
                  Quay lại điều chỉnh câu trả lời
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Ma trận */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-400 p-3 min-w-[120px]"></th>
                        {plantKeys.map(pId => (
                          <th key={pId} className="border border-gray-400 p-3 text-center font-bold min-w-[100px]">
                            {plantNameMap[pId]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plantKeys.map((dong, i) => (
                        <tr key={dong}>
                          <td className="border border-gray-400 p-3 font-bold bg-gray-100">{plantNameMap[dong]}</td>
                          {plantKeys.map((cot, j) => {
                            const isDiag = i === j
                            const isUpper = i < j
                            const mat = altMatrices[currentCriterion.ma_tieu_chi]
                            const value = mat?.[dong]?.[cot] || 1
                            return (
                              <td key={cot} className="border border-gray-400 p-2 text-center">
                                {isDiag ? (
                                  <span className="font-medium text-gray-700">1</span>
                                ) : isUpper ? (
                                  <select
                                    value={getScaleLabel(value)}
                                    onChange={e => handleAltCellChange(currentCriterion.ma_tieu_chi, dong, cot, e.target.value)}
                                    className="w-full px-1 py-1.5 text-center font-semibold bg-yellow-300 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                                  >
                                    {AHP_SCALE_OPTIONS.map(opt => (
                                      <option key={opt.label} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-gray-500 text-sm">{getScaleDisplayLabel(value)}</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Trọng số + CR */}
                <div className="w-full lg:w-64 space-y-4 flex-shrink-0">
                  <div className="border border-gray-300 rounded-xl overflow-hidden">
                    <h3 className="font-bold text-center p-3 bg-yellow-100 border-b border-gray-300 text-sm">
                      TRỌNG SỐ PHƯƠNG ÁN THEO {currentCriterion.ma_tieu_chi}
                    </h3>
                    <div className="p-4 space-y-3">
                      {plantKeys.map(pId => (
                        <div key={pId} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                          <span className="font-medium text-sm">{plantNameMap[pId]}</span>
                          <span className="font-bold">{(altWeights[currentCriterion.ma_tieu_chi]?.[pId] || 0).toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-xl overflow-hidden">
                    <h3 className="font-bold text-center p-3 bg-pink-200 border-b border-gray-300 text-sm">
                      CHỈ SỐ NHẤT QUÁN CR
                    </h3>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">CR</span>
                        <span className={`font-bold ${(altCRs[currentCriterion.ma_tieu_chi] || 0) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                          {(altCRs[currentCriterion.ma_tieu_chi] || 0).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <NextButton onClick={handleNext} />
          </div>
        )}

        {/* ===== BƯỚC CUỐI: KẾT QUẢ XẾP HẠNG (Ảnh 12) ===== */}
        {wizardStep === STEP_RESULTS && (
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black italic mb-8">KẾT QUẢ XẾP HẠNG</h2>

            {finalResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Không có kết quả để hiển thị.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="border border-gray-300 p-4 text-left font-bold text-lg">Cây cảnh</th>
                      <th className="border border-gray-300 p-4 text-left font-bold text-lg">Mức độ phù hợp</th>
                      <th className="border border-gray-300 p-4 text-left font-bold text-lg">Tìm mua sản phẩm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalResults.map(plant => (
                      <tr key={plant.cay_canh_id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 p-4 text-lg">{plant.ten_cay}</td>
                        <td className="border border-gray-300 p-4 text-lg font-bold">{plant.score}%</td>
                        <td className="border border-gray-300 p-4">
                          <Link
                            to={`/cay-canh/${plant.cay_canh_id}`}
                            className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 group"
                          >
                            Mua hàng
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform font-bold" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Nút quay lại */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  setPhase('intro')
                  setWizardStep(0)
                  setAnswers({})
                  setFilteredPlants([])
                  setAltMatrices({})
                  setAltWeights({})
                  setAltCRs({})
                  setFinalResults([])
                  window.scrollTo(0, 0)
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-all hover:shadow-lg"
              >
                Làm lại từ đầu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TuVanAHP
