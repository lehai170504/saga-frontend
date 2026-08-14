import React from "react";
import { Metadata } from "next";
import { StudentProfileClient } from "./student-profile-client";


export const metadata: Metadata = {
  title: "Hồ sơ Sinh viên | SAGA",
  description: "Chi tiết năng lực, đóng góp và lịch sử hoạt động của sinh viên",
};

export default async function StudentProfilePage({ params }: { params: Promise<{ courseId: string, studentId: string }> }) {
  const { courseId, studentId } = await params;

  return (
    <StudentProfileClient courseId={courseId} studentId={studentId} />
  );
}
