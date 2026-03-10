from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

from app.database import get_db
from app.models import (
    TaiKhoan, KhachHang, GioHang, GioHangChiTiet,
    DonHang, CTDonHang, CayCanh, TonKho
)
from app.schemas.don_hang import (
    DatHangRequest, DonHangResponse, DonHangListResponse,
    CTDonHangResponse, HuyDonRequest
)
from app.utils.auth import get_current_user

router = APIRouter(prefix="/don-hang", tags=["Đơn Hàng"])


@router.get("/", response_model=List[DonHangListResponse])
async def get_don_hang_cua_toi(
    trang_thai: Optional[str] = Query(None, description="Lọc theo trạng thái"),
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách đơn hàng của user"""
    
    # Lấy khách hàng
    khach_hang = db.query(KhachHang).filter(
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if not khach_hang:
        return []
    
    query = db.query(DonHang).filter(
        DonHang.KhachHangID == khach_hang.KhachHangID
    )
    
    if trang_thai:
        query = query.filter(DonHang.TrangThai == trang_thai)
    
    don_hangs = query.order_by(DonHang.NgayDat.desc()).all()
    
    result = []
    for dh in don_hangs:
        so_sp = db.query(CTDonHang).filter(CTDonHang.DonHangID == dh.DonHangID).count()
        result.append(DonHangListResponse(
            don_hang_id=dh.DonHangID,
            ngay_dat=dh.NgayDat,
            tong_tien=dh.TongTien,
            trang_thai=dh.TrangThai,
            ten_nguoi_nhan=dh.TenNguoiNhan,
            phuong_thuc_thanh_toan=dh.PhuongThucThanhToan,
            so_san_pham=so_sp
        ))
    
    return result


@router.get("/{don_hang_id}", response_model=DonHangResponse)
async def get_chi_tiet_don_hang(
    don_hang_id: int,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy chi tiết đơn hàng"""
    
    khach_hang = db.query(KhachHang).filter(
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    don_hang = db.query(DonHang).options(
        joinedload(DonHang.chi_tiets).joinedload(CTDonHang.cay_canh)
    ).filter(
        DonHang.DonHangID == don_hang_id,
        DonHang.KhachHangID == khach_hang.KhachHangID
    ).first()
    
    if not don_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    chi_tiets = [
        CTDonHangResponse(
            ct_don_hang_id=ct.CTDonHangID,
            don_hang_id=ct.DonHangID,
            cay_canh_id=ct.CayCanhID,
            so_luong=ct.SoLuong,
            don_gia=ct.DonGia,
            thanh_tien=ct.ThanhTien,
            ten_cay=ct.cay_canh.TenCay if ct.cay_canh else None,
            hinh_anh=ct.cay_canh.HinhAnh if ct.cay_canh else None
        ) for ct in don_hang.chi_tiets
    ]
    
    return DonHangResponse(
        don_hang_id=don_hang.DonHangID,
        khach_hang_id=don_hang.KhachHangID,
        ngay_dat=don_hang.NgayDat,
        tong_tien=don_hang.TongTien,
        trang_thai=don_hang.TrangThai,
        ngay_duyet=don_hang.NgayDuyet,
        ngay_huy=don_hang.NgayHuy,
        ten_nguoi_nhan=don_hang.TenNguoiNhan,
        sdt_nguoi_nhan=don_hang.SDTNguoiNhan,
        dia_chi_giao_hang=don_hang.DiaChiGiaoHang,
        ghi_chu=don_hang.GhiChu,
        phuong_thuc_thanh_toan=don_hang.PhuongThucThanhToan,
        ngay_giao_hang=don_hang.NgayGiaoHang,
        ngay_hoan_thanh=don_hang.NgayHoanThanh,
        chi_tiets=chi_tiets
    )


@router.post("/dat-hang", response_model=DonHangResponse)
async def dat_hang(
    request: DatHangRequest,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Đặt hàng từ giỏ hàng"""
    
    # Lấy khách hàng
    khach_hang = db.query(KhachHang).filter(
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    if not khach_hang:
        raise HTTPException(status_code=400, detail="Không tìm thấy thông tin khách hàng")
    
    # Lấy giỏ hàng
    gio_hang = db.query(GioHang).options(
        joinedload(GioHang.chi_tiets).joinedload(GioHangChiTiet.cay_canh)
    ).filter(GioHang.TaiKhoanID == current_user.TaiKhoanID).first()
    
    if not gio_hang or not gio_hang.chi_tiets:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")
    
    try:
        # Tính tổng tiền
        tong_tien = Decimal(0)
        for ct in gio_hang.chi_tiets:
            don_gia = ct.DonGia if ct.DonGia is not None else Decimal(0)
            tong_tien += ct.SoLuong * don_gia
    except Exception as e:
         print(f"DEBUG: Error calculating total: {e}")
         raise HTTPException(status_code=500, detail=f"Lỗi tính tiền: {str(e)}")

    try:
        # Tạo đơn hàng
        don_hang = DonHang(
            KhachHangID=khach_hang.KhachHangID,
            NgayDat=datetime.now(),
            TongTien=tong_tien,
            TrangThai="Chờ xác nhận",
            TenNguoiNhan=request.ten_nguoi_nhan,
            SDTNguoiNhan=request.sdt_nguoi_nhan,
            DiaChiGiaoHang=request.dia_chi_giao_hang,
            GhiChu=request.ghi_chu,
            PhuongThucThanhToan=request.phuong_thuc_thanh_toan
        )
        db.add(don_hang)
        db.flush()
        
        # Tạo chi tiết đơn hàng
        chi_tiets = []
        for ct in gio_hang.chi_tiets:
            don_gia = ct.DonGia if ct.DonGia is not None else Decimal(0)
            ct_don_hang = CTDonHang(
                DonHangID=don_hang.DonHangID,
                CayCanhID=ct.CayCanhID,
                SoLuong=ct.SoLuong,
                DonGia=don_gia,
                ThanhTien=ct.SoLuong * don_gia
            )
            db.add(ct_don_hang)
            
            chi_tiets.append(CTDonHangResponse(
                ct_don_hang_id=0,
                don_hang_id=don_hang.DonHangID,
                cay_canh_id=ct.CayCanhID,
                so_luong=ct.SoLuong,
                don_gia=don_gia,
                thanh_tien=ct.SoLuong * don_gia,
                ten_cay=ct.cay_canh.TenCay if ct.cay_canh else None,
                hinh_anh=ct.cay_canh.HinhAnh if ct.cay_canh else None
            ))
        
        # Xóa giỏ hàng
        db.query(GioHangChiTiet).filter(
            GioHangChiTiet.GioHangID == gio_hang.GioHangID
        ).delete()
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"DEBUG: Error saving order: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi lưu đơn hàng: {str(e)}")
    
    return DonHangResponse(
        don_hang_id=don_hang.DonHangID,
        khach_hang_id=don_hang.KhachHangID,
        ngay_dat=don_hang.NgayDat,
        tong_tien=don_hang.TongTien,
        trang_thai=don_hang.TrangThai,
        ten_nguoi_nhan=don_hang.TenNguoiNhan,
        sdt_nguoi_nhan=don_hang.SDTNguoiNhan,
        dia_chi_giao_hang=don_hang.DiaChiGiaoHang,
        ghi_chu=don_hang.GhiChu,
        phuong_thuc_thanh_toan=don_hang.PhuongThucThanhToan,
        chi_tiets=chi_tiets
    )


@router.post("/{don_hang_id}/huy")
async def huy_don_hang(
    don_hang_id: int,
    request: HuyDonRequest,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Hủy đơn hàng"""
    
    khach_hang = db.query(KhachHang).filter(
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    don_hang = db.query(DonHang).filter(
        DonHang.DonHangID == don_hang_id,
        DonHang.KhachHangID == khach_hang.KhachHangID
    ).first()
    
    if not don_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # Chỉ được hủy khi đang "Chờ xác nhận" hoặc "Đã xác nhận"
    if don_hang.TrangThai not in ["Chờ xác nhận", "Đã xác nhận"]:
        raise HTTPException(
            status_code=400, 
            detail="Không thể hủy đơn hàng ở trạng thái này"
        )
    
    don_hang.TrangThai = "Đã hủy"
    don_hang.NgayHuy = datetime.now()
    don_hang.GhiChu = f"Lý do hủy: {request.ly_do}"
    
    db.commit()
    
    return {"success": True, "message": "Đã hủy đơn hàng"}


@router.post("/{don_hang_id}/da-nhan")
async def xac_nhan_da_nhan(
    don_hang_id: int,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xác nhận đã nhận hàng"""
    
    khach_hang = db.query(KhachHang).filter(
        KhachHang.TaiKhoanID == current_user.TaiKhoanID
    ).first()
    
    don_hang = db.query(DonHang).filter(
        DonHang.DonHangID == don_hang_id,
        DonHang.KhachHangID == khach_hang.KhachHangID
    ).first()
    
    if not don_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    if don_hang.TrangThai != "Đang giao hàng":
        raise HTTPException(status_code=400, detail="Đơn hàng chưa được giao")
    
    don_hang.TrangThai = "Đã nhận hàng"
    don_hang.NgayHoanThanh = datetime.now()
    
    db.commit()
    
    return {"success": True, "message": "Xác nhận đã nhận hàng thành công"}
