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
import { Loader2, Bug, Sparkles, PlusSquare, Bookmark, CheckSquare } from "lucide-react";
import { TaskLabelsInput } from "./task-labels-input";
import { getTodayString } from "../board-helpers";
import { CustomDateInput } from "../../shared/custom-date-input";

export interface EditTaskModalProps {
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

        <form onSubmit={onSubmit} noValidate className="space-y-4 pt-4">
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
                  <SelectItem value="BUG" className="text-xs">
                    <span className="flex items-center gap-2">
                      <Bug size={14} className="text-red-500 shrink-0" /> Bug
                    </span>
                  </SelectItem>
                  <SelectItem value="FEATURE" className="text-xs">
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} className="text-emerald-500 shrink-0" /> Feature
                    </span>
                  </SelectItem>
                  <SelectItem value="REQUEST" className="text-xs">
                    <span className="flex items-center gap-2">
                      <PlusSquare size={14} className="text-blue-500 shrink-0" /> Request
                    </span>
                  </SelectItem>
                  <SelectItem value="STORY" className="text-xs">
                    <span className="flex items-center gap-2">
                      <Bookmark size={14} className="text-emerald-600 shrink-0" /> Story
                    </span>
                  </SelectItem>
                  <SelectItem value="TASK" className="text-xs">
                    <span className="flex items-center gap-2">
                      <CheckSquare size={14} className="text-blue-600 shrink-0" /> Task
                    </span>
                  </SelectItem>
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

          <TaskLabelsInput
            value={editLabels}
            onChange={onEditLabelsChange}
          />

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
