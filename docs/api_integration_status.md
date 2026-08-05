# Báo cáo Tình trạng Tích hợp API (SAGA Frontend)

Tài liệu này tổng hợp toàn bộ các API đã được tích hợp thành công trên Frontend, cũng như danh sách các tính năng/API còn thiếu cần bổ sung để hoàn thiện 100% hệ thống SAGA.

## 1. Các API đã được gọi và tích hợp thành công trên Frontend

Dưới đây là danh sách **chi tiết và đầy đủ** các API đã được định nghĩa và sử dụng thực tế trong Frontend (`src/features/*/api/*.ts`), bao gồm các tham số Query, Path và Body để đối chiếu với Swagger của Backend.

### 1.1. Authentication (Xác thực & Phân quyền)
Toàn bộ luồng xác thực (bao gồm bảo mật CSRF) đã hoàn thiện và chạy thực tế.
- `POST /api/auth/login`: Đăng nhập.
- `POST /api/auth/refresh`: Refresh token tự động khi hết hạn.
- `GET /api/auth/csrf`: Lấy CSRF token (Interceptor tự động gán vào header cho mọi API mutate).
- `GET /api/auth/me`: Lấy thông tin User hiện tại (Role, Profile).
- `POST /api/auth/logout`: Đăng xuất.

### 1.2. Master Data (Dữ liệu Hệ thống)
Các trang Quản trị Master Data đã hoàn thiện cả tính năng Xem danh sách (Table, Phân trang) và Tạo mới (Form, Validate bằng Zod).

**Môn học (Subjects):**
- `GET /api/v1/subjects`
  - Query Params: `keyword?: string`, `page?: number`, `size?: number`
  - Response: `Page<Subject>`
- `GET /api/v1/subjects/{id}`
  - Path Param: `id`
  - Response: `Subject`
- `POST /api/v1/subjects`
  - Request Body: `SubjectRequest`
  - Response: `Subject`

**Khóa học (Courses):**
- `GET /api/v1/courses`
  - Query Params: `subjectId?: string`, `semesterId?: string`, `instructorId?: string`, `page?: number`, `size?: number`
  - Response: `Page<Course>`
- `GET /api/v1/courses/{id}`
  - Path Param: `id`
  - Response: `Course`
- `POST /api/v1/courses`
  - Request Body: `CourseRequest`
  - Response: `Course`

**Lớp học (Classes):**
- `GET /api/v1/classes`
  - Query Params: `keyword?: string`, `page?: number`, `size?: number`
  - Response: `Page<Class>`
- `GET /api/v1/classes/{id}`
  - Path Param: `id`
  - Response: `Class`
- `POST /api/v1/classes`
  - Request Body: `ClassRequest`
  - Response: `Class`

**Học kỳ (Semesters):**
- `GET /api/v1/semesters`
  - Query Params: `keyword?: string`, `page?: number`, `size?: number`
  - Response: `Page<Semester>`
- `GET /api/v1/semesters/{id}`
  - Path Param: `id`
  - Response: `Semester`
- `POST /api/v1/semesters`
  - Request Body: `SemesterRequest`
  - Response: `Semester`

### 1.3. Quản lý Dự án Nhóm (Team Projects)
- `POST /api/teams/{teamId}/projects`: Khởi tạo không gian dự án cho một nhóm (Đã tích hợp UI Modal tại `StudentProjectsList`).
  - Path Param: `teamId`
  - Request Body: `CreateTeamProjectRequest`
  - Response: `ProjectResponse`

### 1.4. Tích hợp Dự án (Project Integrations - Jira/GitHub)
Dành cho Leader cấu hình không gian làm việc. Toàn bộ UI (Panel Settings) và Call API đã được thực hiện bằng React Query.
- `GET /api/projects/{projectId}/integrations`: Lấy trạng thái liên kết.
- `POST /api/projects/{projectId}/jira/link`: Liên kết với 1 Project Key của Jira (Body: `JiraProjectLinkRequest`).
- `DELETE /api/projects/{projectId}/jira`: Xóa liên kết Jira.
- `POST /api/projects/{projectId}/github/repositories`: Thêm repository GitHub vào dự án (Body: `GitHubRepositoriesLinkRequest`).
- `DELETE /api/projects/{projectId}/github/repositories/{repoId}`: Xóa repo GitHub khỏi dự án.
- `GET /api/projects/{projectId}/sync-status`: Polling (5s/lần) trạng thái đồng bộ dữ liệu.

