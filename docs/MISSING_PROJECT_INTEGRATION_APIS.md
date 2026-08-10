# Danh sách các API bị thiếu cho Quản lý Dự án và Tích hợp (Jira/GitHub)

Tài liệu này tổng hợp lại các API liên quan đến quản lý dự án (Project Management) và tích hợp công cụ (Jira / GitHub) hiện tại **hoàn toàn chưa có đặc tả kỹ thuật** (chưa định nghĩa trong tài liệu tích hợp chung lẫn mã nguồn Frontend) từ phía Backend, cần yêu cầu Backend thiết lập và bổ sung.

---
## 1. Đồng bộ & Quản lý Task/Sprint Jira

* **Kích hoạt đồng bộ Jira thủ công:**
  * `POST /api/projects/{projectId}/jira/sync`
  * *Lý do:* Cho phép sinh viên chủ động bấm nút "Đồng bộ ngay" để ép hệ thống tải lập tức các thay đổi từ Jira về SAGA (hiện tại backend chỉ chạy đồng bộ tự động qua webhook hoặc lúc đầu liên kết).

---

## 2. Đồng bộ & Quản lý Code/Branch GitHub

* **Kích hoạt đồng bộ GitHub thủ công:**
  * `POST /api/projects/{projectId}/github/sync`
  * *Lý do:* Cho phép sinh viên đồng bộ tức thì toàn bộ Commit, Pull Request vừa được push lên kho lưu trữ GitHub về hệ thống.

---

## 3. Xem Lịch sử & Kết nối lại Repository

* **Xem lịch sử đồng bộ dự án:**
  * `GET /api/projects/{projectId}/sync-history`
  * *Lý do:* Cho phép sinh viên/giảng viên xem danh sách các lượt đồng bộ gần đây (thời gian, số lượng task/commit pull về, kết quả thành công/lỗi).

* **Kết nối lại Repository GitHub:**
  * `POST /api/projects/{projectId}/github/repositories/{repositoryId}/connect`
  * *Lý do:* Cho phép sinh viên kết nối lại hoặc cấp quyền lại cho 1 repository cụ thể khi bị mất kết nối hoặc đổi token.

