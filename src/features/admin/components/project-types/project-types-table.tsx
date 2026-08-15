import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/DataState";
import { ProjectType } from "../../api/projectTypeApi";

interface ProjectTypesTableProps {
  data: ProjectType[];
}

export function ProjectTypesTable({ data }: ProjectTypesTableProps) {

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState message="Chưa có loại dự án nào." />
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[150px] font-semibold text-foreground">Mã (Code)</TableHead>
                <TableHead className="font-semibold text-foreground">Tên hiển thị</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-foreground">Mô tả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((type) => (
                <TableRow key={type.projectTypeId} className="hover:bg-muted/20 border-border/50 transition-colors">
                  <TableCell className="font-medium">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs uppercase tracking-wider">
                      {type.code}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-foreground">{type.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-[300px] truncate">
                    {type.description || "Không có mô tả"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
}


