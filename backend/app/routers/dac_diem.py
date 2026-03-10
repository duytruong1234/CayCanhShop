from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.dac_diem import DacDiem
from app.models.cay_canh_dac_diem import CayCanhDacDiem


router = APIRouter(
    prefix="/dac-diem",
    tags=["AHP - Đặc điểm nổi bật"]
)


class DacDiemResponse(BaseModel):
    ma_dac_diem: str
    ten_dac_diem: str

    class Config:
        from_attributes = True


class DacDiemCreate(BaseModel):
    ma_dac_diem: str
    ten_dac_diem: str


@router.get("", response_model=List[DacDiemResponse])
async def get_all_dac_diem(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả đặc điểm nổi bật"""
    dac_diems = db.query(DacDiem).all()
    return [
        DacDiemResponse(
            ma_dac_diem=dd.MaDacDiem,
            ten_dac_diem=dd.TenDacDiem
        ) for dd in dac_diems
    ]


@router.post("", response_model=DacDiemResponse)
async def create_dac_diem(data: DacDiemCreate, db: Session = Depends(get_db)):
    """Thêm đặc điểm nổi bật mới"""
    existing = db.query(DacDiem).filter(DacDiem.MaDacDiem == data.ma_dac_diem).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mã đặc điểm đã tồn tại")
    
    new_dd = DacDiem(MaDacDiem=data.ma_dac_diem, TenDacDiem=data.ten_dac_diem)
    db.add(new_dd)
    db.commit()
    db.refresh(new_dd)
    
    return DacDiemResponse(ma_dac_diem=new_dd.MaDacDiem, ten_dac_diem=new_dd.TenDacDiem)


@router.get("/cay/{cay_id}", response_model=List[DacDiemResponse])
async def get_dac_diem_by_cay(cay_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách đặc điểm của một cây"""
    links = db.query(CayCanhDacDiem).filter(CayCanhDacDiem.CayCanhID == cay_id).all()
    result = []
    for link in links:
        dd = db.query(DacDiem).filter(DacDiem.MaDacDiem == link.MaDacDiem).first()
        if dd:
            result.append(DacDiemResponse(ma_dac_diem=dd.MaDacDiem, ten_dac_diem=dd.TenDacDiem))
    return result


@router.put("/cay/{cay_id}")
async def update_cay_dac_diem(cay_id: int, ma_dac_diems: List[str], db: Session = Depends(get_db)):
    """Cập nhật đặc điểm cho một cây (ghi đè hoàn toàn)"""
    # Xóa tất cả đặc điểm cũ
    db.query(CayCanhDacDiem).filter(CayCanhDacDiem.CayCanhID == cay_id).delete()
    
    # Thêm đặc điểm mới
    for ma in ma_dac_diems:
        link = CayCanhDacDiem(CayCanhID=cay_id, MaDacDiem=ma)
        db.add(link)
    
    db.commit()
    return {"message": "Cập nhật thành công", "count": len(ma_dac_diems)}
