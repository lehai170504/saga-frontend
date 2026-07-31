# Tóm tắt công việc Frontend - Phase 1, 2 & 3

Tài liệu này tóm tắt các thiết lập và tính năng đã được hoàn thiện trong các giai đoạn phát triển Frontend, từ việc chuẩn hoá kiến trúc ban đầu, tích hợp Authentication cho đến việc nâng cấp Kiến trúc Route & Tối ưu UI/UX (Phase 3).

## 🌟 Phase 1: Cấu hình Core Architecture
Trong Phase 1, toàn bộ các cấu hình lõi để giao tiếp với Backend và quản lý State đã được thiết lập chuẩn chỉnh.

- **State Management (Zustand):** Khởi tạo `authStore` để lưu trữ trạng thái người dùng global thay cho Context API (giúp tối ưu hiệu năng và dễ scale).
- **Data Fetching (TanStack Query):** Cài đặt và cấu hình `QueryProvider` bao bọc toàn ứng dụng để tự động caching, quản lý trạng thái pending/error của các API Request.
- **HTTP Client (Axios Interceptor):**
  - Khởi tạo file cấu hình `src/lib/axios.ts` chuẩn mực.
  - Tự động gắn `withCredentials: true` vào mọi request để gửi kèm `JSESSIONID` cookie.
  - Tự động trích xuất cookie `XSRF-TOKEN` và đính kèm vào header `X-XSRF-TOKEN` với các request dạng Mutation (POST, PUT, DELETE, PATCH).
  - Bắt lỗi `401 Unauthorized` globally để tự động clear session và đá về trang đăng nhập.
- **Environment Variables:** Đấu nối biến môi trường `NEXT_PUBLIC_API_BASE_URL` trong `.env.local` trỏ về BE production (`saga-backend-production-3951.up.railway.app`).

## 🔐 Phase 2: Tích hợp Authentication & Security
Trong Phase 2, luồng đăng nhập, đăng xuất và bảo vệ tuyến đường (Route Guard) đã được triển khai hoàn chỉnh.

- **Authentication API & Hooks (`authApi.ts`, `useAuth.ts`):** 
  - Khởi tạo thư mục chuẩn Clean Architecture: `src/features/auth/`.
  - Tích hợp gọi API `/api/auth/me` để đồng bộ hoá phiên đăng nhập.
  - Tạo Custom Hook `useAuth` đóng vai trò là "cầu nối" (bridge) giữa React Query (lấy data) và Zustand (lưu global state).
- **Cơ chế Login (Cognito Hosted UI):** 
  - Sửa đổi UI Login. Nút "Đăng nhập với SAGA Identity" chuyển sang dùng thẻ `<a>` thuần tuý để redirect trình duyệt trực tiếp sang `/api/auth/login`, nhường việc xử lý OAuth2 cho BE và AWS Cognito.
- **Cơ chế Logout (Hidden POST Form):** 
  - Xử lý mượt mà vấn đề CORS / Redirect 302 của Logout bằng cách tạo một Form ẩn gọi phương thức `POST` gửi tới `/api/auth/logout` kèm CSRF Token.
- **Xoá bỏ hoàn toàn AuthContext cũ:** 
  - Gỡ bỏ thư viện context cũ, thay thế triệt để trên toàn bộ các components (`header`, `sidebar`, `profile-modal`, `global-command-palette`) sang dùng `useAuth`.
  - Cập nhật chuẩn Type dữ liệu trả về từ BE: Đổi `role` thành `applicationRole`, `name` thành `fullName`, fix lỗi lấy `avatarInitials`.
- **Bảo vệ Routes (RouteGuard & ClientGuard):** 
  - Tạo Component bọc ngoài để bảo vệ trang, ngăn chặn truy cập trái phép. Tự động kiểm tra quyền (`applicationRole`) và chuyển hướng (Redirect) nếu người dùng chưa đăng nhập hoặc không đủ quyền.

## 🎨 Phase 3: Nâng cấp Kiến trúc & Đại tu UI/UX
Trong Phase 3, hệ thống tập trung xử lý các phần liên quan đến tương tác API thực tế, kiến trúc dữ liệu và tối ưu giao diện người dùng để đạt tiêu chuẩn SaaS quốc tế.

- **Đại phẫu thuật Kiến trúc State (Architecturally Perfect):**
  - **URL-based State:** Chuyển đổi toàn bộ Student Dashboard từ việc dùng Global State (Zustand/LocalStorage) sang kiến trúc **Dynamic URL Routes (`/student/[classId]/...`)**.
  - **Sự đồng nhất:** Kiến trúc của Student giờ đã đối xứng 100% với Lecturer, giúp URL trở thành "Nguồn sự thật" (Source of Truth).
  - **Trải nghiệm mới:** Loại bỏ hoàn toàn lỗi bất đồng bộ dữ liệu khi mở nhiều tab, và kích hoạt khả năng **Shareable URL** (copy link gửi cho bạn bè).
- **Thiết kế lại toàn bộ Design System (UI/UX Redesign):**
  - Xoá bỏ tàn dư của các CSS template cũ/AI-generated nhàm chán.
  - Xây dựng lại hệ thống CSS Variables (`globals.css`) với tone màu **Electric Blue** và **Deep Slate (Dark mode)** hiện đại, dịu mắt.
  - Áp dụng triệt để phong cách **Glassmorphism**, đổ bóng đa lớp (multi-layered shadows) và hiệu ứng tương tác (micro-interactions) mang hơi hướng Vercel & Linear.
- **Brand Identity:** Thiết kế và tích hợp Logo SAGA mới (Stylized S-node network) đồng bộ hoàn toàn với hệ thống màu sắc.
- **Quản lý trạng thái Integration:** Đã chuẩn bị sẵn các Zustand store và Mock data để xử lý luồng tích hợp GitHub và Jira (Identity Mappings, Sync Status).

---
**Kết luận:** Hệ thống Frontend hiện tại đã "làm sạch" hoàn toàn các nợ kỹ thuật (Technical Debt) về Context cũ, sở hữu kiến trúc Route chuẩn mực của Next.js (URL-driven), và có một bộ mặt UI/UX xuất sắc sẵn sàng cho việc ra mắt!
