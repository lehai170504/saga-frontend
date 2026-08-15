"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, UserX } from "lucide-react";
import { CourseStudent } from "@/features/courses/types";
import { StudentTableRow } from "./student-table-row";

interface StudentsTableTabProps {
  courseId: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoadingStudents: boolean;
  sortedGroupedTeams: [string, CourseStudent[]][];
  filteredStudentsWithTeam: CourseStudent[];
  filteredStudentsWithoutTeam: CourseStudent[];
}

export function StudentsTableTab({
  courseId,
  searchTerm,
  setSearchTerm,
  isLoadingStudents,
  sortedGroupedTeams,
  filteredStudentsWithTeam,
  filteredStudentsWithoutTeam,
}: StudentsTableTabProps) {
  return (
    <Card className="rounded-[2rem] shadow-lg border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden h-full">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/50 bg-muted/10 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm sinh viên, mã số, email..."
              className="pl-9 bg-background border-border/50 focus-visible:border-primary rounded-xl h-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Table>
            <TableHeader className="bg-muted/90 sticky top-0 z-10 backdrop-blur-md shadow-sm">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[60px] text-center text-xs font-bold uppercase tracking-wider">STT</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Sinh viên</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Mã SV</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Vai trò</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase tracking-wider">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingStudents ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-border/50">
                    <TableCell>
                      <Skeleton className="h-4 w-6 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-16 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStudentsWithTeam.length > 0 || filteredStudentsWithoutTeam.length > 0 ? (
                <>
                  {sortedGroupedTeams.map(([teamName, students]) => (
                    <React.Fragment key={`team-${teamName}`}>
                      <TableRow className="bg-muted/20 hover:bg-muted/20 border-border/50">
                        <TableCell colSpan={6} className="py-3">
                          <div className="flex items-center gap-3 pl-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></span>
                            <span className="font-extrabold text-foreground text-sm uppercase tracking-wide">
                              {teamName.toLowerCase().includes("group")
                                ? teamName.replace(/group/i, "Nhóm ")
                                : teamName === "Khác"
                                ? "Chưa vào nhóm"
                                : teamName}
                            </span>
                            <span className="text-primary text-xs font-bold px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                              {students.length} thành viên
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {students.map((student, index) => (
                        <StudentTableRow key={student.studentId} student={student} index={index} courseId={courseId} />
                      ))}
                    </React.Fragment>
                  ))}

                  {filteredStudentsWithoutTeam.length > 0 && (
                    <React.Fragment key="group-none">
                      <TableRow className="bg-destructive/5 hover:bg-destructive/5 border-border/50">
                        <TableCell colSpan={6} className="py-3">
                          <div className="flex items-center gap-3 pl-2">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full shadow-sm"></span>
                            <span className="font-extrabold text-foreground text-sm uppercase tracking-wide">
                              Chưa có nhóm
                            </span>
                            <span className="text-amber-500 text-xs font-bold px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                              {filteredStudentsWithoutTeam.length} sinh viên
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {filteredStudentsWithoutTeam.map((student, index) => (
                        <StudentTableRow key={student.studentId} student={student} index={index} courseId={courseId} />
                      ))}
                    </React.Fragment>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center border-border/50">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <UserX size={32} className="opacity-20" />
                      <p>Không tìm thấy sinh viên nào phù hợp với bộ lọc.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
