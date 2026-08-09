import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Info, Calculator, StarHalf } from "lucide-react";
import { useDefaultRubric } from "../../hooks/useRubric";
import { Skeleton } from "@/components/shared/Skeleton";
import { CreateRubricDialog } from "./create-rubric-dialog";
import { RubricActions } from "./rubric-actions";

export function PeerReviewRules() {
  const { data: defaultRubric, isLoading, isError } = useDefaultRubric();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-border/50">
          <div>
            <CardTitle className="text-2xl">Luật Đánh giá chéo Mù Toàn Hệ thống</CardTitle>
            <CardDescription className="mt-2 text-base">
              Bộ thông số Hệ số điều chỉnh (Adjustment Factor) quy định mức ảnh hưởng của từng mức đánh giá (Star) tới điểm quá trình của sinh viên. Admin có thể thay đổi các tiêu chí này.
            </CardDescription>
          </div>
          <CreateRubricDialog />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* VOTE RULES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 text-sm font-medium mb-4">
                  <StarHalf className="w-4 h-4" /> Các tiêu chí này sẽ được áp dụng làm luật mặc định cho tất cả lớp học trong hệ thống.
                </div>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                  </div>
                ) : isError ? (
                  <div className="p-4 text-center text-destructive bg-destructive/10 rounded-xl">
                    Lỗi khi tải cấu hình đánh giá chéo.
                  </div>
                ) : defaultRubric?.criteria && defaultRubric.criteria.length > 0 ? (
                  defaultRubric.criteria.map((item) => (
                    <div
                      key={item.rubricId}
                      className={`relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all ${item.weight === 1.0
                        ? 'bg-success/5 border-success/30 shadow-sm shadow-emerald-500/5'
                        : 'border-border bg-background hover:border-primary/30 hover:shadow-sm'
                        }`}
                    >
                      <div className="absolute top-4 right-4">
                        <RubricActions rubric={item} />
                      </div>

                      <div className="flex flex-col gap-1 w-44 shrink-0">
                        <div className="flex items-center gap-2">
                          <Star className={`w-5 h-5 fill-current ${item.weight < 1 ? 'text-destructive' : item.weight > 1 ? 'text-primary' : 'text-success'}`} />
                          <span className={`font-bold text-lg ${item.weight === 1.0 ? 'text-success' : ''}`}>{item.criteriaName}</span>
                        </div>
                        <div className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-xs font-semibold w-max border border-border">
                          Hệ số: <span className={`ml-1 ${item.weight < 1 ? 'text-destructive' : item.weight > 1 ? 'text-primary' : 'text-success'}`}>{item.weight.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex-1 text-sm text-muted-foreground pr-10">
                        {item.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/30">
                    <Star className="w-10 h-10 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium text-lg">Chưa có tiêu chí đánh giá nào.</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Bấm "Thêm Tiêu chí" để tạo luật đánh giá mới.</p>
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
                    <div className="bg-background/80 p-3 rounded-lg border border-border/50 font-mono space-y-3 shadow-sm">
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
                      <li>• <strong className="text-foreground">Peer Review (Hệ số Vote):</strong> Được thiết lập thông qua Tiêu chí Đánh giá chéo.</li>
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
