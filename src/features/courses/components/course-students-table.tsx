"use client";

import { useState } from "react";
import { useCourseStudents, useRemoveStudent } from "../hooks/useCourseStudents";
import { useExportCourseReport } from "../hooks/useCourses";
import { ImportStudentsDialog } from "./import-students-dialog";
import { AddStudentManualDialog } from "./add-student-manual-dialog";
import { StudentDetailModal } from "./student-detail-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Search, Users, UserX, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, Loader2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseStudent } from "../types";

interface CourseStudentsTableProps {
  courseId: string;
  courseClassName?: string;
}

export function CourseStudentsTable({ courseId, courseClassName }: CourseStudentsTableProps) {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sortBy, setSortBy] = useState("studentCode");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<CourseStudent | null>(null);

  const { mutateAsync: removeStudent, isPending: isRemoving } = useRemoveStudent();

  const { data, isLoading, refetch } = useCourseStudents(courseId, {
    keyword,
    size,
    page,
    sortBy,
    sortDirection
  });

  const handleRemove = async () => {
    if (!studentToDelete) return;
    try {
      await removeStudent({ courseId, studentId: studentToDelete.studentId });
      setStudentToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to remove student", error);
    }
  };

  const { mutate: exportReport, isPending: isExporting } = useExportCourseReport();

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0); // Reset to first page on new search
  };

  const handleExport = () => {
    exportReport({ courseId, courseClassName });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(0); // Reset to first page on sort change
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const renderPagination = (totalPages: number) => {
    if (!data || totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-end gap-2 py-4 px-6 border-t border-border/50 bg-muted/10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded-xl h-8 px-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-medium px-2 text-muted-foreground">
          Trang {page + 1} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="rounded-xl h-8 px-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Tìm theo tên, MSSV, email..."
            className="w-full sm:w-80 rounded-xl"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="outline" className="rounded-xl px-3 shrink-0" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="rounded-xl border-emerald-500/20 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 hover:text-emerald-700 font-semibold"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export Excel
          </Button>
          <AddStudentManualDialog courseId={courseId} onSuccess={() => refetch()} />
          <ImportStudentsDialog courseId={courseId} courseClassName={courseClassName} onSuccess={() => refetch()} />
        </div>
      </div>

      <Tabs defaultValue="with-team" className="w-full" onValueChange={() => setPage(0)}>
        <TabsList className="mb-6 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5 gap-2">
          <TabsTrigger value="with-team" className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Đã có nhóm
            {data && (
              <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-[10px]">
                {data.studentsWithTeam.totalElements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="without-team" className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <UserX className="w-4 h-4" />
            Chưa có nhóm
            {data && (
              <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-[10px]">
                {data.studentsWithoutTeam.totalElements}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="with-team" className="mt-0">
          <div className="rounded-[2rem] border border-border/50 overflow-hidden bg-card/40 shadow-sm flex flex-col">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("studentCode")}>
                    <div className="flex items-center">MSSV {renderSortIcon("studentCode")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("fullName")}>
                    <div className="flex items-center">Họ và tên {renderSortIcon("fullName")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("email")}>
                    <div className="flex items-center">Email {renderSortIcon("email")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6">Nhóm</TableHead>
                  <TableHead className="font-semibold h-12 px-6 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-xl" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.studentsWithTeam.content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Không có sinh viên nào trong danh sách.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.studentsWithTeam.content.map((student, index) => (
                    <TableRow
                      key={`${student.studentId}-${index}`}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudentId(student.studentId)}
                    >
                      <TableCell className="font-medium px-6 py-4">{student.studentCode}</TableCell>
                      <TableCell className="font-semibold px-6 py-4">{student.fullName}</TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">{student.email}</TableCell>
                      <TableCell className="px-6 py-4">
                        {student.team && (
                          <Badge variant="outline" className="rounded-full px-3 py-1 border-primary/20 text-primary bg-primary/5 whitespace-nowrap">
                            {student.team.teamName}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(student);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {renderPagination(data?.studentsWithTeam.totalPages || 0)}
          </div>
        </TabsContent>

        <TabsContent value="without-team" className="mt-0">
          <div className="rounded-[2rem] border border-border/50 overflow-hidden bg-card/40 shadow-sm flex flex-col">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("studentCode")}>
                    <div className="flex items-center">MSSV {renderSortIcon("studentCode")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("fullName")}>
                    <div className="flex items-center">Họ và tên {renderSortIcon("fullName")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => handleSort("email")}>
                    <div className="flex items-center">Email {renderSortIcon("email")}</div>
                  </TableHead>
                  <TableHead className="font-semibold h-12 px-6 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-xl" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.studentsWithoutTeam.content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Không có sinh viên nào trong danh sách.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.studentsWithoutTeam.content.map((student, index) => (
                    <TableRow
                      key={`${student.studentId}-${index}`}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudentId(student.studentId)}
                    >
                      <TableCell className="font-medium px-6 py-4">{student.studentCode}</TableCell>
                      <TableCell className="font-semibold px-6 py-4">{student.fullName}</TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">{student.email}</TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(student);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {renderPagination(data?.studentsWithoutTeam.totalPages || 0)}
          </div>
        </TabsContent>
      </Tabs>

      <StudentDetailModal
        courseId={courseId}
        studentId={selectedStudentId}
        isOpen={!!selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />

      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sinh viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sinh viên <strong className="text-foreground">{studentToDelete?.fullName}</strong> khỏi khóa học? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} disabled={isRemoving} className="rounded-xl bg-destructive hover:bg-destructive/90">
              {isRemoving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
