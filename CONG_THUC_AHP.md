# CÔNG THỨC TÍNH AHP – Hệ thống gợi ý cây cảnh

## Tổng quan

Hệ thống sử dụng phương pháp **AHP (Analytic Hierarchy Process)** để xếp hạng và gợi ý cây cảnh phù hợp nhất cho khách hàng.

---

## Bước 1: Ma trận so sánh cặp (Admin thiết lập)

Admin nhập giá trị so sánh từng cặp tiêu chí (hoặc từng cặp cây) trên thang **Saaty 1-9**:

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Hai tiêu chí bằng nhau |
| 3 | Tiêu chí A quan trọng hơn B một chút |
| 5 | A quan trọng hơn B rõ ràng |
| 7 | A quan trọng hơn B rất nhiều |
| 9 | A quan trọng hơn B tuyệt đối |
| 1/3, 1/5, 1/7, 1/9 | Giá trị ngược (B quan trọng hơn A) |

**Tính đối xứng**: Nếu ô `[A, B] = 5` thì ô `[B, A] = 1/5` (tự động).

### Ví dụ ma trận 4 tiêu chí (C1-C4):

```
         C1     C2     C3     C4
C1   [  1    , 1/3  ,  3   ,  5   ]
C2   [  3    ,  1   ,  5   ,  7   ]
C3   [ 1/3  , 1/5  ,  1   ,  3   ]
C4   [ 1/5  , 1/7  , 1/3  ,  1   ]
```

---

## Bước 2: Tính trọng số bằng Column Sum Normalization (Chuẩn hóa cột)

**Bước 2.1** - Tính tổng mỗi cột:

```
S_j = Σ a_ij     (i = 1..n)
```

**Bước 2.2** - Chuẩn hóa: chia mỗi ô cho tổng cột tương ứng:

```
a'_ij = a_ij / S_j
```

**Bước 2.3** - Trọng số = trung bình mỗi dòng sau chuẩn hóa:

```
W_i = (a'_i1 + a'_i2 + ... + a'_in) / n
```

### Ví dụ tính cho C1:

```
Tổng cột C1 = 1 + 3 + 1/3 + 1/5 = 4.5333

Chuẩn hóa dòng C1: [1/4.533, 0.333/1.676, 3/9.333, 5/16]
W_C1 = trung bình dòng C1 sau chuẩn hóa
```

**Kết quả mẫu** (từ dữ liệu SQL):
| Tiêu chí | Trọng số (W) |
|----------|-------------|
| C1 (Nhiệt độ) | ~0.2633 (26.33%) |
| C2 (Ánh sáng) | ~0.5579 (55.79%) |
| C3 (Độ ẩm) | ~0.1220 (12.20%) |
| C4 (Lọc khí) | ~0.0567 (5.67%) |

---

## Bước 3: Tính chỉ số nhất quán CR (Consistency Ratio)

### 3.1. Tính λ_max (eigenvalue lớn nhất)

```
Bước 1: Tính vector A × W (ma trận × vector trọng số)
Bước 2: Chia từng phần tử kết quả cho trọng số tương ứng
Bước 3: Lấy trung bình → λ_max
```

### 3.2. Tính CI (Consistency Index)

```
CI = (λ_max - n) / (n - 1)
```

### 3.3. Tính CR

```
CR = CI / RI
```

Bảng **RI** (Random Index) theo số tiêu chí n:

| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| RI | 0.00 | 0.00 | 0.58 | 0.90 | 1.12 | 1.24 | 1.32 | 1.41 | 1.45 | 1.49 |

**Kết luận**:
- `CR < 0.1` → ✅ Dữ liệu **nhất quán**, chấp nhận được
- `CR ≥ 0.1` → ❌ Dữ liệu **không nhất quán**, cần sửa lại ma trận

---

## Bước 4: Chuẩn hóa trọng số khi khách hàng chọn/bỏ tiêu chí

Khi khách hàng chỉ chọn **một số** tiêu chí (ví dụ chỉ chọn C1 và C2), hệ thống **chuẩn hóa lại** trọng số:

