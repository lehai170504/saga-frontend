"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { JiraTask } from "@/features/projects/types";

export interface DeleteTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskToDelete: JiraTask | null;
  onConfirmDelete: () => void;
  isPending: boolean;
}

export function BoardDeleteTaskModal({
  isOpen,
  onOpenChange,
  taskToDelete,
  onConfirmDelete,
  isPending,
}: DeleteTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-2 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug flex items-center gap-2">
            <span className="p-2 bg-destructive/10 text-destructive rounded-xl">
              <AlertCircle size={18} />
            </span>
            Xác nhận xóa công việc
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-2">
            Bạn có chắc chắn muốn xóa công việc <strong className="text-foreground font-bold">&ldquo;{taskToDelete?.title}&rdquo;</strong> không? Hành động này sẽ xóa vĩnh viễn công việc này khỏi hệ thống Jira và không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1.5"
            onClick={onConfirmDelete}
          >
            {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            Xác nhận xóa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
