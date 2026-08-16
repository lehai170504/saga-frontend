"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { isCourseEnded } from "@/lib/course-utils";

export function CourseEndedBanner({ courseId }: { courseId: string }) {
  const { data: course } = useCourse(courseId);

  if (!course || !isCourseEnded(course.semester?.endDate)) return null;

  return (
    <div className="bg-amber-500/15 border border-amber-500/50 text-amber-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 w-full shadow-sm">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
      <div className="flex-1 text-sm font-medium">
        <strong className="font-bold">Khóa học đã kết thúc.</strong> Bạn đang xem ở chế độ Read-Only (Chỉ Xem). Không thể thực hiện các thao tác thay đổi dữ liệu.
      </div>
    </div>
  );
}
