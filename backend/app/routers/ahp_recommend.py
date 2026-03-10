from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from pydantic import BaseModel

from app.database import get_db
from app.models.tieu_chi import TieuChi
from app.models.trong_so_phuong_an import TrongSoPhuongAn
from app.models.cay_canh import CayCanh
from app.models.dac_diem import DacDiem
from app.models.cay_canh_dac_diem import CayCanhDacDiem
from app.utils.ahp_calculator import calculate_final_scores


router = APIRouter(
    prefix="/ahp-recommend",
    tags=["AHP - Gợi ý cây cho người dùng"]
)


class FilterPlantsRequest(BaseModel):
    selected_dac_diem: Optional[List[str]] = None


class RecommendRequest(BaseModel):
    selected_criteria: List[str]  # ['C1', 'C3']
    selected_dac_diem: Optional[List[str]] = None  # ['KHONG_DOC', 'DE_CHAM']
    custom_weights: Optional[Dict[str, float]] = None  # Trọng số tùy chỉnh từ ma trận người dùng nhập


class PlantRecommendation(BaseModel):
    cay_canh_id: int
    ten_cay: str
    gia: float
    hinh_anh: Optional[str]
    loai_cay: Optional[str]
    diem_phu_hop: float  # Percentage 0-100
    dac_diems: List[str]


class RecommendResponse(BaseModel):
    tong_so: int
    trong_so_chuan_hoa: dict  # {'C1': 32.06, 'C2': 67.94} - % sau khi chuẩn hóa
    cay_goi_y: List[PlantRecommendation]


@router.post("/goi-y", response_model=RecommendResponse)
async def get_recommendations(request: RecommendRequest, db: Session = Depends(get_db)):
    """
    Gợi ý cây dựa trên tiêu chí và đặc điểm đã chọn.
    
    1. Lọc cây theo đặc điểm (nếu có)
    2. Chuẩn hóa trọng số theo tiêu chí được chọn (tổng = 100%)
    3. Tính điểm AHP = Σ(trọng số chuẩn hóa × trọng số cây)
    4. Sắp xếp theo điểm giảm dần
    """
    # Lấy tất cả cây cảnh
    plants_query = db.query(CayCanh)
    
    # Lọc theo đặc điểm nếu được cung cấp
    if request.selected_dac_diem and len(request.selected_dac_diem) > 0:
        # Lấy ID cây có TẤT CẢ các đặc điểm đã chọn
        for ma_dd in request.selected_dac_diem:
            subquery = db.query(CayCanhDacDiem.CayCanhID).filter(
                CayCanhDacDiem.MaDacDiem == ma_dd
            )
            plants_query = plants_query.filter(CayCanh.CayCanhID.in_(subquery))
    
    plants = plants_query.all()
    
    if not plants:
        return RecommendResponse(tong_so=0, trong_so_chuan_hoa={}, cay_goi_y=[])
    
    # Lấy trọng số tiêu chí: ưu tiên dùng custom_weights từ frontend (người dùng tự chỉnh ma trận)
    if request.custom_weights:
        criteria_weights = dict(request.custom_weights)
    else:
        # Fallback: lấy từ DB (admin đã tính sẵn)
        criteria_weights = {}
        tieu_chis = db.query(TieuChi).all()
        for tc in tieu_chis:
            criteria_weights[tc.MaTieuChi] = tc.TrongSoTieuChi or 0
    
    # Chuẩn hóa trọng số: chỉ lấy tiêu chí được chọn, chia lại tổng = 1
    total_selected_weight = sum(criteria_weights.get(c, 0) for c in request.selected_criteria)
    if total_selected_weight == 0:
        total_selected_weight = 1
    
    normalized_weights = {}
    for c in request.selected_criteria:
        w = criteria_weights.get(c, 0) / total_selected_weight
        normalized_weights[c] = round(w * 100, 2)  # chuyển sang %
    
    # Lấy trọng số cây theo từng tiêu chí
    plant_weights = {}
    for tc in request.selected_criteria:
        plant_weights[tc] = {}
        weights = db.query(TrongSoPhuongAn).filter(TrongSoPhuongAn.MaTieuChi == tc).all()
        for w in weights:
            plant_weights[tc][w.CayCanhID] = w.TrongSoPhuongAn
    
    # Tính điểm cuối cùng
    final_scores = calculate_final_scores(
        selected_criteria=request.selected_criteria,
        criteria_weights=criteria_weights,
        plant_weights=plant_weights
    )
    
    # Xây dựng phản hồi
    recommendations = []
    for plant in plants:
        # Lấy đặc điểm của cây
        dac_diem_links = db.query(CayCanhDacDiem).filter(
            CayCanhDacDiem.CayCanhID == plant.CayCanhID
        ).all()
        dac_diem_names = []
        for link in dac_diem_links:
            dd = db.query(DacDiem).filter(DacDiem.MaDacDiem == link.MaDacDiem).first()
            if dd:
                dac_diem_names.append(dd.TenDacDiem)
        
        # Lấy tên loại cây
        loai_cay_name = plant.loai_cay.TenLoai if plant.loai_cay else None
        
        # Lấy điểm (mặc định là 0 nếu không có trong dữ liệu AHP)
        score = final_scores.get(plant.CayCanhID, 0.0)
        
        recommendations.append(PlantRecommendation(
            cay_canh_id=plant.CayCanhID,
            ten_cay=plant.TenCay,
            gia=float(plant.Gia) if plant.Gia else 0,
            hinh_anh=plant.HinhAnh,
            loai_cay=loai_cay_name,
            diem_phu_hop=score,
            dac_diems=dac_diem_names
        ))
    
    # Sắp xếp theo điểm giảm dần
    recommendations.sort(key=lambda x: x.diem_phu_hop, reverse=True)
    
    return RecommendResponse(
        tong_so=len(recommendations),
        trong_so_chuan_hoa=normalized_weights,
        cay_goi_y=recommendations
    )


@router.get("/tieu-chi-va-dac-diem")
async def get_criteria_and_features(db: Session = Depends(get_db)):
    """Lấy danh sách tiêu chí và đặc điểm để hiển thị trên UI lọc"""
    tieu_chis = db.query(TieuChi).order_by(TieuChi.MaTieuChi).all()
    dac_diems = db.query(DacDiem).all()
    
    return {
        "tieu_chis": [
            {"ma": tc.MaTieuChi, "ten": tc.TenTieuChi, "trong_so": tc.TrongSoTieuChi or 0}
            for tc in tieu_chis
        ],
        "dac_diems": [
            {"ma": dd.MaDacDiem, "ten": dd.TenDacDiem}
            for dd in dac_diems
        ]
    }


@router.post("/loc-cay")
async def filter_plants(request: FilterPlantsRequest, db: Session = Depends(get_db)):
    """Lọc cây theo đặc điểm, trả về danh sách cây cơ bản cho wizard tư vấn"""
    plants_query = db.query(CayCanh)

    if request.selected_dac_diem and len(request.selected_dac_diem) > 0:
        for ma_dd in request.selected_dac_diem:
            subquery = db.query(CayCanhDacDiem.CayCanhID).filter(
                CayCanhDacDiem.MaDacDiem == ma_dd
            )
            plants_query = plants_query.filter(CayCanh.CayCanhID.in_(subquery))

    plants = plants_query.all()

    return [
        {
            "cay_canh_id": p.CayCanhID,
            "ten_cay": p.TenCay,
            "hinh_anh": p.HinhAnh
        }
        for p in plants
    ]
