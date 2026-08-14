# Danh sách các API bị thiếu dành cho Admin (Dựa trên tài liệu BE)

Tài liệu này tổng hợp lại những API mà Backend hiện tại **chưa có** hoặc **chưa hoàn thiện** (PARTIAL/TBD) ở góc độ quản trị viên (ADMIN), gây cản trở cho việc phát triển các màn hình quản trị trên Frontend.


## 8. Báo cáo & Thống kê Trực quan (Dashboard Charts)
Hiện tại trang chủ Admin Dashboard (`/admin`) đang phải dùng dữ liệu giả (mock data) cho hai biểu đồ quan trọng.
**Danh sách API cần bổ sung:**
- `GET /api/admin/reports/anomalies`: Thống kê số lượng các "Tín hiệu cảnh báo" toàn hệ thống (Task Ảo MSR, Cày Deadline Process, Cô Lập SNA).
- `GET /api/admin/reports/graph-processing`: Thống kê mật độ xử lý đồ thị (số lượng Nodes và Edges mới tạo/cập nhật) trong 7 ngày gần nhất để vẽ biểu đồ line/area.

> Vui lòng gửi tài liệu này cho đội Backend để lên kế hoạch triển khai thêm các endpoint phục vụ Admin Dashboard.
