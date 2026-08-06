import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Info, Lock, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDefaultRubric } from "../../hooks/useRubric";
import { Skeleton } from "@/components/shared/Skeleton";

export function PeerReviewRules() {
  const { data: defaultRubric, isLoading, isError } = useDefaultRubric();

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
                <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 text-sm font-medium mb-4">
                  <Lock className="w-4 h-4" /> Hệ số điều chỉnh đã được khóa cứng theo Quy chế Đào tạo.
                </div>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : isError ? (
                  <div className="p-4 text-center text-destructive bg-destructive/10 rounded-xl">
                    Lỗi khi tải cấu hình đánh giá chéo.
                  </div>
                ) : defaultRubric?.items && defaultRubric.items.length > 0 ? (
                  defaultRubric.items.map((item) => (
                    <div
                      key={item.star}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${item.adjustmentFactor === 1.0
                        ? 'bg-success/10 border-success/20 shadow-sm shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                        : 'border-border/50 bg-background/50 opacity-90'
                        }`}
                    >
                      <div className="flex items-center gap-2 w-44 shrink-0">
                        <Star className={`w-5 h-5 fill-current ${item.adjustmentFactor < 1 ? 'text-destructive' : item.adjustmentFactor > 1 ? 'text-primary' : 'text-success'}`} />
                        <span className={`font-bold ${item.adjustmentFactor === 1.0 ? 'text-success' : ''}`}>{item.label}</span>
                      </div>
                      <div className="flex-1 text-sm text-muted-foreground flex flex-col justify-center">
                        {item.adjustmentFactor === 1.0 ? (
                          <span className="font-semibold text-success dark:text-emerald-300">
                            {item.description}
                          </span>
                        ) : (
                          item.description
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Hệ số nhân</Label>
                        <Input
                          type="number"
                          disabled
                          value={item.adjustmentFactor}
                          className={`w-24 text-center font-bold h-10 rounded-xl bg-muted border-border/50 ${item.adjustmentFactor < 1 ? 'text-destructive' : item.adjustmentFactor > 1 ? 'text-primary text-primary' : 'text-success text-success'}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground bg-muted/50 rounded-xl">
                    Chưa có cấu hình đánh giá chéo.
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-muted/30 space-y-4">
                <h4 className="font-bold text-sm">Chính sách Phản hồi Hệ thống</h4>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                      <Label htmlFor="req-low" className="font-medium cursor-pointer">Bắt buộc Comment khi vote {"<="} 2 sao</Label>
                      <Switch id="req-low" checked={defaultRubric?.requireLowScoreComment ?? true} disabled />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                      <Label htmlFor="req-high" className="font-medium cursor-pointer">Bắt buộc Comment khi vote 5 sao</Label>
                      <Switch id="req-high" checked={defaultRubric?.requireHighScoreComment ?? true} disabled />
                    </div>
                  </div>
                )}
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
                      <p><strong className="text-destructive">1 Sao (0.50):</strong> Loss Aversion & PIP. Trừng phạt tâm lý (sợ mất mát), trừ 50% xem như đòn cảnh cáo cấp cao nhất để triệt tiêu ý định free-rider.</p>
                      <p><strong className="text-primary">2 Sao (0.80):</strong> Phạt 20% vì đồng đội phải gánh 20% khối lượng công việc. Chuyển sinh viên từ Khá xuống Trung bình.</p>
                      <div className="p-3 bg-success/10 border border-success/20 rounded-xl my-3">
                        <p className="text-success font-semibold"><strong className="text-success">3 Sao (1.0) - MỐC CHUẨN:</strong> Hoàn thành 100% khối lượng kỳ vọng thì nhận 100% điểm. (Baseline).</p>
                      </div>
                      <p><strong className="text-primary">4 Sao (1.05):</strong> Bonus 5% - Phần thưởng khích lệ an toàn.</p>
                      <p><strong className="text-primary">5 Sao (1.10):</strong> Performance Bonus. Mức thưởng 10% tiêu chuẩn đánh giá 360 độ của doanh nghiệp IT, chống &quot;chính trị chốn công sở&quot;.</p>
                    </div>
                  </div>

                  {/* FORMULA SECTION */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-primary" /> Công thức Chấm điểm
                    </h4>
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50 font-mono space-y-3">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">1. Tích lũy Sprint (Thực thi)</span>
                        <p className="text-success font-bold text-[11px] leading-relaxed">
                          Slices_Sprint = ∑(SP × Hệ số) + Bonus
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">2. Chốt sổ Phase (Đánh giá)</span>
                        <p className="text-primary font-bold text-[11px] leading-relaxed">
                          Slices_Phase = ∑(Slices_Sprint) × Peer_Review
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">3. Đóng góp Cuối kỳ</span>
                        <p className="text-primary font-bold text-[11px] leading-relaxed">
                          % Final = Slices_Final_Cá_Nhân / Tổng_Slices_Nhóm
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-2 text-muted-foreground list-none pl-1">
                      <li>• <strong className="text-foreground">Multiplier (Hệ số công việc):</strong> (VD: Code x2.0, Docs x1.0).</li>
                      <li>• <strong className="text-foreground">Bonus Tương tác:</strong> Điểm thưởng cho Review/Thảo luận PR.</li>
                      <li>• <strong className="text-foreground">Peer Review (Hệ số Vote):</strong> Khóa mặc định (VD: 5 sao x1.1, 1 sao x0.5).</li>
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
