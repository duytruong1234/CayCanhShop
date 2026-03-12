import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaPlus } from 'react-icons/fa'
import api from '../../../services/api'

const QuanLyBaiViet = () => {
    const { cayCanhId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [showThongTinModal, setShowThongTinModal] = useState(false)
    const [showMoTaModal, setShowMoTaModal] = useState(false)
    const [showDacDiemModal, setShowDacDiemModal] = useState(false)
    const [showChamSocModal, setShowChamSocModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    const [thongTinForm, setThongTinForm] = useState({ ten_khoa_hoc: '', ho_thuc_vat: '', nguon_goc: '', ten_goi_khac: '' })
    const [moTaForm, setMoTaForm] = useState({ tieu_de: '', noi_dung: '' })
    const [dacDiemForm, setDacDiemForm] = useState({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' })
    const [chamSocForm, setChamSocForm] = useState({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' })

    useEffect(() => { fetchBaiViet() }, [cayCanhId])

    const fetchBaiViet = async () => {
        try { const res = await api.get(`/admin/bai-viet/${cayCanhId}`); setData(res.data) }
        catch (error) { console.error('Error fetching bai viet:', error) }
        finally { setLoading(false) }
    }

    // THÔNG TIN KHOA HỌC
    const openThongTinModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.thong_tin_khoa_hoc) {
            setThongTinForm({ ten_khoa_hoc: data.thong_tin_khoa_hoc.ten_khoa_hoc || '', ho_thuc_vat: data.thong_tin_khoa_hoc.ho_thuc_vat || '', nguon_goc: data.thong_tin_khoa_hoc.nguon_goc || '', ten_goi_khac: data.thong_tin_khoa_hoc.ten_goi_khac || '' })
        } else { setThongTinForm({ ten_khoa_hoc: '', ho_thuc_vat: '', nguon_goc: '', ten_goi_khac: '' }) }
        setShowThongTinModal(true)
    }

    const handleThongTinSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(thongTinForm).forEach(([key, value]) => formData.append(key, value))
        try {
            const method = isEditMode ? api.put : api.post
            await method('/admin/bai-viet/thong-tin-khoa-hoc', formData)
            alert(isEditMode ? 'Cập nhật thành công!' : 'Thêm thành công!')
            setShowThongTinModal(false); fetchBaiViet()
        } catch (error) { alert(error.response?.data?.detail || 'Có lỗi xảy ra') }
    }

    // MÔ TẢ CHI TIẾT
    const openMoTaModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.mo_ta_chi_tiet) { setMoTaForm({ tieu_de: data.mo_ta_chi_tiet.tieu_de || '', noi_dung: data.mo_ta_chi_tiet.noi_dung || '' }) }
        else { setMoTaForm({ tieu_de: '', noi_dung: '' }) }
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
            setShowMoTaModal(false); fetchBaiViet()
        } catch (error) { alert(error.response?.data?.detail || 'Có lỗi xảy ra') }
    }

    // ĐẶC ĐIỂM NỔI BẬT
    const openDacDiemModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.dac_diem_noi_bat?.length > 0) {
            setDacDiemForm({ noi_dung_1: data.dac_diem_noi_bat[0]?.noi_dung || '', noi_dung_2: data.dac_diem_noi_bat[1]?.noi_dung || '', noi_dung_3: data.dac_diem_noi_bat[2]?.noi_dung || '', noi_dung_4: data.dac_diem_noi_bat[3]?.noi_dung || '', noi_dung_5: data.dac_diem_noi_bat[4]?.noi_dung || '' })
        } else { setDacDiemForm({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' }) }
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
            setShowDacDiemModal(false); fetchBaiViet()
        } catch (error) { alert(error.response?.data?.detail || 'Có lỗi xảy ra') }
    }

    // CÁCH CHĂM SÓC
    const openChamSocModal = (edit = false) => {
        setIsEditMode(edit)
        if (edit && data.cach_cham_soc?.length > 0) {
            const cs = data.cach_cham_soc
            setChamSocForm({ noi_dung_1: cs.find(x => x.tieu_de === 'Ánh sáng')?.noi_dung || '', noi_dung_2: cs.find(x => x.tieu_de === 'Tưới nước')?.noi_dung || '', noi_dung_3: cs.find(x => x.tieu_de === 'Đất trồng')?.noi_dung || '', noi_dung_4: cs.find(x => x.tieu_de === 'Nhiệt độ')?.noi_dung || '', noi_dung_5: cs.find(x => x.tieu_de === 'Bón phân')?.noi_dung || '' })
        } else { setChamSocForm({ noi_dung_1: '', noi_dung_2: '', noi_dung_3: '', noi_dung_4: '', noi_dung_5: '' }) }
        setShowChamSocModal(true)
    }

    const handleChamSocSubmit = async () => {
        const formData = new FormData()
        formData.append('cay_canh_id', cayCanhId)
        Object.entries(chamSocForm).forEach(([key, value]) => formData.append(key, value))
        try {
            await api.post('/admin/bai-viet/cach-cham-soc', formData)
            alert('Cập nhật thành công!')
            setShowChamSocModal(false); fetchBaiViet()
        } catch (error) { alert(error.response?.data?.detail || 'Có lỗi xảy ra') }
    }

    if (loading) return (
        <div className="admin-page flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
    )

    // Section card component
    const Section = ({ title, hasData, children, onAdd, onEdit }) => (
        <div className="admin-card mb-4">
            <div className="admin-card-header flex items-center justify-between">
                <span>{title}</span>
                {hasData ? (
                    <button className="admin-btn admin-btn-sm admin-btn-edit" onClick={onEdit}><FaEdit size={11} /> Sửa</button>
                ) : (
                    <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={onAdd}><FaPlus size={11} /> Thêm mới</button>
                )}
            </div>
            <div className="admin-card-body text-sm text-gray-600 space-y-1.5">
                {hasData ? children : <p className="text-gray-400 italic">Chưa có dữ liệu</p>}
            </div>
        </div>
    )

    // Modal component
    const Modal = ({ show, onClose, title, onSubmit, submitLabel, children }) => {
        if (!show) return null
        return (
            <div className="admin-modal-overlay" onClick={onClose}>
                <div className="admin-modal" onClick={e => e.stopPropagation()}>
                    <div className="admin-modal-header">
                        <h3>{title}</h3>
                        <button className="admin-modal-close" onClick={onClose}>✕</button>
                    </div>
                    <div className="admin-modal-body">{children}</div>
                    <div className="admin-modal-footer">
                        <button className="admin-btn admin-btn-ghost" onClick={onClose}>Hủy</button>
                        <button className="admin-btn admin-btn-primary" onClick={onSubmit}>{submitLabel}</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page animate-fade-in">
            <button className="admin-btn admin-btn-ghost mb-4" onClick={() => navigate('/admin/cay-canh')}>
                <FaArrowLeft size={12} /> Quay lại danh sách
            </button>

            <div className="admin-page-header">
                <h1>Quản lý bài viết: {data?.ten_cay}</h1>
            </div>

            {/* Thông tin khoa học */}
            <Section title="Thông tin khoa học" hasData={!!data?.thong_tin_khoa_hoc} onAdd={() => openThongTinModal(false)} onEdit={() => openThongTinModal(true)}>
                <p><strong>Tên khoa học:</strong> {data?.thong_tin_khoa_hoc?.ten_khoa_hoc}</p>
                <p><strong>Họ thực vật:</strong> {data?.thong_tin_khoa_hoc?.ho_thuc_vat}</p>
                <p><strong>Nguồn gốc:</strong> {data?.thong_tin_khoa_hoc?.nguon_goc}</p>
                <p><strong>Tên gọi khác:</strong> {data?.thong_tin_khoa_hoc?.ten_goi_khac}</p>
            </Section>

            {/* Mô tả chi tiết */}
            <Section title="Mô tả chi tiết" hasData={!!data?.mo_ta_chi_tiet} onAdd={() => openMoTaModal(false)} onEdit={() => openMoTaModal(true)}>
                <p><strong>{data?.mo_ta_chi_tiet?.tieu_de}:</strong> {data?.mo_ta_chi_tiet?.noi_dung}</p>
            </Section>

            {/* Đặc điểm nổi bật */}
            <Section title="Đặc điểm nổi bật" hasData={data?.dac_diem_noi_bat?.length > 0} onAdd={() => openDacDiemModal(false)} onEdit={() => openDacDiemModal(true)}>
                {data?.dac_diem_noi_bat?.map((item, idx) => <p key={idx}>• {item.noi_dung}</p>)}
            </Section>

            {/* Cách chăm sóc */}
            <Section title="Cách chăm sóc" hasData={data?.cach_cham_soc?.length > 0} onAdd={() => openChamSocModal(false)} onEdit={() => openChamSocModal(true)}>
                {data?.cach_cham_soc?.map((item, idx) => <p key={idx}><strong>{item.tieu_de}:</strong> {item.noi_dung}</p>)}
            </Section>

            {/* Modal Thông tin khoa học */}
            <Modal show={showThongTinModal} onClose={() => setShowThongTinModal(false)} title={`${isEditMode ? 'Cập nhật' : 'Thêm'} thông tin khoa học`} onSubmit={handleThongTinSubmit} submitLabel={isEditMode ? 'Cập nhật' : 'Lưu'}>
                {[
                    { label: 'Tên khoa học', key: 'ten_khoa_hoc' },
                    { label: 'Họ thực vật', key: 'ho_thuc_vat' },
                    { label: 'Nguồn gốc', key: 'nguon_goc' },
                    { label: 'Tên gọi khác', key: 'ten_goi_khac' },
                ].map(f => (
                    <div key={f.key} className="admin-form-group">
                        <label className="admin-form-label">{f.label}</label>
                        <input className="admin-form-input" value={thongTinForm[f.key]} onChange={e => setThongTinForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                    </div>
                ))}
            </Modal>

            {/* Modal Mô tả */}
            <Modal show={showMoTaModal} onClose={() => setShowMoTaModal(false)} title={`${isEditMode ? 'Cập nhật' : 'Thêm'} mô tả chi tiết`} onSubmit={handleMoTaSubmit} submitLabel={isEditMode ? 'Cập nhật' : 'Lưu'}>
                <div className="admin-form-group">
                    <label className="admin-form-label">Tiêu đề</label>
                    <input className="admin-form-input" value={moTaForm.tieu_de} onChange={e => setMoTaForm(prev => ({ ...prev, tieu_de: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                    <label className="admin-form-label">Nội dung</label>
                    <textarea className="admin-form-input" rows={5} value={moTaForm.noi_dung} onChange={e => setMoTaForm(prev => ({ ...prev, noi_dung: e.target.value }))} />
                </div>
            </Modal>

            {/* Modal Đặc điểm */}
            <Modal show={showDacDiemModal} onClose={() => setShowDacDiemModal(false)} title="Đặc điểm nổi bật" onSubmit={handleDacDiemSubmit} submitLabel={isEditMode ? 'Cập nhật' : 'Lưu'}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="admin-form-group">
                        <label className="admin-form-label">Đặc điểm {i}</label>
                        <input className="admin-form-input" value={dacDiemForm[`noi_dung_${i}`]} onChange={e => setDacDiemForm(prev => ({ ...prev, [`noi_dung_${i}`]: e.target.value }))} />
                    </div>
                ))}
            </Modal>

            {/* Modal Chăm sóc */}
            <Modal show={showChamSocModal} onClose={() => setShowChamSocModal(false)} title="Cách chăm sóc" onSubmit={handleChamSocSubmit} submitLabel="Cập nhật">
                {[
                    { label: 'Ánh sáng', key: 'noi_dung_1' },
                    { label: 'Tưới nước', key: 'noi_dung_2' },
                    { label: 'Đất trồng', key: 'noi_dung_3' },
                    { label: 'Nhiệt độ', key: 'noi_dung_4' },
                    { label: 'Bón phân', key: 'noi_dung_5' },
                ].map(f => (
                    <div key={f.key} className="admin-form-group">
                        <label className="admin-form-label">{f.label}</label>
                        <textarea className="admin-form-input" rows={2} value={chamSocForm[f.key]} onChange={e => setChamSocForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                    </div>
                ))}
            </Modal>
        </div>
    )
}

export default QuanLyBaiViet
