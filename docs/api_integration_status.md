# Báo cáo Tình trạng Tích hợp API (SAGA Frontend)

Tài liệu này tổng hợp toàn bộ các API đã được tích hợp thành công trên Frontend, cũng như danh sách các tính năng/API còn thiếu cần bổ sung để hoàn thiện 100% hệ thống SAGA.

## 1. Các API đã được gọi và tích hợp thành công

### 1.1. Authentication (Xác thực & Phân quyền)
Toàn bộ luồng xác thực (bao gồm bảo mật CSRF) đã hoàn thiện và chạy thực tế.
- `POST /api/auth/login`: Đăng nhập.
- `GET /api/auth/csrf`: Lấy CSRF token (Interceptor tự động gán vào header cho mọi API mutate).
- `POST /api/auth/refresh`: Refresh token tự động khi hết hạn.
- `GET /api/auth/me`: Lấy thông tin User hiện tại (Role, Profile).
- `POST /api/auth/logout`: Đăng xuất.

### 1.2. Master Data (Dữ liệu Hệ thống)
Các trang Quản trị Master Data đã hoàn thiện cả tính năng Xem danh sách (Table, Phân trang) và Tạo mới (Form, Validate bằng Zod).
- **Môn học (Subjects):** `GET /api/v1/subjects`, `GET /api/v1/subjects/{id}`, `POST /api/v1/subjects`
- **Khóa học (Courses):** `GET /api/v1/courses`, `GET /api/v1/courses/{id}`, `POST /api/v1/courses`
- **Lớp học (Classes):** `GET /api/v1/classes`, `GET /api/v1/classes/{id}`, `POST /api/v1/classes`
- **Học kỳ (Semesters):** `GET /api/v1/semesters`, `GET /api/v1/semesters/{id}`, `POST /api/v1/semesters`

### 1.3. Quản lý Dự án Nhóm (Team Projects)
- `POST /api/teams/{teamId}/projects`: Khởi tạo không gian dự án cho một nhóm. (Đã tích hợp UI Modal tại `StudentProjectsList`).

### 1.4. Tích hợp Dự án (Project Integrations - Jira/GitHub)
Dành cho Leader cấu hình không gian làm việc. Toàn bộ UI (Panel Settings) và Call API đã được thực hiện bằng React Query. Luồng OAuth Connect được thực hiện thông qua `window.location.assign`.
- `GET /api/projects/{projectId}/integrations`: Lấy trạng thái liên kết Jira/GitHub.
- `GET /api/projects/{projectId}/jira/connect`: Redirect sang Jira để ủy quyền (OAuth).
- `GET /api/projects/{projectId}/github/install`: Redirect sang GitHub để cài đặt App.
- `GET /api/projects/{projectId}/github/setup`: Redirect từ GitHub sau khi setup.
- `GET /api/projects/{projectId}/github/callback`: Webhook/Callback xử lý mã ủy quyền từ GitHub.
- `POST /api/projects/{projectId}/jira/link`: Liên kết với 1 Project Key của Jira.
- `DELETE /api/projects/{projectId}/jira`: Xóa liên kết Jira.
- `POST /api/projects/{projectId}/github/repositories`: Thêm repository GitHub vào dự án.
- `DELETE /api/projects/{projectId}/github/repositories/{repoId}`: Xóa repo GitHub khỏi dự án.
- `GET /api/projects/{projectId}/sync-status`: Polling (5s/lần) trạng thái đồng bộ dữ liệu.

### 1.5. Cá nhân & Kiểm duyệt Danh tính (Identity Mappings)
- `GET /api/integrations/identity-mappings?studentId={uuid}`: Lấy danh sách các tài khoản Jira/GitHub cá nhân sinh viên đã link.
- `PATCH /api/integrations/identity-mappings/{mappingId}`: Giảng viên Duyệt (APPROVE) hoặc Từ chối (REJECT) tài khoản sinh viên (UI: Nằm trong trang Chi tiết hồ sơ Sinh viên).
- `GET /api/me/integrations`: Xem danh sách liên kết cá nhân.
- `DELETE /api/me/integrations/{provider}`: Hủy liên kết cá nhân.

### 1.6. Quản lý Sinh viên & Nhóm (Course Students & Teams)
- `POST /api/v1/courses/{courseId}/import-students`: Import danh sách sinh viên vào khóa học bằng file Excel (Đã tích hợp UI Modal upload file thực tế).
- `GET /api/v1/courses/{courseId}/students`: Lấy danh sách toàn bộ sinh viên của một khóa học, chia thành 2 danh sách Đã có nhóm và Chưa có nhóm (Đã setup API, Hook và UI hiển thị).
- `GET /api/v1/courses/{courseId}/teams/{teamId}/members`: Lấy danh sách thành viên của một nhóm (Đã setup API và Hook, chờ UI danh sách nhóm).

### 1.7. Quản lý Người dùng (Users)
- `GET /api/v1/courses/instructors`: Lấy danh sách giảng viên phân trang (Đã tích hợp API, Hook và đổ dữ liệu vào Dropdown chọn Giảng viên trong Form Tạo Khóa học).

---

## 2. Các API và Tính năng CÒN THIẾU (Cần bổ sung)

Mặc dù UI Frontend đã được thiết kế sẵn (thậm chí dùng Mock Data để dựng trước), nhưng để hệ thống chạy "End-to-End" với Backend thật, chúng ta cần giải quyết các lỗ hổng sau:

