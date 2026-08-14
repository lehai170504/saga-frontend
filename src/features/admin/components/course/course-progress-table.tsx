import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, GraduationCap, Users, Network, GitCommit, UserCheck, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/shared/DataState";
import { AdminCourseProgressResponse } from "../../api/courseProgressApi";
import Link from "next/link";

interface CourseProgressTableProps {
  data: AdminCourseProgressResponse[];
  pageIndex: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const columns: ColumnDef<AdminCourseProgressResponse>[] = [
  {
    accessorKey: "course",
    header: "Khóa Học",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold text-foreground line-clamp-1 max-w-[200px]" title={row.original.courseName}>
            {row.original.courseName}
          </span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-11">
          {row.original.courseCode}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lecturer",
    header: "Giảng viên",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold border border-primary/20">
          {row.original.lecturer?.fullName?.charAt(0) || "G"}
        </div>
        <span className="font-medium text-[13px] text-foreground truncate max-w-[120px]" title={row.original.lecturer?.fullName}>
          {row.original.lecturer?.fullName || "Chưa phân công"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "stats",
    header: "Tổng quan Sĩ số & Nhóm",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{row.original.studentCount} Sinh viên</span>
        </div>
        <div className="flex items-center gap-2">
          <Network className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{row.original.teamCount} Nhóm • {row.original.projectCount} Dự án</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "sprints",
    header: "Tiến trình (Sprints & ĐGC)",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium">
            <span className="text-foreground">{row.original.activeSprintCount} đang chạy</span> / <span className="text-muted-foreground">{row.original.sprintCount} Sprints</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-medium text-foreground">{row.original.peerReviewCount} Lượt đánh giá chéo</span>
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <Link href={`/admin/courses/${row.original.courseId}`}>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function CourseProgressTable({
  data,
  pageIndex,
  totalPages,
  totalElements,
  onPageChange,
}: CourseProgressTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <EmptyState
        message="Hiện tại hệ thống chưa có dữ liệu tiến độ khóa học nào."
      />
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Table Data */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-border/50 hover:bg-muted/20 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground font-medium flex items-center gap-4">
          <span>Trang {pageIndex + 1} / {totalPages || 1}</span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-foreground">Tổng: {totalElements} khóa học</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="rounded-xl h-9 px-3 border-border/50 hover:bg-muted/50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
            className="rounded-xl h-9 px-3 border-border/50 hover:bg-muted/50"
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
