"use client";

import React from "react";
import { StudentDashboardView } from "@/features/student/components/student-dashboard-view";

export default function OverviewDashboardPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentDashboardView classId={classId} />;
}
