"use client";

import { useLecturerClass } from "@/context/LecturerClassContext";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MOCK_ASSIGNMENTS = [
  { id: 1, title: "Bài tập 1: Đặc tả yêu cầu", deadline: "15/06/2026", submitted: 10, total: 12, status: "ongoing" },
  { id: 2, title: "Bài tập 2: Thiết kế kiến trúc", deadline: "30/06/2026", submitted: 2, total: 12, status: "ongoing" },
  { id: 3, title: "Báo cáo tiến độ Sprint 1", deadline: "10/05/2026", submitted: 12, total: 12, status: "completed" },
];

export default function AssignmentsManagementPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý bài tập - Lớp ${classId}`}
          description="Tạo và quản lý các bài tập, yêu cầu cho các nhóm."
        />
        <Button className="gap-2">
          <Plus size={16} />
          Tạo bài tập mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ASSIGNMENTS.map((assignment) => (
          <Card key={assignment.id} className="rounded-2xl shadow-sm border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                  <FileText size={20} />
                </div>
                {assignment.status === "ongoing" ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    Đang diễn ra
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Đã đóng
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-4 line-clamp-1">{assignment.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-2 gap-1.5">
                <CalendarClock size={14} />
                Hạn nộp: {assignment.deadline}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ nộp bài</span>
                  <span className="font-medium">{assignment.submitted}/{assignment.total} nhóm</span>
                </div>
                <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="w-full">Chỉnh sửa</Button>
                <Button className="w-full">Chấm điểm</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
