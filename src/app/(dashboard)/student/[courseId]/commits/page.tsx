"use client";

import React from "react";
import { StudentCommitsView } from "@/features/student/components/student-commits-view";

export default function StudentCommitsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentCommitsView courseId={courseId} />;
}
