"use client";

import React from "react";
import { StudentDashboardView } from "@/features/student/components/student-dashboard-view";

export default function OverviewDashboardPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentDashboardView courseId={courseId} />;
}
