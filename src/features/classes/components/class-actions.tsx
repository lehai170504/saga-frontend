"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { classSchema, ClassFormValues } from "../schemas/classSchema";
import { useUpdateClass, useDeleteClass } from "../hooks/useClasses";
import { Class } from "../types";

interface ClassActionsProps {
  clazz: Class;
}

export function ClassActions({ clazz }: ClassActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();
  const { mutateAsync: deleteClass, isPending: isDeleting } = useDeleteClass();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      classCode: clazz.classCode,
      name: clazz.name,
    },
  });

  const onEditSubmit = async (data: ClassFormValues) => {
    try {
      await updateClass({ id: clazz.id, data });
      setIsEditOpen(false);
      toast.success("Cập nhật lớp học thành công.");
    } catch (error: unknown) {
      console.error("Failed to update class", error);
      toast.error((error as { message?: string })?.message || "Có lỗi xảy ra khi cập nhật.");
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteClass(clazz.id);
      setIsDeleteOpen(false);
      toast.success("Xóa lớp học thành công.");
    } catch (error: unknown) {
      console.error("Failed to delete class", error);
      toast.error((error as { message?: string })?.message || "Có lỗi xảy ra khi xóa.");
    }
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] rounded-xl" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(false);
              reset({ classCode: clazz.classCode, name: clazz.name });
              setIsEditOpen(true);
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(false);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Chỉnh sửa Lớp học</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-classCode-${clazz.id}`} className="font-semibold text-foreground/80">
                Mã lớp
              </Label>
              <Input
                id={`edit-classCode-${clazz.id}`}
                className={`rounded-xl h-11 ${errors.classCode ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                {...register("classCode")}
              />
              {errors.classCode && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.classCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-name-${clazz.id}`} className="font-semibold text-foreground/80">
                Tên lớp
              </Label>
              <Input
                id={`edit-name-${clazz.id}`}
                className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl h-11 px-6 font-semibold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="rounded-xl h-11 px-6 font-bold shadow-sm"
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpdating ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa lớp học <span className="font-bold text-foreground">{clazz.classCode}</span> không? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl h-11 px-6 font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="rounded-xl h-11 px-6 font-bold shadow-sm"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Đang xóa..." : "Xóa lớp học"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
