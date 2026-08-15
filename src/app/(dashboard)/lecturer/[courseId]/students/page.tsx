import React from "react";
import { Metadata } from "next";
import { StudentListClient } from "../../../../../features/student/components/student-list-client";


export const metadata: Metadata = {
  title: "Danh sách Sinh viên | SAGA",
  description: "Quản lý danh sách sinh viên trong lớp học",
};

export default async function StudentsManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return (
    <StudentListClient courseId={courseId} />
  );
}