"use client";

import React from "react";
import { StudentSprintDetailsView } from "@/features/student/components/student-sprint-details-view";

export default function StudentSprintDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string; sprintId: string }>;
}) {
  const { courseId, sprintId } = React.use(params);

  return <StudentSprintDetailsView courseId={courseId} sprintId={sprintId} />;
}
