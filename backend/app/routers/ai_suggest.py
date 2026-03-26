from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.config import settings
import json
import math

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


def score_plant_by_criterion(plant: PlantInfo, tieu_chi: str) -> float:
    """Score a plant based on a criterion (higher = better)"""
    tc = tieu_chi.upper()
    
    # C1: Khả năng thích nghi với nhiệt độ / Dễ chăm sóc
    if tc in ['C1', 'THICH_NGHI', 'DE_CHAM']:
        score = 5.0  # base
        dacs = [d.upper() for d in (plant.dac_diems or [])]
        if any(k in d for d in dacs for k in ['DỄ', 'DE_CHAM', 'CHỊU', 'THÍCH NGHI', 'BỀN']):
            score += 3
        if any(k in d for d in dacs for k in ['KHÓ', 'NHẠY', 'YẾU']):
            score -= 2
        desc = (plant.mo_ta or '').lower()
        if any(w in desc for w in ['dễ chăm', 'dễ trồng', 'bền', 'chịu', 'thích nghi', 'khỏe']):
            score += 2
        if any(w in desc for w in ['khó chăm', 'nhạy cảm', 'cần chăm sóc kỹ']):
            score -= 1
        return max(1, score)

    # C2: Thẩm mỹ / Đẹp
    if tc in ['C2', 'THAM_MY', 'DEP']:
        score = 5.0
        dacs = [d.upper() for d in (plant.dac_diems or [])]
        if any(k in d for d in dacs for k in ['HOA', 'ĐẸP', 'THẨM MỸ', 'TRANG TRÍ']):
            score += 3
        desc = (plant.mo_ta or '').lower()
        if any(w in desc for w in ['đẹp', 'hoa', 'rực rỡ', 'sang trọng', 'trang trí', 'thẩm mỹ', 'bắt mắt']):
            score += 2
        if any(w in desc for w in ['đơn giản', 'giản dị']):
            score -= 1
        # Nhiều đặc điểm = hấp dẫn hơn
        score += len(plant.dac_diems or []) * 0.5
        return max(1, score)

    # C3: Giá cả (giá rẻ hơn = tốt hơn)
    if tc in ['C3', 'GIA', 'GIA_CA']:
        gia = plant.gia or 0
        if gia <= 0:
            return 5.0
        if gia < 50000:
            return 9
        elif gia < 100000:
            return 7
        elif gia < 200000:
            return 5
        elif gia < 500000:
            return 3
        else:
            return 1

    # C4: Công dụng / Lợi ích
    if tc in ['C4', 'CONG_DUNG', 'LOI_ICH']:
        score = 5.0
        dacs = [d.upper() for d in (plant.dac_diems or [])]
        if any(k in d for d in dacs for k in ['LỌC', 'KHÔNG ĐỘC', 'AN TOÀN', 'KHONG_DOC']):
            score += 3
        if any(k in d for d in dacs for k in ['ÍT SÂU', 'IT_SAU', 'KHÁNG']):
            score += 2
        if any(k in d for d in dacs for k in ['ÍT MÙI', 'IT_MUI']):
            score += 1
        desc = (plant.mo_ta or '').lower()
        if any(w in desc for w in ['lọc không khí', 'thanh lọc', 'giảm stress', 'phong thủy', 'tốt cho sức khỏe']):
            score += 2
        return max(1, score)

    # Default: score based on number of features
    return 5.0 + len(plant.dac_diems or []) * 0.5


def compare_pair(plant_a: PlantInfo, plant_b: PlantInfo, tieu_chi: str, ten_tieu_chi: str) -> tuple:
    """Compare two plants and return (ahp_score, explanation)"""
    score_a = score_plant_by_criterion(plant_a, tieu_chi)
    score_b = score_plant_by_criterion(plant_b, tieu_chi)
    
    tc = tieu_chi.upper()
    tc_name = ten_tieu_chi.lower()
    
    if abs(score_a - score_b) < 0.5:
        return 1.0, f"Hai cây tương đương về {tc_name}"
    
    if score_a > score_b:
        ratio = score_a / max(score_b, 0.1)
        ahp = snap_to_ahp(min(ratio, 9))
        
        # Build explanation
        if tc in ['C3', 'GIA', 'GIA_CA']:
            gia_a = f"{int(plant_a.gia or 0):,}đ"
            gia_b = f"{int(plant_b.gia or 0):,}đ"
            if (plant_a.gia or 0) < (plant_b.gia or 0):
                expl = f"{plant_a.ten_cay} ({gia_a}) rẻ hơn {plant_b.ten_cay} ({gia_b})"
            else:
                expl = f"{plant_a.ten_cay} tốt hơn về {tc_name}"
        else:
            expl = f"{plant_a.ten_cay} tốt hơn {plant_b.ten_cay} về {tc_name}"
            dacs_a = plant_a.dac_diems or []
            if dacs_a:
                expl += f" (có: {', '.join(dacs_a[:2])})"
        return ahp, expl
    else:
        ratio = score_b / max(score_a, 0.1)
        ahp = snap_to_ahp(1 / min(ratio, 9))
        
        if tc in ['C3', 'GIA', 'GIA_CA']:
            gia_a = f"{int(plant_a.gia or 0):,}đ"
            gia_b = f"{int(plant_b.gia or 0):,}đ"
            if (plant_b.gia or 0) < (plant_a.gia or 0):
                expl = f"{plant_b.ten_cay} ({gia_b}) rẻ hơn {plant_a.ten_cay} ({gia_a})"
            else:
                expl = f"{plant_b.ten_cay} tốt hơn về {tc_name}"
        else:
            expl = f"{plant_b.ten_cay} tốt hơn {plant_a.ten_cay} về {tc_name}"
            dacs_b = plant_b.dac_diems or []
            if dacs_b:
                expl += f" (có: {', '.join(dacs_b[:2])})"
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
    
    summary = f"Hệ thống đã phân tích {len(plant_list)} cây theo tiêu chí \"{tc_name}\" dựa trên thông tin giá, mô tả và đặc điểm của từng cây. Bạn có thể điều chỉnh điểm nếu cần."
    
    return AISuggestResponse(suggestions=suggestions, summary=summary)


