from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app.models import CayCanh, LoaiCay, TonKho, MoTaChiTiet, CachChamSoc, DacDiemNoiBat, ThongTinKhoaHoc
from app.schemas.cay_canh import (
    CayCanhResponse, CayCanhDetailResponse, LoaiCayResponse,
    MoTaChiTietResponse, CachChamSocResponse, DacDiemNoiBatResponse, ThongTinKhoaHocResponse
)

router = APIRouter(prefix="/cay-canh", tags=["Cây Cảnh"])


@router.get("/", response_model=List[CayCanhResponse])
async def get_all_cay_canh(
    keyword: Optional[str] = Query(None, description="Từ khóa tìm kiếm"),
    loai_cay_id: Optional[int] = Query(None, description="Lọc theo loại cây"),
    min_price: Optional[float] = Query(None, description="Giá tối thiểu"),
    max_price: Optional[float] = Query(None, description="Giá tối đa"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Lấy danh sách cây cảnh với filter và phân trang"""
    
    query = db.query(CayCanh).options(
        joinedload(CayCanh.loai_cay),
        joinedload(CayCanh.ton_kho)
    )
    
    # Filter theo từ khóa
    if keyword:
        # Sử dụng contains thay vì ilike để hỗ trợ tốt hơn trên SQL Server
        # SQL Server mặc định thường là Case-Insensitive (CI) nên contains (LIKE %...%) là đủ
        query = query.filter(CayCanh.TenCay.contains(keyword))
    
    # Filter theo loại cây
    if loai_cay_id:
        query = query.filter(CayCanh.LoaiCayID == loai_cay_id)
    
    # Filter theo giá
    if min_price is not None:
        query = query.filter(CayCanh.Gia >= min_price)
    if max_price is not None:
        query = query.filter(CayCanh.Gia <= max_price)
    
    # SQL Server yêu cầu ORDER BY khi dùng OFFSET/LIMIT
    query = query.order_by(CayCanh.CayCanhID)
    
    cay_canhs = query.offset(skip).limit(limit).all()
    
    result = []
    for cay in cay_canhs:
        result.append(CayCanhResponse(
            cay_canh_id=cay.CayCanhID,
            ten_cay=cay.TenCay,
            gia=cay.Gia,
            mo_ta=cay.MoTa,
            hinh_anh=cay.HinhAnh,
            loai_cay_id=cay.LoaiCayID,
            loai_cay=LoaiCayResponse(
                loai_cay_id=cay.loai_cay.LoaiCayID,
                ten_loai=cay.loai_cay.TenLoai,
                mo_ta=cay.loai_cay.MoTa
            ) if cay.loai_cay else None,
            so_luong_ton=cay.ton_kho.SoLuongTon if cay.ton_kho else 0
        ))
    
    return result


@router.get("/loai-cay", response_model=List[LoaiCayResponse])
async def get_all_loai_cay(db: Session = Depends(get_db)):
    """Lấy danh sách loại cây"""
    loai_cays = db.query(LoaiCay).all()
    
    return [
        LoaiCayResponse(
            loai_cay_id=lc.LoaiCayID,
            ten_loai=lc.TenLoai,
            mo_ta=lc.MoTa
        ) for lc in loai_cays
    ]


@router.get("/{cay_canh_id}", response_model=CayCanhDetailResponse)
async def get_cay_canh_detail(cay_canh_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết cây cảnh (bao gồm mô tả, cách chăm sóc, đặc điểm...)"""
    
    cay = db.query(CayCanh).options(
        joinedload(CayCanh.loai_cay),
        joinedload(CayCanh.ton_kho),
        joinedload(CayCanh.mo_ta_chi_tiet),
        joinedload(CayCanh.cach_cham_socs),
        joinedload(CayCanh.dac_diem_noi_bats),
        joinedload(CayCanh.thong_tin_khoa_hoc)
    ).filter(CayCanh.CayCanhID == cay_canh_id).first()
    
    if not cay:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây cảnh")
    
    return CayCanhDetailResponse(
        cay_canh_id=cay.CayCanhID,
        ten_cay=cay.TenCay,
        gia=cay.Gia,
        mo_ta=cay.MoTa,
        hinh_anh=cay.HinhAnh,
        loai_cay_id=cay.LoaiCayID,
        loai_cay=LoaiCayResponse(
            loai_cay_id=cay.loai_cay.LoaiCayID,
            ten_loai=cay.loai_cay.TenLoai,
            mo_ta=cay.loai_cay.MoTa
        ) if cay.loai_cay else None,
        so_luong_ton=cay.ton_kho.SoLuongTon if cay.ton_kho else 0,
        mo_ta_chi_tiet=MoTaChiTietResponse(
            cay_canh_id=cay.mo_ta_chi_tiet.CayCanhID,
            tieu_de=cay.mo_ta_chi_tiet.TieuDe,
            noi_dung=cay.mo_ta_chi_tiet.NoiDung
        ) if cay.mo_ta_chi_tiet else None,
        cach_cham_socs=[
            CachChamSocResponse(
                id=ccs.ID,
                cay_canh_id=ccs.CayCanhID,
                tieu_de=ccs.TieuDe,
                noi_dung=ccs.NoiDung
            ) for ccs in cay.cach_cham_socs
        ],
        dac_diem_noi_bats=[
            DacDiemNoiBatResponse(
                id=ddnb.ID,
                cay_canh_id=ddnb.CayCanhID,
                noi_dung=ddnb.NoiDung
            ) for ddnb in cay.dac_diem_noi_bats
        ],
        thong_tin_khoa_hoc=ThongTinKhoaHocResponse(
            cay_canh_id=cay.thong_tin_khoa_hoc.CayCanhID,
            ten_khoa_hoc=cay.thong_tin_khoa_hoc.TenKhoaHoc,
            ho_thuc_vat=cay.thong_tin_khoa_hoc.HoThucVat,
            nguon_goc=cay.thong_tin_khoa_hoc.NguonGoc,
            ten_goi_khac=cay.thong_tin_khoa_hoc.TenGoiKhac
        ) if cay.thong_tin_khoa_hoc else None
    )
