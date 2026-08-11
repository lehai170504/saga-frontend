"use client";

import React from "react";
import { useParams } from "next/navigation";
import { StudentSprintsView } from "@/features/student/components/student-sprints-view";

export default function StudentSprintsPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || "";

  return <StudentSprintsView courseId={courseId} />;
}

