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
import { Crown, DownloadCloud, FileSpreadsheet, Search, UploadCloud, UserPlus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Cập nhật Mock Data theo template CSV
const INITIAL_STUDENTS = [
  {
    rollNumber: "SE171184",
    email: "minhbpnse171184@fpt.edu.vn",
    fullName: "Bùi Phan Nhật Minh",
    group: "1",
    leader: "x"
  },
  {
    rollNumber: "SE183904",
    email: "hailhse180934@fpt.edu.vn",
    fullName: "Lê Hoàng Hải",
    group: "1",
    leader: ""
  },
];

export default function StudentsManagementPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const handleImport = () => {
    setIsImporting(true);
    setIsDialogOpen(false);

    setTimeout(() => {
      const importedData = [
        ...INITIAL_STUDENTS,
        {
          rollNumber: "SE199999",
          email: "newstudent1@fpt.edu.vn",
          fullName: "Nguyễn Văn A",
          group: "2",
          leader: "x"
        },
        {
          rollNumber: "SE188888",
          email: "newstudent2@fpt.edu.vn",
          fullName: "Trần Thị B",
          group: "2",
          leader: ""
        },
        {
          rollNumber: "SE177777",
          email: "newstudent3@fpt.edu.vn",
          fullName: "Lê Văn C",
          group: "",
          leader: ""
        },
      ];
      setStudents(importedData);
      setIsImporting(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast.info("Tính năng đang được phát triển, vui lòng thử lại sau!");

    /*
    const headers = "Class,RollNumber,Email,MemberCode,FullName,Group,Leader\n";
    const sampleRow = `${classId},SE171184,minhbpnse171184@fpt.edu.vn,MinhBPN,Bùi Phan Nhật Minh,1,x\n`;
    const sampleRow2 = `${classId},SE183904,hailhse180934@fpt.edu.vn,HaiLH,Lê Hoàng Hải,1,\n`;
    const csvContent = headers + sampleRow + sampleRow2;
    
    // Thêm \uFEFF vào đầu file để Excel nhận diện đúng encoding UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Import_SinhVien.csv");
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    */
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nhóm học sinh theo group
  const uniqueGroups = Array.from(new Set(filteredStudents.map(s => s.group))).filter(Boolean).sort();
  const studentsWithoutGroup = filteredStudents.filter(s => !s.group);
  const hasMultipleGroups = uniqueGroups.length > 1;

  const renderStudentRow = (student: { rollNumber: string; fullName: string; email: string; group?: string; leader?: string }, index: number) => (
    <TableRow key={student.rollNumber} className="hover:bg-muted/30 transition-colors">
      <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="font-bold text-primary">{student.rollNumber}</TableCell>
      <TableCell className="font-medium text-foreground">{student.fullName}</TableCell>
      <TableCell className="text-muted-foreground text-sm">{student.email}</TableCell>
      <TableCell>
        {student.group ? (
          <span className="px-2.5 py-1 bg-accent/60 border border-border text-foreground rounded-md text-xs font-medium shadow-sm">
            Nhóm {student.group}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs italic">Chưa có</span>
        )}
      </TableCell>
      <TableCell>
        {student.leader?.toLowerCase() === 'x' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm">
            <Crown size={12} className="text-amber-600 dark:text-amber-400" />
            Leader
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            Member
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-semibold" asChild>
          <Link href={`/lecturer/${classId}/students/${student.rollNumber}`}>Chi tiết</Link>
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý sinh viên - Lớp ${classId}`}
          description="Danh sách sinh viên, thêm mới hoặc import từ file Excel."
        />
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm">
                <FileSpreadsheet size={16} />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import danh sách sinh viên</DialogTitle>
                <DialogDescription>
                  Tải lên file Excel (.xlsx, .csv) chứa danh sách sinh viên của lớp {classId}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors cursor-pointer mb-2">
                  <UploadCloud size={40} className="text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Kéo thả file vào đây hoặc click để chọn file</p>
                  <p className="text-xs text-muted-foreground">Hỗ trợ .xlsx, .xls, .csv</p>
                </div>
                <div className="flex justify-center">
                  <Button variant="ghost" size="sm" className="text-primary gap-2 hover:bg-primary/10" onClick={handleDownloadTemplate}>
                    <DownloadCloud size={16} /> Tải file mẫu (Template)
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleImport} disabled={isImporting} className="w-full">
                  {isImporting ? "Đang xử lý..." : "Bắt đầu Import"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2 shadow-sm">
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
                placeholder="Tìm kiếm sinh viên, mã số, email..."
                className="pl-9 bg-muted/50 border-transparent focus-visible:border-primary rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[60px] text-center">STT</TableHead>
                  <TableHead className="w-[120px]">Mã SV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isImporting ? (
                  // Skeleton Loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length > 0 ? (
                  hasMultipleGroups ? (
                    <>
                      {uniqueGroups.map(group => (
                        <React.Fragment key={`group-${group}`}>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={7} className="font-bold text-foreground py-2 border-y border-border">
                              Phân nhóm: Nhóm {group}
                            </TableCell>
                          </TableRow>
                          {filteredStudents.filter(s => s.group === group).map((student, index) => renderStudentRow(student, index))}
                        </React.Fragment>
                      ))}
                      {studentsWithoutGroup.length > 0 && (
                        <React.Fragment key="group-none">
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={7} className="font-bold text-muted-foreground py-2 border-y border-border">
                              Chưa có nhóm
                            </TableCell>
                          </TableRow>
                          {studentsWithoutGroup.map((student, index) => renderStudentRow(student, index))}
                        </React.Fragment>
                      )}
                    </>
                  ) : (
                    filteredStudents.map((student, index) => renderStudentRow(student, index))
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy sinh viên nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}