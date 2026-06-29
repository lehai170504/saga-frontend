import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Flame, Users, Info, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AiWarningRules() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle>Ngưỡng Cảnh báo Sớm AI (AI Early Warning)</CardTitle>
          <CardDescription>
            Bộ thông số quét dữ liệu tự động của AI được <strong>khóa cố định</strong> để làm mốc quy chuẩn toàn trường. Giảng viên chỉ có thể xin quyền Ghi đè (Override) từng cảnh báo riêng lẻ ở cấp độ Lớp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT COLUMN: RULES CONFIGURATION */}
            <div className="xl:col-span-2 space-y-8">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm font-medium">
                <Lock className="w-4 h-4" /> Ngưỡng AI đã được khóa cứng. Giảng viên cần tạo Yêu cầu Ghi đè nếu muốn nới lỏng.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Level Warning */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-blue-500" /> Cảnh báo Dự án
                  </h3>

                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-90">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" /> Ngưỡng "Gánh Team" (Bottleneck)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo khi 1-2 thành viên nắm giữ trên mức % tổng Slices của nhóm.</p>
                      <div className="flex items-center gap-3">
                        <Input type="number" defaultValue={60} disabled className="w-20 text-center font-bold bg-muted" />
                        <span className="text-sm font-medium">% Tổng Slices</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-border/50 my-2" />

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" /> Cảnh báo Trễ Tiến Độ
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Kích hoạt khi tỷ lệ hoàn thành (Burn-rate) chậm hơn kế hoạch mức % này.</p>
                      <div className="flex items-center gap-3">
                        <Input type="number" defaultValue={30} disabled className="w-20 text-center font-bold bg-muted" />
                        <span className="text-sm font-medium">% Lệch chuẩn</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Level Warning */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Cảnh báo Cá nhân
                  </h3>

                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-90">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-500" /> Ngưỡng "Ghosting" (Biến mất)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo nếu sinh viên không phát sinh bất kỳ Slices nào trong khoảng thời gian.</p>
                      <div className="flex items-center gap-3">
                        <Input type="number" defaultValue={5} disabled className="w-20 text-center font-bold bg-muted" />
                        <span className="text-sm font-medium">Ngày liên tục</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-border/50 my-2" />

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" /> Ngưỡng Phá vỡ Cam kết
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo khi Giờ làm thực tế (Actual) vượt qua mức % Giờ dự kiến (Estimate).</p>
                      <div className="flex items-center gap-3">
                        <Input type="number" defaultValue={200} disabled className="w-20 text-center font-bold bg-muted" />
                        <span className="text-sm font-medium">% Estimate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACADEMIC BASIS */}
            <div className="xl:col-span-1">
              <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Cơ sở Quản trị Rủi ro (Risk Management)</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground pt-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p><strong className="text-orange-500 text-base">60% "Gánh Team":</strong></p>
                      <p className="text-xs leading-relaxed">
                        Dựa trên khái niệm <strong>Bus Factor</strong> (Rủi ro nhân sự) trong Software Engineering. Scrum yêu cầu <em>Cross-functional Team</em>. Nếu 1 cá nhân ôm đồm &gt;60% khối lượng, dự án có nguy cơ sụp đổ hoàn toàn nếu người đó rời nhóm. Mức 60% là Red Flag cho việc phân chia công việc thất bại.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p><strong className="text-destructive text-base">30% Trễ tiến độ:</strong></p>
                      <p className="text-xs leading-relaxed">
                        Biểu đồ Agile Burndown kỳ vọng đường tiêu thụ (burn) tuyến tính. Độ lệch (deviation) &gt; 30% chứng tỏ nhóm đang gặp Blocker nghiêm trọng chưa giải quyết, hoặc đã đánh giá sai hoàn toàn độ khó của task lúc Sprint Planning.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p><strong className="text-zinc-500 text-base">5 Ngày Ghosting:</strong></p>
                      <p className="text-xs leading-relaxed">
                        Agile yêu cầu <strong>Continuous Integration</strong> và <strong>Daily Standups</strong>. 5 ngày không log time đồng nghĩa sinh viên đã bỏ lỡ 1 tuần làm việc trọn vẹn (Work week). Đây là dấu hiệu sớm nhất của việc xao nhãng hoặc muốn bỏ cuộc (Drop out).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p><strong className="text-destructive text-base">200% Over-commitment:</strong></p>
                      <p className="text-xs leading-relaxed">
                        Theo triết lý Agile, nếu <em>Actual Time {">"} 2x Estimate Time</em>, lỗ hổng nằm ở kỹ năng <strong>Task Breakdown</strong>. Task quá mơ hồ và quá lớn, vi phạm nguyên tắc <em>Predictable Velocity</em> (tốc độ dự đoán) của nhóm.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <h4 className="font-bold text-foreground">Kết luận</h4>
                    <p className="text-xs">
                      Các con số này không phải ngẫu nhiên mà được đúc kết từ thực tiễn Quản trị dự án Agile. Đóng băng các chỉ số này giúp AI của SAGA hoạt động như một <strong>Scrum Master khách quan</strong>, phát tín hiệu cảnh báo chuẩn xác cho mọi dự án trong trường.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
