from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter(
    prefix="/ai-suggest",
    tags=["AI - Gợi ý điểm AHP"]
)


class PlantInfo(BaseModel):
    cay_canh_id: int
    ten_cay: str
    gia: Optional[float] = 0
    mo_ta: Optional[str] = ""
    loai_cay: Optional[str] = None
    dac_diems: Optional[List[str]] = []


class AISuggestRequest(BaseModel):
    plants: List[PlantInfo]
    tieu_chi: str
    ten_tieu_chi: str


class PairSuggestion(BaseModel):
    plant_a_id: int
    plant_b_id: int
    plant_a_name: str
    plant_b_name: str
    score: float
    explanation: str


class AISuggestResponse(BaseModel):
    suggestions: List[PairSuggestion]
    summary: str


def snap_to_ahp(value):
    """Snap a float value to nearest AHP scale value"""
    scales = [1/9, 1/8, 1/7, 1/6, 1/5, 1/4, 1/3, 1/2, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    closest = min(scales, key=lambda s: abs(value - s))
    return closest


def score_plant_by_criterion(plant: PlantInfo, ten_tieu_chi: str) -> float:
    """Score a plant based on a criterion name (higher = better)"""
    tc_name = ten_tieu_chi.lower()
    
    score = 5.0
    dacs = [d.upper() for d in (plant.dac_diems or [])]
    desc = (plant.mo_ta or '').lower()
    
    # 1. Liên quan đến "giá"
    if 'giá' in tc_name or 'rẻ' in tc_name:
        gia = plant.gia or 0
        if gia <= 0: score = 5.0
        elif gia < 50000: score = 9.0
        elif gia < 100000: score = 7.0
        elif gia < 200000: score = 5.0
        elif gia < 500000: score = 3.0
        else: score = 1.0

    # 2. Liên quan đến "thẩm mỹ", "đẹp", "trang trí", "nổi bật"
    elif any(k in tc_name for k in ['thẩm mỹ', 'đẹp', 'trang trí', 'nổi bật', 'ngoại hình']):
        if any(k in d for d in dacs for k in ['HOA', 'ĐẸP', 'THẨM MỸ', 'TRANG TRÍ']):
            score += 3
        if any(w in desc for w in ['đẹp', 'hoa', 'rực rỡ', 'sang trọng', 'trang trí', 'thẩm mỹ', 'bắt mắt']):
            score += 2
        if any(w in desc for w in ['đơn giản', 'giản dị']):
            score -= 1

    # 3. Liên quan đến "công dụng", "lợi ích", "lọc", "phong thủy"
    elif any(k in tc_name for k in ['công dụng', 'lợi ích', 'lọc', 'phong thủy', 'độc']):
        if any(k in d for d in dacs for k in ['LỌC', 'KHÔNG ĐỘC', 'AN TOÀN', 'ÍT SÂU', 'KHÁNG']):
            score += 3
        if any(w in desc for w in ['lọc không khí', 'thanh lọc', 'phong thủy', 'sức khỏe']):
            score += 2
            
    # 4. Ánh sáng: Râm mát, yếu, trong nhà
    elif any(k in tc_name for k in ['mát', 'yếu', 'râm', 'trong nhà', 'văn phòng', 'thiếu sáng']):
        if any(w in desc for w in ['chịu bóng', 'trong nhà', 'ưa mát', 'ít nắng', 'bóng râm', 'văn phòng']):
            score += 3
        if any(w in desc for w in ['ưa nắng', 'nắng gắt', 'ngoài trời', 'nhiều sáng']):
            score -= 2
            
    # 5. Ánh sáng: Nắng, mạnh, ngoài trời
    elif any(k in tc_name for k in ['nắng', 'sáng', 'ngoài trời', 'ban công', 'sân']):
        if any(w in desc for w in ['ưa nắng', 'chịu nắng', 'ngoài trời', 'nhiều sáng', 'nắng gắt']):
            score += 3
        if any(w in desc for w in ['chịu bóng', 'trong nhà', 'ưa mát']):
            score -= 2
            
    # 6. Nước / Ẩm: Ưa ẩm, cần tưới nhiều
    elif any(k in tc_name for k in ['ưa ẩm', 'ưa nước', 'nhiều nước']):
        if any(w in desc for w in ['ưa ẩm', 'ưa nước', 'cần nước', 'độ ẩm']):
            score += 3
        if any(w in desc for w in ['chịu hạn', 'ít tưới', 'khô']):
            score -= 2
            
    # 7. Nước / Khô hạn: Chịu hạn, ít tưới
    elif any(k in tc_name for k in ['khô', 'hạn', 'ít tưới', 'lười tưới']):
        if any(w in desc for w in ['chịu hạn', 'ít tưới', 'chịu khô']):
            score += 3
        if any(w in desc for w in ['ưa ẩm', 'cần tưới', 'ưa nước']):
            score -= 2

    # 8. Mặc định (Các yếu tố sinh trưởng chung "thích nghi", "chăm sóc")
    else:
        if any(k in d for d in dacs for k in ['DỄ', 'CHỊU', 'THÍCH NGHI', 'BỀN']):
            score += 3
        if any(k in d for d in dacs for k in ['KHÓ', 'NHẠY', 'YẾU']):
            score -= 2
        if any(w in desc for w in ['dễ chăm', 'bền', 'chịu', 'thích nghi', 'khỏe']):
            score += 2
        if any(w in desc for w in ['khó chăm', 'nhạy cảm']):
            score -= 1
            
    # Tie-breaker logic (Phá vỡ thế cân bằng để AHP không bao giờ ra tỷ lệ chẵn 20%)
    tie_breaker = (min(len(desc), 500) * 0.001) + (len(dacs) * 0.01) + (plant.cay_canh_id * 0.0001)

    return max(1.0, score + tie_breaker)


def generate_nlg_explanation(winner: PlantInfo, loser: PlantInfo, tc_name: str) -> str:
    """Sinh ra câu giải thích bằng cách trực tiếp trích xuất chữ từ Database của cây chiến thắng"""
    desc = (winner.mo_ta or "").strip()
    if len(desc) > 65:
        # Cắt chuỗi cho vừa vặn hiển thị
        desc = desc[:65].rsplit(' ', 1)[0] + "..."
        
    dacs = winner.dac_diems or []
    dac_str = ", ".join(dacs[:2]) if dacs else ""
    
    if desc and dac_str:
        return f"{winner.ten_cay} phù hợp hơn {loser.ten_cay} ({tc_name}) nhờ đặc tính '{dac_str}' và được mô tả: '{desc}'."
    elif desc:
        return f"{winner.ten_cay} phù hợp hơn {loser.ten_cay} ({tc_name}) vì được mô tả là: '{desc}'."
    elif dac_str:
        return f"{winner.ten_cay} nổi trội hơn {loser.ten_cay} ({tc_name}) nhờ sở hữu đặc điểm: '{dac_str}'."
    else:
        return f"{winner.ten_cay} là ưu tiên cao hơn {loser.ten_cay} theo chuẩn AHP đối với {tc_name}."


def compare_pair(plant_a: PlantInfo, plant_b: PlantInfo, tieu_chi: str, ten_tieu_chi: str) -> tuple:
    """Compare two plants and return (ahp_score, explanation)"""
    score_a = score_plant_by_criterion(plant_a, ten_tieu_chi)
    score_b = score_plant_by_criterion(plant_b, ten_tieu_chi)
    
    tc_name = ten_tieu_chi.lower()
    
    # Trường hợp hy hữu (id, text giống y hệt)
    if abs(score_a - score_b) < 0.00001:
        return 1.0, f"Hai cây hoàn toàn tương đương về {tc_name}"
    
    if score_a > score_b:
        ratio = score_a / max(score_b, 0.1)
        ahp = snap_to_ahp(min(ratio, 9))
        
        # Ép tỷ lệ chênh lệch nếu khoảng cách siêu nhỏ từ Tie-Breaker bị làm tròn về 1
        if ahp == 1.0: 
            ahp = 2.0
            
        # Build explanation
        if 'giá' in tc_name or 'rẻ' in tc_name:
            gia_a = f"{int(plant_a.gia or 0):,}đ"
            gia_b = f"{int(plant_b.gia or 0):,}đ"
            if (plant_a.gia or 0) < (plant_b.gia or 0):
                expl = f"Theo bảng giá, {plant_a.ten_cay} ({gia_a}) tiết kiệm chi phí hơn phân nửa so với {plant_b.ten_cay} ({gia_b})."
            else:
                expl = f"Xét về tính kinh tế hiện tại, {plant_a.ten_cay} là sự lựa chọn tối ưu hơn hẳn."
        else:
            expl = generate_nlg_explanation(plant_a, plant_b, tc_name)
        return ahp, expl
    else:
        ratio = score_b / max(score_a, 0.1)
        ahp = snap_to_ahp(1 / min(ratio, 9))
        
        if ahp == 1.0:
            ahp = snap_to_ahp(1 / 2.0) # 0.5
            
        if 'giá' in tc_name or 'rẻ' in tc_name:
            gia_a = f"{int(plant_a.gia or 0):,}đ"
            gia_b = f"{int(plant_b.gia or 0):,}đ"
            if (plant_b.gia or 0) < (plant_a.gia or 0):
                expl = f"Theo bảng giá, {plant_b.ten_cay} ({gia_b}) tiết kiệm chi phí hơn phân nửa so với {plant_a.ten_cay} ({gia_a})."
            else:
                expl = f"Xét về tính kinh tế hiện tại, {plant_b.ten_cay} là sự lựa chọn tối ưu hơn hẳn."
        else:
            expl = generate_nlg_explanation(plant_b, plant_a, tc_name)
        return ahp, expl


def local_suggest(request: AISuggestRequest) -> AISuggestResponse:
    """Generate AHP suggestions using local heuristic analysis"""
    suggestions = []
    plant_list = request.plants
    
    for i in range(len(plant_list)):
        for j in range(i + 1, len(plant_list)):
            a, b = plant_list[i], plant_list[j]
            score, explanation = compare_pair(a, b, request.tieu_chi, request.ten_tieu_chi)
            suggestions.append(PairSuggestion(
                plant_a_id=a.cay_canh_id,
                plant_b_id=b.cay_canh_id,
                plant_a_name=a.ten_cay,
                plant_b_name=b.ten_cay,
                score=score,
                explanation=explanation
            ))
    
    tc_name = request.ten_tieu_chi.lower()
    
    summary = f"Hệ thống đã phân tích {len(plant_list)} cây theo tiêu chí \"{tc_name}\" dựa trên mô tả và đặc điểm của từng cây. Bạn có thể điều chỉnh điểm nếu cần."
    
    return AISuggestResponse(suggestions=suggestions, summary=summary)


@router.post("/goi-y-diem", response_model=AISuggestResponse)
async def get_ai_suggestions(request: AISuggestRequest):
    """
    Gợi ý điểm AHP sử dụng phân tích theo thuật toán nội bộ (Local Heuristic).
    """
    return local_suggest(request)

