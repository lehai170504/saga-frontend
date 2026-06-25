"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_GRADES = [
  { id: "102210001", name: "Nguyễn Văn A", group: "Nhóm 1", bt1: 8.5, bt2: 9.0, thck: 8.8 },
  { id: "102210002", name: "Trần Thị B", group: "Nhóm 1", bt1: 8.0, bt2: 8.5, thck: 8.5 },
  { id: "102210003", name: "Lê Văn C", group: "Nhóm 2", bt1: 7.5, bt2: 8.0, thck: 7.8 },
  { id: "102210004", name: "Phạm Thị D", group: "Nhóm 3", bt1: 9.0, bt2: 9.5, thck: 9.2 },
];

export default function GradesManagementPage({ params }: { params: { classId: string } }) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý điểm số - Lớp ${params.classId}`}
          description="Bảng điểm thành phần và điểm tổng kết của sinh viên."
        />
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Xuất bảng điểm
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">MSSV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead className="text-center">Bài tập 1 (20%)</TableHead>
                  <TableHead className="text-center">Bài tập 2 (20%)</TableHead>
                  <TableHead className="text-center">Cuối kỳ (60%)</TableHead>
                  <TableHead className="text-center font-bold text-primary">Tổng kết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_GRADES.map((student) => {
                  const total = (student.bt1 * 0.2 + student.bt2 * 0.2 + student.thck * 0.6).toFixed(1);
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <span className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium">
                          {student.group}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{student.bt1}</TableCell>
                      <TableCell className="text-center">{student.bt2}</TableCell>
                      <TableCell className="text-center font-medium">{student.thck}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
