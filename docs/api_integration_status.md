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
- `PUT /api/v1/subjects/{id}`
  - Path Param: `id`
  - Request Body: `SubjectRequest`
  - Response: `Subject`
- `DELETE /api/v1/subjects/{id}`
  - Path Param: `id`
  - Response: `void`

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
- `PUT /api/v1/classes/{id}`
  - Path Param: `id`
  - Request Body: `ClassRequest`
  - Response: `Class`
- `DELETE /api/v1/classes/{id}`
  - Path Param: `id`
  - Response: `void`

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
- `GET /api/projects/{projectId}`: Lấy chi tiết thông tin dự án (tên đề tài, mô tả, ngày tạo).
  - Path Param: `projectId`
  - Response: Chi tiết dự án (`name`, `description`, v.v.)
- `PUT /api/projects/{projectId}`: Cập nhật thông tin đề tài dự án (tên đề tài, mô tả).
  - Path Param: `projectId`
  - Request Body: `{ name: string; description: string | null }`
  - Response: `ProjectResponse`


### 1.4. Tích hợp Dự án (Project Integrations - Jira/GitHub)
Dành cho Leader cấu hình không gian làm việc. Toàn bộ UI (Panel Settings) và Call API đã được thực hiện bằng React Query.
- `GET /api/projects/{projectId}/integrations`: Lấy trạng thái liên kết.
- `POST /api/projects/{projectId}/jira/link`: Liên kết với 1 Project Key của Jira (Body: `JiraProjectLinkRequest`).
- `DELETE /api/projects/{projectId}/jira`: Xóa liên kết Jira.
- `POST /api/projects/{projectId}/github/repositories`: Thêm repository GitHub vào dự án (Body: `GitHubRepositoriesLinkRequest`).
- `DELETE /api/projects/{projectId}/github/repositories/{repoId}`: Ngắt kết nối repo GitHub khỏi dự án.
- `POST /api/projects/{projectId}/github/repositories/{repositoryId}/connect`: Kết nối lại repository GitHub (cho repo có trạng thái DISCONNECTED/DEGRADED).
- `GET /api/projects/{projectId}/sync-status`: Polling (5s/lần) trạng thái đồng bộ dữ liệu.
- `POST /api/projects/{projectId}/sync`: Kích hoạt tiến trình đồng bộ thủ công dữ liệu dự án từ Jira và GitHub (Response 202 Accepted).
- `GET /api/projects/{projectId}/github/repositories/{repositoryId}/branches`: Lấy danh sách nhánh GitHub của một repository.
  - Path Params: `projectId`, `repositoryId`
- `GET /api/projects/{projectId}/github/repositories/{repositoryId}/commits`: Lấy lịch sử commit theo nhánh GitHub (hỗ trợ phân trang và filter branch).
  - Path Params: `projectId`, `repositoryId`
  - Query Params: `branch` (URL-encoded), `page`, `size`


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

### 1.9. Đánh giá % Đóng góp (Lecturer Contribution)
Dành cho giảng viên xem và ghi đè phần trăm đóng góp của sinh viên trong nhóm.
- `GET /api/v1/teams/{teamId}/contribution-evaluation`: Xem chi tiết phần trăm đóng góp của từng thành viên trong nhóm dựa trên điểm Task và Peer Review.
  - Path Param: `teamId`
  - Response: `ContributionEvaluationResponse` (có chứa breakdown cho Code, Doc, Design, Cảnh báo AI, v.v.)
- `POST /api/v1/teams/{teamId}/contribution-override`: Ghi đè phần trăm đóng góp cuối cùng cho nhóm.
  - Path Param: `teamId`
  - Request Body: `ContributionOverrideRequest`
  - Response: Kết quả cập nhật phần trăm.
- `GET /api/v1/courses/contribution-slice-weight-requests`: Admin xem toàn bộ danh sách yêu cầu thay đổi trọng số Slices trên toàn hệ thống (Đã tích hợp).
- `PUT /api/v1/courses/contribution-slice-weight-requests/{requestId}/decision`: Admin Duyệt hoặc Từ chối yêu cầu thay đổi trọng số (Đã tích hợp).