*Lưu ý luồng OAuth Connect (Redirect bằng trình duyệt, Backend xử lý Callback):*
- `GET /api/projects/{projectId}/jira/connect`: Redirect sang Jira để ủy quyền (Project OAuth).
- `GET /api/projects/{projectId}/github/install`: Redirect sang GitHub để cài đặt App (Project OAuth).
- `GET /api/integrations/github/setup`: Redirect từ GitHub sau khi setup (Project).
- `GET /api/integrations/github/project/callback`: Webhook/Callback xử lý mã ủy quyền từ GitHub (Project).
- `GET /api/integrations/jira/callback`: Webhook/Callback xử lý mã ủy quyền từ Jira (Global/Project).

### 1.5. Cá nhân & Kiểm duyệt Danh tính (Identity Mappings)
- `GET /api/integrations/identity-mappings`: Lấy danh sách tài khoản liên kết của sinh viên.
  - Query Param: `studentId={uuid}`
  - Response: `IdentityConnectionResponse[]`
- `PATCH /api/integrations/identity-mappings/{mappingId}`: Giảng viên Duyệt hoặc Từ chối tài khoản sinh viên.
  - Path Param: `mappingId`
  - Request Body: `IdentityMappingReviewRequest` (chứa status duyệt)
- `GET /api/me/integrations`: Xem danh sách liên kết cá nhân (Response: `PersonalIntegrationsResponse`).
- `DELETE /api/me/integrations/jira`: Hủy liên kết cá nhân Jira.
- `DELETE /api/me/integrations/github`: Hủy liên kết cá nhân GitHub.

*Lưu ý luồng OAuth Connect Cá nhân (Redirect bằng trình duyệt, Backend xử lý Callback):*
- `GET /api/me/integrations/jira/connect`: Redirect sang Jira để ủy quyền (Personal OAuth).
- `GET /api/me/integrations/github/connect`: Redirect sang GitHub để ủy quyền (Personal OAuth).
- `GET /api/me/integrations/github/callback`: Callback xử lý mã ủy quyền từ GitHub (Personal).

### 1.6. Quản lý Sinh viên & Nhóm (Course Students & Teams)
- `POST /api/v1/courses/{courseId}/import-students`: Import danh sách sinh viên vào khóa học bằng file Excel.
  - Path Param: `courseId`
  - Request Body: `FormData` (multipart/form-data chứa file Excel)
- `GET /api/v1/courses/{courseId}/students`: Lấy danh sách toàn bộ sinh viên của một khóa học.
  - Path Param: `courseId`
  - Query Params: `keyword?: string`, `hasTeam?: string`, `page?: number`, `size?: number`, `sortBy?: string`, `sortDirection?: string`
  - Response: `CourseStudentsResponse`
- `GET /api/v1/courses/{courseId}/teams/{teamId}/members`: Lấy danh sách thành viên của một nhóm.
  - Path Params: `courseId`, `teamId`
  - Query Params: `page?: number`, `size?: number`
  - Response: `Page<TeamMemberResponse>`
- `GET /api/me/courses/{courseId}/team/members`: Lấy thông tin nhóm và danh sách thành viên nhóm của sinh viên đang đăng nhập.
  - Path Param: `courseId`
  - Response: `MyTeamMembersResponse`

### 1.7. Quản lý Người dùng (Users)
- `GET /api/v1/courses/instructors`: Lấy danh sách giảng viên phân trang (Cho dropdown Form Tạo Khóa học).
  - Query Params: `keyword?: string`, `sortBy?: string`, `sortDirection?: string`, `page?: number`, `size?: number`
  - Response: `Page<InstructorResponse>`

### 1.8. Luồng Xử lý Callback OAuth mới (Jira/GitHub)
Toàn bộ luồng nhận ủy quyền từ các nhà cung cấp bên thứ ba (Jira/GitHub) cho cả tài khoản cá nhân và dự án nhóm đã chuyển sang contract mới sử dụng mã trung gian `resultId`.

