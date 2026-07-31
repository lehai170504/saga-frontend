"use client";

import { useCourses } from "../hooks/useCourses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCourseDialog } from "./create-course-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function CourseList() {
  const { data: page, isLoading, error } = useCourses();
  const { user } = useAuth();

  const isAdmin = user?.applicationRole === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Đã có lỗi xảy ra khi tải danh sách khóa học.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Danh sách Khóa học</h2>
        {isAdmin && <CreateCourseDialog />}
      </div>

      <div className="border border-border/50 rounded-2xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-foreground">Mã khóa học</TableHead>
              <TableHead className="font-bold text-foreground">Tên khóa học</TableHead>
              <TableHead className="font-bold text-foreground">Môn học</TableHead>
              <TableHead className="font-bold text-foreground">Lớp học</TableHead>
              <TableHead className="font-bold text-foreground">Học kỳ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page?.content && page.content.length > 0 ? (
              page.content.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">{course.courseCode}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.subject?.subjectCode}</TableCell>
                  <TableCell>{course.clazz?.classCode}</TableCell>
                  <TableCell>{course.semester?.code}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
