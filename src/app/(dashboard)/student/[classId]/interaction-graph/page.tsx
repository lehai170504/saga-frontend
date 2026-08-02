"use client";

import React from "react";
import { StudentInteractionGraph } from "@/features/student/components/student-interaction-graph";

export default function StudentInteractionGraphPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentInteractionGraph classId={classId} />;
}
