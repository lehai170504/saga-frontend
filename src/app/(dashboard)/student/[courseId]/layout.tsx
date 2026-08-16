"use client";

import React from "react";
import { StudentCourseProvider } from "@/context/StudentCourseContext";
import { CourseEndedBanner } from "@/components/shared/course-ended-banner";
import { useParams } from "next/navigation";

export default function StudentCourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = typeof params?.courseId === "string" ? params.courseId : "";

  return (
    <StudentCourseProvider>
      {courseId && <CourseEndedBanner courseId={courseId} />}
      {children}
    </StudentCourseProvider>
  );
}
