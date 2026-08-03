"use client";

import React from "react";
import { StudentProjectsList } from "@/features/student/components/student-projects-list";

export default function StudentProjectsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentProjectsList courseId={courseId} />;
}
