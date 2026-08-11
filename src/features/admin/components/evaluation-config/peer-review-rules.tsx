import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Info } from "lucide-react";
import { useDefaultRubric } from "../../hooks/useRubric";
import { Skeleton } from "@/components/shared/Skeleton";

export function PeerReviewRules() {
  const { data: defaultRubric, isLoading, isError } = useDefaultRubric();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-border/50">
          <div>
            <CardTitle className="text-2xl">Tiêu chí Đánh giá chéo Toàn Hệ thống</CardTitle>
            <CardDescription className="mt-2 text-base">
              Bộ tiêu chí này được thiết lập mặc định trong toàn hệ thống để làm cơ sở đánh giá điểm đóng góp của sinh viên.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-6">
            {/* VOTE RULES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-lg border border-primary/20 text-sm font-medium mb-4">
                <Info className="w-4 h-4" /> Các tiêu chí này được áp dụng làm khung đánh giá mặc định cho tất cả các lớp học trong hệ thống.
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
                    className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-1 w-60 shrink-0">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-current text-primary" />
                        <span className="font-bold text-lg text-foreground">{item.criteriaName}</span>
                      </div>
                      <div className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-xs font-semibold w-max border border-border">
                        Hệ số: <span className="ml-1 text-primary">{item.weight.toFixed(2)}</span>
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
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
