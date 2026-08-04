# Danh sách các API bị thiếu cho Quản lý Dự án và Tích hợp (Jira/GitHub)

Tài liệu này tổng hợp lại các API liên quan đến quản lý dự án (Project Management) và tích hợp công cụ (Jira / GitHub) hiện tại **chưa có** hoặc **chưa hoàn thiện** từ phía Backend, gây ảnh hưởng đến việc triển khai luồng cấu hình dự án nhóm của sinh viên trên Frontend.

---

## 1. Quản lý Dự án Nhóm (Group Project Management)

Hiện tại, Frontend mới chỉ có API tạo dự án thông qua Team (`POST /api/teams/{teamId}/projects`) và xem danh sách tích hợp. Hệ thống vẫn đang thiếu các API CRUD cơ bản để vận hành dự án độc lập.

**Danh sách API cần bổ sung:**
* **Chi tiết Dự án:**
  * `GET /api/projects/{projectId}` (Xem thông tin chi tiết của dự án bao gồm tên, mô tả, ngày tạo, team sở hữu).
  * *Lý do:* Phục vụ hiển thị thông tin dự án độc lập trên trang cấu hình hoặc quản trị của giảng viên mà không cần đi vòng qua API lấy thành viên nhóm.
* **Cập nhật Dự án:**
  * `PUT /api/projects/{projectId}` (Chỉnh sửa tên dự án, mô tả đề tài).
  * *Lý do:* Trưởng nhóm (Leader) cần cập nhật lại thông tin đề tài khi có yêu cầu thay đổi từ phía giảng viên hướng dẫn.
* **Xóa/Hủy bỏ Dự án:**
  * `DELETE /api/projects/{projectId}` (Xóa vĩnh viễn dự án hoặc hủy kích hoạt).
  * *Lý do:* Cho phép nhóm sinh viên reset hoặc đổi đề tài khác để cấu hình tích hợp lại từ đầu.

---

## 2. Đồng bộ & Quản lý Task/Sprint Jira

Mặc dù luồng liên kết dự án với Jira đã hoàn thành, hệ thống vẫn thiếu cơ chế tương tác trực tiếp đối với tiến trình đồng bộ và quản lý Task/Sprint.

**Danh sách API cần bổ sung:**
* **Kích hoạt đồng bộ Jira thủ công:**
  * `POST /api/projects/{projectId}/jira/sync`
  * *Lý do:* Cho phép sinh viên bấm nút "Đồng bộ ngay" để ép hệ thống tải ngay lập tức các Task, Issue, Sprint vừa mới cập nhật trên Jira về SAGA.
* **Xem lịch sử đồng bộ Jira:**
  * `GET /api/projects/{projectId}/jira/sync-jobs`
  * *Lý do:* Trả về danh sách nhật ký các lần quét để kiểm tra trạng thái và xử lý lỗi kết nối.
* **Quản lý Sprints của Dự án (Jira Sprints CRUD):**
  * `GET /api/projects/{projectId}/jira/sprints` (Xem danh sách các Sprint).
  * `POST /api/projects/{projectId}/jira/sprints` (Tạo Sprint mới).
  * `PUT /api/projects/{projectId}/jira/sprints/{sprintId}` (Cập nhật thông tin Sprint).
  * `DELETE /api/projects/{projectId}/jira/sprints/{sprintId}` (Xóa Sprint).
  * *Lý do:* Hỗ trợ lập kế hoạch và quản lý Sprint trực tiếp trên SAGA (đồng bộ 2 chiều với Jira).
* **Quản lý Tasks của Dự án (Jira Tasks CRUD):**
  * `GET /api/projects/{projectId}/jira/tasks` (Xem danh sách các Task).
  * `POST /api/projects/{projectId}/jira/tasks` (Tạo Task mới).
  * `PUT /api/projects/{projectId}/jira/tasks/{taskId}` (Cập nhật Task: chuyển cột Kanban, sửa mô tả, Story Point, gán người thực hiện).
  * `DELETE /api/projects/{projectId}/jira/tasks/{taskId}` (Xóa Task).
  * *Lý do:* Phục vụ hiển thị và kéo thả trạng thái trên Bảng Kanban (Kanban Board) của SAGA.

---

## 3. Đồng bộ & Quản lý Code/Branch GitHub

Tương tự như Jira, luồng tích hợp GitHub cũng cần cung cấp các API để truy xuất và quản lý dữ liệu kho lưu trữ sâu hơn.

**Danh sách API cần bổ sung:**
* **Kích hoạt đồng bộ GitHub thủ công:**
  * `POST /api/projects/{projectId}/github/sync`
  * *Lý do:* Cho phép sinh viên đồng bộ tức thì toàn bộ Commit, Pull Request vừa được push lên kho lưu trữ GitHub về hệ thống.
* **Xem lịch sử đồng bộ GitHub:**
  * `GET /api/projects/{projectId}/github/sync-jobs`
  * *Lý do:* Hiển thị lịch sử đồng bộ code để hỗ trợ debug khi xảy ra lỗi tích hợp Git.
* **Lấy danh sách các Branch (Nhánh) của Repository:**
  * `GET /api/projects/{projectId}/github/repositories/{repoId}/branches`
  * *Lý do:* Cho phép lọc xem lịch sử commit và đóng góp code theo từng nhánh (ví dụ: `main`, `dev`, `feature/*`).
* **Lấy danh sách Commits từ một Branch cụ thể:**
  * `GET /api/projects/{projectId}/github/repositories/{repoId}/branches/{branchName}/commits`
  * *Lý do:* Phục vụ trang Lịch sử Commits của sinh viên, hiển thị danh sách các commit, tác giả, tin nhắn commit (commit message) và thời gian thực hiện.
* **Kết nối lại Repository bị ngắt (Reconnect GitHub Repository):**
  * `POST /api/projects/{projectId}/github/repositories/{repositoryId}/connect`
  * *Lý do:* Khi một repository chuyển sang trạng thái `DISCONNECTED`, sinh viên có thể nhấn nút "Kết nối lại" để khôi phục trạng thái kết nối trực tiếp thay vì phải xóa và cài đặt lại từ đầu.

---

## 4. Tùy chọn Hợp nhất API Đồng bộ (Alternative Unified Sync API)

> [!TIP]
> Để tinh gọn tài nguyên và số lượng endpoint, Backend có thể hợp nhất luồng đồng bộ thủ công của cả Jira và GitHub thành một endpoint duy nhất:

* **Endpoint:** `POST /api/projects/{projectId}/sync`
* **Query Parameter:** `?provider=JIRA` hoặc `?provider=GITHUB` (Nếu để trống thì sẽ đồng bộ đồng thời cả hai).
* **Nghiệp vụ:** Kích hoạt tiến trình quét dữ liệu thủ công cho dự án.
