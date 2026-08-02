"use client";

import React from "react";
import { StudentHeatmap } from "@/features/student/components/student-heatmap";

export default function StudentHeatmapPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentHeatmap classId={classId} />;
}
