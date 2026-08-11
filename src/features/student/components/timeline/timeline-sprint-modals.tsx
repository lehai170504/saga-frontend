"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Sprint } from "@/features/projects/types";

interface CreateSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (val: string) => void;
  goal: string;
  onGoalChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function TimelineCreateSprintModal({
  isOpen,
  onOpenChange,
  name,
  onNameChange,
  goal,
  onGoalChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onSubmit,
  isPending,
}: CreateSprintModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40">
          <DialogTitle className="text-lg font-bold text-foreground">Tạo Sprint mới</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tạo Sprint và đồng bộ trực tiếp với dự án Jira của nhóm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="sprint-name" className="text-sm font-bold text-foreground">
              Tên Sprint <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sprint-name"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ví dụ: Sprint 1"
              className="rounded-xl border-border/50 bg-background/80 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sprint-goal" className="text-sm font-bold text-foreground">
              Mục tiêu Sprint
            </Label>
            <Textarea
              id="sprint-goal"
              value={goal}
              onChange={(e) => onGoalChange(e.target.value)}
              placeholder="Mô tả mục tiêu của Sprint này..."
              className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-sm font-bold text-foreground">
                Ngày bắt đầu
              </Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-sm font-bold text-foreground">
                Ngày kết thúc
              </Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-11 px-5"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Sprint"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  onEditNameChange: (val: string) => void;
  editGoal: string;
  onEditGoalChange: (val: string) => void;
  editStartDate: string;
  onEditStartDateChange: (val: string) => void;
  editEndDate: string;
  onEditEndDateChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function TimelineEditSprintModal({
  isOpen,
  onOpenChange,
  editName,
  onEditNameChange,
  editGoal,
  onEditGoalChange,
  editStartDate,
  onEditStartDateChange,
  editEndDate,
  onEditEndDateChange,
  onSubmit,
  isPending,
}: EditSprintModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40">
          <DialogTitle className="text-lg font-bold text-foreground">Chỉnh sửa Sprint</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cấu hình thông tin Sprint và đồng bộ trực tiếp với dự án Jira của nhóm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-sprint-name" className="text-sm font-bold text-foreground">
              Tên Sprint <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-sprint-name"
              required
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              placeholder="Ví dụ: Sprint 1"
              className="rounded-xl border-border/50 bg-background/80 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-sprint-goal" className="text-sm font-bold text-foreground">
              Mục tiêu Sprint
            </Label>
            <Textarea
              id="edit-sprint-goal"
              value={editGoal}
              onChange={(e) => onEditGoalChange(e.target.value)}
              placeholder="Mô tả mục tiêu của Sprint này..."
              className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-start-date" className="text-sm font-bold text-foreground">
                Ngày bắt đầu
              </Label>
              <Input
                id="edit-start-date"
                type="datetime-local"
                value={editStartDate}
                onChange={(e) => onEditStartDateChange(e.target.value)}
                className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-end-date" className="text-sm font-bold text-foreground">
                Ngày kết thúc
              </Label>
              <Input
                id="edit-end-date"
                type="datetime-local"
                value={editEndDate}
                onChange={(e) => onEditEndDateChange(e.target.value)}
                className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-11 px-5"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sprintToDelete: Sprint | null;
  onConfirmDelete: () => void;
  isPending: boolean;
}

export function TimelineDeleteSprintModal({
  isOpen,
  onOpenChange,
  sprintToDelete,
  onConfirmDelete,
  isPending,
}: DeleteSprintModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40">
          <DialogTitle className="text-lg font-bold text-foreground">Xóa Sprint</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Hành động này không thể hoàn tác. Sprint sẽ bị xóa vĩnh viễn khỏi SAGA và Jira.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bạn có chắc chắn muốn xóa Sprint <strong className="text-foreground">{sprintToDelete?.sprintName}</strong> không?
          </p>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-11 px-5"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={onConfirmDelete}
              className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
