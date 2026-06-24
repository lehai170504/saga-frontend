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

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

interface SemestersTableProps {
  data: Semester[];
}

export const columns: ColumnDef<Semester>[] = [
  { accessorKey: "name", header: "Tên học kỳ" },
  { accessorKey: "startDate", header: "Ngày bắt đầu" },
  { accessorKey: "endDate", header: "Ngày kết thúc" },
];

export function SemestersTable({ data }: SemestersTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-border">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold text-foreground">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-border/50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
