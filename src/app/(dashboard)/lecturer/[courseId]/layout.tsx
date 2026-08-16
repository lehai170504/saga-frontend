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
      {courseId && <CourseEndedBanner courseId={courseId} />}
      {children}
    </LecturerCourseProvider>
  );
}
