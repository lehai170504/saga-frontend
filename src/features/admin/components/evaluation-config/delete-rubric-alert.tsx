"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRubric } from "../../hooks/useRubric";
import { RubricCriteria } from "../../api/rubricApi";

interface DeleteRubricAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rubric: RubricCriteria | null;
}

export function DeleteRubricAlert({ open, onOpenChange, rubric }: DeleteRubricAlertProps) {
  const { mutateAsync: deleteRubric, isPending } = useDeleteRubric();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!rubric) return;

    try {
      await deleteRubric(rubric.rubricId);
      onOpenChange(false);
      toast.success("Đã xóa tiêu chí thành công!");
    } catch (error: unknown) {
      console.error("Failed to delete rubric", error);
      toast.error((error as { message?: string })?.message || "Có lỗi xảy ra khi xóa tiêu chí.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2rem]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Xóa tiêu chí đánh giá?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-foreground/80 mt-2">
            Bạn có chắc chắn muốn xóa tiêu chí <strong className="text-foreground">{rubric?.criteriaName}</strong>? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="rounded-xl h-11 px-6 font-semibold">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl h-11 px-6 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Đang xóa..." : "Xóa tiêu chí"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