### 1.10. Lecturer Analytics (Biểu đồ & Thống kê)
Toàn bộ các API phân tích dữ liệu cho giảng viên đã được cấu hình và gọi thành công trong `src/features/lecturer/api/analyticsApi.ts`:
- `GET /api/v1/courses/{courseId}/teams/{teamId}/detail`: Lấy chi tiết Team (project, members).
- `GET /api/v1/courses/{courseId}/students/{studentId}/progress`: Tiến độ công việc (Task completion).
- `GET /api/v1/courses/{courseId}/students/{studentId}/activities`: Hoạt động gần đây (Commit, Docs).
- `GET /api/v1/courses/{courseId}/students/{studentId}/contribution-detail`: Chi tiết điểm đóng góp cá nhân.
- `GET /api/v1/courses/{courseId}/early-warnings`: Danh sách cảnh báo sớm (OVERDUE_TASK).
- `GET /api/v1/courses/{courseId}/teams/{teamId}/interactions`: Dữ liệu cho đồ thị tương tác Node-Edge.
- `GET /api/v1/courses/{courseId}/teams/{teamId}/heatmap`: Dữ liệu cho biểu đồ nhiệt (Heatmap).
- `GET /api/v1/courses/{courseId}/teams/{teamId}/sprints/velocity`: Vận tốc làm việc theo Sprint.

### 1.11. Quản lý Sprints & Đánh giá chéo (Sprints & Peer Review)
- `GET /api/v1/projects/{projectId}/sprints`: Lấy danh sách Sprint của dự án phục vụ hiển thị Timeline và Backlog.
- `POST /api/v1/projects/{projectId}/sprints`: Tạo Sprint mới và đồng bộ trực tiếp lên Jira (yêu cầu gửi kèm `Idempotency-Key` ở Header).
- `PUT /api/v1/projects/{projectId}/sprints/{sprintId}`: Cập nhật thông tin Sprint (Tên, Mục tiêu, Ngày bắt đầu/kết thúc).
- `POST /api/v1/projects/{projectId}/sprints/{sprintId}/start`: Bắt đầu kích hoạt Sprint.
- `POST /api/v1/projects/{projectId}/sprints/{sprintId}/close`: Đóng Sprint hoàn thành.
- `DELETE /api/v1/projects/{projectId}/sprints/{sprintId}`: Xóa Sprint đồng bộ trên Jira.
- `GET /api/v1/teams/{teamId}/sprints`: Lấy danh sách Sprint của một nhóm.
- `GET /api/v1/teams/{teamId}/sprints/{sprintId}/peer-reviews`: Đọc lịch sử đánh giá Peer Review của nhóm trong một Sprint. Hook `useTeamSprintReviews` gọi endpoint này và trả về `reviews: PeerReviewItem[]` (bao gồm `createdAt`, `revieweeId`, `starRating`, `comment`). Frontend dùng để hiển thị timestamp đánh giá (`dd-mm-yyyy`) trên card thành viên trong `StudentSprintDetailsView`.
- `GET /api/v1/teams/{teamId}/peer-review-rubric`: Lấy Rubric đánh giá chéo được thiết lập riêng cho nhóm.
- `GET /api/v1/teams/{teamId}/sprints/{sprintId}/peer-reviews/candidates`: Lấy danh sách ứng viên (các thành viên cùng nhóm) để đánh giá chéo. Response `ReviewCandidate` bao gồm: `alreadyReviewed`, `existingTotalStarRating`, `existingCreatedAt` (ngày đánh giá dự phòng).
- `POST /api/v1/teams/{teamId}/sprints/{sprintId}/peer-reviews`: Gửi đánh giá chéo cho một thành viên trong nhóm.
- `GET /api/v1/peer-review-rubrics/default`: Lấy cấu hình Rubric đánh giá chéo chuẩn của toàn trường.
- `GET /api/v1/courses/contribution-slice-weights`: Lấy trọng số đóng góp của một khóa học.
- `POST /api/v1/courses/{courseId}/contribution-slice-weight-requests`: Gửi yêu cầu thay đổi trọng số (Lecturer).

