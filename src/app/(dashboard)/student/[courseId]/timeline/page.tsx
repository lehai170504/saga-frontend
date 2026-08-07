"use client";

import React from "react";
import { StudentTimelineView } from "@/features/student/components/student-timeline-view";

export default function StudentTimelinePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentTimelineView courseId={courseId} />;
}
