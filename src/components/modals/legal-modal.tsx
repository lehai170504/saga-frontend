"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, defaultTab = "privacy" }: LegalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] md:max-w-4xl bg-card border-border p-0 overflow-hidden gap-0">
        <DialogHeader className="px-8 pr-14 pt-8 pb-6 border-b border-border bg-muted/30">
          <DialogTitle className="text-2xl font-black">Chính sách & Điều khoản</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Các quy định và cam kết bảo mật khi sử dụng hệ thống đánh giá quá trình học tập SAGA.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="px-8 pt-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger value="privacy" className="rounded-md font-bold">Chính sách Bảo mật</TabsTrigger>
              <TabsTrigger value="terms" className="rounded-md font-bold">Điều khoản Sử dụng</TabsTrigger>
            </TabsList>
          </div>

          <div className="overflow-y-auto max-h-[60vh] px-8 py-8">
            <TabsContent value="privacy" className="mt-0 outline-none">
              <div className="space-y-8 text-muted-foreground leading-relaxed text-base">
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">1. Dữ liệu chúng tôi thu thập</h2>
                  <p className="mb-3">Hệ thống SAGA chỉ thu thập các dữ liệu cần thiết để phục vụ mục đích đánh giá và theo dõi tiến độ học tập qua các môn học, bao gồm:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Dữ liệu từ GitHub:</strong> Lịch sử Commit, số dòng code thay đổi, nội dung Pull Request qua Token quyền đọc (Read-only).</li>
                    <li><strong className="text-foreground">Dữ liệu từ Jira:</strong> Thông tin tiến độ Task, người được phân công, trạng thái Workflow và thời gian hoàn thành.</li>
                    <li><strong className="text-foreground">Dữ liệu nội bộ (FAP):</strong> Thông tin nhóm sinh viên, giảng viên hướng dẫn và học kỳ hiện tại.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">2. Mục đích sử dụng dữ liệu</h2>
                  <p className="mb-3">Dữ liệu thu thập được sử dụng duy nhất cho các mục đích học thuật và quản lý tiến độ học tập:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Xây dựng biểu đồ tiến độ (Burndown Chart) và biểu đồ nhiệt (Heatmap) tự động.</li>
                    <li>Đánh giá sự công bằng và đóng góp thực tế của từng thành viên trong nhóm.</li>
                    <li>Phát hiện sớm rủi ro để giảng viên có thể can thiệp kịp thời.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">3. Bảo vệ và Lưu trữ</h2>
                  <p>
                    Tất cả các Access Token (GitHub/Jira) do người dùng cung cấp đều được mã hóa bằng thuật toán AES-256. 
                    Hệ thống tuyệt đối không chia sẻ, bán, hoặc cấp quyền truy cập dữ liệu của bạn cho bên thứ ba. Dữ liệu sẽ được tự động làm sạch (Archived) sau 6 tháng.
                  </p>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="mt-0 outline-none">
              <div className="space-y-8 text-muted-foreground leading-relaxed text-base">
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">1. Chấp nhận điều khoản</h2>
                  <p>
                    Bằng việc đăng nhập và sử dụng hệ thống SAGA, bạn đồng ý tuân thủ các quy định dưới đây. 
                    Hệ thống này được xây dựng nhằm phục vụ trực tiếp cho quá trình học tập và làm việc qua các môn học tại Đại học FPT.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">2. Trách nhiệm của Sinh viên</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Tính trung thực:</strong> Nghiêm cấm mọi hành vi thao túng lịch sử Commit (như tự động sinh code rác, sửa author) để gian lận.</li>
                    <li><strong className="text-foreground">Bảo mật Token:</strong> Chỉ cung cấp Token với quyền đọc (Read-only). Hệ thống không chịu trách nhiệm nếu cung cấp Token có quyền ghi.</li>
                    <li><strong className="text-foreground">Đồng bộ Email:</strong> Email sử dụng trên GitHub/Jira phải khớp với email FPT.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">3. Trách nhiệm của Giảng viên</h2>
                  <p>
                    Dữ liệu trên SAGA có giá trị tham khảo hỗ trợ quyết định (Decision Support). Phán quyết cuối cùng về điểm số và xử lý sinh viên vi phạm vẫn thuộc về nghiệp vụ của bộ môn.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-3">4. Giới hạn trách nhiệm</h2>
                  <p>
                    SAGA cam kết không thực hiện lệnh ghi, sửa, xóa lên Repository GitHub hay Board Jira của người dùng dưới bất kỳ hình thức nào.
                  </p>
                </section>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
