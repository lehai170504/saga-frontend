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
import { ChevronLeft, ChevronRight, FolderGit2, GraduationCap, GitBranch, KanbanSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/DataState";
import { AdminProjectResponse } from "../api/projectApi";
import { Badge } from "@/components/ui/badge";

interface ProjectsTableProps {
  data: AdminProjectResponse[];
  pageIndex: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const columns: ColumnDef<AdminProjectResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Dự Án",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="font-semibold text-foreground">{row.original.name}</span>
        </div>
        {row.original.description && (
          <span className="text-[11px] text-muted-foreground ml-11 line-clamp-1 max-w-[200px]">
            {row.original.description}
          </span>
        )}
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
    accessorKey: "integrations",
    header: "Trạng thái Tích hợp",
    cell: ({ row }) => {
      const jiraStatus = row.original.jira?.connectionStatus;
      const ghRepoCount = row.original.gitHub?.repositoryCount || 0;
      const ghActiveCount = row.original.gitHub?.activeRepositoryCount || 0;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <KanbanSquare className="w-4 h-4 text-blue-500" />
            <Badge
              variant={jiraStatus === "CONNECTED" || jiraStatus === "ACTIVE" ? "default" : "secondary"}
              className={jiraStatus === "CONNECTED" || jiraStatus === "ACTIVE" ? "bg-emerald-500 hover:bg-emerald-600 text-[10px]" : "text-[10px]"}
            >
              {jiraStatus || "NOT_CONNECTED"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {ghActiveCount} / {ghRepoCount} Repos Active
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <Link href={`/admin/courses/${row.original.course.id}`}>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export function ProjectsTable({
  data,
  pageIndex,
  totalPages,
  totalElements,
  onPageChange,
}: ProjectsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <EmptyState
        message="Hiện tại hệ thống chưa có dữ liệu dự án nào."
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
          <span className="text-foreground">Tổng: {totalElements} dự án</span>
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
