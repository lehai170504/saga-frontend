"use client";

import React from "react";
import { StudentProjectStatsView } from "@/features/student/components/student-project-stats-view";

export default function StudentProjectStatsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentProjectStatsView courseId={courseId} />;
}
