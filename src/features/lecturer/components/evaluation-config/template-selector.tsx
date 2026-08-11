"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/authStore";
import { useCourseContributionWeights, useRequestCourseContributionWeight } from "../../hooks/useContribution";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSelector({ courseId }: { courseId: string }) {
  const { user } = useAuthStore();
  const { data: weightsData, isLoading } = useCourseContributionWeights(courseId);
  const { mutate: requestOverride, isPending } = useRequestCourseContributionWeight();

  const [codeWeight, setCodeWeight] = useState(33.33);
  const [documentWeight, setDocumentWeight] = useState(33.33);
  const [designWeight, setDesignWeight] = useState(33.34);
  const [overrideReason, setOverrideReason] = useState("");

  // Sync state when data is loaded
  useEffect(() => {
    if (weightsData) {
      setCodeWeight(weightsData.codeWeight);
      setDocumentWeight(weightsData.documentWeight);
      setDesignWeight(weightsData.designWeight);
    }
  }, [weightsData]);

  const totalWeight = (codeWeight + documentWeight + designWeight).toFixed(2);
  const isValid = Math.abs(parseFloat(totalWeight) - 100) < 0.1;
  const isModified = weightsData && (
    codeWeight !== weightsData.codeWeight ||
    documentWeight !== weightsData.documentWeight ||
    designWeight !== weightsData.designWeight
  );

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Tổng trọng số phải bằng xấp xỉ 100%");
      return;
    }
    if (!overrideReason.trim()) {
      toast.error("Vui lòng nhập lý do để Admin phê duyệt");
      return;
    }
    requestOverride(
      { courseId, data: { codeWeight, documentWeight, designWeight, reason: overrideReason, lecturerId: user?.localProfileId || "" } },
      {
        onSuccess: () => {
          toast.success("Đã gửi yêu cầu thay đổi trọng số lên Admin thành công!");
          setOverrideReason("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu");
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
                  Tổng 3 trọng số phải bằng đúng 100%. Nếu thay đổi hệ số này, phần Đóng góp thực tế của sinh viên sẽ tự động scale dựa trên các loại Task tương ứng. Việc thay đổi cần Admin kiểm duyệt.
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

              {/* Reason for Override */}
              {isModified && (
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-start gap-2 text-primary">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <Label className="font-bold">Yêu cầu Kiểm duyệt từ Admin</Label>
                      <p className="text-xs">Hệ số đã thay đổi so với cấu hình gốc. Vui lòng nhập lý do (VD: Đồ án lớp này tập trung mạnh vào AI, nên cần tăng trọng số Lập trình).</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Lý do điều chỉnh..."
                    className="min-h-[100px] border-primary/20 focus-visible:ring-primary/20"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmit}
                      disabled={isPending || !overrideReason.trim() || !isValid}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
                    >
                      {isPending ? "Đang gửi..." : "Gửi yêu cầu lên Admin"}
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
                      <strong className="text-foreground">{weightsData?.codeWeight ?? 33.33}%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Viết tài liệu (Docs):</span>
                      <strong className="text-foreground">{weightsData?.documentWeight ?? 33.33}%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Thiết kế (Design):</span>
                      <strong className="text-foreground">{weightsData?.designWeight ?? 33.34}%</strong>
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

