"use client";

import React from "react";
import { LecturerCourseProvider } from "@/context/LecturerCourseContext";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <LecturerCourseProvider>{children}</LecturerCourseProvider>;
}
