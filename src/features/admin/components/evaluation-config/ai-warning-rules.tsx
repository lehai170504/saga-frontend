import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Flame, Users, Info, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

export function AiWarningRules() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle>Ngưỡng Cảnh báo Sớm AI (AI Early Warning)</CardTitle>
          <CardDescription>
            Bộ thông số quét dữ liệu tự động của AI được <strong>khóa cố định</strong> để làm mốc quy chuẩn toàn trường. Giảng viên có thể chủ động Ghi đè (Override) từng cảnh báo riêng lẻ ở cấp độ Lớp mà không cần chờ phê duyệt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT COLUMN: RULES CONFIGURATION */}
            <div className="xl:col-span-2 space-y-8">
              <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 text-sm font-medium">
                <Lock className="w-4 h-4 shrink-0" /> Hệ thống hiện tại chỉ hỗ trợ Cảnh báo Quá hạn (OVERDUE_TASK). Các tín hiệu khác đang trong quá trình phát triển (TBD).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supported Warnings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                    <AlertTriangle className="w-5 h-5 text-primary" /> Đã Hỗ trợ (Supported)
                  </h3>

                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-90">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-destructive" /> OVERDUE_TASK (Task Quá hạn)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Phát hiện các công việc đã vượt quá thời hạn (deadline) trên hệ thống Jira.</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-md">Hoạt động (Active)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TBD Warnings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                    <Clock className="w-5 h-5 text-muted-foreground" /> Chưa Hỗ trợ (TBD)
                  </h3>

                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-70">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" /> MSR (Bottleneck / Gánh Team)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo sự mất cân bằng về lượng đóng góp (Slices) giữa các thành viên.</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-md">Chưa hỗ trợ (TBD)</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-border/50 my-2" />

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="w-4 h-4" /> DEADLINE_PROCESS
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo tiến độ tổng thể chậm hơn dự kiến.</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-md">Chưa hỗ trợ (TBD)</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-border/50 my-2" />

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                        <Flame className="w-4 h-4" /> SNA_ISOLATION
                      </Label>
                      <p className="text-xs text-muted-foreground mb-3">Cảnh báo thành viên bị cô lập dựa trên sơ đồ Mạng tương tác (Social Network Analysis).</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-md">Chưa hỗ trợ (TBD)</span>
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
                    <Info className="w-5 h-5 text-primary shrink-0" />
                    <h3 className="font-bold text-lg">Cơ sở Quản trị Rủi ro</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground pt-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p><strong className="text-destructive text-base">OVERDUE_TASK:</strong></p>
                      <p className="text-xs leading-relaxed">
                        Cảnh báo Task quá hạn giúp nhận diện ngay các nút thắt (Blocker) trong dự án. Việc trễ hạn liên tục là tín hiệu của việc ước lượng sai (Poor Estimation) hoặc gặp khó khăn về kỹ thuật.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p><strong className="text-muted-foreground text-base">MSR (TBD):</strong></p>
                      <p className="text-xs leading-relaxed">
                        Dựa trên khái niệm <strong>Bus Factor</strong> (Rủi ro nhân sự) trong Software Engineering. Nếu 1 cá nhân ôm đồm quá nhiều, dự án có nguy cơ sụp đổ hoàn toàn nếu người đó rời nhóm.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p><strong className="text-muted-foreground text-base">SNA_ISOLATION (TBD):</strong></p>
                      <p className="text-xs leading-relaxed">
                        Phân tích mạng lưới tương tác qua GitHub/Jira để phát hiện các sinh viên không có sự gắn kết với nhóm (Cô lập), nguy cơ cao dẫn đến bỏ cuộc (Drop out).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <h4 className="font-bold text-foreground">Tuân thủ Quy tắc Backend</h4>
                    <p className="text-xs text-destructive font-semibold">
                      Hệ thống SAGA tuyệt đối KHÔNG sử dụng/mock các chỉ số ảo: GHOSTING, TOXIC_COMMUNICATION, TECHNICAL_DEBT, AI_RISK_SCORE.
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
