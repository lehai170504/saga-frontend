"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseProgressTable } from "@/features/admin/components/course-progress-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminCourseProgress } from "@/features/admin/hooks/useCourseProgress";

export default function CourseProgressPage() {
  const [page, setPage] = useState(0);

  const { data: progressData, isLoading } = useAdminCourseProgress({
    page: page,
    size: 20,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Tiến độ Khóa học"
        description="Theo dõi số lượng sinh viên, nhóm, dự án và tiến trình đánh giá chéo của toàn bộ các khóa học."
        workspace="Tổng quan"
      />

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                ))}
              </div>
            </div>
          ) : (
            <CourseProgressTable
              data={progressData?.content || []}
              pageIndex={progressData?.number || 0}
              totalPages={progressData?.totalPages || 0}
              totalElements={progressData?.totalElements || 0}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
