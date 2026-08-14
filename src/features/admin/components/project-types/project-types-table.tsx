import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import { ProjectType } from "../../api/projectTypeApi";
import { CreateProjectTypeModal } from "./create-project-type-modal";
import { useDeleteProjectType } from "../../hooks/useProjectTypes";
import { EmptyState } from "@/components/shared/DataState";

interface ProjectTypesTableProps {
  data: ProjectType[];
}

export function ProjectTypesTable({ data }: ProjectTypesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectTypeToDelete, setProjectTypeToDelete] = useState<ProjectType | null>(null);

  const { mutateAsync: deleteProjectType, isPending: isDeleting } = useDeleteProjectType();

  const handleCreate = () => {
    setSelectedProjectType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (projectType: ProjectType) => {
    setProjectTypeToDelete(projectType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectTypeToDelete) {
      await deleteProjectType(projectTypeToDelete.projectTypeId);
      setIsDeleteDialogOpen(false);
      setProjectTypeToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="rounded-xl h-10 px-4 font-semibold shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Loại Dự án
        </Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState message="Chưa có loại dự án nào. Hãy nhấn nút thêm mới để tạo loại dự án đầu tiên cho hệ thống." />
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[150px] font-semibold text-foreground">Mã (Code)</TableHead>
                <TableHead className="font-semibold text-foreground">Tên hiển thị</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-foreground">Mô tả</TableHead>
                <TableHead className="w-[100px] text-right font-semibold text-foreground">Thao tác</TableHead>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-muted">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                        <DropdownMenuItem onClick={() => handleEdit(type)} className="rounded-lg cursor-pointer font-medium">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(type)} className="rounded-lg cursor-pointer font-medium text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CreateProjectTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectType={selectedProjectType}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              Bạn có chắc chắn muốn xóa loại dự án <span className="font-bold text-foreground">{projectTypeToDelete?.name}</span> không? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các dự án đang sử dụng loại này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-11 border-border/50 hover:bg-muted font-semibold">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="rounded-xl h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold px-8"
            >
              {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


