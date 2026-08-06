"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourse } from "@/features/courses/hooks/useCourses";

interface StudentDashboardViewProps {
  courseId?: string;
}

export function StudentDashboardView({ courseId }: StudentDashboardViewProps) {
  const [mounted, setMounted] = useState(false);
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = isLoadingCourse || !mounted;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <PageHeader
        title="Tổng quan Khóa học"
        description={
          courseData
            ? `${courseData.semester?.name || ""} · Khóa học ${courseData.courseCode || ""} · ${courseData.subject?.subjectCode || ""}`
            : "Đang tải dữ liệu khóa học..."
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : (
            <>
              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  {courseData?.subject?.name || "Môn học"}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Môn học
                </p>
              </Card>

              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-success">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  {(courseData?.instructor as Record<string, unknown>)?.name as string || "Giảng viên"}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Giảng viên hướng dẫn
                </p>
              </Card>

              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-warning">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  Đang hoạt động
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Trạng thái
                </p>
              </Card>
            </>
          )}
      </div>
    </div>
  );
}