### Công thức:

```
W'_j = W_j / Σ(W_k)     với k ∈ {các tiêu chí được chọn}
```

### Ví dụ: Khách chỉ chọn C1 và C2

```
Tổng = W_C1 + W_C2 = 0.2633 + 0.5579 = 0.8212

W'_C1 = 0.2633 / 0.8212 ≈ 0.3206 (32.06%)
W'_C2 = 0.5579 / 0.8212 ≈ 0.6794 (67.94%)

Tổng mới = 100% ✓
```

> **Ý nghĩa**: Giữ nguyên tỷ lệ quan trọng giữa C1 và C2, nhưng chia lại cho tổng = 100%.

---

## Bước 5: Tính điểm phù hợp cuối cùng cho mỗi cây

### Công thức tổng điểm:

```
S_i = Σ (W'_j × r_ij) × 100%
```

Trong đó:
- `S_i` = Điểm phù hợp của cây i (đơn vị: %)
- `W'_j` = Trọng số chuẩn hóa của tiêu chí j (đã tính ở Bước 4)
- `r_ij` = Trọng số cây i theo tiêu chí j (lưu trong bảng `TrongSoPhuongAn`)
- Nhân 100 để ra phần trăm

### Ví dụ: Tính điểm cho cây Lưỡi Hổ (ID=2), chọn C1 và C2

```
S_LưỡiHổ = (W'_C1 × r_2,C1) + (W'_C2 × r_2,C2)
         = (0.3206 × 0.2959) + (0.6794 × 0.2286)
         = 0.0949 + 0.1553
         = 0.2502
         = 25.02%
```

(Giá trị `r_ij` là trọng số đã tính từ ma trận phương án 10×10)

---

## Tóm tắt luồng dữ liệu

```
[Admin nhập ma trận so sánh]
        ↓
[Tính trọng số (Geometric Mean)]  →  Lưu vào bảng TieuChi.TrongSoTieuChi
        ↓                            Lưu vào bảng TrongSoPhuongAn
[Tính CR kiểm tra nhất quán]
        ↓
[Khách hàng chọn tiêu chí]
        ↓
[Chuẩn hóa lại trọng số (tổng = 100%)]
        ↓
[Tính điểm S_i cho mỗi cây]
        ↓
[Sắp xếp giảm dần → Hiển thị gợi ý]
```

---

## Bảng DB liên quan

| Bảng | Mô tả |
|------|-------|
| `TieuChi` | 4 tiêu chí (C1-C4), lưu trọng số `TrongSoTieuChi` |
| `MaTranSoSanh` | Ma trận so sánh cặp giữa 4 tiêu chí (4×4) |
| `MaTranPhuongAn` | Ma trận so sánh cặp giữa các cây theo từng tiêu chí (N×N per C) |
| `TrongSoPhuongAn` | Trọng số tính được của mỗi cây theo từng tiêu chí |
| `AHP_ThongSoTieuChi` | Lưu CR tổng thể |
| `DacDiem` | Đặc điểm lọc (Có hoa, Không độc, v.v.) |
| `CayCanh_DacDiem` | Bảng trung gian cây-đặc điểm |

---

## File code tương ứng

| File | Vai trò |
|------|---------|
| `backend/app/utils/ahp_calculator.py` | Hàm `calculate_weights()`, `calculate_cr()`, `calculate_final_scores()` |
| `backend/app/routers/tieu_chi.py` | API quản lý ma trận tiêu chí + tính trọng số |
| `backend/app/routers/phuong_an.py` | API quản lý ma trận phương án (cây) + tính trọng số |
| `backend/app/routers/ahp_recommend.py` | API gợi ý cây cho khách hàng |
| `frontend/src/pages/CayCanh/TuVanAHP.jsx` | Trang khách hàng chọn tiêu chí → xem gợi ý |
| `frontend/src/pages/Admin/AHP/TieuChiAHP.jsx` | Trang admin quản lý ma trận tiêu chí |
| `frontend/src/pages/Admin/AHP/PhuongAnAHP.jsx` | Trang admin quản lý ma trận phương án |
