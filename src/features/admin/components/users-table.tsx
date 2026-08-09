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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, GraduationCap, UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/shared/DataState";
import { UserProfileResponse } from "../api/userApi";

interface UsersTableProps {
  data: UserProfileResponse[];
  pageIndex: number;
  totalPages: number;
  totalElements: number;
  keyword: string;
  role: string;
  accountStatus: string;
  onPageChange: (page: number) => void;
  onKeywordChange: (keyword: string) => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
  onToggleStatus?: (id: string, currentStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING") => void;
}

export const columns: ColumnDef<UserProfileResponse>[] = [
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.fullName}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="flex items-center gap-2">
          {role === "STUDENT" ? (
            <GraduationCap className="w-4 h-4 text-primary" />
          ) : (
            <UserCircle2 className="w-4 h-4 text-secondary" />
          )}
          <span className="capitalize font-medium text-foreground">
            {role === "STUDENT" ? "Sinh viên" : role === "LECTURER" ? "Giảng viên" : "Admin"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "accountStatus",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.accountStatus;
      return (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${status === "ACTIVE"
            ? "bg-success/10 text-success"
            : status === "PENDING"
              ? "bg-warning/10 text-warning"
              : "bg-muted text-muted-foreground"
            }`}
        >
          {status === "ACTIVE" ? "Hoạt động" : status === "PENDING" ? "Chờ duyệt" : status === "SUSPENDED" ? "Bị đình chỉ" : "Vô hiệu hóa"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Truy cập",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as { onToggleStatus?: (id: string, currentStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING") => void };

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={user.accountStatus === "ACTIVE"}
            onCheckedChange={() => meta?.onToggleStatus?.(user.localProfileId, user.accountStatus)}
          />
        </div>
      );
    },
  },
];

export function UsersTable({
  data,
  pageIndex,
  totalPages,
  totalElements,
  keyword,
  role,
  accountStatus,
  onPageChange,
  onKeywordChange,
  onRoleChange,
  onStatusChange,
  onToggleStatus
}: UsersTableProps) {

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onToggleStatus,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            className="pl-9 rounded-xl focus-visible:ring-ring bg-background"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={role}
            onValueChange={onRoleChange}
          >
            <SelectTrigger className="w-full sm:w-[150px] rounded-xl bg-background border-border">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="STUDENT">Sinh viên</SelectItem>
              <SelectItem value="LECTURER">Giảng viên</SelectItem>
              <SelectItem value="ADMIN">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={accountStatus}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[160px] rounded-xl bg-background border-border">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Vô hiệu hóa</SelectItem>
              <SelectItem value="SUSPENDED">Đình chỉ</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="text-sm text-muted-foreground font-medium flex items-center gap-4">
          <span>Trang {pageIndex + 1} / {totalPages || 1}</span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-foreground">Tổng: {totalElements} người dùng</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex <= 0}
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
