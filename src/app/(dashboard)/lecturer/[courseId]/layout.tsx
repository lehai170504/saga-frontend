"use client";

import React from "react";
import { LecturerCourseProvider } from "@/context/LecturerCourseContext";
import { CourseEndedBanner } from "@/components/shared/course-ended-banner";
import { useParams } from "next/navigation";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = typeof params?.courseId === "string" ? params.courseId : "";

  return (
    <LecturerCourseProvider>
      <div className="p-4 sm:p-6 pb-0 max-w-[1200px] mx-auto w-full">
        {courseId && <CourseEndedBanner courseId={courseId} />}
      </div>
      {children}
    </LecturerCourseProvider>
  );
}
