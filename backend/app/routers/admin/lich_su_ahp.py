import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import TaiKhoan, LichSuAHP, KhachHang, CayCanh
from app.utils.auth import get_current_admin


router = APIRouter(
    prefix="/admin/lich-su-ahp",
    tags=["Admin Lich Su AHP"],
    dependencies=[Depends(get_current_admin)]
)


@router.get("/")
def get_all_ahp_history(
    tai_khoan_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Lấy tất cả lịch sử AHP (có thể filter theo user)"""
    
    query = db.query(LichSuAHP)
    
    if tai_khoan_id:
        query = query.filter(LichSuAHP.TaiKhoanID == tai_khoan_id)
    
    records = query.order_by(LichSuAHP.NgayDanhGia.desc()).all()
    
    result = []
    for r in records:
        # Lấy tên khách hàng
        kh = db.query(KhachHang).filter(KhachHang.TaiKhoanID == r.TaiKhoanID).first()
        tk = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == r.TaiKhoanID).first()
        
        result.append({
            "lich_su_ahp_id": r.LichSuAHPID,
            "tai_khoan_id": r.TaiKhoanID,
            "ten_khach_hang": kh.HoTen if kh else (tk.TenDangNhap if tk else "Unknown"),
            "ngay_danh_gia": r.NgayDanhGia.isoformat() if r.NgayDanhGia else None,
            "trong_so_tieu_chi": json.loads(r.TrongSoTieuChi) if r.TrongSoTieuChi else {},
            "cr_tieu_chi": r.CRTieuChi,
            "cau_tra_loi": json.loads(r.CauTraLoi) if r.CauTraLoi else {},
            "ket_qua": json.loads(r.KetQua) if r.KetQua else [],
            "cay_duoc_chon_id": r.CayDuocChonID
        })
    
    return result


@router.get("/{tai_khoan_id}")
def get_ahp_history_by_user(
    tai_khoan_id: int,
    db: Session = Depends(get_db)
):
    """Lấy lịch sử AHP của 1 khách hàng cụ thể"""
    
    # Kiểm tra user tồn tại
    user = db.query(TaiKhoan).filter(TaiKhoan.TaiKhoanID == tai_khoan_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    
    kh = db.query(KhachHang).filter(KhachHang.TaiKhoanID == tai_khoan_id).first()
    
    records = db.query(LichSuAHP).filter(
        LichSuAHP.TaiKhoanID == tai_khoan_id
    ).order_by(LichSuAHP.NgayDanhGia.desc()).all()
    
    result = []
    for r in records:
        ket_qua = json.loads(r.KetQua) if r.KetQua else []
        
        result.append({
            "lich_su_ahp_id": r.LichSuAHPID,
            "tai_khoan_id": r.TaiKhoanID,
            "ngay_danh_gia": r.NgayDanhGia.isoformat() if r.NgayDanhGia else None,
            "trong_so_tieu_chi": json.loads(r.TrongSoTieuChi) if r.TrongSoTieuChi else {},
            "cr_tieu_chi": r.CRTieuChi,
            "cau_tra_loi": json.loads(r.CauTraLoi) if r.CauTraLoi else {},
            "ket_qua": ket_qua,
            "cay_duoc_chon_id": r.CayDuocChonID
        })
    
    return {
        "tai_khoan_id": tai_khoan_id,
        "ten_khach_hang": kh.HoTen if kh else user.TenDangNhap,
        "tong_so_lan": len(result),
        "lich_su": result
    }
