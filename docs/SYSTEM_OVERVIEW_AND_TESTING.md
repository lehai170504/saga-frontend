# SAGA Frontend - System Overview & Testing Guide

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc tính năng, các luồng tích hợp API mới nhất (đặc biệt là Jira & GitHub Traceability) dành cho **Lecturer Dashboard**, cùng với các kịch bản kiểm thử (Testing) chi tiết để đảm bảo hệ thống hoạt động chính xác.

---

## 1. Tổng quan Hệ thống (System Overview)

Hệ thống **SAGA Frontend** (phân hệ Giảng viên - Lecturer) được thiết kế nhằm giúp Giảng viên theo dõi sát sao tiến độ làm việc, chất lượng đóng góp và tình trạng sức khỏe của từng dự án/nhóm trong lớp học thông qua phương pháp phân tích dữ liệu Agile (Agile Analytics).

### 1.1 Các tính năng cốt lõi (Core Features)
- **Tổng quan Nhóm (Project Dashboard):**
  - **Tiến độ Công việc (Tasks):** Tỷ lệ % hoàn thành, số task hoàn thành/đang làm.
  - **Hoạt động GitHub:** Thống kê tổng số Commits, Pull Requests.
  - **Early Warning Alerts:** Hệ thống cảnh báo tự động các rủi ro (VD: Sinh viên không đóng góp, Task quá hạn).
  - **Sprint Velocity:** Biểu đồ so sánh Điểm Story Points (Kế hoạch vs Hoàn thành) và số lượng Bugs phát sinh qua các Sprints.
- **Traceability (Dòng thời gian & Truy xuất nguồn gốc):**
  - Đồng bộ hoá toàn bộ vòng đời của một tính năng: Từ **Jira Task** ↔ **GitHub Issue** ↔ **GitHub Commit** ↔ **Pull Request**.
  - **Dòng thời gian (Project Traceability View):** Hiển thị toàn bộ lịch sử hoạt động của dự án trên một trục thời gian thống nhất.
  - **Task Traceability:** Hiển thị chi tiết các GitHub Issues, Commits được link với một Jira Task cụ thể.
- **Công việc & Mã nguồn:**
  - Danh sách Task đồng bộ từ Jira.
  - Lịch sử Commit và Danh sách Issues lấy trực tiếp từ GitHub thông qua Backend (không gọi thẳng API bên thứ 3 từ FE).
- **Phân tích Chuyên sâu:**
  - **Biểu đồ Nhiệt (Heatmap):** Tần suất hoạt động theo thời gian.
  - **Mạng Tương Tác (Interaction Graph):** Sơ đồ tương tác giữa các thành viên.
  - **Đánh giá chéo (Peer Review):** Tính toán cổ phần đóng góp (Slices) thông qua các tiêu chí Rubric.

### 1.2 Kiến trúc Tích hợp API mới nhất
Tất cả các API calls đều yêu cầu xác thực bằng `JSESSIONID` qua browser cookie (`credentials: "include"`). FE không tự giữ token.

Các API quan trọng vừa được tích hợp:
1. `GET /api/v1/courses/{courseId}/teams/{teamId}/detail`: Trả về thông tin nhóm kèm theo danh sách `repositories` (có chứa `repositoryId` dạng số thực tế của GitHub).
2. `GET /api/projects/{projectId}/github/issues`: Danh sách Issues (có phân trang, lọc theo state Open/Closed).
3. `GET /api/projects/{projectId}/traceability`: Dòng thời gian của toàn dự án (Timeline events).
4. `GET /api/v1/projects/{projectId}/tasks/{taskId}/traceability`: Chi tiết liên kết của một Task.
5. `GET /api/projects/{projectId}/dashboard-stats`: Thống kê tổng quan (Tasks, Github).
6. `GET /api/v1/courses/{courseId}/students/{studentId}/progress`: Tiến độ của một sinh viên cụ thể.

---

## 2. Hướng dẫn Testing chi tiết (Testing Guide)

Để kiểm thử hiệu quả, người kiểm thử (QA/Dev) cần đóng vai trò là **Giảng viên** và đi qua các luồng (flows) sau đây.

