"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTodayString } from "./backlog-helpers";

interface CreateSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sprintNameInput: string;
  onSprintNameChange: (val: string) => void;
  sprintGoalInput: string;
  onSprintGoalChange: (val: string) => void;
  sprintStartDateInput: string;
  onSprintStartDateChange: (val: string) => void;
  sprintEndDateInput: string;
  onSprintEndDateChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function CreateSprintModal({
  isOpen,
  onOpenChange,
  sprintNameInput,
  onSprintNameChange,
  sprintGoalInput,
  onSprintGoalChange,
  sprintStartDateInput,
  onSprintStartDateChange,
  sprintEndDateInput,
  onSprintEndDateChange,
  onSubmit,
  isPending,
}: CreateSprintModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
            Tạo Sprint mới (Jira Sprint)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tạo Sprint mới trực tiếp trên Jira và đồng bộ về hệ thống SAGA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tên Sprint *</label>
            <Input
              value={sprintNameInput}
              onChange={(e) => onSprintNameChange(e.target.value)}
              placeholder="Ví dụ: Sprint 1"
              required
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mục tiêu Sprint</label>
            <Textarea
              value={sprintGoalInput}
              onChange={(e) => onSprintGoalChange(e.target.value)}
              placeholder="Mô tả mục tiêu của Sprint..."
              className="rounded-xl min-h-[80px] bg-background/50 border-border/40 text-xs p-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày bắt đầu</label>
              <Input
                type="date"
                min={getTodayString()}
                value={sprintStartDateInput}
                onChange={(e) => onSprintStartDateChange(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày kết thúc</label>
              <Input
                type="date"
                min={sprintStartDateInput || getTodayString()}
                value={sprintEndDateInput}
                onChange={(e) => onSprintEndDateChange(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Tạo mới
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
  editSprintNameInput: string;
  onEditSprintNameChange: (val: string) => void;
  editSprintGoalInput: string;
  onEditSprintGoalChange: (val: string) => void;
  editSprintStartDateInput: string;
  onEditSprintStartDateChange: (val: string) => void;
  editSprintEndDateInput: string;
  onEditSprintEndDateChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isAutoStart?: boolean;
}

export function EditSprintModal({
  isOpen,
  onOpenChange,
  editSprintNameInput,
  onEditSprintNameChange,
  editSprintGoalInput,
  onEditSprintGoalChange,
  editSprintStartDateInput,
  onEditSprintStartDateChange,
  editSprintEndDateInput,
  onEditSprintEndDateChange,
  onSubmit,
  isPending,
  isAutoStart = false,
}: EditSprintModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
            {isAutoStart ? "Cập nhật thời gian & Bắt đầu Sprint" : "Chỉnh sửa Sprint"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isAutoStart
              ? "Vui lòng chọn thời gian bắt đầu và kết thúc để kích hoạt khởi động Sprint này."
              : "Cập nhật thông tin của Sprint trực tiếp trên Jira."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tên Sprint *</label>
            <Input
              value={editSprintNameInput}
              onChange={(e) => onEditSprintNameChange(e.target.value)}
              placeholder="Ví dụ: Sprint 1"
              required
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mục tiêu Sprint</label>
            <Textarea
              value={editSprintGoalInput}
              onChange={(e) => onEditSprintGoalChange(e.target.value)}
              placeholder="Nhập mục tiêu của Sprint..."
              rows={2}
              className="rounded-xl bg-background/50 border-border/40 text-xs px-4 py-2.5 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày bắt đầu {isAutoStart && "*"}</label>
              <Input
                type="date"
                required={isAutoStart}
                value={editSprintStartDateInput}
                onChange={(e) => onEditSprintStartDateChange(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày kết thúc {isAutoStart && "*"}</label>
              <Input
                type="date"
                required={isAutoStart}
                value={editSprintEndDateInput}
                onChange={(e) => onEditSprintEndDateChange(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              {isAutoStart ? "Lưu & Bắt đầu Sprint" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface MoveTaskConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskToMove: JiraTask | null;
  sourceSprintName: string;
  targetSprintName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function MoveTaskConfirmModal({
  isOpen,
  onOpenChange,
  taskToMove,
  sourceSprintName,
  targetSprintName,
  onConfirm,
  isPending,
}: MoveTaskConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-2 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug flex items-center gap-2">
            <span className="p-2 bg-primary/10 text-primary rounded-xl">
              <ArrowRightLeft size={16} />
            </span>
            Di chuyển công việc?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-normal pt-2">
            Bạn có chắc chắn muốn di chuyển công việc{" "}
            <strong className="text-foreground font-bold">
              {taskToMove?.externalKey} - {taskToMove?.title}
            </strong>{" "}
            từ <strong className="text-foreground font-bold">{sourceSprintName}</strong> sang{" "}
            <strong className="text-foreground font-bold">{targetSprintName}</strong> không?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 border-t border-border/40 gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white h-10 px-5 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 size={12} className="mr-2 animate-spin" />
                Đang di chuyển...
              </>
            ) : (
              "Xác nhận di chuyển"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
