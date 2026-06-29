# TÀI LIỆU THIẾT KẾ: HỆ THỐNG ĐÁNH GIÁ SLICING PIE & TRỢ LÝ CẢNH BÁO SỚM AI

Tài liệu này mô tả chi tiết kiến trúc nghiệp vụ cho Hệ thống Đánh giá Công bằng (Dynamic Equity) và Quản trị Rủi ro Dự án (Early Warning) dành cho hệ thống giáo dục SAGA.

---

## PHẦN 1: MÔ HÌNH ĐÁNH GIÁ ĐÓNG GÓP (SLICING PIE)
Mô hình Slicing Pie giúp lượng hóa chính xác % đóng góp của sinh viên dựa trên giá trị công việc thực tế, loại bỏ hoàn toàn tình trạng "free-rider" (ăn bám).

### Công thức Cốt lõi
> **Slices (Cá nhân) = Giá trị công việc (Giờ/Story Points) × Hệ số công việc (Multiplier) × Hệ số Peer Review**
> **% Đóng góp cuối cùng = Slices (Cá nhân) / Tổng Slices (Cả nhóm)**

**Trong đó:**
- **Multiplier:** Do Giảng viên cấu hình. Ví dụ: Code (x2.0), Docs (x1.0), Design (x1.5).
- **Hệ số Peer Review:** Dựa trên vote cuối mỗi Phase. Ví dụ: 5 sao = x1.1 (thưởng), 1 sao = x0.5 (phạt).

### Quy trình Thực thi 4 Bước
1. **Khởi tạo (Config):** Giảng viên chốt các Giai đoạn (Phases) và Hệ số công việc đầu kỳ.
2. **Thực thi (Execute):** Sinh viên nhận Task, log giờ làm việc. Slices tự động cộng dồn theo thời gian thực (Real-time).
3. **Đánh giá chéo Mù (Blind Peer Review):** Cuối mỗi Phase, sinh viên đánh giá nhau qua Rate Sao & Comment. Quá trình này hoàn toàn "mù" (ẩn danh với thành viên bị đánh giá) - sinh viên không thể xem được ai đã đánh giá mình ra sao. Dữ liệu thật chỉ có Giảng viên và AI được truy cập.
4. **Chốt sổ (Finalize):** AI tổng hợp báo cáo. Giảng viên kiểm duyệt lần cuối (có quyền Override nếu phát hiện gian lận) và chốt % điểm.

---

## PHẦN 2: HỆ THỐNG CẢNH BÁO SỚM BẰNG AI (EARLY WARNING SYSTEM)
Để ngăn chặn việc dự án "bể" ở phút chót hoặc có thành viên rớt môn vì không làm gì, AI sẽ đóng vai trò radar rà quét dữ liệu liên tục và chia cảnh báo làm 2 cấp độ.

### Cấp độ 1: Cảnh báo sớm mức Dự án (Project-Level Warning)
AI giúp Giảng viên và Leader nhận diện rủi ro sụp đổ dự án thông qua các căn cứ:

- **Mất cân bằng Slices (Resource Bottleneck):** Căn cứ AI phân tích biểu đồ Pie Chart. Nếu phát hiện 1-2 cá nhân đang nắm giữ > 60-70% tổng số Slices của dự án. Cảnh báo Báo động đỏ "Gánh team". Dự án có nguy cơ dừng hoạt động nếu "core members" này quá tải, kiệt sức hoặc có việc đột xuất.
- **Tiến độ Lệch chuẩn (Velocity Drop):** Căn cứ tỷ lệ hoàn thành Task (Burn-rate) chậm hơn mức an toàn (ví dụ: đã qua 50% thời gian Phase nhưng mới đạt 20% Slices dự kiến). Cảnh báo dự án trễ tiến độ diện rộng (Burn-out warning).
- **Chỉ số Kỹ thuật bất thường (Technical Signals):** Căn cứ hệ thống Git tích hợp không ghi nhận commit code nào, hoặc tỷ lệ Bug Tasks sinh ra vượt quá số Task hoàn thành.

### Cấp độ 2: Cảnh báo sớm mức Thành viên (Member-Level Warning)
AI giúp can thiệp sớm đối với các cá nhân có thái độ làm việc bất thường, giúp Giảng viên nhắc nhở trước khi quá muộn.

- **Đóng băng Đóng góp (Zero Contribution):** Căn cứ sinh viên không phát sinh bất kỳ Slices nào mới trong 3-5 ngày liên tục (không log giờ, không update trạng thái task). Cảnh báo Ghosting (Biến mất khỏi dự án).
- **Phá vỡ Cam kết liên tục (Deadline Breach):** Căn cứ số giờ thực tế (Actual Hours) vượt quá 200% số giờ dự kiến (Estimated Hours) kéo dài, hoặc trễ hạn > 3 task liên tiếp. Cảnh báo năng lực không đáp ứng hoặc đang gặp blocker nghiêm trọng.
- **Dấu hiệu từ Phân tích Ngôn ngữ tự nhiên (NLP Peer Review):** Căn cứ AI quét các comments trong Daily Standup hoặc Peer Review nội bộ. Cảnh báo dù điểm số sao chưa thấp, nhưng nếu xuất hiện tần suất cao các keywords nhạy cảm (VD: "gọi không nghe", "làm hời hợt", "phải làm thay"), AI sẽ bật Cờ Vàng (Yellow Flag) gửi riêng cho Giảng viên.

