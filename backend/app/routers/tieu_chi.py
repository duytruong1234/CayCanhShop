from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel

from app.database import get_db
from app.models.tieu_chi import TieuChi
from app.models.ma_tran_so_sanh import MaTranSoSanh
from app.models.ahp_thong_so import AHPThongSoTieuChi
from app.utils.ahp_calculator import calculate_weights, calculate_cr


router = APIRouter(
    prefix="/tieu-chi",
    tags=["AHP - Tiêu chí"]
)


class TieuChiResponse(BaseModel):
    ma_tieu_chi: str
    ten_tieu_chi: str
    trong_so: float
    cr_phuong_an: float

    class Config:
        from_attributes = True


class MatrixCell(BaseModel):
    dong: str
    cot: str
    gia_tri: float


class MatrixUpdateRequest(BaseModel):
    cells: List[MatrixCell]


class MatrixResponse(BaseModel):
    matrix: Dict[str, Dict[str, float]]
    tieu_chis: List[TieuChiResponse]
    cr: float


@router.get("", response_model=List[TieuChiResponse])
async def get_all_tieu_chi(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả tiêu chí với trọng số"""
    tieu_chis = db.query(TieuChi).order_by(TieuChi.MaTieuChi).all()
    return [
        TieuChiResponse(
            ma_tieu_chi=tc.MaTieuChi,
            ten_tieu_chi=tc.TenTieuChi,
            trong_so=tc.TrongSoTieuChi or 0,
            cr_phuong_an=tc.CR_PhuongAn or 0
        ) for tc in tieu_chis
    ]


@router.get("/ma-tran", response_model=MatrixResponse)
async def get_matrix_tieu_chi(db: Session = Depends(get_db)):
    """Lấy ma trận so sánh tiêu chí (4x4)"""
    tieu_chis = db.query(TieuChi).order_by(TieuChi.MaTieuChi).all()
    ma_tieu_chi_list = [tc.MaTieuChi for tc in tieu_chis]
    
    # Tạo dictionary ma trận
    matrix_dict = {tc: {tc2: 1.0 for tc2 in ma_tieu_chi_list} for tc in ma_tieu_chi_list}
    
    # Điền giá trị từ database
    cells = db.query(MaTranSoSanh).all()
    for cell in cells:
        if cell.TieuChiDong in matrix_dict and cell.TieuChiCot in matrix_dict[cell.TieuChiDong]:
            matrix_dict[cell.TieuChiDong][cell.TieuChiCot] = cell.GiaTriTieuChi
    
    # Tính chỉ số CR
    n = len(ma_tieu_chi_list)
    if n > 0:
        matrix_list = [[matrix_dict[r][c] for c in ma_tieu_chi_list] for r in ma_tieu_chi_list]
        weights = calculate_weights(matrix_list)
        cr = calculate_cr(matrix_list, weights)
    else:
        cr = 0
    
    # Lấy CR từ giá trị lưu trữ
    cr_record = db.query(AHPThongSoTieuChi).filter(
        AHPThongSoTieuChi.MaThongSo == 'CR_TieuChi_TongThe'
    ).first()
    stored_cr = cr_record.GiaTri if cr_record else cr
    
    return MatrixResponse(
        matrix=matrix_dict,
        tieu_chis=[
            TieuChiResponse(
                ma_tieu_chi=tc.MaTieuChi,
                ten_tieu_chi=tc.TenTieuChi,
                trong_so=tc.TrongSoTieuChi or 0,
                cr_phuong_an=tc.CR_PhuongAn or 0
            ) for tc in tieu_chis
        ],
        cr=stored_cr
    )


@router.put("/ma-tran")
async def update_matrix_tieu_chi(request: MatrixUpdateRequest, db: Session = Depends(get_db)):
    """
    Cập nhật ma trận so sánh tiêu chí.
    Tự động điền giá trị đối xứng (1/x).
    """
    for cell in request.cells:
        # Cập nhật ô ma trận
        existing = db.query(MaTranSoSanh).filter(
            MaTranSoSanh.TieuChiDong == cell.dong,
            MaTranSoSanh.TieuChiCot == cell.cot
        ).first()
        
        if existing:
            existing.GiaTriTieuChi = cell.gia_tri
        else:
            new_cell = MaTranSoSanh(
                TieuChiDong=cell.dong,
                TieuChiCot=cell.cot,
                GiaTriTieuChi=cell.gia_tri
            )
            db.add(new_cell)
        
        # Tự động điền giá trị nghịch đảo (bỏ qua đường chéo)
        if cell.dong != cell.cot:
            reciprocal_value = 1.0 / cell.gia_tri if cell.gia_tri != 0 else 0
            reciprocal = db.query(MaTranSoSanh).filter(
                MaTranSoSanh.TieuChiDong == cell.cot,
                MaTranSoSanh.TieuChiCot == cell.dong
            ).first()
            
            if reciprocal:
                reciprocal.GiaTriTieuChi = reciprocal_value
            else:
                new_reciprocal = MaTranSoSanh(
                    TieuChiDong=cell.cot,
                    TieuChiCot=cell.dong,
                    GiaTriTieuChi=reciprocal_value
                )
                db.add(new_reciprocal)
    
    db.commit()
    return {"message": "Cập nhật thành công"}


@router.post("/tinh-trong-so")
async def calculate_tieu_chi_weights(db: Session = Depends(get_db)):
    """Tính trọng số và CR từ ma trận hiện tại, lưu vào database"""
    tieu_chis = db.query(TieuChi).order_by(TieuChi.MaTieuChi).all()
    ma_tieu_chi_list = [tc.MaTieuChi for tc in tieu_chis]
    
    n = len(ma_tieu_chi_list)
    if n == 0:
        raise HTTPException(status_code=400, detail="Không có tiêu chí nào")
    
    # Xây dựng ma trận
    matrix_dict = {tc: {tc2: 1.0 for tc2 in ma_tieu_chi_list} for tc in ma_tieu_chi_list}
    cells = db.query(MaTranSoSanh).all()
    for cell in cells:
        if cell.TieuChiDong in matrix_dict:
            matrix_dict[cell.TieuChiDong][cell.TieuChiCot] = cell.GiaTriTieuChi
    
    matrix_list = [[matrix_dict[r][c] for c in ma_tieu_chi_list] for r in ma_tieu_chi_list]
    
    # Tính toán
    weights = calculate_weights(matrix_list)
    cr = calculate_cr(matrix_list, weights)
    
    # Lưu trọng số vào bảng TieuChi
    for i, tc in enumerate(tieu_chis):
        tc.TrongSoTieuChi = weights[i]
    
    # Lưu chỉ số CR
    cr_record = db.query(AHPThongSoTieuChi).filter(
        AHPThongSoTieuChi.MaThongSo == 'CR_TieuChi_TongThe'
    ).first()
    if cr_record:
        cr_record.GiaTri = cr
    else:
        new_cr = AHPThongSoTieuChi(MaThongSo='CR_TieuChi_TongThe', GiaTri=cr)
        db.add(new_cr)
    
    db.commit()
    
    return {
        "weights": {ma_tieu_chi_list[i]: round(weights[i], 4) for i in range(n)},
        "cr": round(cr, 4),
        "is_consistent": cr < 0.1
    }
