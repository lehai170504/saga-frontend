# KIẾN TRÚC ĐỒ THỊ TRUY VẾT SLICING PIE (TRACEABILITY GRAPH)

Tài liệu này lưu trữ thiết kế kiến trúc và giải trình lý do (Reasoning) đằng sau việc xây dựng hệ thống **Đồ thị Truy vết (Traceability Graph)** cho phân hệ Giảng viên (Lecturer) và Sinh viên (Student) trong dự án SAGA.

## 1. TỔNG QUAN TÍNH NĂNG (WHAT WE DID)

Thay vì sử dụng bảng tính (Table/Excel) khô khan để hiển thị điểm số, SAGA sử dụng **React Flow** để vẽ ra một Đồ thị Tri thức (Knowledge Graph) có hướng (Directed Acyclic Graph - DAG). Đồ thị này mô phỏng toàn bộ dòng chảy "tiền tệ hóa" (Monetization) công sức của sinh viên.

### 1.1 Phân hệ Sinh viên (Student Trace Graph)
- **Truy vết 1-1 (1-to-1 Traceability):** Đồ thị cho phép sinh viên nhìn thấy rõ từng **Bằng chứng (Proof)** (Commit Hash hoặc Link Figma/Docs) kết nối với **Task (Jira)** nào.
- **Minh bạch hóa Điểm Base & Phạt:** Dòng chảy từ Task đi qua **Hệ số (Multiplier)** (Code x2.0, Design x1.5) để tạo ra Base Slices. Các Task vi phạm (Không link Jira, trễ hạn) sẽ đi vào nhánh **Phạt (Penalty)**.
- **Tích hợp Đánh giá chéo (Phase-level Peer Review):** Tất cả Base Slices trong một Phase sẽ hội tụ về một Node màu cam (Peer Review Node) trước khi ra điểm cuối cùng của Phase đó.
- **Tổng kết Final:** Ở tab Final, đồ thị thu phóng tầm nhìn (Macro-view) hợp lưu điểm 3 Phase lại và nhân với hệ số Thái độ toàn kỳ (Global Peer Review) để ra Cổ phần cuối cùng.

### 1.2 Phân hệ Giảng viên (Class Network Graph)
- **Tầm nhìn Máy bay (Bird-eye View):** Giảng viên không nhìn theo hướng cá nhân mà nhìn toàn bộ Cấu trúc Lớp học. Các **Hệ số Đầu vào** (Code, Design, Docs) sẽ tỏa các đường nối (Edge) tới các Sinh viên.
- **Kiểm toán 1 chạm (Click-to-Verify & Drilldown):** Giảng viên có thể Click vào bất kỳ đường nối nào (Ví dụ: Đường nối `10 SP Code` của Nguyễn Văn A) để mở ra **Drilldown Drawer**. Drawer này chứa danh sách Task thực tế và Link Bằng chứng (GitHub/Figma) để Giảng viên kiểm chứng.
- **Hỗ trợ Đa nhiệm (Multi-tasking):** Một sinh viên "gánh team" (Core member) sẽ nhận nhiều đường nối từ nhiều Hệ số khác nhau (Vừa nhận Edge từ Code, vừa nhận Edge từ Design), chứng minh năng lực đa nhiệm rõ ràng mà không cần đọc báo cáo dài.
- **Quản trị Ngoại lệ (Governance by Exception):** Từ Drawer, Giảng viên có quyền **Ghi đè (Override)** điểm do AI đề xuất nếu phát hiện có gian lận hoặc sai sót khách quan.

## 2. TẠI SAO LẠI THIẾT KẾ NHƯ VẬY? (WHY WE DID IT)

Toàn bộ UI/UX và logic luồng dữ liệu của Đồ thị không phải là sự ngẫu hứng, mà dựa trên các nền tảng học thuật và nghiệp vụ thực tiễn:

### 2.1 Explainable AI (XAI - Trí tuệ nhân tạo có thể giải thích được)
- **Vấn đề:** Các hệ thống AI truyền thống chấm điểm như một "hộp đen" (Black-box), sinh viên không hiểu tại sao mình bị điểm thấp và sinh ra bất mãn.
- **Giải pháp bằng Đồ thị:** Graph trực quan hóa từng bước nhân chia cộng trừ của AI. Sinh viên nhìn vào Node Peer Review màu cam (bị x0.5) hoặc Node Phạt màu đỏ (-2.0 Slices) là tự hiểu ngay lý do rớt điểm, không cần đi khiếu nại Giảng viên.

### 2.2 Proof of Work (Bằng chứng công việc) vs. Time-logged (Định luật Parkinson)
- Đồ thị cấm việc thể hiện "Số giờ làm việc" (Time-logged) vì **Định luật Parkinson** chỉ ra rằng "Sinh viên sẽ cố tình kéo dài thời gian code để lấy nhiều điểm".
- Thay vào đó, Đồ thị bắt đầu bằng các **Proof Nodes** (Git Commit / External Link). Đây là các bằng chứng toán học (Cryptographic Hash) hoặc hiện vật thực tế, đảm bảo sinh viên *thực sự có làm* thì mới có Data Anchor (Mỏ neo dữ liệu) để tính điểm.

### 2.3 Loại bỏ "Bus Factor" & "Free-rider" (The Founder's Dilemmas)
- Giảng viên nhìn vào Đồ thị Network sẽ thấy ngay những sinh viên "Ghosting" (Không có đường nối nào chĩa vào) hoặc bị phạt nặng $\rightarrow$ Loại bỏ Free-rider (Kẻ đi ké).
- Thấy ngay những "Core Member" (Nhận 3-4 đường nối đa nhiệm) đang gánh 60% cổ phần $\rightarrow$ AI kích hoạt Cờ đỏ (Red Flag) cảnh báo Bus Factor (Rủi ro sụp đổ dự án nếu người này nghỉ ốm).

## 3. CÔNG NGHỆ ÁP DỤNG (TECH STACK)
- **Engine:** `@xyflow/react` (React Flow) cho phép render đồ thị DAG cực nhẹ, hỗ trợ Pan/Zoom mượt mà.
- **UI:** Custom Nodes (Sử dụng Tailwind CSS Glassmorphism) & Custom Edges (Sử dụng SmoothStep Edge tích hợp SVG Path logic).
- **Icons:** `lucide-react` để gán ý nghĩa ngữ nghĩa (Semantic) cho từng loại dữ liệu (PieChart cho Slices, UserCheck cho Peer Review, GitCommit cho Code).
