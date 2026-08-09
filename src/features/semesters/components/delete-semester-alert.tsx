"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useDeleteSemester } from "../hooks/useSemesters";
import { Semester } from "../types";

interface DeleteSemesterAlertProps {
  semester: Semester;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSemesterAlert({ semester, open, onOpenChange }: DeleteSemesterAlertProps) {
  const { mutateAsync: deleteSemester, isPending } = useDeleteSemester();

  const handleDelete = async () => {
    try {
      await deleteSemester(semester.id);
      onOpenChange(false);
      toast.success("Xóa học kỳ thành công!");
    } catch (error: unknown) {
      console.error("Failed to delete semester", error);
      toast.error((error as { message?: string })?.message || "Có lỗi xảy ra khi xóa học kỳ.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Xóa Học kỳ?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium">
            Bạn có chắc chắn muốn xóa học kỳ <span className="font-bold text-foreground">{semester.name}</span>?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl px-6 h-11 font-semibold" disabled={isPending}>
            Hủy
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="rounded-xl px-6 h-11 font-bold shadow-sm"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Đang xóa..." : "Xóa học kỳ"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
