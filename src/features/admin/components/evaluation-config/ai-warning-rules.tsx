import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Flame, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AiWarningRules() {
  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle>Ngưỡng Cảnh báo Sớm AI (AI Early Warning)</CardTitle>
        <CardDescription>
          Thiết lập các mốc dữ liệu để AI kích hoạt Cờ Vàng (Yellow Flag) hoặc Cờ Đỏ (Red Flag) cho Giảng viên. Hệ thống tự động quét dữ liệu mỗi ngày.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Level Warning */}
          <div className="space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-blue-500" /> Cảnh báo Dự án
            </h3>

            <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Ngưỡng "Gánh Team" (Bottleneck)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">Cảnh báo khi 1-2 thành viên nắm giữ trên mức % tổng Slices của nhóm.</p>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={60} className="w-20 text-center font-bold" />
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
                  <Input type="number" defaultValue={30} className="w-20 text-center font-bold" />
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

            <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" /> Ngưỡng "Ghosting" (Biến mất)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">Cảnh báo nếu sinh viên không phát sinh bất kỳ Slices nào trong khoảng thời gian.</p>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={5} className="w-20 text-center font-bold" />
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
                  <Input type="number" defaultValue={200} className="w-20 text-center font-bold" />
                  <span className="text-sm font-medium">% Estimate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
