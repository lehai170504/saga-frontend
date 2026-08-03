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
import { Crown, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { CourseStudent } from "@/features/courses/types";
import { ImportStudentsDialog } from "@/features/courses/components/import-students-dialog";

export default function StudentsManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: studentsData, isLoading: isLoadingStudents, refetch } = useCourseStudents(courseId);
  const { data: courseData } = useCourse(courseId);
  const className = courseData?.clazz?.name || courseData?.courseCode || courseId;

  const allStudentsWithTeam = studentsData?.studentsWithTeam.content || [];
  const allStudentsWithoutTeam = studentsData?.studentsWithoutTeam.content || [];

  const filteredStudentsWithTeam = allStudentsWithTeam.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudentsWithoutTeam = allStudentsWithoutTeam.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nhóm học sinh theo team
  const groupedByTeam: Record<string, CourseStudent[]> = {};
  filteredStudentsWithTeam.forEach(s => {
    const teamName = s.team?.teamName || "Khác";
    if (!groupedByTeam[teamName]) {
      groupedByTeam[teamName] = [];
    }
    groupedByTeam[teamName].push(s);
  });

  const renderStudentRow = (student: CourseStudent, index: number) => {
    const role = student.team?.teamMembers.find(m => m.studentId === student.studentId)?.roleInTeam;

    return (
      <TableRow key={student.studentId} className="hover:bg-muted/30 transition-colors">
        <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
        <TableCell className="font-bold text-primary">{student.studentCode}</TableCell>
        <TableCell className="font-medium text-foreground">{student.fullName}</TableCell>
        <TableCell className="text-muted-foreground text-sm">{student.email}</TableCell>
        <TableCell>
          {role === 'LEADER' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Crown size={12} className="text-primary" />
              Nhóm trưởng
            </span>
          ) : role === 'MEMBER' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border shadow-sm">
              Thành viên
            </span>
          ) : (
            <span className="text-muted-foreground text-xs italic">-</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-semibold" asChild>
            <Link href={`/lecturer/${courseId}/students/${student.studentCode}`}>Chi tiết</Link>
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          workspace={`Khóa ${courseData?.subject?.subjectCode || ''}`}
          title={`Quản lý sinh viên - Lớp ${className}`}
          description="Danh sách sinh viên, thêm mới hoặc import từ file Excel."
        />
        <div className="flex gap-2">
          <ImportStudentsDialog courseId={courseId} className={className} onSuccess={refetch} />
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
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingStudents ? (
                  // Skeleton Loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudentsWithTeam.length > 0 || filteredStudentsWithoutTeam.length > 0 ? (
                  <>
                    {Object.entries(groupedByTeam).map(([teamName, students]) => (
                      <React.Fragment key={`team-${teamName}`}>
                        <TableRow className="bg-muted/10 hover:bg-muted/10">
                          <TableCell colSpan={6} className="py-3 border-y border-border">
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-5 bg-primary rounded-full"></span>
                              <span className="font-extrabold text-primary text-sm uppercase tracking-wide">
                                {teamName.toLowerCase().includes("group") ? teamName.replace(/group/i, "Nhóm") : (teamName === "Khác" ? "Chưa vào nhóm" : teamName)}
                              </span>
                              <span className="text-muted-foreground text-xs font-medium px-2 py-0.5 bg-muted rounded-full">
                                {students.length} sinh viên
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                        {students.map((student, index) => renderStudentRow(student, index))}
                      </React.Fragment>
                    ))}

                    {filteredStudentsWithoutTeam.length > 0 && (
                      <React.Fragment key="group-none">
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={7} className="font-bold text-muted-foreground py-2 border-y border-border">
                            Chưa có nhóm
                          </TableCell>
                        </TableRow>
                        {filteredStudentsWithoutTeam.map((student, index) => renderStudentRow(student, index))}
                      </React.Fragment>
                    )}
                  </>
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