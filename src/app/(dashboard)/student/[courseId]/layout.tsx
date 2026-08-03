"use client";

import React from "react";
import { StudentCourseProvider } from "@/context/StudentCourseContext";

export default function StudentCourseLayout({ children }: { children: React.ReactNode }) {
  return <StudentCourseProvider>{children}</StudentCourseProvider>;
}