### 1.12. Quản lý công việc (Jira Tasks)
Toàn bộ luồng quản lý công việc và hiển thị Kanban Board của nhóm sinh viên đã được tích hợp đầy đủ:
- `GET /api/v1/projects/{projectId}/tasks`: Lấy danh sách nhiệm vụ của dự án (hỗ trợ filter `keyword`, `sprintId`, `assigneeId`, `status`, phân trang, và giới hạn size tối đa 100). Response bao gồm field `labels: string[]` — hiển thị dưới dạng chips màu primary trên Board Card, Backlog Row và Task Detail Modal.
- `GET /api/v1/projects/{projectId}/tasks/{taskId}`: Lấy chi tiết một nhiệm vụ (bao gồm `labels[]`).
- `POST /api/v1/projects/{projectId}/tasks`: Tạo công việc mới đồng bộ trực tiếp lên Jira (yêu cầu gửi kèm `Idempotency-Key` ở Header). Giao diện hỗ trợ truyền `issueTypeId` và `priorityId` để xử lý phân giải dữ liệu. Field `labels` hỗ trợ nhập chuỗi phân cách bằng dấu phẩy.
- `PUT /api/v1/projects/{projectId}/tasks/{taskId}`: Cập nhật thông tin chi tiết công việc đồng bộ trực tiếp lên Jira (yêu cầu gửi kèm `Idempotency-Key` ở Header). Hỗ trợ truyền `priority`, `priorityId`, `priorityName` để tránh lỗi DTO rỗng. Hỗ trợ cập nhật `labels[]`.
- `DELETE /api/v1/projects/{projectId}/tasks/{taskId}`: Xóa/Ngắt kết nối công việc đồng bộ trực tiếp trên Jira (yêu cầu gửi kèm `Idempotency-Key` ở Header).
- `PUT /api/v1/projects/{projectId}/tasks/{taskId}/sprint`: Gán công việc vào Sprint (Body: `{ sprintId }`) hoặc chuyển về Backlog (Body: `{ backlog: true }`).
- `PUT /api/v1/projects/{projectId}/tasks/{taskId}/assignee`: Phân công/Bỏ phân công người thực hiện công việc (Body: `{ assigneeId }` hoặc `{ unassign: true }`).
- `PUT /api/v1/projects/{projectId}/tasks/{taskId}/estimation`: Cập nhật Story Points cho công việc (Body: `{ value: number }`).
- `GET /api/v1/projects/{projectId}/tasks/{taskId}/transitions`: Lấy danh sách các trạng thái hợp lệ có thể chuyển đổi cho công việc.
- `POST /api/v1/projects/{projectId}/tasks/{taskId}/transitions`: Chuyển đổi trạng thái (Transition) của công việc trên bảng Kanban (yêu cầu gửi kèm `Idempotency-Key` ở Header).

### 1.13. Tích hợp GitHub — Lọc Repository theo trạng thái
Dropdown chọn Repository trong trang **Lịch sử Commit** đã được cập nhật để chỉ hiển thị các repository có trạng thái `ACTIVE`. Các repository `DISCONNECTED` hoặc `DEGRADED` bị loại khỏi danh sách lựa chọn (lọc tại `useMemo` trong `student-commits-view.tsx`).

### 1.14. Thống kê Tổng quan Dự án (Project Dashboard Stats)
- `GET /api/projects/{projectId}/dashboard-stats`: Xem thống kê tổng quan dự án (tổng số task, số task đã hoàn thành, chưa hoàn thành, tỉ lệ %, số repository GitHub, số commit, số pull request). Hook `useProjectDashboardStats` tích hợp hiển thị giao diện trang **Thống kê dự án** (`StudentProjectStatsView`) với biểu đồ Donut & Bar Chart của Recharts.

### 1.15. Thông báo & Firebase Push Notifications (Notification & Firebase)
Toàn bộ luồng thông báo quả chuông và đẩy tín hiệu Push Notification qua Firebase Web SDK đã được tích hợp chuẩn theo hợp đồng Handoff:
- `GET /api/me/notifications?page=0&size=20`: Lấy danh sách thông báo phân trang của người dùng hiện tại (ADMIN / LECTURER / STUDENT).
- `GET /api/me/notifications/unread-count`: Lấy số lượng thông báo chưa đọc hiển thị badge đỏ tại icon quả chuông ở Header.
- `PATCH /api/me/notifications/{id}/read`: Đánh dấu một thông báo là đã đọc khi người dùng click xem.
- `POST /api/me/firebase-installations`: Đăng ký Firebase Installation ID (FID) của trình duyệt lên backend để nhận Push Signal (tự động gọi sau khi nạp session user & CSRF thành công).
- `DELETE /api/me/firebase-installations/{id}`: Thu hồi đăng ký thiết bị Firebase khi người dùng đăng xuất.
- `POST /api/admin/notifications/broadcast`: Admin gửi thông báo broadcast toàn hệ thống (yêu cầu gửi kèm `Idempotency-Key` ở Header).
- `POST /api/v1/courses/notifications/broadcast`: Giảng viên gửi thông báo broadcast cho sinh viên trong khóa học quản lý (yêu cầu gửi kèm `Idempotency-Key` ở Header).

### 1.16. Tích hợp GitHub Repositories, GitHub Issues & Traceability (Task ↔ Issue)
Đã cập nhật theo hợp đồng API mới nhất của Backend (`FRONTEND_HANDOFF.md` & `FRONTEND_API_INTEGRATION.md`):
- `GET /api/v1/courses/{courseId}/teams/{teamId}/detail`: Dữ liệu `project` trả thêm danh sách `repositories: [{ repositoryId, repositoryName }]` trong đó `repositoryId` dạng `number/int64`. FE cho phép chọn repository linh hoạt (không mặc định `repositories[0]`).
- Dùng `repositoryId` (number) trực tiếp cho các API:
  - `GET /api/projects/{projectId}/github/repositories/{repositoryId}/branches`
  - `GET /api/projects/{projectId}/github/repositories/{repositoryId}/commits`
  - `GET /api/projects/{projectId}/github/issues?repositoryId={repositoryId}`