---

## PHẦN 3: VAI TRÒ CỦA AI TRONG LUỒNG CHỐT KẾT QUẢ

- **Tổng hợp & Trực quan hóa bằng Biểu đồ (Visual Synthesize):** Thay vì Giảng viên phải đọc hàng ngàn log task và comment, AI sẽ đóng gói lại thành một Dashboard Báo cáo trực quan với các biểu đồ chặt chẽ:
  - **Pie Chart (Biểu đồ tròn):** Thể hiện % Slices (Cổ phần thực tế) của từng người trên tổng quỹ của nhóm.
  - **Radar Chart (Biểu đồ nhện):** Phân tích kỹ năng đóng góp của từng cá nhân (VD: Code, Docs, Design) để thấy sự thiên lệch.
  - **Burndown/Line Chart:** Vẽ lại đường tốc độ làm việc (Velocity) qua từng Sprint để giảng viên thấy nhóm có chạy nước rút hay làm đều tay.
- **Danh sách Cảnh báo:** "Sinh viên Báo động đỏ" kèm lý do, và "Thành viên Xuất sắc" để tuyên dương.
- **Khuyến nghị & Bằng chứng (Recommend & Evidence):** Đi kèm với tính toán % cuối cùng, AI sẽ ghim sẵn các "Bằng chứng" (Evidence) như trích dẫn comment đánh giá ẩn danh của team, biểu đồ trễ hạn để Giảng viên có cơ sở ra quyết định ngay lập tức.
- **Giảng viên luôn có quyền lực tối cao (Final Say):** Dù AI vẽ biểu đồ và tính toán tự động, quyền nhấn nút Ghi đè (Override) và Phê duyệt (Approve) luôn thuộc về Giảng viên, đảm bảo tính nhân văn và sư phạm.

---

## PHẦN 4: CƠ SỞ LÝ THUYẾT VÀ BẰNG CHỨNG THỰC TIỄN
Hệ thống Slicing Pie và cơ chế chia tỷ lệ động (Dynamic Equity Split) được xây dựng dựa trên các nghiên cứu học thuật và case study thực tế, cung cấp nền tảng khoa học vững chắc cho hệ thống SAGA.

### 1. Nền tảng nguyên bản Slicing Pie (Mike Moyer)
- **Căn cứ:** Mô hình Slicing Pie được phát triển bởi Giáo sư, Doanh nhân Mike Moyer. Lý thuyết này bác bỏ cách chia điểm/cổ phần cố định (Fixed Split) mang nhiều rủi ro bằng cơ chế tỷ lệ động (Dynamic Equity). Theo Moyer, giá trị đóng góp phải được quy đổi thành "Slices" dựa trên Giá trị công bằng (Fair Market Value) nhân với Hệ số rủi ro (Multiplier). Điều này khớp hoàn toàn với Công thức Cốt lõi áp dụng trong Phần 1 của SAGA.
- **Tham khảo:** Moyer, M. (2012). *Slicing Pie: Funding Your Company Without Funds*.

### 2. Tránh bẫy rủi ro "Chia đều ngay từ đầu" (The Founder's Dilemmas)
- **Căn cứ:** Nghiên cứu dựa trên dữ liệu của hàng ngàn dự án khởi nghiệp do Giáo sư Noam Wasserman (Đại học Harvard/USC) thực hiện chỉ ra rằng 73% các nhóm chốt tỷ lệ chia đều ngay trong tháng đầu tiên thường đối mặt với xung đột nghiêm trọng về sau. Khái niệm "Dead Equity" (cổ phần/điểm số chết rơi vào tay người không làm gì) là nguyên nhân chính làm sập dự án. SAGA sử dụng Slicing Pie để giải quyết triệt để vấn đề này, đảm bảo tỷ lệ điểm luôn phản ánh thời gian thực tế dựa vào sự đóng góp của sinh viên.
- **Tham khảo:** Wasserman, N. (2012). *The Founder's Dilemmas: Anticipating and Avoiding the Pitfalls That Can Sink a Startup*.

### 3. Minh chứng hiệu quả quản trị thực tiễn (Y-Productive & Encode.org Case Studies)
- **Căn cứ:** Theo các báo cáo thực tế khi áp dụng Dynamic Equity vào làm việc nhóm từ Y-Productive và Encode.org, phương pháp này ép buộc mọi thành viên duy trì kỷ luật nhập liệu giờ làm việc (Sweat Equity) để quy đổi ra Slices. Báo cáo cũng nhấn mạnh Slicing Pie giúp loại bỏ triệt để tình trạng "Alligator Pit of Re-negotiation" (đòi hỏi công bằng vào phút chót dự án) vì tất cả mọi dữ liệu đã được hệ thống tính toán minh bạch trên từng Sprint.
- **Tham khảo:** Báo cáo thực tế chuyên sâu về Dynamic Equity Split trên hệ thống quản trị của Y-Productive (Alex Zhebryakov) và Encode.org (Dennis Wittrock).

