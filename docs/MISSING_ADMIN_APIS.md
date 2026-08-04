# Danh sách các API bị thiếu dành cho Admin (Dựa trên tài liệu BE)

Tài liệu này tổng hợp lại những API mà Backend hiện tại **chưa có** hoặc **chưa hoàn thiện** (PARTIAL/TBD) ở góc độ quản trị viên (ADMIN), gây cản trở cho việc phát triển các màn hình quản trị trên Frontend.

## 1. Thiếu API Cập nhật (Update) và Xóa (Delete) cho Master Data
Các resource cốt lõi (Subject, Class, Semester, Course) hiện tại mới chỉ hỗ trợ `POST` (Tạo mới) và `GET` (Đọc danh sách/Chi tiết).

**Danh sách API cần bổ sung:**
- **Subject:** 
  - `PUT /api/v1/subjects/{id}` (Sửa môn học)
  - `DELETE /api/v1/subjects/{id}` (Xóa môn học)
- **Class:**
  - `PUT /api/v1/classes/{id}` (Sửa lớp)
  - `DELETE /api/v1/classes/{id}` (Xóa lớp)
- **Semester:**
  - `PUT /api/v1/semesters/{id}` (Sửa học kỳ)
  - `DELETE /api/v1/semesters/{id}` (Xóa học kỳ)
- **Course:**
  - `PUT /api/v1/courses/{id}` (Sửa khóa học)
  - `DELETE /api/v1/courses/{id}` (Xóa khóa học)

*(Lưu ý: BE cần chốt cơ chế Hard Delete hay Soft Delete cho các dữ liệu này).*

## 2. Quản lý Người dùng (User / Account Management)
Hiện tại URL pattern `/api/admin/**` đã được đưa vào Security Rule nhưng không có HTTP Controller nào thực sự implement các đường dẫn này.

**Danh sách API cần bổ sung:**
- `GET /api/admin/users`: Lấy danh sách toàn bộ người dùng (Student, Lecturer, Admin) để hiển thị trong mục "Quản lý Người dùng".
- `PATCH /api/admin/users/{id}/status`: Đổi trạng thái tài khoản. Tài liệu có ghi nhận lỗi `HIGH: AccountStatus không enforce permission`, và Admin cần API này để chủ động khóa (`SUSPENDED`/`INACTIVE`) hoặc duyệt (`ACTIVE`) tài khoản.
- `PUT /api/admin/users/{id}/role` (Tùy chọn): Nếu nghiệp vụ cho phép Admin set role thủ công.

## 3. Dữ liệu Đánh giá và Tiến trình học (Assessment, Rubric, v.v.)
Các entity (database table) đã có cho: Assessment, Rubric, CAM, AI log, Document, Meeting, Notification, Peer Review, Sprint/Task nhưng **thiếu hoàn toàn Controller HTTP**.

**Danh sách API cần bổ sung (Ví dụ điển hình):**
- **Rubric:** API để Admin tạo và quản lý thư viện các tiêu chí chấm điểm (Rubric Template).
- **Peer Review/Assessment:** API để lấy danh sách các đánh giá chéo hoặc xem tổng quan tình hình đánh giá nếu Admin cần can thiệp.

## 4. Quản lý Hệ thống và Lịch sử (System & Audit Logs)
Admin có thể override quyền (quản lý Integration, Project) và những hành động này được ghi vào MongoDB (`SystemAuditLog`).

**Danh sách API cần bổ sung:**
- `GET /api/admin/audit-logs`: API để lấy lịch sử thao tác từ MongoDB lên Dashboard cho Admin xem lại các thay đổi quan trọng.
- `GET /api/admin/system-stats`: Thống kê tổng số users, lớp, khóa học, integrations đang active cho trang Dashboard `/admin`.

## 5. Quản lý Team / Project Tổng thể
Admin có quyền quản lý Integration của mọi project (override). Tuy nhiên, hiện tại Admin chỉ có thể truy cập bằng cách đi sâu từ Course -> Team -> Project.

**Danh sách API cần bổ sung:**
- `GET /api/admin/teams`: Danh sách toàn bộ Teams trên hệ thống.
- `GET /api/admin/projects`: Danh sách toàn bộ Projects trên hệ thống kèm trạng thái Jira/GitHub.

---

> Vui lòng gửi tài liệu này cho đội Backend để lên kế hoạch triển khai thêm các endpoint phục vụ Admin Dashboard.
