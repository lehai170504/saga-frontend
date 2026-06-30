import React from "react";
import { Search, Plus, MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  status: string;
  avatar: string;
}

interface ClassStudentsTabProps {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export function ClassStudentsTab({
  students,
  searchQuery,
  setSearchQuery,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}: ClassStudentsTabProps) {
  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sinh viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-background border-border focus-visible:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl font-bold shadow-sm" onClick={onAddStudent}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm sinh viên
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Mã SV</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-border">
                <TableCell>
                  <Avatar className="w-9 h-9 border border-border/50">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">{student.studentId}</TableCell>
                <TableCell className="font-bold text-foreground">{student.name}</TableCell>
                <TableCell className="text-muted-foreground">{student.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      student.status === "Bình thường"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                    }`}
                  >
                    {student.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        className="cursor-pointer rounded-md flex items-center hover:bg-muted focus:bg-muted"
                        onClick={() => toast.success(`Đã gửi email đến ${student.name}`)}
                      >
                        <Mail className="mr-2 h-4 w-4" /> Gửi email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-md flex items-center hover:bg-muted focus:bg-muted"
                        onClick={() => onEditStudent(student)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        className="cursor-pointer rounded-md text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center"
                        onClick={() => onDeleteStudent(student.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Xóa khỏi lớp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
