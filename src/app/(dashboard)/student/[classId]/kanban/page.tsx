"use client";

import React from "react";
import { StudentKanbanBoard } from "@/features/student/components/student-kanban-board";

export default function StudentKanbanPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentKanbanBoard classId={classId} />;
}
