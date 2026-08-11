"use client";

import React from "react";
import { StudentBoardView } from "@/features/student/components/student-board-view";

export default function StudentBoardPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  return <StudentBoardView courseId={courseId} />;
}
