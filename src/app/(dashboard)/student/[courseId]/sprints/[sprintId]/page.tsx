"use client";

import React from "react";
import { useParams } from "next/navigation";
import { StudentSprintDetailsView } from "@/features/student/components/student-sprint-details-view";

export default function StudentSprintDetailsPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || "";
  const sprintId = (params?.sprintId as string) || "";

  return <StudentSprintDetailsView courseId={courseId} sprintId={sprintId} />;
}

