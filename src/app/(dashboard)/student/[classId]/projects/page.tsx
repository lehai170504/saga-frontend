"use client";

import React from "react";
import { StudentProjectsList } from "@/features/student/components/student-projects-list";

export default function StudentProjectsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentProjectsList classId={classId} />;
}
