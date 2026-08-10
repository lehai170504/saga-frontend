"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Flag, Calendar, Sparkles, Clock } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";
import { getTypeBadge } from "./board-helpers";
import { TaskStatusDropdown } from "./task-status-dropdown";

interface TaskDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: JiraTask | null;
  projectId: string;
  onTaskUpdated: (updatedTask: JiraTask) => void;
}

export function TaskDetailModal({
  isOpen,
  onOpenChange,
  selectedTask,
  projectId,
  onTaskUpdated,
}: TaskDetailModalProps) {
  if (!selectedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {getTypeBadge(selectedTask.type)}
            <span className="text-xs font-black text-muted-foreground tracking-wide uppercase">
              {selectedTask.externalKey}
            </span>
            {selectedTask.storyPoint > 0 && (
              <Badge variant="secondary" className="rounded-xl font-bold bg-primary/5 text-primary border-primary/10 px-2 py-0.5 text-xs">
                {selectedTask.storyPoint} SP
              </Badge>
            )}
            <TaskStatusDropdown 
              projectId={projectId} 
              task={selectedTask} 
              onTransitionSuccess={onTaskUpdated} 
            />
          </div>
          <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
            {selectedTask.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Xem thông tin chi tiết nhiệm vụ đồng bộ từ Jira.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Description */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Mô tả công việc</span>
            <div className="p-3 bg-muted/20 border border-border/30 rounded-2xl text-xs leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
              {selectedTask.description || (
                <span className="text-muted-foreground/60 italic">Không có mô tả công việc.</span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                <User size={14} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Người thực hiện</span>
                <p className="text-xs font-bold text-foreground">
                  {selectedTask.assignee?.fullName || "Chưa giao việc"}
                </p>
                {selectedTask.assignee?.studentCode && (
                  <p className="text-[9px] font-medium text-muted-foreground">
                    {selectedTask.assignee.studentCode}
                  </p>
                )}
              </div>
            </div>

            {/* Reporter */}
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                <User size={14} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Người báo cáo</span>
                <p className="text-xs font-bold text-foreground">
                  {selectedTask.reporter?.fullName || "Hệ thống"}
                </p>
                {selectedTask.reporter?.studentCode && (
                  <p className="text-[9px] font-medium text-muted-foreground">
                    {selectedTask.reporter.studentCode}
                  </p>
                )}
              </div>
            </div>

            {/* Sprint */}
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                <Flag size={14} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Sprint</span>
                <p className="text-xs font-bold text-foreground">
                  {selectedTask.sprint?.name || "Backlog / Chưa gán"}
                </p>
              </div>
            </div>

            {/* Due Date */}
            {selectedTask.dueDate ? (() => {
              const dueDateInfo = getTaskDueDateInfo(selectedTask.dueDate, selectedTask.status);
              return (
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 border ${dueDateInfo?.badgeStyle || "bg-muted/40 text-muted-foreground border-border/10"}`}>
                    <Calendar size={14} className={dueDateInfo?.iconColorStyle} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Hạn hoàn thành</span>
                    <div>
                      <Badge variant="outline" className={`rounded-xl text-xs py-0.5 px-2.5 flex items-center gap-1 border w-fit ${dueDateInfo?.badgeStyle}`}>
                        <span>{dueDateInfo?.badgeLabel}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                  <Calendar size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Hạn hoàn thành</span>
                  <p className="text-xs font-bold text-foreground">Không có</p>
                </div>
              </div>
            )}
          </div>

          {/* Estimation / Story Point Display */}
          <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/30 rounded-2xl mt-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground">Điểm SP (Story Point)</span>
            </div>
            <span className="text-xs font-extrabold text-foreground px-3 py-1 bg-muted/40 border border-border/30 rounded-xl">
              {selectedTask.storyPoint ?? 0}
            </span>
          </div>

          {/* Dates footer */}
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground/60 pt-4 border-t border-border/20">
            <Clock size={10} />
            <span>Cập nhật cuối trên Jira: {selectedTask.externalUpdatedAt ? (() => { const d = new Date(selectedTask.externalUpdatedAt!); const dd = String(d.getDate()).padStart(2,'0'); const mm = String(d.getMonth()+1).padStart(2,'0'); const yyyy = d.getFullYear(); const hh = String(d.getHours()).padStart(2,'0'); const min = String(d.getMinutes()).padStart(2,'0'); return `${dd}-${mm}-${yyyy} ${hh}:${min}`; })() : "Không xác định"}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