---

## PHẦN 5: TÍCH HỢP HỆ THỐNG NGOẠI VI (JIRA & GITHUB)
SAGA không hoạt động biệt lập mà đồng bộ dữ liệu trực tiếp từ các nền tảng quản lý dự án (Jira) và quản lý mã nguồn (GitHub) để tự động hóa việc thu thập Slices và rà soát chéo (Cross-check).

### 1. Tích hợp Jira (Nguồn tạo ra Slices cốt lõi)
Giảng viên có thể lựa chọn 1 trong 2 cơ chế quy đổi Task thành Slices:
- **Dựa trên Story Points (Khuyến nghị):** Đề cao năng lực giải quyết vấn đề. Một Task 5 point sẽ được thưởng 5 Slices (nhân với hệ số công việc), bất kể sinh viên hoàn thành trong 1 giờ hay 10 giờ. Giúp ngăn chặn việc cố tình kéo dài thời gian (ngâm task) để gian lận Slices.
- **Dựa trên Time Logged (Sweat Equity):** Đề cao công sức và thời gian bỏ ra (phù hợp với lý thuyết nguyên bản của Mike Moyer). Slices = Số giờ đã log × Hệ số công việc. Yêu cầu AI rà soát chặt chẽ để phát hiện các trường hợp Logged Time cao bất thường so với Estimate.

### 2. Tích hợp GitHub (Bằng chứng thép cho AI)
Dữ liệu GitHub không được quy đổi trực tiếp thành Slices để tránh việc sinh viên spam commits. Thay vào đó, nó đóng vai trò Màng lọc Xác thực (Validation Filter) cho AI:
- **Xác thực "Ghosting" (No-code warning):** Khi một sinh viên chuyển Task "Lập trình" trên Jira sang "Done" và nhận Slices, AI lập tức đối chiếu với tài khoản GitHub của sinh viên đó. Nếu không có bất kỳ Commit hay Pull Request nào khớp với mã Task, AI kích hoạt Cờ Đỏ (Gian lận / Nhận vơ công sức).
- **Đo lường Nợ kỹ thuật (Technical Debt / Bug Rate):** AI liên kết số lượng thẻ "Bug" trên Jira do Tester report với các commit tương ứng trên GitHub. Nếu mật độ Bug do 1 sinh viên tạo ra vượt qua ngưỡng cấu hình (ví dụ >30% số task của họ), AI tự động đề xuất **trừ hệ số Slices** của sinh viên đó vào cuối Phase.

---

## PHẦN 6: PHÂN QUYỀN VÀ QUẢN TRỊ (AUTHORIZATION MATRIX)
Để đảm bảo sự cân bằng giữa tính chuẩn hóa toàn trường (Standardization) và tính linh hoạt của từng lớp (Flexibility), hệ thống áp dụng cơ chế quản trị phân cấp:

### 1. Cấp độ Quản trị Hệ thống (Admin / Academic Department)
Admin thiết lập "Luật chơi chung" và ranh giới an toàn cho toàn hệ thống:
- **Global Peer Review Rules:** Định nghĩa hệ số thưởng/phạt mặc định (ví dụ: 5 sao = 1.1x). Đảm bảo không có sự chênh lệch tiêu chuẩn quá lớn giữa các lớp.
- **Global AI Warning Thresholds:** Thiết lập các ngưỡng cảnh báo tối thiểu (ví dụ: vắng mặt 5 ngày là cảnh báo đỏ).
- **Task Multiplier Templates:** Tạo sẵn các "Bộ khung hệ số mẫu" cho từng khối ngành (Khối IT, Khối Kinh tế, Khối Ngôn ngữ) để chuẩn hóa danh mục công việc.

### 2. Cấp độ Giảng viên (Lecturer / Class Manager)
Giảng viên có quyền lực tối cao (Final Say) đối với lớp học của mình. Ở cấp độ lớp học, Giảng viên thực hiện:
- **Kế thừa & Tinh chỉnh (Inherit & Override):** Chọn một "Bộ khung hệ số" do Admin cung cấp và tinh chỉnh lại các Multipliers cho phù hợp với môn mình dạy.
- **Phân bổ Giai đoạn (Sprint/Phase Mapping):** Độc quyền thiết lập thời gian bắt đầu/kết thúc của các Phase và thời điểm Peer Review, dựa trên lịch trình thực tế của lớp.
- **Siết chặt Kỷ luật (Stricter Constraints):** Có thể ghi đè ngưỡng cảnh báo của AI để khắt khe hơn (ví dụ: giảm ngưỡng "Ghosting" từ 5 ngày xuống 2 ngày đối với các dự án ngắn hạn).
- **Phê duyệt Cuối (Approve Results):** Trực tiếp kiểm duyệt báo cáo do AI tổng hợp, có quyền ghi đè (Override) kết quả nếu phát hiện yếu tố ngoại cảnh mà AI không nhận diện được.
