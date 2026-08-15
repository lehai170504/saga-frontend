"use client";

import React from "react";
import { useCourseWeights } from "@/features/lecturer/hooks/useCourseWeights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { Code, FileText, PenTool, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseWeightsConfigProps {
  courseId: string;
}

export const CourseWeightsConfig = ({ courseId }: CourseWeightsConfigProps) => {
  const { data: weights, isLoading } = useCourseWeights(courseId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!weights) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-3xl border border-border/50">
        <Scale className="w-12 h-12 mb-4 text-muted-foreground/50" />
        <p className="text-sm font-medium">Chưa có cấu hình trọng số cho khóa học này</p>
      </div>
    );
  }

  const formatWeight = (val: number | undefined) => {
    if (val === undefined || val === null) return "0.00";
    return val.toFixed(2);
  };

  const weightCards = [
    {
      title: "Trọng số Code",
      value: formatWeight(weights.codeWeight),
      icon: Code,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Trọng số Document",
      value: formatWeight(weights.documentWeight),
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Trọng số Design",
      value: formatWeight(weights.designWeight),
      icon: PenTool,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Cấu hình Trọng số Đánh giá (Contribution Slice Weights)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weightCards.map((card, index) => (
          <Card key={index} className={cn("rounded-3xl border shadow-sm overflow-hidden", card.border)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{card.title}</CardTitle>
              <div className={cn("p-2 rounded-xl", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{card.value}%</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cảnh báo lưu ý */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 text-sm">
        <div className="text-primary mt-0.5">ℹ️</div>
        <div>
          <p className="font-semibold text-foreground mb-1">Lưu ý về Trọng số Đánh giá</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Các trọng số mặc định này được áp dụng làm cơ sở cho môn học (ID: <strong>{weights.courseId}</strong>).
            Lưu ý: Việc điều chỉnh trọng số đánh giá thực tế hiện đã được chuyển xuống cấp độ Nhóm (Team) để đảm bảo tính linh hoạt. Giảng viên và Admin có thể điều chỉnh trọng số cho từng nhóm cụ thể trong trang quản lý Nhóm.
          </p>
        </div>
      </div>
    </div>
  );
};