- `GET /api/projects/{projectId}/github/issues`: Danh sách GitHub Issues (hỗ trợ `state`: `OPEN`/`CLOSED`, `repositoryId` filter, `keyword` search, `page`, `size`, `assignedToMe`). Hook `useGithubIssues`.
- `GET /api/projects/{projectId}/github/issues/{issueId}`: Chi tiết một GitHub Issue bằng local Issue ID. Hook `useGithubIssueDetail`.
- `POST /api/v1/projects/{projectId}/tasks/{taskId}/github-issues/{issueId}`: Tạo liên kết Jira Task với GitHub Issue (yêu cầu gửi kèm `Idempotency-Key` ở Header). Hook `useLinkTaskIssue`.
- `DELETE /api/v1/projects/{projectId}/tasks/{taskId}/github-issues/{issueId}`: Hủy liên kết Jira Task với GitHub Issue (yêu cầu gửi kèm `Idempotency-Key` ở Header). Hook `useUnlinkTaskIssue`.
- `GET /api/v1/projects/{projectId}/tasks/{taskId}/traceability`: Đọc ma trận Traceability của 1 Task. Hook `useTaskTraceability`.
- `GET /api/projects/{projectId}/traceability`: Đọc ma trận Traceability của toàn bộ Dự án. Hook `useProjectTraceability`.

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

2. **Master Data - Cập nhật và Xóa (PUT / DELETE):**
   - Đã tích hợp thành công Cập nhật (`PUT`) và Xóa (`DELETE`) cho **Môn học (Subject)** và **Lớp học (Class)**.
   - Vẫn còn thiếu API PUT/DELETE cho **Khóa học (Course)** và **Học kỳ (Semester)** từ phía Backend.

3. **Tìm kiếm Course/Class bằng Keyword:**
   - Các API List (như `GET /api/v1/courses`) cần bổ sung param `?keyword=...` để thanh Search của Frontend có thể hoạt động.


### 2.2. Phía Frontend (Các hạng mục cần hoàn thiện tiếp)
> **Những tính năng này có thể tự làm hoặc đợi BE làm xong (2.1) rồi mới ráp nối.**

1. **Giao diện Quản lý Cá nhân (Personal Integrations):**
   - Mới có API (`personalIntegrationApi.ts`), chưa có giao diện cho sinh viên tự thao tác (Các nút bấm gọi `window.location.assign` đến `GET /api/me/integrations/jira/connect`).
   - Cần dựng trang: `/student/settings/integrations`.

2. **Giao diện Chọn Nhóm / Danh sách Lớp của Sinh viên:**
   - Trang `/student/page.tsx` hiện tại chỉ đang render tĩnh các Course lưới card. Chưa có luồng Sinh viên chọn lớp -> vào xem mình thuộc nhóm nào -> xem điểm cá nhân.

3. **Cập nhật Thông tin Cá nhân (User Profile):**
   - *Backend đã cung cấp API:* `PUT /api/v1/users/me` (Cập nhật Profile cá nhân) và `PUT /api/v1/users/{userId}` (Cho Admin).
   - *Frontend cần làm:* Tích hợp API này vào form "Cập nhật hồ sơ" trong modal Profile để cho phép đổi mật khẩu, số điện thoại, avatar...


3. **Tính năng Export Danh sách Sinh viên:**
   - Đã hoàn thành phần Import (gọi api `/import-students`), nhưng chức năng tải file mẫu Template (.csv/.xlsx) vẫn đang chờ chốt định dạng (Schema) với Backend.

4. **Biểu đồ (Dashboards) & Đánh giá Năng lực (Evaluations):**
   - Radar Chart và Timeline trong trang chi tiết Sinh viên đang dùng Mock Data.
   - Các trang Interaction Graph, Heatmap, Metrics (dành cho Admin và Lecturer) đã được BE cung cấp API nhưng FE chưa triển khai đầy đủ giao diện.

---
**Kết luận:** 
Phần cốt lõi và khó nhất (Authentication, Tích hợp OAuth, React Query, API Services, Form Validation, Component UI Design) đã hoàn thiện với chất lượng rất cao (Premium UI).
Mục tiêu tiếp theo là làm việc chặt chẽ với team Backend để bổ sung các API về Nhóm/Sinh viên, từ đó kết nối toàn bộ hệ thống lại với nhau.