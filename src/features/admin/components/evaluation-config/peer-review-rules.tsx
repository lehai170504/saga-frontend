import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PeerReviewRules() {
  const [requireLowScoreComment, setRequireLowScoreComment] = useState(true);
  const [requireHighScoreComment, setRequireHighScoreComment] = useState(true);

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle>Luật Đánh giá chéo Mù Toàn Hệ thống</CardTitle>
        <CardDescription>
          Thiết lập hệ số điều chỉnh (Adjustment Factor) làm mốc tiêu chuẩn cho toàn trường. Giảng viên có thể ghi đè ở cấp độ Lớp, nhưng đây là cấu hình mặc định. Quá trình đánh giá luôn đảm bảo tính ẩn danh (Blind Review).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* VOTE RULES */}
        <div className="space-y-4">
          {[
            { star: 5, label: "Xuất sắc (5 Sao)", desc: "Làm vượt kỳ vọng, hỗ trợ tốt đồng đội.", defaultVal: 1.1, color: "text-amber-500" },
            { star: 4, label: "Khá Tốt (4 Sao)", desc: "Hoàn thành tốt nhiệm vụ được giao.", defaultVal: 1.05, color: "text-blue-500" },
            { star: 3, label: "Đạt (3 Sao)", desc: "Hoàn thành mức cơ bản, đúng hạn.", defaultVal: 1.0, color: "text-emerald-500" },
            { star: 2, label: "Kém (2 Sao)", desc: "Trễ hạn nhiều, cần người khác gánh.", defaultVal: 0.8, color: "text-orange-500" },
            { star: 1, label: "Rất Tệ (1 Sao)", desc: "Không làm gì, thái độ thiếu hợp tác.", defaultVal: 0.5, color: "text-destructive" },
          ].map((item) => (
            <div key={item.star} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-2 w-40 shrink-0">
                <Star className={`w-5 h-5 fill-current ${item.color}`} />
                <span className="font-bold">{item.label}</span>
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {item.desc}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Hệ số nhân</Label>
                <Input
                  type="number"
                  step="0.05"
                  defaultValue={item.defaultVal}
                  className={`w-24 text-center font-bold h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary ${item.defaultVal < 1 ? 'text-destructive' : item.defaultVal > 1 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* REQUIREMENT SETTINGS */}
        <div className="p-5 rounded-xl border border-border/50 bg-muted/30 space-y-4">
          <h4 className="font-bold text-sm">Chính sách Phản hồi Hệ thống</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
              <Label htmlFor="req-low" className="font-medium cursor-pointer">Bắt buộc Comment khi vote {"<="} 2 sao</Label>
              <Switch id="req-low" checked={requireLowScoreComment} onCheckedChange={setRequireLowScoreComment} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
              <Label htmlFor="req-high" className="font-medium cursor-pointer">Bắt buộc Comment khi vote 5 sao</Label>
              <Switch id="req-high" checked={requireHighScoreComment} onCheckedChange={setRequireHighScoreComment} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