async def gemini_suggest(request: AISuggestRequest, api_key: str) -> AISuggestResponse:
    """Generate AHP suggestions using Gemini AI"""
    from google import genai
    client = genai.Client(api_key=api_key)
    
    plants_info = ""
    for p in request.plants:
        plants_info += f"- ID={p.cay_canh_id}, Tên: {p.ten_cay}"
        if p.gia: plants_info += f", Giá: {int(p.gia):,}đ"
        if p.loai_cay: plants_info += f", Loại: {p.loai_cay}"
        if p.mo_ta: plants_info += f", Mô tả: {p.mo_ta[:100]}"
        if p.dac_diems: plants_info += f", Đặc điểm: {', '.join(p.dac_diems)}"
        plants_info += "\n"

    pairs = []
    for i in range(len(request.plants)):
        for j in range(i + 1, len(request.plants)):
            pairs.append((request.plants[i], request.plants[j]))

    pairs_text = "\n".join(f"{idx+1}. {a.ten_cay} vs {b.ten_cay}" for idx, (a, b) in enumerate(pairs))

    prompt = f"""Bạn là chuyên gia cây cảnh và AHP. Đánh giá các cặp cây theo tiêu chí "{request.ten_tieu_chi}" ({request.tieu_chi}).

QUAN TRỌNG: BẠN CHỈ ĐƯỢC PHÉP CHẤM ĐIỂM VÀ LÝ GIẢI DỰA TRÊN THÔNG TIN DƯỚI ĐÂY (TỪ DATABASE MANG LÊN). TUYỆT ĐỐI KHÔNG BỊA ĐẶT THÊM KIẾN THỨC NGOÀI, KHÔNG TỰ CHẾ RA CÁC ĐẶC ĐIỂM KHÔNG CÓ TRONG DANH SÁCH "Đặc điểm" HAY "Mô tả".

Cây: {plants_info}
Cặp: {pairs_text}

Cho điểm AHP quy chuẩn từ 1/9 đến 9. Score > 1 có nghĩa là A tốt hơn B. Score < 1 có nghĩa là B tốt hơn A.
Trả về định dạng JSON thuần (không bọc trong tag markdown hay code block):
{{"suggestions":[{{"plant_a_id":1,"plant_b_id":2,"plant_a_name":"...","plant_b_name":"...","score":3.0,"explanation":"Ngắn gọn lý do cụ thể theo data..."}}],"summary":"..."}}
Score bắt buộc phải là số thập phân. Đánh giá tất cả {len(pairs)} cặp."""

    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if "```" in text: text = text[:text.rfind("```")]
    text = text.strip()
    result = json.loads(text)
    return AISuggestResponse(
        suggestions=[PairSuggestion(**s) for s in result.get("suggestions", [])],
        summary=result.get("summary", "AI đã phân tích xong.")
    )


@router.post("/goi-y-diem", response_model=AISuggestResponse)
async def get_ai_suggestions(request: AISuggestRequest):
    """
    Gợi ý điểm AHP. Ưu tiên dùng Gemini AI, nếu không có key hoặc lỗi thì dùng phân tích nội bộ.
    """
    api_key = settings.GEMINI_API_KEY
    
    # Nếu có Gemini key, thử dùng AI trước
    if api_key:
        try:
            return await gemini_suggest(request, api_key)
        except Exception as e:
            error_str = str(e)
            print(f"[AI-Suggest] Gemini failed: {error_str[:200]}, falling back to local analysis")
            # Fallback to local analysis
    
    # Phân tích nội bộ (không cần API key)
    return local_suggest(request)
