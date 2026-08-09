# Danh sách các API bị thiếu dành cho Admin (Dựa trên tài liệu BE)

Tài liệu này tổng hợp lại những API mà Backend hiện tại **chưa có** hoặc **chưa hoàn thiện** (PARTIAL/TBD) ở góc độ quản trị viên (ADMIN), gây cản trở cho việc phát triển các màn hình quản trị trên Frontend.

## 1. Thiếu API Cập nhật (Update) và Xóa (Delete) cho Master Data
Các resource cốt lõi (Subject, Class, Semester, Course) hiện tại mới chỉ hỗ trợ `POST` (Tạo mới) và `GET` (Đọc danh sách/Chi tiết).

**Danh sách API cần bổ sung:**
- **Course:**
  - `PUT /api/v1/courses/{id}` (Sửa khóa học)
  - `DELETE /api/v1/courses/{id}` (Xóa khóa học)
  - `POST /api/v1/courses/{id}/students` (Thêm thủ công 1 sinh viên vào lớp - hiện tại chỉ mới có API Import Excel hàng loạt)
  - `DELETE /api/v1/courses/{id}/students/{studentId}` (Rút/Xóa 1 sinh viên khỏi lớp)

*(Lưu ý: BE cần chốt cơ chế Hard Delete hay Soft Delete cho các dữ liệu này).*

## 2. Quản lý Người dùng (User / Account Management)
Hiện tại URL pattern `/api/admin/**` đã được đưa vào Security Rule nhưng không có HTTP Controller nào thực sự implement các đường dẫn này.

**Danh sách API cần bổ sung:**
- `PUT /api/admin/users/{id}/role` (Tùy chọn): Nếu nghiệp vụ cho phép Admin set role thủ công.
- `POST /api/admin/users/{id}/reset-password`: Cấp lại mật khẩu khẩn cấp (ép đổi mật khẩu hoặc gửi email reset) cho trường hợp user quên mật khẩu mà không tự lấy lại được.

## 3. Import/Export Dữ liệu hàng loạt
Trong quá trình vận hành, Admin thường xuyên làm việc với số lượng lớn dữ liệu (đầu kỳ học, cuối kỳ).
**Danh sách API cần bổ sung:**
- `POST /api/admin/users/import`: Import tài khoản User (Student/Lecturer) hàng loạt qua file Excel/CSV.
- `GET /api/admin/reports/courses/{id}/export`: Xuất toàn bộ bảng điểm, báo cáo đánh giá của một khóa học ra file.

## 4. Cấu hình Hệ thống Chung (Global Settings)
Admin cần công cụ để tinh chỉnh hệ thống mà không cần Dev can thiệp vào Database.
**Danh sách API cần bổ sung:**
- `PUT /api/admin/settings/active-semester`: Cấu hình "Học kỳ hiện tại" (để các màn hình FE tự động filter theo default).
- `PUT /api/admin/settings/system`: Cấu hình các tham số mặc định chung (Ví dụ: trọng số đánh giá mặc định).

## 5. Quản lý Thông báo Toàn hệ thống (Notifications)
- `POST /api/admin/notifications/broadcast`: Gửi thông báo đến toàn bộ người dùng hoặc một role cụ thể (Ví dụ: thông báo bảo trì, nhắc nhở đầu kỳ học).

## 6. Khắc phục sự cố & Hỗ trợ Người dùng (Support & Diagnostics)

- **Giám sát Tích hợp (Integration Health):**
  - `GET /api/admin/integrations/health`: Kiểm tra trạng thái webhook và kết nối của GitHub/Jira App toàn hệ thống xem có lỗi hay không.

## 7. Truy cập chéo Dữ liệu (Cross-access Entity)
*(Câu hỏi cần làm rõ với BE về Kiến trúc API)*
Hệ thống có các entity con như Assessment, Peer Review, Sprint/Task, Document, Meeting. Khi Admin muốn xem hoặc chỉnh sửa dữ liệu của một Team bất kỳ:
- Admin sẽ gọi chung endpoint với user (VD: `GET /api/v1/teams/{id}/tasks`) và BE tự động **bypass quyền (override)**?
- Hay BE bắt buộc cung cấp các endpoint riêng cho Admin dạng `GET /api/admin/teams/{id}/tasks`?

---

> Vui lòng gửi tài liệu này cho đội Backend để lên kế hoạch triển khai thêm các endpoint phục vụ Admin Dashboard.
