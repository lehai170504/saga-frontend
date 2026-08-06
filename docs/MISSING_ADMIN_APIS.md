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
  - `POST /api/v1/courses/{id}/students` (Thêm thủ công 1 sinh viên vào lớp - hiện tại chỉ mới có API Import Excel hàng loạt)
  - `DELETE /api/v1/courses/{id}/students/{studentId}` (Rút/Xóa 1 sinh viên khỏi lớp)

*(Lưu ý: BE cần chốt cơ chế Hard Delete hay Soft Delete cho các dữ liệu này).*

## 2. Quản lý Người dùng (User / Account Management)
Hiện tại URL pattern `/api/admin/**` đã được đưa vào Security Rule nhưng không có HTTP Controller nào thực sự implement các đường dẫn này.

**Danh sách API cần bổ sung:**
- `GET /api/admin/users`: Lấy danh sách toàn bộ người dùng (Student, Lecturer, Admin) để hiển thị trong mục "Quản lý Người dùng".
- `PATCH /api/admin/users/{id}/status`: Đổi trạng thái tài khoản. Tài liệu có ghi nhận lỗi `HIGH: AccountStatus không enforce permission`, và Admin cần API này để chủ động khóa (`SUSPENDED`/`INACTIVE`) hoặc duyệt (`ACTIVE`) tài khoản.
- `PUT /api/admin/users/{id}/role` (Tùy chọn): Nếu nghiệp vụ cho phép Admin set role thủ công.
- `POST /api/admin/users/{id}/reset-password`: Cấp lại mật khẩu khẩn cấp (ép đổi mật khẩu hoặc gửi email reset) cho trường hợp user quên mật khẩu mà không tự lấy lại được.

## 3. Dữ liệu Đánh giá và Tiến trình học (Assessment, Rubric, CAM...)
Dựa theo luồng Contribution, các API đọc/ghi cơ bản của sinh viên và giảng viên (như `GET /peer-reviews`, `GET /contribution-evaluation`) đã được Backend cung cấp. Tuy nhiên, ở góc độ **Quản trị (Admin)**, hệ thống vẫn thiếu các API quản lý danh mục:

**Danh sách API cần bổ sung:**
- **Quản lý Rubric (Tiêu chí đánh giá):** Hiện tại hệ thống có API `GET /api/v1/peer-review-rubrics/default` trả về 4 tiêu chí cứng. Admin cần bộ API CRUD để chủ động thay đổi nội dung các tiêu chí này thay vì fix cứng trong DB.
  - Cần bổ sung: `POST /api/admin/peer-review-rubrics` (Tạo tiêu chí mặc định mới)
  - Cần bổ sung: `PUT /api/admin/peer-review-rubrics/{id}` (Sửa nội dung/trọng số tiêu chí)
  - Cần bổ sung: `DELETE /api/admin/peer-review-rubrics/{id}` (Xóa/Vô hiệu hóa tiêu chí)
- **Quản lý Tổng quan Đánh giá:** Cần API để Admin theo dõi tiến độ đánh giá toàn trường (VD: Liệt kê tổng quan các lớp chưa hoàn thành Peer Review hoặc chưa chốt điểm Contribution khi sắp hết hạn).

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

## 6. Import/Export Dữ liệu hàng loạt
Trong quá trình vận hành, Admin thường xuyên làm việc với số lượng lớn dữ liệu (đầu kỳ học, cuối kỳ).
**Danh sách API cần bổ sung:**
- `POST /api/admin/users/import`: Import tài khoản User (Student/Lecturer) hàng loạt qua file Excel/CSV.
- `GET /api/admin/reports/courses/{id}/export`: Xuất toàn bộ bảng điểm, báo cáo đánh giá của một khóa học ra file.

## 7. Cấu hình Hệ thống Chung (Global Settings)
Admin cần công cụ để tinh chỉnh hệ thống mà không cần Dev can thiệp vào Database.
**Danh sách API cần bổ sung:**
- `PUT /api/admin/settings/active-semester`: Cấu hình "Học kỳ hiện tại" (để các màn hình FE tự động filter theo default).
- `PUT /api/admin/settings/system`: Cấu hình các tham số mặc định chung (Ví dụ: trọng số đánh giá mặc định).

## 8. Quản lý Thông báo Toàn hệ thống (Notifications)
- `POST /api/admin/notifications/broadcast`: Gửi thông báo đến toàn bộ người dùng hoặc một role cụ thể (Ví dụ: thông báo bảo trì, nhắc nhở đầu kỳ học).

## 9. Khắc phục sự cố & Hỗ trợ Người dùng (Support & Diagnostics)
- **Impersonate (Đăng nhập giả lập):** Admin "toàn quyền" cần login vào góc nhìn của một giảng viên/sinh viên để kiểm tra lỗi hoặc hỗ trợ thao tác mà không cần mật khẩu.
  - `POST /api/admin/impersonate/{userId}`: Sinh ra token tạm thời để đăng nhập dưới quyền user khác.
- **Theo dõi thao tác chi tiết 1 User (Activity Logs):** 
  - `GET /api/admin/users/{id}/audit-logs`: Xem lịch sử thao tác của riêng 1 user cụ thể trên hệ thống (để truy vết xem user đó đã sửa/xóa những gì).
- **Giám sát Tích hợp (Integration Health):**
  - `GET /api/admin/integrations/health`: Kiểm tra trạng thái webhook và kết nối của GitHub/Jira App toàn hệ thống xem có lỗi hay không.

## 10. Truy cập chéo Dữ liệu (Cross-access Entity)
*(Câu hỏi cần làm rõ với BE về Kiến trúc API)*
Hệ thống có các entity con như Assessment, Peer Review, Sprint/Task, Document, Meeting. Khi Admin muốn xem hoặc chỉnh sửa dữ liệu của một Team bất kỳ:
- Admin sẽ gọi chung endpoint với user (VD: `GET /api/v1/teams/{id}/tasks`) và BE tự động **bypass quyền (override)**?
- Hay BE bắt buộc cung cấp các endpoint riêng cho Admin dạng `GET /api/admin/teams/{id}/tasks`?

---

> Vui lòng gửi tài liệu này cho đội Backend để lên kế hoạch triển khai thêm các endpoint phục vụ Admin Dashboard.
