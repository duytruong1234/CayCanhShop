from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel

from app.database import get_db
from app.models.tieu_chi import TieuChi
from app.models.ma_tran_phuong_an import MaTranPhuongAn
from app.models.trong_so_phuong_an import TrongSoPhuongAn
from app.models.cay_canh import CayCanh
from app.utils.ahp_calculator import calculate_weights, calculate_cr


router = APIRouter(
    prefix="/phuong-an",
    tags=["AHP - Ma trận phương án (Cây)"]
)


class PlantInfo(BaseModel):
    cay_canh_id: int
    ten_cay: str


class MatrixCell(BaseModel):
    cay_dong_id: int
    cay_cot_id: int
    gia_tri: float


class MatrixUpdateRequest(BaseModel):
    cells: List[MatrixCell]


class PlantMatrixResponse(BaseModel):
    ma_tieu_chi: str
    ten_tieu_chi: str
    matrix: Dict[int, Dict[int, float]]
    plants: List[PlantInfo]
    weights: Dict[int, float]
    cr: float


@router.get("/{ma_tieu_chi}", response_model=PlantMatrixResponse)
async def get_plant_matrix(ma_tieu_chi: str, db: Session = Depends(get_db)):
    """Lấy ma trận so sánh các cây theo một tiêu chí"""
    tieu_chi = db.query(TieuChi).filter(TieuChi.MaTieuChi == ma_tieu_chi).first()
    if not tieu_chi:
        raise HTTPException(status_code=404, detail="Tiêu chí không tồn tại")
    
    # Lấy tất cả các cây có dữ liệu so sánh cho tiêu chí này
    plant_ids_query = db.query(MaTranPhuongAn.CayDongID).filter(
        MaTranPhuongAn.MaTieuChi == ma_tieu_chi
    ).distinct()
    plant_ids = [row[0] for row in plant_ids_query.all()]
    
    if not plant_ids:
        # Nếu không có dữ liệu so sánh, lấy tất cả các cây
        plants = db.query(CayCanh).limit(10).all()
        plant_ids = [p.CayCanhID for p in plants]
    else:
        plants = db.query(CayCanh).filter(CayCanh.CayCanhID.in_(plant_ids)).all()
    
    plant_ids = sorted(plant_ids)
    
    # Xây dựng ma trận dictionary
    matrix_dict = {p: {p2: 1.0 for p2 in plant_ids} for p in plant_ids}
    
    # Điền dữ liệu từ database
    cells = db.query(MaTranPhuongAn).filter(MaTranPhuongAn.MaTieuChi == ma_tieu_chi).all()
    for cell in cells:
        if cell.CayDongID in matrix_dict and cell.CayCotID in matrix_dict[cell.CayDongID]:
            matrix_dict[cell.CayDongID][cell.CayCotID] = cell.GiaTriPhuongAn
    
    # Lấy trọng số đã lưu
    weights_dict = {}
    stored_weights = db.query(TrongSoPhuongAn).filter(
        TrongSoPhuongAn.MaTieuChi == ma_tieu_chi
    ).all()
    for sw in stored_weights:
        weights_dict[sw.CayCanhID] = sw.TrongSoPhuongAn
    
    # Điền trọng số còn thiếu bằng 0
    for pid in plant_ids:
        if pid not in weights_dict:
            weights_dict[pid] = 0.0
    
    return PlantMatrixResponse(
        ma_tieu_chi=tieu_chi.MaTieuChi,
        ten_tieu_chi=tieu_chi.TenTieuChi,
        matrix=matrix_dict,
        plants=[PlantInfo(cay_canh_id=p.CayCanhID, ten_cay=p.TenCay) for p in plants],
        weights=weights_dict,
        cr=tieu_chi.CR_PhuongAn or 0
    )


