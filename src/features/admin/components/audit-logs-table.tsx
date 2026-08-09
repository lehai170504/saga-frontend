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
import { ChevronLeft, ChevronRight, Clock, Database, CodeSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/DataState";
import { AuditLogResponse } from "../api/auditLogApi";
import { Badge } from "@/components/ui/badge";

interface AuditLogsTableProps {
  data: AuditLogResponse[];
  pageIndex: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const columns: ColumnDef<AuditLogResponse>[] = [
  {
    accessorKey: "timestamp",
    header: "Thời Gian",
    cell: ({ row }) => {
      let formattedDate = row.original.timestamp;
      try {
        const date = new Date(row.original.timestamp);
        formattedDate = date.toLocaleString("vi-VN", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (e) {
        console.error(e);
      }

      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-[13px] text-foreground">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành Động",
    cell: ({ row }) => {
      const actionStr = row.original.action || "";
      const actionUpper = actionStr.toUpperCase();

      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      let colorClass = "bg-primary/10 text-primary border-primary/20"; // default blue-ish

      if (actionUpper.includes("CREATE") || actionUpper.includes("ADD") || actionUpper.includes("SYNC")) {
        colorClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20";
        variant = "secondary";
      } else if (actionUpper.includes("DELETE") || actionUpper.includes("REMOVE") || actionUpper.includes("DISABLE")) {
        colorClass = "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
        variant = "secondary";
      } else if (actionUpper.includes("UPDATE") || actionUpper.includes("EDIT")) {
        colorClass = "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20";
        variant = "secondary";
      }

      return (
        <div className="flex items-center gap-2">
          <CodeSquare className="w-4 h-4 text-muted-foreground opacity-50" />
          <Badge variant={variant} className={`font-bold tracking-wider text-[10px] ${colorClass}`}>
            {actionUpper}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "targetEntity",
    header: "Đối Tượng (Target)",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-[300px]">
        <Database className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="font-medium text-[13px] text-muted-foreground truncate" title={row.original.targetEntity}>
          {row.original.targetEntity || "N/A"}
        </span>
      </div>
    ),
  },
];

export function AuditLogsTable({
  data,
  pageIndex,
  totalPages,
  totalElements,
  onPageChange,
}: AuditLogsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <EmptyState
        message="Hiện tại hệ thống chưa có bản ghi nhật ký nào."
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
          <span className="text-foreground">Tổng: {totalElements} logs</span>
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
