"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Activity, Star, Info } from "lucide-react";
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

  const [overridePeerReview, setOverridePeerReview] = useState(false);
  const [peerReviewReq, setPeerReviewReq] = useState(true);

  const [overrideReason, setOverrideReason] = useState("");

  const hasAnyOverride = overrideGhosting || overrideBugRate || overridePeerReview;

  const isGhostingValid = ghostingDays >= 2 && ghostingDays <= 14;
  const isBugRateValid = bugRate >= 10 && bugRate <= 50;

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Ghi đè Chính sách (Policy Overrides)
        </CardTitle>
        <CardDescription>
          Mặc định lớp học sẽ tuân theo các luật cảnh báo và Peer Review do Admin cấu hình. Bật công tắc "Ghi đè" nếu bạn muốn thay đổi các chỉ số này cho phù hợp với tiến độ riêng của lớp. Mọi thay đổi đều cần Admin kiểm duyệt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Ghosting Override */}
        <div className={`p-5 rounded-xl border transition-colors ${overrideGhosting ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background/50'} space-y-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 mr-4">
              <Label className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" /> Cảnh báo Lười biếng (Ghosting Warning)
              </Label>
              <p className="text-xs text-muted-foreground">Admin đang cấu hình: Cảnh báo đỏ nếu sinh viên không có hoạt động trong 5 ngày. Bật ghi đè nếu muốn thời gian khắt khe hoặc nới lỏng hơn.</p>
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
                  <span className="text-sm font-medium">Ngày không có log/commit</span>
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
              <p className="text-xs text-muted-foreground">Admin đang cấu hình: Phạt hệ số nếu tỷ lệ Bug vượt 30% tổng số task. Ghi đè để đổi tỷ lệ này.</p>
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
                  <span className="text-sm font-medium">% Tổng số Task</span>
                </div>
              </div>
              {!isBugRateValid && (
                <p className="text-xs text-destructive font-semibold ml-35">Giới hạn hợp lệ của hệ thống: Từ 10% đến 50%.</p>
              )}
            </div>
          )}
        </div>

        {/* Peer Review Comment Req Override */}
        <div className={`p-5 rounded-xl border transition-colors ${overridePeerReview ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background/50'} space-y-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 mr-4">
              <Label className="font-bold text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Bắt buộc Comment Đánh giá (Peer Review)
              </Label>
              <p className="text-xs text-muted-foreground">Admin đang cấu hình: Bắt buộc viết nhận xét nếu vote {"<="} 2 sao hoặc 5 sao. Ghi đè để bắt buộc viết nhận xét cho mọi mức điểm (khắt khe hơn).</p>
            </div>
            <Switch checked={overridePeerReview} onCheckedChange={setOverridePeerReview} />
          </div>

          {overridePeerReview && (
            <div className="flex items-center justify-between pt-3 border-t border-primary/20">
              <Label className="text-xs font-bold text-primary uppercase">Bắt buộc Comment cho MỌI vote</Label>
              <Switch checked={peerReviewReq} onCheckedChange={setPeerReviewReq} />
            </div>
          )}
        </div>

        {/* Reason for Override & Submit Request */}
        {hasAnyOverride && (
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Label className="font-bold">Yêu cầu Kiểm duyệt từ Admin</Label>
                <p className="text-xs">Bạn đang thực hiện ghi đè chính sách hệ thống. Vui lòng cung cấp lý do chi tiết để Admin xem xét và phê duyệt.</p>
              </div>
            </div>

            <Textarea
              placeholder="Ví dụ: Lớp học này có nhiều sinh viên part-time, cần nới lỏng cảnh báo Ghosting lên 7 ngày..."
              className="min-h-[100px] border-amber-500/30 focus-visible:ring-amber-500/20"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                disabled={!overrideReason.trim() || !isGhostingValid || !isBugRateValid}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
              >
                Gửi yêu cầu Ghi đè
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
