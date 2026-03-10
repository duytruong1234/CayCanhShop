import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './QuanLyBaiViet.css'

const QuanLyBaiViet = () => {
    const { cayCanhId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Trạng thái Modal
    const [showThongTinModal, setShowThongTinModal] = useState(false)
    const [showMoTaModal, setShowMoTaModal] = useState(false)
    const [showDacDiemModal, setShowDacDiemModal] = useState(false)
    const [showChamSocModal, setShowChamSocModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    // Trạng thái Form
    const [thongTinForm, setThongTinForm] = useState({
        ten_khoa_hoc: '',
        ho_thuc_vat: '',
        nguon_goc: '',
        ten_goi_khac: ''
    })

    const [moTaForm, setMoTaForm] = useState({
        tieu_de: '',
        noi_dung: ''
    })

    const [dacDiemForm, setDacDiemForm] = useState({
        noi_dung_1: '',
        noi_dung_2: '',
        noi_dung_3: '',
        noi_dung_4: '',
        noi_dung_5: ''
    })

    const [chamSocForm, setChamSocForm] = useState({
        noi_dung_1: '',
        noi_dung_2: '',
        noi_dung_3: '',
        noi_dung_4: '',
        noi_dung_5: ''
    })

    useEffect(() => {
        fetchBaiViet()
    }, [cayCanhId])

    const fetchBaiViet = async () => {
        try {
            const res = await api.get(`/admin/bai-viet/${cayCanhId}`)
            setData(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching bai viet:', error)
            setLoading(false)
        }
    }

    // ================= THÔNG TIN KHOA HỌC =================
    const openThongTinModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.thong_tin_khoa_hoc) {
            setThongTinForm({
                ten_khoa_hoc: data.thong_tin_khoa_hoc.ten_khoa_hoc || '',
                ho_thuc_vat: data.thong_tin_khoa_hoc.ho_thuc_vat || '',
                nguon_goc: data.thong_tin_khoa_hoc.nguon_goc || '',
                ten_goi_khac: data.thong_tin_khoa_hoc.ten_goi_khac || ''
            })
        } else {
            setThongTinForm({ ten_khoa_hoc: '', ho_thuc_vat: '', nguon_goc: '', ten_goi_khac: '' })
        }
        setShowThongTinModal(true)
    }

    const handleThongTinSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(thongTinForm).forEach(([key, value]) => formData.append(key, value))

        try {
            const endpoint = isEditMode ? '/admin/bai-viet/thong-tin-khoa-hoc' : '/admin/bai-viet/thong-tin-khoa-hoc'
            const method = isEditMode ? api.put : api.post
            await method(endpoint, formData)
            alert(isEditMode ? 'Cập nhật thành công!' : 'Thêm thành công!')
            setShowThongTinModal(false)
            fetchBaiViet()
        } catch (error) {
            alert(error.response?.data?.detail || 'Có lỗi xảy ra')
        }
    }

    // ================= MÔ TẢ CHI TIẾT =================
    const openMoTaModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.mo_ta_chi_tiet) {
            setMoTaForm({
                tieu_de: data.mo_ta_chi_tiet.tieu_de || '',
                noi_dung: data.mo_ta_chi_tiet.noi_dung || ''
            })
        } else {
            setMoTaForm({ tieu_de: '', noi_dung: '' })
        }
        setShowMoTaModal(true)
    }

    const handleMoTaSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(moTaForm).forEach(([key, value]) => formData.append(key, value))

        try {
            const method = isEditMode ? api.put : api.post
            await method('/admin/bai-viet/mo-ta-chi-tiet', formData)
            alert(isEditMode ? 'Cập nhật thành công!' : 'Thêm thành công!')
            setShowMoTaModal(false)
            fetchBaiViet()
        } catch (error) {
            alert(error.response?.data?.detail || 'Có lỗi xảy ra')
        }
    }

    // ================= ĐẶC ĐIỂM NỔI BẬT =================
    const openDacDiemModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.dac_diem_noi_bat?.length > 0) {
            setDacDiemForm({
                noi_dung_1: data.dac_diem_noi_bat[0]?.noi_dung || '',
                noi_dung_2: data.dac_diem_noi_bat[1]?.noi_dung || '',
                noi_dung_3: data.dac_diem_noi_bat[2]?.noi_dung || '',
                noi_dung_4: data.dac_diem_noi_bat[3]?.noi_dung || '',
                noi_dung_5: data.dac_diem_noi_bat[4]?.noi_dung || ''
            })
        } else {
            setDacDiemForm({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' })
        }
        setShowDacDiemModal(true)
    }

    const handleDacDiemSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(dacDiemForm).forEach(([key, value]) => formData.append(key, value))

        try {
            const method = isEditMode ? api.put : api.post
            await method('/admin/bai-viet/dac-diem-noi-bat', formData)
            alert(isEditMode ? 'Cập nhật thành công!' : 'Thêm thành công!')
            setShowDacDiemModal(false)
            fetchBaiViet()
        } catch (error) {
            alert(error.response?.data?.detail || 'Có lỗi xảy ra')
        }
    }

    // ================= CÁCH CHĂM SÓC =================
    const openChamSocModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.cach_cham_soc?.length > 0) {
            const cs = data.cach_cham_soc
            setChamSocForm({
                noi_dung_1: cs.find(x => x.tieu_de === 'Ánh sáng')?.noi_dung || '',
                noi_dung_2: cs.find(x => x.tieu_de === 'Tưới nước')?.noi_dung || '',
                noi_dung_3: cs.find(x => x.tieu_de === 'Đất trồng')?.noi_dung || '',
                noi_dung_4: cs.find(x => x.tieu_de === 'Nhiệt độ')?.noi_dung || '',
                noi_dung_5: cs.find(x => x.tieu_de === 'Bón phân')?.noi_dung || ''
            })
        } else {
            setChamSocForm({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' })
        }
        setShowChamSocModal(true)
    }

    const handleChamSocSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(chamSocForm).forEach(([key, value]) => formData.append(key, value))

        try {
            await api.post('/admin/bai-viet/cach-cham-soc', formData)
            alert('Cập nhật thành công!')
            setShowChamSocModal(false)
            fetchBaiViet()
        } catch (error) {
            alert(error.response?.data?.detail || 'Có lỗi xảy ra')
        }
    }

    if (loading) {
        return <div className="loading">Đang tải...</div>
    }

    return (
        <div className="bai-viet-container">
            <button className="back-button" onClick={() => navigate('/admin/cay-canh')}>
                <i className="fa fa-arrow-left"></i> Quay lại danh sách cây cảnh
            </button>

            <h2 className="page-title">QUẢN LÝ BÀI VIẾT CHO: {data?.ten_cay}</h2>

            {/* THÔNG TIN KHOA HỌC */}
            <div className="bv-item">
                <div className="bv-label">Thông tin khoa học</div>
                <div className="bv-box">
                    {data?.thong_tin_khoa_hoc ? (
                        <>
                            <p><b>Tên khoa học:</b> {data.thong_tin_khoa_hoc.ten_khoa_hoc}</p>
                            <p><b>Họ thực vật:</b> {data.thong_tin_khoa_hoc.ho_thuc_vat}</p>
                            <p><b>Nguồn gốc:</b> {data.thong_tin_khoa_hoc.nguon_goc}</p>
                            <p><b>Tên gọi khác:</b> {data.thong_tin_khoa_hoc.ten_goi_khac}</p>
                            <button className="btn-edit sua" onClick={() => openThongTinModal(true)}>Sửa</button>
                        </>
                    ) : (
                        <>
                            <p>Chưa có thông tin khoa học.</p>
                            <button className="btn-edit them" onClick={() => openThongTinModal(false)}>Thêm mới</button>
                        </>
                    )}
                </div>
            </div>

            {/* MÔ TẢ CHI TIẾT */}
            <div className="bv-item">
                <div className="bv-label">Mô tả chi tiết</div>
                <div className="bv-box">
                    {data?.mo_ta_chi_tiet ? (
                        <>
                            <p><b>{data.mo_ta_chi_tiet.tieu_de}</b>: {data.mo_ta_chi_tiet.noi_dung}</p>
                            <button className="btn-edit sua" onClick={() => openMoTaModal(true)}>Sửa</button>
                        </>
                    ) : (
                        <>
                            <p>Chưa có mô tả chi tiết.</p>
                            <button className="btn-edit them" onClick={() => openMoTaModal(false)}>Thêm mới</button>
                        </>
                    )}
                </div>
            </div>

            {/* ĐẶC ĐIỂM NỔI BẬT */}
            <div className="bv-item">
                <div className="bv-label">Đặc điểm nổi bật</div>
                <div className="bv-box">
                    {data?.dac_diem_noi_bat?.length > 0 ? (
                        <>
                            {data.dac_diem_noi_bat.map((item, idx) => (
                                <p key={idx}>{item.noi_dung}</p>
                            ))}
                            <button className="btn-edit sua" onClick={() => openDacDiemModal(true)}>Sửa</button>
                        </>
                    ) : (
                        <>
                            <p>Chưa có đặc điểm nổi bật.</p>
                            <button className="btn-edit them" onClick={() => openDacDiemModal(false)}>Thêm mới</button>
                        </>
                    )}
                </div>
            </div>

            {/* CÁCH CHĂM SÓC */}
            <div className="bv-item">
                <div className="bv-label">Cách chăm sóc</div>
                <div className="bv-box">
                    {data?.cach_cham_soc?.length > 0 ? (
                        <>
                            {data.cach_cham_soc.map((item, idx) => (
                                <p key={idx}><b>{item.tieu_de}</b>: {item.noi_dung}</p>
                            ))}
                            <button className="btn-edit sua" onClick={() => openChamSocModal(true)}>Sửa</button>
                        </>
                    ) : (
                        <>
                            <p>Chưa có thông tin chăm sóc.</p>
                            <button className="btn-edit them" onClick={() => openChamSocModal(false)}>Thêm mới</button>
                        </>
                    )}
                </div>
            </div>

            {/* MODAL THÔNG TIN KHOA HỌC */}
            {showThongTinModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowThongTinModal(false)}>✖</span>
                        <h2 className="modal-title">{isEditMode ? 'Cập nhật' : 'Thêm'} thông tin khoa học</h2>

                        <label>Tên khoa học</label>
                        <input type="text" className="input-field" value={thongTinForm.ten_khoa_hoc}
                            onChange={(e) => setThongTinForm(prev => ({ ...prev, ten_khoa_hoc: e.target.value }))} />

                        <label>Họ thực vật</label>
                        <input type="text" className="input-field" value={thongTinForm.ho_thuc_vat}
                            onChange={(e) => setThongTinForm(prev => ({ ...prev, ho_thuc_vat: e.target.value }))} />

                        <label>Nguồn gốc</label>
                        <input type="text" className="input-field" value={thongTinForm.nguon_goc}
                            onChange={(e) => setThongTinForm(prev => ({ ...prev, nguon_goc: e.target.value }))} />

                        <label>Tên gọi khác</label>
                        <input type="text" className="input-field" value={thongTinForm.ten_goi_khac}
                            onChange={(e) => setThongTinForm(prev => ({ ...prev, ten_goi_khac: e.target.value }))} />

                        <button className="modal-btn" onClick={handleThongTinSubmit}>
                            {isEditMode ? 'Cập nhật' : 'Lưu'}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL MÔ TẢ CHI TIẾT */}
            {showMoTaModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowMoTaModal(false)}>✖</span>
                        <h2 className="modal-title">{isEditMode ? 'Cập nhật' : 'Thêm'} mô tả chi tiết</h2>

                        <label>Tiêu đề</label>
                        <input type="text" className="input-field" value={moTaForm.tieu_de}
                            onChange={(e) => setMoTaForm(prev => ({ ...prev, tieu_de: e.target.value }))} />

                        <label>Nội dung</label>
                        <textarea className="input-field textarea" value={moTaForm.noi_dung}
                            onChange={(e) => setMoTaForm(prev => ({ ...prev, noi_dung: e.target.value }))} />

                        <button className="modal-btn" onClick={handleMoTaSubmit}>
                            {isEditMode ? 'Cập nhật' : 'Lưu'}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL ĐẶC ĐIỂM NỔI BẬT */}
            {showDacDiemModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowDacDiemModal(false)}>✖</span>
                        <h2 className="modal-title">Đặc điểm nổi bật</h2>

                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i}>
                                <label>Đặc điểm {i}</label>
                                <input type="text" className="input-field"
                                    value={dacDiemForm[`noi_dung_${i}`]}
                                    onChange={(e) => setDacDiemForm(prev => ({ ...prev, [`noi_dung_${i}`]: e.target.value }))} />
                            </div>
                        ))}

                        <button className="modal-btn" onClick={handleDacDiemSubmit}>
                            {isEditMode ? 'Cập nhật' : 'Lưu'}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL CÁCH CHĂM SÓC */}
            {showChamSocModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <span className="close-btn" onClick={() => setShowChamSocModal(false)}>✖</span>
                        <h2 className="modal-title">Cách chăm sóc</h2>

                        <label>Ánh sáng</label>
                        <textarea className="input-field small-textarea" value={chamSocForm.noi_dung_1}
                            onChange={(e) => setChamSocForm(prev => ({ ...prev, noi_dung_1: e.target.value }))} />

                        <label>Tưới nước</label>
                        <textarea className="input-field small-textarea" value={chamSocForm.noi_dung_2}
                            onChange={(e) => setChamSocForm(prev => ({ ...prev, noi_dung_2: e.target.value }))} />

                        <label>Đất trồng</label>
                        <textarea className="input-field small-textarea" value={chamSocForm.noi_dung_3}
                            onChange={(e) => setChamSocForm(prev => ({ ...prev, noi_dung_3: e.target.value }))} />

                        <label>Nhiệt độ</label>
                        <textarea className="input-field small-textarea" value={chamSocForm.noi_dung_4}
                            onChange={(e) => setChamSocForm(prev => ({ ...prev, noi_dung_4: e.target.value }))} />

                        <label>Bón phân</label>
                        <textarea className="input-field small-textarea" value={chamSocForm.noi_dung_5}
                            onChange={(e) => setChamSocForm(prev => ({ ...prev, noi_dung_5: e.target.value }))} />

                        <button className="modal-btn" onClick={handleChamSocSubmit}>Cập nhật</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuanLyBaiViet
