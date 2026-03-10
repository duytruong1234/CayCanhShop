from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import CayCanh, TonKho
from app.utils.auth import get_current_admin
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/admin/ton-kho",
    tags=["Admin Ton Kho"],
    dependencies=[Depends(get_current_admin)]
)

class TonKhoResponse(BaseModel):
    cay_canh_id: int
    ten_cay: str
    hinh_anh: str
    so_luong_con: int
    gia: float

    class Config:
        from_attributes = True

class NhapKhoRequest(BaseModel):
    cay_canh_id: int
    so_luong_nhap: int

@router.get("/", response_model=List[TonKhoResponse])
def get_inventory(db: Session = Depends(get_db)):
    # Join CayCanh with TonKho
    # If no TonKho record, assume 0
    items = db.query(CayCanh).outerjoin(TonKho, CayCanh.CayCanhID == TonKho.CayCanhID).all()
    
    res = []
    for item in items:
        qty = 0
        if item.ton_kho:
            qty = item.ton_kho.SoLuongTon
        
        res.append({
            "cay_canh_id": item.CayCanhID,
            "ten_cay": item.TenCay,
            "hinh_anh": item.HinhAnh or "",
            "so_luong_con": qty,
            "gia": float(item.Gia)
        })
    return res

@router.post("/nhap")
def import_stock(data: NhapKhoRequest, db: Session = Depends(get_db)):
    if data.so_luong_nhap <= 0:
        raise HTTPException(status_code=400, detail="Số lượng phải > 0")
        
    item = db.query(CayCanh).filter(CayCanh.CayCanhID == data.cay_canh_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây")
        
    # Find or create TonKho
    stock = db.query(TonKho).filter(TonKho.CayCanhID == data.cay_canh_id).first()
    if not stock:
        stock = TonKho(CayCanhID=data.cay_canh_id, SoLuongTon=0, NgayCapNhat=datetime.now())
        db.add(stock)
    
    stock.SoLuongTon += data.so_luong_nhap
    stock.NgayCapNhat = datetime.now()
    
    db.commit()
    return {"message": "Nhập kho thành công", "new_stock": stock.SoLuongTon}