### 2.1 Chuẩn bị (Pre-requisites)
1. Backend đang chạy và đã kết nối thành công với database.
2. FE chạy local ở `http://localhost:3000`.
3. Đăng nhập vào hệ thống bằng tài khoản Giảng viên (Lecturer).
4. Chọn một khoá học (Course) và click vào xem chi tiết một nhóm (Team/Project) **đã có liên kết Jira và GitHub**.

---

### 2.2 Test Kịch bản 1: Thống kê Tổng quan (Dashboard Stats & Alerts)
**Mục tiêu:** Đảm bảo các con số tổng quan và biểu đồ phân tích hiển thị chính xác.

- **Bước 1:** Vào tab `Tổng quan Nhóm` (Tab mặc định).
- **Bước 2 (Kiểm tra Dashboard Stats):**
  - Nhìn vào 2 card trên cùng bên phải. Thẻ **Tiến độ Công việc** phải hiển thị % hoàn thành hợp lý dựa trên số Task (VD: 5/10 task hoàn thành = 50%).
  - Thẻ **Hoạt động GitHub** phải hiển thị số lượng Commits và PRs > 0 (nếu backend có data).
- **Bước 3 (Kiểm tra Sprint Velocity):**
  - Cuộn xuống biểu đồ "Tiến độ Đóng góp theo Sprints".
  - Hover chuột vào các cột để xem Tooltip. Đảm bảo số `Kế hoạch (Points)`, `Hoàn thành (Points)` và `Bugs` khớp với cấu trúc `sprints` từ API `/api/v1/courses/{courseId}/teams/{teamId}/analytics/velocity`.
- **Bước 4 (Kiểm tra Cảnh báo sớm):**
  - Kiểm tra xem tên của Sinh viên có hiển thị dạng Text đọc được không (thay vì UUID), cảnh báo hiển thị đúng mức độ (Đỏ/Vàng).

### 2.3 Test Kịch bản 2: Đồng bộ GitHub (Lịch sử Commit & Issues)
**Mục tiêu:** Kiểm thử chức năng đọc dữ liệu trực tiếp từ GitHub provider ID thông qua Backend.

- **Bước 1:** Chuyển sang tab `Lịch sử Commit (Github)`.
- **Bước 2 (Bộ lọc Repositories):**
  - Click vào dropdown `Chọn repository`. Phải thấy danh sách các repo thực tế mà team đã liên kết.
  - Khi chọn một repo, dropdown `Chọn branch` phải xoay loading và tải ra danh sách các nhánh (VD: `main`, `dev`).
- **Bước 3 (Danh sách Commit):**
  - Chọn branch `main`, danh sách các commit phải hiện ra kèm theo ảnh avatar chữ cái (Initials), tên người commit, ngày tháng chuẩn format Việt Nam, và mã Hash (7 ký tự).
  - Thử bấm nút chuyển trang (Phân trang) để test tính năng Pagination.
- **Bước 4 (Tab Issues):**
  - Chuyển sang tab `Issues (Github)`.
  - Kiểm tra xem các Issue Open có màu 🟢 (Xanh lá) và Closed có màu 🟣 (Tím) hay không.
  - Test nút "Mở liên kết" (Icon Mũi tên ngoài) để xem có dẫn đúng về link Issue trên web GitHub không.

### 2.4 Test Kịch bản 3: Truy xuất nguồn gốc toàn cảnh (Project Traceability)
**Mục tiêu:** Đảm bảo hệ thống gom nhóm được mọi hoạt động Jira và GitHub vào cùng một dòng thời gian.

- **Bước 1:** Chuyển sang tab `Dòng thời gian` (Traceability).
- **Bước 2 (Giao diện Timeline):**
  - Nếu API trả về `truncated: true`, kiểm tra xem có Badge cảnh báo "Chỉ hiển thị X sự kiện gần nhất" trên góc hay không.
  - Kiểm tra dọc theo trục thời gian (đường kẻ dọc bên trái):
    - Sự kiện Jira Task: Icon màu Xanh dương.
    - Sự kiện GitHub Issue: Icon màu Xanh lá.
    - Sự kiện GitHub Commit: Icon màu Vàng cam.
    - Sự kiện Pull Request: Icon màu Tím.