@router.put("/{ma_tieu_chi}")
async def update_plant_matrix(
    ma_tieu_chi: str, 
    request: MatrixUpdateRequest, 
    db: Session = Depends(get_db)
):
    """
    Cập nhật ma trận so sánh cây theo tiêu chí.
    Tự động điền giá trị đối xứng (1/x).
    """
    tieu_chi = db.query(TieuChi).filter(TieuChi.MaTieuChi == ma_tieu_chi).first()
    if not tieu_chi:
        raise HTTPException(status_code=404, detail="Tiêu chí không tồn tại")
    
    for cell in request.cells:
        # Cập nhật ô ma trận
        existing = db.query(MaTranPhuongAn).filter(
            MaTranPhuongAn.MaTieuChi == ma_tieu_chi,
            MaTranPhuongAn.CayDongID == cell.cay_dong_id,
            MaTranPhuongAn.CayCotID == cell.cay_cot_id
        ).first()
        
        if existing:
            existing.GiaTriPhuongAn = cell.gia_tri
        else:
            new_cell = MaTranPhuongAn(
                MaTieuChi=ma_tieu_chi,
                CayDongID=cell.cay_dong_id,
                CayCotID=cell.cay_cot_id,
                GiaTriPhuongAn=cell.gia_tri
            )
            db.add(new_cell)
        
        # Tự động điền giá trị nghịch đảo (bỏ qua đường chéo)
        if cell.cay_dong_id != cell.cay_cot_id:
            reciprocal_value = 1.0 / cell.gia_tri if cell.gia_tri != 0 else 0
            reciprocal = db.query(MaTranPhuongAn).filter(
                MaTranPhuongAn.MaTieuChi == ma_tieu_chi,
                MaTranPhuongAn.CayDongID == cell.cay_cot_id,
                MaTranPhuongAn.CayCotID == cell.cay_dong_id
            ).first()
            
            if reciprocal:
                reciprocal.GiaTriPhuongAn = reciprocal_value
            else:
                new_reciprocal = MaTranPhuongAn(
                    MaTieuChi=ma_tieu_chi,
                    CayDongID=cell.cay_cot_id,
                    CayCotID=cell.cay_dong_id,
                    GiaTriPhuongAn=reciprocal_value
                )
                db.add(new_reciprocal)
    
    db.commit()
    return {"message": "Cập nhật thành công"}


@router.post("/{ma_tieu_chi}/tinh-trong-so")
async def calculate_plant_weights(ma_tieu_chi: str, db: Session = Depends(get_db)):
    """Tính trọng số các cây từ ma trận theo tiêu chí, lưu vào database"""
    tieu_chi = db.query(TieuChi).filter(TieuChi.MaTieuChi == ma_tieu_chi).first()
    if not tieu_chi:
        raise HTTPException(status_code=404, detail="Tiêu chí không tồn tại")
    
    # Lấy ID các cây
    plant_ids_query = db.query(MaTranPhuongAn.CayDongID).filter(
        MaTranPhuongAn.MaTieuChi == ma_tieu_chi
    ).distinct()
    plant_ids = sorted([row[0] for row in plant_ids_query.all()])
    
    n = len(plant_ids)
    if n == 0:
        raise HTTPException(status_code=400, detail="Không có dữ liệu ma trận")
    
    # Xây dựng ma trận
    matrix_dict = {p: {p2: 1.0 for p2 in plant_ids} for p in plant_ids}
    cells = db.query(MaTranPhuongAn).filter(MaTranPhuongAn.MaTieuChi == ma_tieu_chi).all()
    for cell in cells:
        if cell.CayDongID in matrix_dict:
            matrix_dict[cell.CayDongID][cell.CayCotID] = cell.GiaTriPhuongAn
    
    matrix_list = [[matrix_dict[r][c] for c in plant_ids] for r in plant_ids]
    
    # Tính toán
    weights = calculate_weights(matrix_list)
    cr = calculate_cr(matrix_list, weights)
    
    # Lưu trọng số
    for i, plant_id in enumerate(plant_ids):
        existing = db.query(TrongSoPhuongAn).filter(
            TrongSoPhuongAn.CayCanhID == plant_id,
            TrongSoPhuongAn.MaTieuChi == ma_tieu_chi
        ).first()
        
        if existing:
            existing.TrongSoPhuongAn = weights[i]
        else:
            new_weight = TrongSoPhuongAn(
                CayCanhID=plant_id,
                MaTieuChi=ma_tieu_chi,
                TrongSoPhuongAn=weights[i]
            )
            db.add(new_weight)
    
    # Lưu CR vào bảng TieuChi
    tieu_chi.CR_PhuongAn = cr
    
    db.commit()
    
    return {
        "weights": {plant_ids[i]: round(weights[i], 4) for i in range(n)},
        "cr": round(cr, 4),
        "is_consistent": cr < 0.1
    }
