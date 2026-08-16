"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { isCourseEnded } from "@/lib/course-utils";

export function CourseEndedBanner({ courseId }: { courseId: string }) {
  const { data: course } = useCourse(courseId);

  if (!course || !isCourseEnded(course)) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-4 pointer-events-none animate-in slide-in-from-top-8 fade-in duration-700">
      <div className="bg-amber-500/10 backdrop-blur-2xl border border-amber-500/30 text-amber-700 dark:text-amber-500 px-5 py-2.5 rounded-full shadow-2xl shadow-amber-500/10 flex items-center gap-3 pointer-events-auto">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="text-sm font-medium">
          <strong className="font-bold">Khóa học đã kết thúc.</strong> Bạn đang xem ở chế độ Read-Only (Chỉ Xem).
        </div>
      </div>
    </div>
  );
}
