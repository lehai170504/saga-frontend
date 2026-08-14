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
import { ChevronLeft, ChevronRight, Network, GraduationCap, FolderGit2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/DataState";
import { AdminTeamResponse } from "../../api/teamApi";
import { CreateProjectModal } from "../projects/create-project-modal";
import { ProjectDetailsModal } from "../projects/project-details-modal";
import { TeamEvaluationAction } from "./team-evaluation-action";

interface TeamsTableProps {
  data: AdminTeamResponse[];
  pageIndex: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const columns: ColumnDef<AdminTeamResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Nhóm",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Network className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "course",
    header: "Thuộc Khóa Học",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-[13px]">{row.original.course.name}</span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-6">
          {row.original.course.courseCode}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "project",
    header: "Dự Án Đang Làm",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FolderGit2 className="w-4 h-4 text-indigo-500" />
        <span className="font-medium text-[13px] text-foreground">{row.original.project?.name || "Chưa chọn dự án"}</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end pr-2 gap-2 items-center">
        <TeamEvaluationAction courseId={row.original.course.id} teamId={row.original.id} teamName={row.original.name} />
        {!row.original.project ? (
          <CreateProjectModal teamId={row.original.id} />
        ) : (
          <ProjectDetailsModal projectId={row.original.project.id} />
        )}
        <Link href={`/admin/courses/${row.original.course.id}`}>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function TeamsTable({
  data,
  pageIndex,
  totalPages,
  totalElements,
  onPageChange,
}: TeamsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <EmptyState
        message="Hiện tại hệ thống chưa có dữ liệu nhóm nào."
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
          <span className="text-foreground">Tổng: {totalElements} nhóm</span>
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
