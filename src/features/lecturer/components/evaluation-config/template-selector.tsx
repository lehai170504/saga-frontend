"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourseContributionWeights, useUpdateCourseContributionWeights } from "../../hooks/useContribution";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSelector({ courseId }: { courseId: string }) {
  const { data: weightsData, isLoading } = useCourseContributionWeights(courseId);
  const { mutate: updateWeights, isPending } = useUpdateCourseContributionWeights();

  const [customCodeWeight, setCustomCodeWeight] = useState<number | null>(null);
  const [customDocumentWeight, setCustomDocumentWeight] = useState<number | null>(null);
  const [customDesignWeight, setCustomDesignWeight] = useState<number | null>(null);

  const codeWeight = customCodeWeight ?? (weightsData ? Number(weightsData.codeWeight.toFixed(2)) : 33.33);
  const documentWeight = customDocumentWeight ?? (weightsData ? Number(weightsData.documentWeight.toFixed(2)) : 33.33);
  const designWeight = customDesignWeight ?? (weightsData ? Number(weightsData.designWeight.toFixed(2)) : 33.34);

  const setCodeWeight = (val: number) => setCustomCodeWeight(val);
  const setDocumentWeight = (val: number) => setCustomDocumentWeight(val);
  const setDesignWeight = (val: number) => setCustomDesignWeight(val);

  const totalWeight = (codeWeight + documentWeight + designWeight).toFixed(2);
  const isValid = parseFloat(totalWeight) === 100;
  const isModified = weightsData && (
    codeWeight !== weightsData.codeWeight ||
    documentWeight !== weightsData.documentWeight ||
    designWeight !== weightsData.designWeight
  );

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Tổng trọng số phải bằng ĐÚNG 100%");
      return;
    }
    updateWeights(
      { courseId, data: { codeWeight, documentWeight, designWeight } },
      {
        onSuccess: () => {
          toast.success("Đã lưu trọng số thành công!");
        },
        onError: (err: Error) => {
          const resErr = err as Error & { response?: { data?: { message?: string } } };
          toast.error(resErr?.response?.data?.message || "Có lỗi xảy ra khi lưu thay đổi");
        }
      }
    );
  };

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Kế thừa & Tùy chỉnh Khung Hệ số (Slices)
          </CardTitle>
          <CardDescription>
            Tùy chỉnh phân bổ ngân sách 100% phần trăm đóng góp cho các nhóm công việc: <strong>Lập trình, Viết tài liệu, và Thiết kế</strong>. Mặc định là 1/3 cho mỗi nhóm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Template Info */}
              <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Tổng ngân sách điểm Đóng góp (Contribution): 100%</span>
                </div>
                <p className="text-sm">
                  Tổng 3 trọng số phải bằng đúng 100%. Nếu thay đổi hệ số này, phần Đóng góp thực tế của sinh viên sẽ tự động scale dựa trên các loại Task tương ứng.
                </p>
              </div>

              {/* Customizing Multipliers */}
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold w-1/3">1. Lập trình & Logic (Code)</Label>
                    <div className="flex items-center gap-2 w-2/3">
                      <Input
                        type="number"
                        step="0.01"
                        value={codeWeight}
                        onChange={(e) => setCodeWeight(parseFloat(e.target.value) || 0)}
                        className="h-10 text-center font-bold"
                      />
                      <span className="text-sm font-medium w-6">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold w-1/3">2. Viết Tài liệu (Docs)</Label>
                    <div className="flex items-center gap-2 w-2/3">
                      <Input
                        type="number"
                        step="0.01"
                        value={documentWeight}
                        onChange={(e) => setDocumentWeight(parseFloat(e.target.value) || 0)}
                        className="h-10 text-center font-bold"
                      />
                      <span className="text-sm font-medium w-6">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold w-1/3">3. Thiết kế/Kiến trúc (Design)</Label>
                    <div className="flex items-center gap-2 w-2/3">
                      <Input
                        type="number"
                        step="0.01"
                        value={designWeight}
                        onChange={(e) => setDesignWeight(parseFloat(e.target.value) || 0)}
                        className="h-10 text-center font-bold"
                      />
                      <span className="text-sm font-medium w-6">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Tổng cộng:</span>
                      <span className={`font-bold text-lg ${!isValid ? "text-destructive" : "text-success"}`}>
                        {totalWeight}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isModified && (
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-start gap-2 text-primary">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <Label className="font-bold">Lưu Thay đổi Trọng số</Label>
                      <p className="text-xs">Hệ số đã thay đổi so với cấu hình gốc. Bạn có thể lưu trực tiếp các thay đổi này.</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmit}
                      disabled={isPending || !isValid}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
                    >
                      {isPending ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-1">
              <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Cấu hình Đang dùng</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Lập trình (Code):</span>
                      <strong className="text-foreground">{weightsData?.codeWeight != null ? weightsData.codeWeight.toFixed(2) : "33.33"}%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Viết tài liệu (Docs):</span>
                      <strong className="text-foreground">{weightsData?.documentWeight != null ? weightsData.documentWeight.toFixed(2) : "33.33"}%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Thiết kế (Design):</span>
                      <strong className="text-foreground">{weightsData?.designWeight != null ? weightsData.designWeight.toFixed(2) : "33.34"}%</strong>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border/50 text-xs">
                    <p>Lần cập nhật cuối: {weightsData?.lastUpdatedAt ? new Date(weightsData.lastUpdatedAt).toLocaleDateString("vi-VN") : "Chưa có thay đổi"}</p>
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

