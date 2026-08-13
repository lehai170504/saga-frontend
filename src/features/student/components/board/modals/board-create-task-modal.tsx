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
import { getTodayString } from "../board-helpers";
import { CustomDateInput } from "../../shared/custom-date-input";

export interface CreateTaskModalProps {
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

        <form onSubmit={onSubmit} noValidate className="space-y-4 pt-4">
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
