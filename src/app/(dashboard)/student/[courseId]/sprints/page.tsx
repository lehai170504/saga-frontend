"use client";

import React from "react";
import { StudentSprintsView } from "@/features/student/components/student-sprints-view";

export default function StudentSprintsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentSprintsView courseId={courseId} />;
}
