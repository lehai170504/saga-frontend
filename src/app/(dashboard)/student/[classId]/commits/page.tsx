"use client";

import React from "react";
import { StudentCommits } from "@/features/student/components/student-commits";

export default function StudentCommitsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);

  return <StudentCommits classId={classId} />;
}
