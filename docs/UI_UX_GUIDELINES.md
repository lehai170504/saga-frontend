# SAGA Frontend - Quy chuẩn UI/UX & Coding Standards

Tài liệu này đóng vai trò là "Single Source of Truth" (Nguồn chân lý duy nhất) cho toàn bộ Frontend Team của dự án SAGA (Continuous Dashboard). Bất cứ khi nào tạo tính năng mới hay thiết kế giao diện, mọi thành viên **bắt buộc phải tuân theo** các quy tắc dưới đây nhằm đảm bảo tính đồng bộ, chuyên nghiệp và mang lại cảm giác "Wow" (Premium) cho người dùng.

---

## 1. Hệ thống màu sắc (Color System)

Project đang sử dụng **Tailwind CSS v4** với mã màu định dạng `oklch` trong `globals.css`. Không sử dụng mã HEX hay RGB trực tiếp trong class (ví dụ: `bg-[#ff5500]`), hãy luôn dùng class biến của hệ thống.

### Màu chủ đạo (Primary & Secondary)
- **Primary (Màu Cam sáng):** Dùng cho các nút kêu gọi hành động chính (CTA), điểm nhấn quan trọng, trạng thái đang chọn (Active).
  - Sử dụng: `bg-primary`, `text-primary`, `border-primary`
- **Secondary (Màu Xanh dương):** Dùng cho các icon phụ trợ, viền phụ, nút nhấn cấp độ 2, trạng thái (Badge).
  - Sử dụng: `bg-secondary`, `text-secondary`

### Màu Trạng thái (Status Colors)
- **Thành công (Success):** Xanh lá (`emerald-500` / `emerald-600`) - Dùng khi hiển thị kết quả đúng, hoàn thành, điểm cao.
- **Cảnh báo (Warning):** Vàng / Cam nhạt (`orange-400` / `orange-500`) - Dùng khi nhắc nhở, rủi ro vừa.
- **Lỗi/Nguy hiểm (Destructive):** Đỏ thẫm (`destructive`) - Dùng cho nút xóa, cảnh báo rủi ro cao, lỗi.

### Màu Nền & Văn bản (Background & Foreground)
Hệ thống tự động hỗ trợ **Light/Dark mode**. 
- Nền trang web: `bg-background`
- Nền của khối Card/Panel: `bg-card` hoặc `bg-slate-50 / bg-muted` (để tách biệt với nền).
- Text chính: `text-foreground`
- Text phụ/Ghi chú: `text-muted-foreground`

---

## 2. Typography & Font chữ

- Font mặc định hệ thống được thiết lập là `font-sans`. KHÔNG thay đổi thủ công sang font khác.
- Kích thước chữ (Text Size):
  - Tiêu đề Trang (Page Header): `text-4xl` hoặc `text-5xl` kèm `font-black tracking-tight`.
  - Tiêu đề Card: `text-base font-extrabold` hoặc `text-lg font-bold`.
  - Chữ thường: `text-sm` hoặc `text-xs font-medium`.
  - Chữ ghi chú siêu nhỏ: `text-[10px]` hoặc `text-[11px] font-bold uppercase tracking-wide`.

---

## 3. Kiến trúc Bo góc (Border Radius) & Bóng đổ (Shadows)

SAGA Dashboard nhắm tới thiết kế hiện đại, thân thiện (Glassmorphism + Smoothness). Vì thế các góc luôn được bo tròn sâu.

- **Nút bấm (Buttons) & Input:** Luôn dùng `rounded-xl` hoặc `rounded-full`. (Ví dụ: `rounded-xl h-11`).
- **Thẻ nội dung (Cards/Panels):** Thường sử dụng `rounded-2xl` hoặc `rounded-3xl` cho các khối to. Hạn chế dùng `rounded-md` hay `rounded-lg` trừ khi đó là các dropdown/popover nhỏ.
- **Bóng đổ (Shadow):** Khuyến khích sử dụng `shadow-sm` cho các card bình thường và `shadow-md` cho hiệu ứng hover. Không dùng shadow quá đậm.

---

## 4. UI Components (Sử dụng Shadcn UI)

**TUYỆT ĐỐI KHÔNG** tự code lại CSS thuần cho các thành phần cơ bản (Button, Input, Select, Dialog, Dropdown, Tabs). 
Tất cả đã được cấu hình tại thư mục `@/components/ui/`.

- **Khi cần dùng nút bấm:** `import { Button } from "@/components/ui/button"`
- **Khi cần Card:** `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"`
- **Các class tùy biến cho Button:** Nếu muốn nút nhìn "premium" hơn, có thể thêm class:
  - Nút Primary: `bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20`
  - Nút Outline: `border-slate-200 text-foreground hover:bg-slate-50`

---

## 5. Icon & Đồ họa

- **Icon:** Đồng nhất toàn bộ dự án sử dụng thư viện **Lucide React** (`lucide-react`). KHÔNG dùng FontAwesome hay Heroicons.
  - Ví dụ: `import { Users, LayoutDashboard, Settings } from "lucide-react"`
  - Kích thước Icon tiêu chuẩn trên text thường: `size={16}` (hoặc `w-4 h-4`).
- Thường xuyên bọc Icon trong một vùng tròn có nền mờ (VD: `p-3 bg-primary/10 text-primary rounded-2xl`) để tạo điểm nhấn thị giác (Visual Point).

---

## 6. Micro-Animations & Tương tác (Aesthetics)

SAGA yêu cầu giao diện phải **"Sống động" (Dynamic)**. Hãy thêm hiệu ứng cho mọi thành phần xuất hiện trên màn hình:
- **Render Card ban đầu:** Sử dụng plugin `tw-animate-css` hoặc các class có sẵn: `animate-in fade-in slide-in-from-bottom-4 duration-500`.
- **Hover tương tác:** Các card/nút phải phản hồi khi đưa chuột vào. Thường dùng: `transition-all duration-300 hover:shadow-md hover:border-slate-300`.
- **Click:** Nút bấm khi nhấn tự động có hiệu ứng thu nhỏ (`scale-[0.98]`) hoặc ring (viền focus) màu primary.

---

## 7. Kiến trúc Thư mục làm việc (Folder Structure)

- `src/app/(dashboard)/`: Chứa các trang có chung Layout bên trong hệ thống (đã đăng nhập).
- `src/components/ui/`: CHỈ chứa các Shadcn UI components thuần túy (không chứa logic dự án).
- `src/components/shared/`: Chứa các components do team tự build và dùng lại nhiều lần ở nhiều trang (ví dụ: `PageHeader.tsx`, `MetricCard.tsx`, `RouteGuard.tsx`).
- `src/components/layout/`: Chứa Sidebar, Header, MobileOverlay.
- `src/features/`: Chứa logic/components đặc thù của một domain riêng (vd: tính năng phân tích điểm rủi ro, phân tích biểu đồ nhiệt).

---

Hãy cùng nhau tạo ra một SAGA Dashboard không chỉ thông minh về logic mà còn **tuyệt đẹp** về mặt thị giác! 🚀
