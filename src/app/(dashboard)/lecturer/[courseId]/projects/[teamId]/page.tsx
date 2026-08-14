import React from "react";
import { ProjectDetailClient } from "./project-detail-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết dự án | SAGA",
  description: "Trang chi tiết dự án dành cho giảng viên",
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ courseId: string, teamId: string }> }) {
  const { courseId, teamId } = await params;

  return (
    <ProjectDetailClient courseId={courseId} teamId={teamId} />
  );
}