### 2.1. Phía Backend (BE cần cung cấp thêm API)
> **Đây là những API mang tính chất chặn (blocker), nếu không có thì luồng nghiệp vụ bị đứt gãy.**

1. **API Quản lý Nhóm (Teams) trong Khóa học:**
   - Thiếu: `GET /api/v1/courses/{courseId}/teams` (Lấy danh sách nhóm trong 1 khóa học).
   - Thiếu: `POST /api/v1/courses/{courseId}/teams` (Tạo nhóm mới / Tự động tạo nhóm).
   - Thiếu: `POST /api/v1/courses/{courseId}/teams/{teamId}/members` (Thêm sinh viên vào nhóm).
   - Thiếu: `DELETE /api/v1/courses/{courseId}/teams/{teamId}/members/{studentId}` (Xóa sinh viên khỏi nhóm).
   - Thiếu: `PATCH /api/v1/courses/{courseId}/teams/{teamId}/leader` (Gán/Chọn Leader).
   - *Hiện trạng:* Đã có API lấy `members` của 1 team cụ thể (`GET /api/v1/courses/{courseId}/teams/{teamId}/members`), nhưng chưa có API để lấy ra danh sách các `teamId` thuộc về `courseId` đó. Do vậy giao diện Tích hợp Dự án phải mock cứng ID là `"project-123"`.

3. **Master Data - Cập nhật và Xóa (PUT / DELETE):**
   - Hiện tại Master Data (Subject, Course, Class, Semester) mới chỉ có API Tạo mới (`POST`) và Xem chi tiết (`GET`).
   - Thiếu: `PUT /api/v1/{resource}/{id}` (Cập nhật thông tin).
   - Thiếu: `DELETE /api/v1/{resource}/{id}` (Xóa, hoặc đổi status sang vô hiệu hóa).

4. **Tìm kiếm Course/Class bằng Keyword:**
   - Các API List (như `GET /api/v1/courses`) cần bổ sung param `?keyword=...` để thanh Search của Frontend có thể hoạt động.

5. **Quản lý Thông tin Cá nhân (User Profile):**
   - Thiếu: `PUT /api/auth/me` hoặc API tương đương để cập nhật thông tin cá nhân (Avatar, số điện thoại, mật khẩu).

6. **LỖI NGHIÊM TRỌNG: Luồng OAuth Callback (GitHub/Jira):**
   - Hiện trạng: Khi sinh viên bấm "Liên kết GitHub" hoặc "Jira", Frontend gọi đến API `GET /api/me/integrations/github/connect`. Trình duyệt chuyển sang trang ủy quyền của GitHub/Jira. Sau khi user đồng ý, GitHub/Jira redirect về Callback của Backend (vd: `GET /api/me/integrations/github/callback`).
   - Lỗi Backend: Backend đang xử lý Callback và trả về trực tiếp chuỗi JSON (`IdentityConnectionResponse`) với status 200 OK ngay trên trình duyệt (như hình sinh viên gửi).
   - Yêu cầu Backend sửa: Backend PHẢI redirect (Mã HTTP 302 Found) người dùng trở lại đường dẫn của Frontend (ví dụ: `http://localhost:3000/student/settings?status=success`) sau khi lưu xong mapping, chứ không được in JSON thô ra màn hình.
   - Note thêm về Jira: App Jira do Backend tạo trên Atlassian Developer đang ở chế độ "Development", chưa được cấp quyền Public hoặc chưa add email sinh viên vào danh sách tester. Dẫn đến lỗi "You don't have access to this app". Backend cần vào Atlassian để mở quyền.

### 2.2. Phía Frontend (Các hạng mục cần hoàn thiện tiếp)
> **Những tính năng này có thể tự làm hoặc đợi BE làm xong (2.1) rồi mới ráp nối.**

1. **Giao diện Quản lý Cá nhân (Personal Integrations):**
   - Mới có API (`personalIntegrationApi.ts`), chưa có giao diện cho sinh viên tự thao tác (Các nút bấm gọi `window.location.assign` đến `GET /api/me/integrations/jira/connect`).
   - Cần dựng trang: `/student/settings/integrations`.

2. **Giao diện Chọn Nhóm / Danh sách Lớp của Sinh viên:**
   - Trang `/student/page.tsx` hiện tại chỉ đang render tĩnh các Course lưới card. Chưa có luồng Sinh viên chọn lớp -> vào xem mình thuộc nhóm nào -> xem điểm cá nhân.

3. **Tính năng Export Danh sách Sinh viên:**
   - Đã hoàn thành phần Import (gọi api `/import-students`), nhưng chức năng tải file mẫu Template (.csv/.xlsx) vẫn đang chờ chốt định dạng (Schema) với Backend.

4. **Biểu đồ (Dashboards) & Đánh giá Năng lực (Evaluations):**
   - Radar Chart và Timeline trong trang chi tiết Sinh viên đang dùng Mock Data.
   - Các trang Interaction Graph, Heatmap, Metrics (dành cho Admin và Lecturer) chưa được triển khai giao diện.

---
**Kết luận:** 
Phần cốt lõi và khó nhất (Authentication, Tích hợp OAuth, React Query, API Services, Form Validation, Component UI Design) đã hoàn thiện với chất lượng rất cao (Premium UI).
Mục tiêu tiếp theo là làm việc chặt chẽ với team Backend để bổ sung các API về Nhóm/Sinh viên, từ đó kết nối toàn bộ hệ thống lại với nhau.
