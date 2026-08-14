import React from "react";
import { Metadata } from "next";
import { LecturerDashboardClient } from "./lecturer-dashboard-client";


export const metadata: Metadata = {
  title: "Tổng quan Lớp học | SAGA Dashboard",
  description: "Trạm kiểm soát không lưu theo dõi tiến độ và cảnh báo Agile của toàn lớp.",
};

export default async function LecturerDashboardPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return (
    <LecturerDashboardClient courseId={courseId} />
  );
}
