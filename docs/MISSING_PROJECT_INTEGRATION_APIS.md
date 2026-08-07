# Danh sách các API bị thiếu cho Quản lý Dự án và Tích hợp (Jira/GitHub)

Tài liệu này tổng hợp lại các API liên quan đến quản lý dự án (Project Management) và tích hợp công cụ (Jira / GitHub) hiện tại **hoàn toàn chưa có đặc tả kỹ thuật** (chưa định nghĩa trong tài liệu tích hợp chung lẫn mã nguồn Frontend) từ phía Backend, cần yêu cầu Backend thiết lập và bổ sung.

---

## 1. Quản lý Dự án Nhóm (Group Project Management)

* **Xóa/Hủy bỏ Dự án:**
  * `DELETE /api/projects/{projectId}`
  * *Lý do:* Cho phép nhóm sinh viên reset hoặc đổi đề tài khác để cấu hình tích hợp lại từ đầu.

---

## 2. Đồng bộ & Quản lý Task/Sprint Jira

* **Kích hoạt đồng bộ Jira thủ công:**
  * `POST /api/projects/{projectId}/jira/sync`
  * *Lý do:* Cho phép sinh viên chủ động bấm nút "Đồng bộ ngay" để ép hệ thống tải lập tức các thay đổi từ Jira về SAGA (hiện tại backend chỉ chạy đồng bộ tự động qua webhook hoặc lúc đầu liên kết).

---

## 3. Đồng bộ & Quản lý Code/Branch GitHub

* **Kích hoạt đồng bộ GitHub thủ công:**
  * `POST /api/projects/{projectId}/github/sync`
  * *Lý do:* Cho phép sinh viên đồng bộ tức thì toàn bộ Commit, Pull Request vừa được push lên kho lưu trữ GitHub về hệ thống.

---

## 4. Tùy chọn Hợp nhất API Đồng bộ (Alternative Unified Sync API)

> [!TIP]
> Để tinh gọn tài nguyên và số lượng endpoint, Backend có thể hợp nhất luồng đồng bộ thủ công của cả Jira và GitHub thành một endpoint duy nhất:

* **Endpoint:** `POST /api/projects/{projectId}/sync`
* **Query Parameter:** `?provider=JIRA` hoặc `?provider=GITHUB` (Nếu để trống thì sẽ đồng bộ đồng thời cả hai).
* **Nghiệp vụ:** Kích hoạt tiến trình quét dữ liệu thủ công cho dự án.
