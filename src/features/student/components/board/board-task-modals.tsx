"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTodayString } from "./board-helpers";
import { CustomDateInput } from "../shared/custom-date-input";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  createTitle: string;
  onCreateTitleChange: (val: string) => void;
  createIssueType: string;
  onCreateIssueTypeChange: (val: string) => void;
  createPriority: string;
  onCreatePriorityChange: (val: string) => void;
  createAssignee: string;
  onCreateAssigneeChange: (val: string) => void;
  createDueDate: string;
  onCreateDueDateChange: (val: string) => void;
  createDescription: string;
  onCreateDescriptionChange: (val: string) => void;
  createLabels: string;
  onCreateLabelsChange: (val: string) => void;
  isLeader: boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function BoardCreateTaskModal({
  isOpen,
  onOpenChange,
  createTitle,
  onCreateTitleChange,
  createIssueType,
  onCreateIssueTypeChange,
  createPriority,
  onCreatePriorityChange,
  createAssignee,
  onCreateAssigneeChange,
  createDueDate,
  onCreateDueDateChange,
  createDescription,
  onCreateDescriptionChange,
  createLabels,
  onCreateLabelsChange,
  isLeader,
  teamMembers,
  onSubmit,
  isPending,
}: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
            Tạo công việc mới (Jira Task)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tạo công việc mới trực tiếp trên Jira và đồng bộ về hệ thống SAGA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tiêu đề công việc *</label>
            <Input
              value={createTitle}
              onChange={(e) => onCreateTitleChange(e.target.value)}
              placeholder="Ví dụ: Thiết kế giao diện Dashboard"
              required
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Loại công việc</label>
              <Select value={createIssueType} onValueChange={onCreateIssueTypeChange}>
                <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40">
                  <SelectItem value="TASK" className="text-xs">Task (Mặc định)</SelectItem>
                  <SelectItem value="BUG" className="text-xs">Bug</SelectItem>
                  <SelectItem value="STORY" className="text-xs">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mức độ ưu tiên</label>
              <Select value={createPriority} onValueChange={onCreatePriorityChange}>
                <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40">
                  <SelectItem value="HIGHEST" className="text-xs">Highest</SelectItem>
                  <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                  <SelectItem value="MEDIUM" className="text-xs">Medium (Mặc định)</SelectItem>
                  <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                  <SelectItem value="LOWEST" className="text-xs">Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Người thực hiện
                {!isLeader && <span className="ml-1 text-primary/70 normal-case tracking-normal font-normal">(bản thân)</span>}
              </label>
              <Select
                value={createAssignee}
                onValueChange={onCreateAssigneeChange}
                disabled={!isLeader}
              >
                <SelectTrigger className={`h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 ${!isLeader ? "opacity-70 cursor-not-allowed" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40">
                  <SelectItem value="UNASSIGNED" className="text-xs">Chưa phân công</SelectItem>
                  {teamMembers.map((m) => (
                    <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                      {m.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
              <CustomDateInput
                min={getTodayString()}
                value={createDueDate}
                onChange={onCreateDueDateChange}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả chi tiết</label>
            <Textarea
              value={createDescription}
              onChange={(e) => onCreateDescriptionChange(e.target.value)}
              placeholder="Nhập mô tả nhiệm vụ chi tiết..."
              className="rounded-xl min-h-[100px] bg-background/50 border-border/40 text-xs p-4"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Nhãn (Labels)</label>
            <Input
              value={createLabels}
              onChange={(e) => onCreateLabelsChange(e.target.value)}
              placeholder="Ngăn cách bằng dấu phẩy, ví dụ: FE, API, design"
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
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

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editTitle: string;
  onEditTitleChange: (val: string) => void;
  editIssueType: string;
  onEditIssueTypeChange: (val: string) => void;
  editPriority: string;
  onEditPriorityChange: (val: string) => void;
  editDueDate: string;
  onEditDueDateChange: (val: string) => void;
  editDescription: string;
  onEditDescriptionChange: (val: string) => void;
  editLabels: string;
  onEditLabelsChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function BoardEditTaskModal({
  isOpen,
  onOpenChange,
  editTitle,
  onEditTitleChange,
  editIssueType,
  onEditIssueTypeChange,
  editPriority,
  onEditPriorityChange,
  editDueDate,
  onEditDueDateChange,
  editDescription,
  onEditDescriptionChange,
  editLabels,
  onEditLabelsChange,
  onSubmit,
  isPending,
}: EditTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
            Chỉnh sửa công việc (Jira Task)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cập nhật các trường thông tin của công việc này trực tiếp trên Jira.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tiêu đề công việc *</label>
            <Input
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              placeholder="Ví dụ: Thiết kế giao diện Dashboard"
              required
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Loại công việc</label>
              <Select value={editIssueType} onValueChange={onEditIssueTypeChange}>
                <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40">
                  <SelectItem value="TASK" className="text-xs">Task</SelectItem>
                  <SelectItem value="BUG" className="text-xs">Bug</SelectItem>
                  <SelectItem value="STORY" className="text-xs">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mức độ ưu tiên</label>
              <Select value={editPriority} onValueChange={onEditPriorityChange}>
                <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40">
                  <SelectItem value="HIGHEST" className="text-xs">Highest</SelectItem>
                  <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                  <SelectItem value="MEDIUM" className="text-xs">Medium (Mặc định)</SelectItem>
                  <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                  <SelectItem value="LOWEST" className="text-xs">Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
            <CustomDateInput
              min={getTodayString()}
              value={editDueDate}
              onChange={onEditDueDateChange}
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả chi tiết</label>
            <Textarea
              value={editDescription}
              onChange={(e) => onEditDescriptionChange(e.target.value)}
              placeholder="Nhập mô tả nhiệm vụ chi tiết..."
              className="rounded-xl min-h-[100px] bg-background/50 border-border/40 text-xs p-4"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Nhãn (Labels)</label>
            <Input
              value={editLabels}
              onChange={(e) => onEditLabelsChange(e.target.value)}
              placeholder="Ngăn cách bằng dấu phẩy, ví dụ: FE, API, design"
              className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
            />
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
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteTaskModalProps {
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