- **Bước 3:** Đọc nội dung sự kiện. Đảm bảo thời gian hiển thị đúng (VD: `14:30 - 12/08/2026`) và có chứa mã của đối tượng (VD: `[SAGA-123] Fix bug login`).

### 2.5 Test Kịch bản 4: Chi tiết Traceability của từng Task (Task Details)
**Mục tiêu:** Kiểm thử tính năng liên kết sâu trong công việc của Jira.

- **Bước 1:** Chuyển sang tab `Công việc (Jira)`.
- **Bước 2:** Click vào dòng của một Task bất kỳ (ưu tiên Task bạn biết chắc chắn là đã được Leader/Manager link với GitHub Issue).
- **Bước 3:** Một cửa sổ (Sheet) sẽ trượt từ bên phải sang hiển thị Chi tiết công việc.
- **Bước 4:**
  - Cuộn xuống dưới cùng của Sheet, tìm mục **"Liên kết GitHub"**.
  - Đảm bảo hiển thị danh sách các Issues (hoặc Commits) đã được map vào Task này. Tương tự như trên, Issue nào Closed sẽ hiện màu Tím, Open hiện Xanh lá.
  - Nếu Task chưa link với gì, mục này sẽ tự động ẩn đi (không hiển thị lỗi).

---

## 3. Các lưu ý khi Debug/Troubleshooting
1. **Lỗi Không hiện tab "Dòng thời gian" hoặc rỗng:**
   - Kiểm tra `Network` tab xem `/api/projects/{projectId}/traceability` trả về mã 200 hay 4xx/5xx.
   - Nếu trả về rỗng, có nghĩa là Backend chưa sync xong hoặc Project này thực sự chưa có dữ liệu Traceability.
2. **Lỗi 401/403 (Unauthorized):**
   - Phiên đăng nhập (Session JSESSIONID) có thể đã hết hạn. Hãy F5 hoặc đăng nhập lại. 
   - Kiểm tra xem FE có truyền đúng `credentials: "include"` trong config Axios chưa (đã cấu hình chuẩn trong `src/lib/axios.ts`).
3. **Hiển thị "Chưa có dự án" hoặc "Chưa có GitHub Repo":**
   - Điều này là do sinh viên (Leader nhóm) chưa thiết lập tích hợp (Integration) trên hệ thống. Giảng viên chỉ cần yêu cầu sinh viên vào setup là sẽ có data.

---

## 4. Phân hệ Sinh viên (Student Role) - Hướng dẫn Kiểm thử

Sinh viên là những người trực tiếp thao tác và tạo ra dữ liệu trên SAGA thông qua việc cấu hình kết nối Jira/GitHub và cập nhật trạng thái công việc. Tuỳ thuộc vào vai trò (Leader/Member) mà quyền hạn sẽ khác nhau.

### 4.1 Tính năng cốt lõi (Core Features)
- **Thiết lập Tích hợp (Integrations - Dành cho Leader):** 
  - Khai báo Jira Project URL, nhập API Token.
  - Liên kết GitHub Repositories vào SAGA.
- **Quản lý Traceability (Link/Unlink):**
  - Thực hiện liên kết (Link) thủ công một Jira Task với một hoặc nhiều GitHub Issues/PRs.
  - Tuỳ chọn ngắt liên kết (Unlink) nếu có sai sót.
- **Đánh giá Chéo (Peer Review):**
  - Chấm điểm (Rate) các thành viên khác trong Sprint dựa trên Rubric.
  - Xem báo cáo Slices và mức độ cống hiến cá nhân.
- **Tiến độ Cá nhân (My Progress):**
  - Xem thống kê các Task được giao, biểu đồ tương tác của bản thân trong nhóm.

### 4.2 Kịch bản Testing (Student Role)

