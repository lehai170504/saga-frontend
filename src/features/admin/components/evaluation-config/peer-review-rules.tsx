import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Info, Lock, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PeerReviewRules() {
  const [requireLowScoreComment, setRequireLowScoreComment] = useState(true);
  const [requireHighScoreComment, setRequireHighScoreComment] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle>Luật Đánh giá chéo Mù Toàn Hệ thống</CardTitle>
          <CardDescription>
            Bộ thông số Hệ số điều chỉnh (Adjustment Factor) được <strong>khóa cố định</strong> để đảm bảo tính công bằng tuyệt đối trên toàn trường. Không Giảng viên hay Admin nào được phép tùy ý thay đổi các hệ số cốt lõi này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-8">
              {/* VOTE RULES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm font-medium mb-4">
                  <Lock className="w-4 h-4" /> Hệ số điều chỉnh đã được khóa cứng theo Quy chế Đào tạo.
                </div>
                {[
                  { star: 5, label: "Xuất sắc (5 Sao)", desc: "Làm vượt kỳ vọng, hỗ trợ tốt đồng đội.", defaultVal: 1.1, color: "text-amber-500" },
                  { star: 4, label: "Khá Tốt (4 Sao)", desc: "Hoàn thành tốt nhiệm vụ được giao.", defaultVal: 1.05, color: "text-blue-500" },
                  { star: 3, label: "Đạt (3 Sao)", desc: "Hoàn thành mức cơ bản, đúng hạn.", defaultVal: 1.0, color: "text-emerald-500" },
                  { star: 2, label: "Kém (2 Sao)", desc: "Trễ hạn nhiều, cần người khác gánh.", defaultVal: 0.8, color: "text-orange-500" },
                  { star: 1, label: "Rất Tệ (1 Sao)", desc: "Không làm gì, thái độ thiếu hợp tác.", defaultVal: 0.5, color: "text-destructive" },
                ].map((item) => (
                  <div key={item.star} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50 transition-colors opacity-90">
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
                        disabled
                        value={item.defaultVal}
                        className={`w-24 text-center font-bold h-10 rounded-xl bg-muted border-border/50 ${item.defaultVal < 1 ? 'text-destructive' : item.defaultVal > 1 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
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
            </div>

            <div className="xl:col-span-1">
              <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Cơ sở Toán học & Học thuật</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground pt-4">
                  <div className="space-y-3">
                    <p className="font-bold text-foreground">Tại sao lại là những con số này?</p>
                    <div className="space-y-2">
                      <p><strong className="text-emerald-600 dark:text-emerald-400">3 Sao (1.0):</strong> Hoàn thành 100% effort kỳ vọng thì nhận 100% điểm.</p>
                      <p><strong className="text-blue-500">4 Sao (1.05):</strong> Bonus 5% (+0.5 điểm) - Phần thưởng khích lệ an toàn.</p>
                      <p><strong className="text-amber-500">5 Sao (1.10):</strong> Mức trần Bonus 10% (+1.0 điểm). Chặn đứng rủi ro sinh viên thao túng điểm bằng cách "vote chéo 5 sao".</p>
                      <p><strong className="text-orange-500">2 Sao (0.80):</strong> Phạt 20% vì đồng đội phải gánh 20% khối lượng công việc. Chuyển sinh viên từ Khá (8.0) xuống Trung bình (6.4).</p>
                      <p><strong className="text-destructive">1 Sao (0.50):</strong> Cứa cổ Freerider. Giảm 50% điểm, chặn đứng khả năng qua môn nhờ bám víu vào nhóm.</p>
                    </div>
                  </div>

                  {/* FORMULA SECTION */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-primary" /> Công thức Chấm điểm
                    </h4>
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50 font-mono space-y-3">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">Bước 1: Tính Slices Cá nhân</span>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] leading-relaxed">
                          Slices = (Story Points) × Multiplier × Peer_Review
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">Bước 2: Chốt % Đóng góp</span>
                        <p className="text-primary font-bold text-[11px] leading-relaxed">
                          % Final = Slices_Cá_Nhân / Tổng_Slices_Nhóm
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-2 text-muted-foreground list-none pl-1">
                      <li>• <strong className="text-foreground">Multiplier (Hệ số công việc):</strong> Do Giảng viên cấu hình (VD: Code x2.0, Docs x1.0).</li>
                      <li>• <strong className="text-foreground">Peer Review (Hệ số Vote):</strong> Mặc định toàn trường (VD: 5 sao x1.1, 1 sao x0.5).</li>
                    </ul>
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
