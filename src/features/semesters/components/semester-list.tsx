"use client";

import { useSemesters } from "../hooks/useSemesters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateSemesterDialog } from "./create-semester-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function SemesterList() {
  const { data: page, isLoading, error } = useSemesters();
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
        Đã có lỗi xảy ra khi tải danh sách học kỳ.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Danh sách Học kỳ</h2>
        {isAdmin && <CreateSemesterDialog />}
      </div>

      <div className="border border-border/50 rounded-2xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-foreground">Mã học kỳ</TableHead>
              <TableHead className="font-bold text-foreground">Tên học kỳ</TableHead>
              <TableHead className="font-bold text-foreground">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-foreground">Ngày kết thúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page?.content && page.content.length > 0 ? (
              page.content.map((semester) => (
                <TableRow key={semester.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">{semester.code}</TableCell>
                  <TableCell>{semester.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(semester.startDate).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(semester.endDate).toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
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