**Pre-requisites:** Đăng nhập bằng tài khoản Sinh viên. Đã tham gia vào một Nhóm (Team) trong một Khoá học.

- **Kịch bản 1: Cấu hình Project (Leader Only)**
  - Chuyển role hoặc dùng tài khoản Leader. Vào phần **Cài đặt Dự án (Settings)**.
  - Nhập Jira Config, click Save -> Nhận thông báo thành công.
  - Tìm và chọn GitHub Repo tương ứng, click Add -> Nhận thông báo thành công.
- **Kịch bản 2: Thực hiện Link Task ↔ Issue**
  - Vào tab **Công việc (Jira)** của sinh viên. Mở chi tiết 1 Task.
  - Click nút **Liên kết Issue**. Một modal/pop-over sẽ hiện ra yêu cầu chọn Issue.
  - Nhập ID hoặc chọn Issue từ danh sách, bấm Xác nhận (Gọi API `POST /api/v1/projects/{projectId}/tasks/{taskId}/github-issues/{issueId}`).
  - F5 lại trang, kiểm tra phần *Traceability* ở dưới cùng xem Issue đã xuất hiện màu Xanh (Linked) chưa.
  - Click **Unlink (Gỡ liên kết)** -> Gọi API `DELETE`, Issue biến mất khỏi danh sách.
- **Kịch bản 3: Peer Review (Đánh giá Sprint)**
  - Chuyển sang phần Đánh giá Sprint. Chọn một Sprint đang diễn ra.
  - Rate các thành viên khác bằng số sao hoặc form rubric. Đảm bảo submit thành công và hệ thống ghi nhận.

---

## 5. Phân hệ Quản trị (Admin Role) - Hướng dẫn Kiểm thử

Quản trị viên có nhiệm vụ duy trì hệ thống, quản lý tài nguyên máy chủ, cấu hình khoá học và quản lý danh sách Giảng viên/Sinh viên trên toàn trường.

### 5.1 Tính năng cốt lõi (Core Features)
- **Quản lý Tổ chức (Organizations & Courses):**
  - Tạo khoá học (Course) mới, upload danh sách sinh viên qua file Excel.
  - Phân công Giảng viên phụ trách lớp.
- **Quản lý Thông tin Hệ thống (System Dashboard):**
  - Xem tổng số lượng Users, Courses, Projects đang hoạt động.
  - Cấu hình chung cho toàn SAGA (System Settings).
- **Quản lý Người dùng (Users Management):**
  - Khoá/Mở khoá tài khoản (Ban/Unban).
  - Reset mật khẩu cho Sinh viên/Giảng viên khi có yêu cầu.

### 5.2 Kịch bản Testing (Admin Role)

**Pre-requisites:** Đăng nhập bằng tài khoản Administrator (`ROLE_ADMIN`).

- **Kịch bản 1: Import Sinh Viên & Tạo Lớp Học**
  - Vào phần **Quản lý Khoá học (Course Management)**.
  - Nhấn tạo mới một Khoá học. Điền đầy đủ thông tin: Mã lớp, Tên môn học.
  - Dùng tính năng *Import Excel*, upload danh sách sinh viên mẫu. Kiểm tra màn hình Preview xem các trường (Tên, Mã SV, Email) có bị lỗi font hay map sai cột không.
  - Bấm *Confirm Import*, kiểm tra danh sách sinh viên đã vào khoá học thành công.
- **Kịch bản 2: Phân công Giảng viên**
  - Trong cấu hình chi tiết Khoá học, chọn **Assign Lecturer**.
  - Tìm kiếm tài khoản Giảng viên và gán vào lớp.
  - Đăng nhập bằng tài khoản Giảng viên đó -> Đảm bảo Giảng viên thấy được lớp vừa gán.
- **Kịch bản 3: Giám sát Hệ thống (Monitoring)**
  - Vào **Admin Dashboard**.
  - Quan sát các biểu đồ: Số lượng Project tích cực (Active Projects), số lượng Issue/Commit được sync trong tuần.
  - Đảm bảo các con số hiển thị tức thời (tương đương với dữ liệu trong database Admin).
