"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  setEditName: (val: string) => void;
  editDescription: string;
  setEditDescription: (val: string) => void;
  isUpdating: boolean;
  handleUpdateProject: (e: React.FormEvent) => void;
}

export function EditProjectDialog({
  isOpen,
  onOpenChange,
  editName,
  setEditName,
  editDescription,
  setEditDescription,
  isUpdating,
  handleUpdateProject,
}: EditProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40">
          <DialogTitle className="text-lg font-bold text-foreground">Chỉnh sửa thông tin Dự án</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cập nhật tên đề tài và mô tả chi tiết của dự án nhóm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateProject} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-project-name" className="text-sm font-bold text-foreground">
              Tên đề tài / Dự án <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-project-name"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Ví dụ: Hệ thống quản lý thư viện số SAGA"
              className="rounded-xl border-border/50 bg-background/80 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-project-description" className="text-sm font-bold text-foreground">
              Mô tả dự án
            </Label>
            <Textarea
              id="edit-project-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Nhập mô tả ngắn gọn về đề tài của nhóm bạn..."
              className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-11 px-5"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