- **Mở luồng OAuth (Browser Redirection):**
  - Cá nhân Jira: `GET /api/me/integrations/jira/connect`
  - Cá nhân GitHub: `GET /api/me/integrations/github/connect`
  - Dự án Jira: `GET /api/projects/{projectId}/jira/connect`
  - Dự án GitHub: `GET /api/projects/{projectId}/github/install`

- **Trang Callback của Frontend:** `/integrations/callback`
  - Nhận tham số `?resultId=...` từ Backend chuyển hướng về (ví dụ: `http://localhost:3000/integrations/callback?resultId=...`).
  - *Thao tác:* Frontend tự động xóa `resultId` khỏi URL để bảo mật và gửi yêu cầu POST đến API consume bên dưới.

- **API Consume Result:**
  - `POST /api/integrations/callback-results/{resultId}/consume`
    - Path Param: `resultId`
    - Response: `UnifiedCallbackResponse` (Chứa trạng thái `success`, `flow` ("PERSONAL" | "PROJECT"), và kết quả tương ứng lồng bên trong như `identityConnection` (Personal), `jiraAuthorization` (Project Jira), hoặc `gitHubInstallation` (Project GitHub)).

### 1.9. Đánh giá Đóng góp (Contribution Flow)
- `POST /api/v1/teams/{teamId}/contribution-override`: Giảng viên/Admin áp dụng override % đóng góp cho cả lớp ngay lập tức.
- `GET /api/v1/teams/{teamId}/contribution-evaluation`: Lấy kết quả % đóng góp của từng thành viên trong nhóm (Đã gọi nhưng hiện đang thiếu truyền parameter `?sprintId={sprintId}`).

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

### 2.2. Phía Frontend (Các hạng mục cần hoàn thiện tiếp)
> **Những tính năng này có thể tự làm hoặc đợi BE làm xong (2.1) rồi mới ráp nối.**

1. **Giao diện Chọn Nhóm / Danh sách Lớp của Sinh viên:**
   - Trang `/student/page.tsx` hiện tại chỉ đang render tĩnh các Course lưới card. Chưa có luồng Sinh viên chọn lớp -> vào xem mình thuộc nhóm nào -> xem điểm cá nhân.

3. **Cập nhật Thông tin Cá nhân (User Profile):**
   - *Backend đã cung cấp API:* `PUT /api/v1/users/me` (Cập nhật Profile cá nhân) và `PUT /api/v1/users/{userId}` (Cho Admin).
   - *Frontend cần làm:* Tích hợp API này vào form "Cập nhật hồ sơ" trong modal Profile để cho phép đổi mật khẩu, số điện thoại, avatar...


3. **Tính năng Export Danh sách Sinh viên:**
   - Đã hoàn thành phần Import (gọi api `/import-students`), nhưng chức năng tải file mẫu Template (.csv/.xlsx) vẫn đang chờ chốt định dạng (Schema) với Backend.

4. **Biểu đồ (Dashboards) & Đánh giá Năng lực (Evaluations):**
   - Radar Chart và Timeline trong trang chi tiết Sinh viên đang dùng Mock Data.
   - Các trang Interaction Graph, Heatmap, Metrics (dành cho Admin và Lecturer) chưa được triển khai giao diện hoặc chưa nối API thực.

5. **Luồng Đánh giá đóng góp (Contribution Flow) & Peer Review:**
   - Cần bổ sung tham số `sprintId` vào API `getContributionEvaluation` (Trang xem Bảng điểm).
   - Chưa tích hợp API Xem kết quả Peer Review chi tiết (`GET /api/v1/peer-review/team/{teamId}/detail?sprintId={sprintId}`).
   - Chưa tích hợp cụm API Cấu hình & Yêu cầu thay đổi trọng số Slices (`GET /api/v1/courses/{courseId}/contribution-weights`, `POST .../contribution-weight-request`).
   - Chưa tích hợp luồng/UI cho Admin duyệt/từ chối Yêu cầu thay đổi trọng số (`PUT .../decision`).

---
**Kết luận:** 
Phần cốt lõi và khó nhất (Authentication, Tích hợp OAuth, React Query, API Services, Form Validation, Component UI Design) đã hoàn thiện với chất lượng rất cao (Premium UI).
Mục tiêu tiếp theo là làm việc chặt chẽ với team Backend để bổ sung các API về Nhóm/Sinh viên, từ đó kết nối toàn bộ hệ thống lại với nhau.