import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFilter,
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Search, GraduationCap, UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/shared/DataState";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer";
  status: "active" | "inactive";
};

interface UsersTableProps {
  data: User[];
  onToggleStatus?: (id: string, currentStatus: "active" | "inactive") => void;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="flex items-center gap-2">
          {role === "student" ? (
            <GraduationCap className="w-4 h-4 text-primary" />
          ) : (
            <UserCircle2 className="w-4 h-4 text-secondary" />
          )}
          <span className="capitalize font-medium text-foreground">
            {role === "student" ? "Sinh viên" : "Giảng viên"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${status === "active"
            ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
            }`}
        >
          {status === "active" ? "Hoạt động" : "Vô hiệu hóa"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Truy cập",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as { onToggleStatus?: (id: string, currentStatus: "active" | "inactive") => void };

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={user.status === "active"}
            onCheckedChange={() => meta?.onToggleStatus?.(user.id, user.status)}
          />
        </div>
      );
    },
  },
];

export function UsersTable({ data, onToggleStatus }: UsersTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
    meta: {
      onToggleStatus,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9 rounded-xl focus-visible:ring-ring bg-background"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-semibold text-muted-foreground uppercase">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/40 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <EmptyState message="Không tìm thấy người dùng nào phù hợp." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground font-medium">
          Trang {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
