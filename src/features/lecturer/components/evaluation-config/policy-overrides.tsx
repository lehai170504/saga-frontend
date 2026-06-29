"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Activity, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function PolicyOverrides() {
  const [overrideGhosting, setOverrideGhosting] = useState(false);
  const [ghostingDays, setGhostingDays] = useState(5);

  const [overrideBugRate, setOverrideBugRate] = useState(false);
  const [bugRate, setBugRate] = useState(30);

  const [overridePeerReview, setOverridePeerReview] = useState(false);
  const [peerReviewReq, setPeerReviewReq] = useState(true);

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Ghi đè Chính sách (Policy Overrides)
        </CardTitle>
        <CardDescription>
          Mặc định lớp học sẽ tuân theo các luật cảnh báo và Peer Review do Admin cấu hình. Bật công tắc "Ghi đè" nếu bạn muốn thay đổi các chỉ số này cho phù hợp với tiến độ riêng của lớp.
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
            <div className="flex items-center gap-3 pt-3 border-t border-primary/20">
              <Label className="text-xs font-bold text-primary uppercase">Cảnh báo Đỏ (Red Flag) sau:</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={ghostingDays} 
                  onChange={(e) => setGhostingDays(parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center font-bold border-primary/30" 
                />
                <span className="text-sm font-medium">Ngày không có log/commit</span>
              </div>
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
            <div className="flex items-center gap-3 pt-3 border-t border-primary/20">
              <Label className="text-xs font-bold text-primary uppercase">Ngưỡng Phạt Hệ số:</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{">"}</span>
                <Input 
                  type="number" 
                  value={bugRate} 
                  onChange={(e) => setBugRate(parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center font-bold border-primary/30" 
                />
                <span className="text-sm font-medium">% Tổng số Task</span>
              </div>
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

      </CardContent>
    </Card>
  );
}
