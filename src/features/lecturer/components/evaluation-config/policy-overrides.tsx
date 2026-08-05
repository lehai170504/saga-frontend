"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Activity, Users, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function PolicyOverrides() {
  const [overrideGhosting, setOverrideGhosting] = useState(false);
  const [ghostingDays, setGhostingDays] = useState(5);

  const [overrideBugRate, setOverrideBugRate] = useState(false);
  const [bugRate, setBugRate] = useState(30);

  const [overrideBusFactor, setOverrideBusFactor] = useState(false);
  const [busFactor, setBusFactor] = useState(60);

  const [overrideReason, setOverrideReason] = useState("");

  const hasAnyOverride = overrideGhosting || overrideBugRate || overrideBusFactor;

  const isGhostingValid = ghostingDays >= 2 && ghostingDays <= 14;
  const isBugRateValid = bugRate >= 10 && bugRate <= 50;
  const isBusFactorValid = busFactor >= 40 && busFactor <= 80;

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Ghi đè Cảnh báo AI (Early Warning)
        </CardTitle>
        <CardDescription>
          Mặc định lớp học sẽ tuân theo các luật cảnh báo rủi ro do Admin cấu hình. Bật công tắc &quot;Ghi đè&quot; nếu bạn muốn thay đổi các chỉ số này cho phù hợp với đặc thù riêng của lớp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Ghosting Override */}
        <div className={`p-5 rounded-xl border transition-colors ${overrideGhosting ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background/50'} space-y-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 mr-4">
              <Label className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Cảnh báo Lười biếng (Ghosting Warning)
              </Label>
              <p className="text-xs text-muted-foreground">Phát hiện &quot;Zero Contribution&quot;. Cảnh báo đỏ nếu sinh viên không phát sinh Slices mới trong 5 ngày (vi phạm Daily Scrum).</p>
            </div>
            <Switch checked={overrideGhosting} onCheckedChange={setOverrideGhosting} />
          </div>

          {overrideGhosting && (
            <div className="pt-3 border-t border-primary/20 space-y-2">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-bold text-primary uppercase w-32">Cảnh báo Đỏ sau:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={ghostingDays}
                    onChange={(e) => setGhostingDays(parseInt(e.target.value) || 0)}
                    className={`w-16 h-8 text-center font-bold ${!isGhostingValid ? 'border-destructive text-destructive focus-visible:ring-destructive' : 'border-primary/30'}`}
                  />
                  <span className="text-sm font-medium">Ngày không có Slices</span>
                </div>
              </div>
              {!isGhostingValid && (
                <p className="text-xs text-destructive font-semibold ml-35">Giới hạn hợp lệ của hệ thống: Từ 2 đến 14 ngày.</p>
              )}
            </div>
          )}
        </div>

        {/* Bug Rate Override */}
        <div className={`p-5 rounded-xl border transition-colors ${overrideBugRate ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background/50'} space-y-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 mr-4">
              <Label className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" /> Nợ Kỹ thuật (Technical Debt)
              </Label>
              <p className="text-xs text-muted-foreground">Admin đang cấu hình: Phạt hệ số nếu Tỷ lệ Bug/Commit vượt mức 30%. Ghi đè để đổi tỷ lệ này.</p>
            </div>
            <Switch checked={overrideBugRate} onCheckedChange={setOverrideBugRate} />
          </div>

          {overrideBugRate && (
            <div className="pt-3 border-t border-primary/20 space-y-2">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-bold text-primary uppercase w-32">Ngưỡng Phạt Hệ số:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{">"}</span>
                  <Input
                    type="number"
                    value={bugRate}
                    onChange={(e) => setBugRate(parseInt(e.target.value) || 0)}
                    className={`w-16 h-8 text-center font-bold ${!isBugRateValid ? 'border-destructive text-destructive focus-visible:ring-destructive' : 'border-primary/30'}`}
                  />
                  <span className="text-sm font-medium">% Tỷ lệ Bug/Commit</span>
                </div>
              </div>
              {!isBugRateValid && (
                <p className="text-xs text-destructive font-semibold ml-35">Giới hạn hợp lệ của hệ thống: Từ 10% đến 50%.</p>
              )}
            </div>
          )}
        </div>

        {/* Bus Factor Override */}
        <div className={`p-5 rounded-xl border transition-colors ${overrideBusFactor ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background/50'} space-y-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 mr-4">
              <Label className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Mất cân bằng Slices (Bus Factor Risk)
              </Label>
              <p className="text-xs text-muted-foreground">Phát hiện &quot;Gánh team&quot;. Cảnh báo khi 1-2 cá nhân chiếm trên 60% tổng Slices của toàn bộ Sprint. Trợ lý AI sẽ yêu cầu Scrum Master can thiệp.</p>
            </div>
            <Switch checked={overrideBusFactor} onCheckedChange={setOverrideBusFactor} />
          </div>

          {overrideBusFactor && (
            <div className="pt-3 border-t border-primary/20 space-y-2">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-bold text-primary uppercase w-32">Ngưỡng Bus Factor:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{">"}</span>
                  <Input
                    type="number"
                    value={busFactor}
                    onChange={(e) => setBusFactor(parseInt(e.target.value) || 0)}
                    className={`w-16 h-8 text-center font-bold ${!isBusFactorValid ? 'border-destructive text-destructive focus-visible:ring-destructive' : 'border-primary/30'}`}
                  />
                  <span className="text-sm font-medium">% Slices / Sprint</span>
                </div>
              </div>
              {!isBusFactorValid && (
                <p className="text-xs text-destructive font-semibold ml-35">Giới hạn hợp lệ của hệ thống: Từ 40% đến 80%.</p>
              )}
            </div>
          )}
        </div>

        {/* Reason for Override & Submit Request */}
        {hasAnyOverride && (
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-2 text-primary">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Label className="font-bold">Yêu cầu Kiểm duyệt từ Admin</Label>
                <p className="text-xs">Bạn đang thực hiện ghi đè chính sách cảnh báo rủi ro AI. Vui lòng cung cấp lý do chi tiết để Admin xem xét và phê duyệt.</p>
              </div>
            </div>

            <Textarea
              placeholder="Ví dụ: Lớp học này có sinh viên part-time, cần nới lỏng Ghosting Warning lên 7 ngày..."
              className="min-h-[100px] border-primary/20 focus-visible:ring-primary8605"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                disabled={!overrideReason.trim() || !isGhostingValid || !isBugRateValid || !isBusFactorValid}
                className="bg-primary text-white font-bold rounded-xl"
              >
                Gửi yêu cầu Ghi đè AI Rules
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
