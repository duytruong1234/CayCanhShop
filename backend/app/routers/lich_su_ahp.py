import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import TaiKhoan, LichSuAHP, KhachHang
from app.utils.auth import get_current_user


router = APIRouter(prefix="/lich-su-ahp", tags=["Lich Su AHP"])


class LichSuAHPCreate(BaseModel):
    trong_so_tieu_chi: dict        # {"GIA": 0.3, "DEP": 0.4, ...}
    cr_tieu_chi: float
    cau_tra_loi: dict              # {"0": "A", "1": "B", ...}
    ket_qua: list                  # [{"cay_canh_id": 1, "ten_cay": "...", "score": 45.2}, ...]
    cay_duoc_chon_id: Optional[int] = None


class LichSuAHPResponse(BaseModel):
    lich_su_ahp_id: int
    tai_khoan_id: int
    ngay_danh_gia: datetime
    trong_so_tieu_chi: dict
    cr_tieu_chi: float
    cau_tra_loi: dict
    ket_qua: list
    cay_duoc_chon_id: Optional[int]

    class Config:
        from_attributes = True


@router.post("/")
async def save_ahp_history(
    data: LichSuAHPCreate,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lưu lịch sử đánh giá AHP (yêu cầu đăng nhập)"""
    
    new_record = LichSuAHP(
        TaiKhoanID=current_user.TaiKhoanID,
        NgayDanhGia=datetime.now(),
        TrongSoTieuChi=json.dumps(data.trong_so_tieu_chi, ensure_ascii=False),
        CRTieuChi=data.cr_tieu_chi,
        CauTraLoi=json.dumps(data.cau_tra_loi, ensure_ascii=False),
        KetQua=json.dumps(data.ket_qua, ensure_ascii=False),
        CayDuocChonID=data.cay_duoc_chon_id
    )
    db.add(new_record)
    
    try:
        db.commit()
        db.refresh(new_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Lỗi lưu lịch sử: {str(e)}")
    
    return {"message": "Lưu lịch sử thành công", "id": new_record.LichSuAHPID}


@router.get("/")
async def get_my_ahp_history(
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy lịch sử đánh giá AHP của user hiện tại"""
    
    records = db.query(LichSuAHP).filter(
        LichSuAHP.TaiKhoanID == current_user.TaiKhoanID
    ).order_by(LichSuAHP.NgayDanhGia.desc()).all()
    
    result = []
    for r in records:
        result.append({
            "lich_su_ahp_id": r.LichSuAHPID,
            "tai_khoan_id": r.TaiKhoanID,
            "ngay_danh_gia": r.NgayDanhGia.isoformat() if r.NgayDanhGia else None,
            "trong_so_tieu_chi": json.loads(r.TrongSoTieuChi) if r.TrongSoTieuChi else {},
            "cr_tieu_chi": r.CRTieuChi,
            "cau_tra_loi": json.loads(r.CauTraLoi) if r.CauTraLoi else {},
            "ket_qua": json.loads(r.KetQua) if r.KetQua else [],
            "cay_duoc_chon_id": r.CayDuocChonID
        })
    
    return result
