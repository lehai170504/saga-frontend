"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadCloud, Search, Plus, UserPlus, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

const MOCK_STUDENTS = [
  { id: "102210001", name: "Nguyễn Văn A", email: "nva@sv.dut.udn.vn", group: "Nhóm 1", status: "Hoạt động" },
  { id: "102210002", name: "Trần Thị B", email: "ttb@sv.dut.udn.vn", group: "Nhóm 1", status: "Hoạt động" },
  { id: "102210003", name: "Lê Văn C", email: "lvc@sv.dut.udn.vn", group: "Nhóm 2", status: "Hoạt động" },
  { id: "102210004", name: "Phạm Thị D", email: "ptd@sv.dut.udn.vn", group: "Chưa có nhóm", status: "Không hoạt động" },
];

export default function StudentsManagementPage({ params }: { params: { classId: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý sinh viên - Lớp ${params.classId}`}
          description="Danh sách sinh viên, thêm mới hoặc import từ file Excel."
        />
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                <FileSpreadsheet size={16} />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import danh sách sinh viên</DialogTitle>
                <DialogDescription>
                  Tải lên file Excel (.xlsx, .csv) chứa danh sách sinh viên của lớp {params.classId}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors cursor-pointer">
                  <UploadCloud size={40} className="text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Kéo thả file vào đây hoặc click để chọn file</p>
                  <p className="text-xs text-muted-foreground">Hỗ trợ .xlsx, .xls, .csv</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleImport} disabled={isImporting} className="w-full">
                  {isImporting ? "Đang xử lý..." : "Bắt đầu Import"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <UserPlus size={16} />
            Thêm sinh viên
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                className="pl-9 bg-muted/50 border-transparent focus-visible:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">MSSV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium">
                        {student.group}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === "Hoạt động" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                        <Link href={`/lecturer/${params.classId}/students/${student.id}`}>Chi tiết</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
