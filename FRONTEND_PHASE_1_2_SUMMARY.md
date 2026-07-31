# Tóm tắt công việc Frontend - Phase 1 & 2

Tài liệu này tóm tắt các thiết lập và tính năng đã được hoàn thiện trong giai đoạn 1 và giai đoạn 2 của Frontend, tập trung vào việc chuẩn hoá kiến trúc và tích hợp xác thực (Authentication) theo luồng của AWS Cognito.

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

---
**Kết luận:** Hệ thống Frontend hiện tại đã "làm sạch" hoàn toàn các nợ kỹ thuật (Technical Debt) về Context cũ, kiến trúc API/State Management đã được định hình cứng cáp để sẵn sàng đón các chức năng nghiệp vụ tiếp theo ở Phase 3.
