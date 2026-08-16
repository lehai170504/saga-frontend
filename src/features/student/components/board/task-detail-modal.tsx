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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { User, Flag, Calendar, Sparkles, Clock, Tag, Paperclip, ExternalLink, FileText, Link as LinkIcon } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";
import { getTypeBadge } from "./board-helpers";
import { TaskStatusDropdown } from "./task-status-dropdown";
import { TaskTraceabilitySection } from "@/features/projects/components/task-traceability-section";
import { TaskAttachmentModal } from "./modals/task-attachment-modal";

interface TaskDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: JiraTask | null;
  projectId: string;
  onTaskUpdated: (updatedTask: JiraTask) => void;
  variant?: "modal" | "drawer";
  isEnded?: boolean;
}

export function TaskDetailModal({
  isOpen,
  onOpenChange,
  selectedTask,
  projectId,
  onTaskUpdated,
  variant = "modal",
  isEnded,
}: TaskDetailModalProps) {
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = React.useState(false);

  if (!selectedTask) return null;

  const detailBody = (
    <>
      <div className="space-y-5 pt-5">
        {/* Description */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Mô tả công việc
          </span>
          <div className="p-3.5 bg-muted/20 border border-border/30 rounded-2xl text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
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
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Người thực hiện
              </span>
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
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Người báo cáo
              </span>
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
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Sprint
              </span>
              <p className="text-xs font-bold text-foreground">
                {selectedTask.sprint?.name || "Backlog / Chưa gán"}
              </p>
            </div>
          </div>

          {/* Labels */}
          {selectedTask.labels && selectedTask.labels.length > 0 && (
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                <Tag size={14} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  Nhãn (Labels)
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedTask.labels.map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="rounded-lg text-[10px] py-0.5 px-2 font-bold border-primary/20 bg-primary/5 text-primary/80"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Due Date */}
          {selectedTask.dueDate ? (
            (() => {
              const dueDateInfo = getTaskDueDateInfo(selectedTask.dueDate, selectedTask.status);
              return (
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 border ${dueDateInfo?.badgeStyle ||
                      "bg-muted/40 text-muted-foreground border-border/10"
                      }`}
                  >
                    <Calendar size={14} className={dueDateInfo?.iconColorStyle} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                      Hạn hoàn thành
                    </span>
                    <div>
                      <Badge
                        variant="outline"
                        className={`rounded-xl text-xs py-0.5 px-2.5 flex items-center gap-1 border w-fit ${dueDateInfo?.badgeStyle}`}
                      >
                        <span>{dueDateInfo?.badgeLabel}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                <Calendar size={14} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  Hạn hoàn thành
                </span>
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
        {/* Evidence / Attachments Section */}
        <div className="space-y-2 mt-3 p-3 bg-muted/20 border border-border/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip size={15} className="text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground">Bằng chứng / File đính kèm</span>
            </div>
            {!isEnded && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAttachmentModalOpen(true)}
                className="h-8 rounded-xl text-xs font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1.5 cursor-pointer"
              >
                <Paperclip size={13} />
                <span>+ Nộp bằng chứng</span>
              </Button>
            )}
          </div>

          {/* List of files/links */}
          {((selectedTask.attachments && selectedTask.attachments.length > 0) || (selectedTask.links && selectedTask.links.length > 0)) ? (
            <div className="space-y-1.5 pt-2">
              {selectedTask.attachments?.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/40 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} className="text-primary shrink-0" />
                    <span className="truncate font-semibold">{att.filename}</span>
                    <span className="text-[10px] text-muted-foreground">({(att.sizeBytes / 1024).toFixed(1)} KB)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-muted/40 font-mono">Jira #{att.externalId}</Badge>
                </div>
              ))}

              {selectedTask.links?.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/40 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon size={14} className="text-primary shrink-0" />
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate font-semibold text-primary hover:underline flex items-center gap-1">
                      {link.url}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic pt-1">
              Chưa có bằng chứng (file/link) nào được nộp cho Task này.
            </p>
          )}
        </div>

        {/* Traceability Jira Task ↔ GitHub Issue */}
        <TaskTraceabilitySection projectId={projectId} taskId={selectedTask.id} isEnded={isEnded} />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/40 mt-6 space-y-4">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground/60">
          <Clock size={10} />
          <span>
            Cập nhật cuối trên Jira:{" "}
            {selectedTask.externalUpdatedAt
              ? (() => {
                const d = new Date(selectedTask.externalUpdatedAt!);
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const yyyy = d.getFullYear();
                const hh = String(d.getHours()).padStart(2, "0");
                const min = String(d.getMinutes()).padStart(2, "0");
                return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
              })()
              : "Không xác định"}
          </span>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </div>
    </>
  );

  const headerContent = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {getTypeBadge(selectedTask.type)}
        <span className="text-xs font-black text-muted-foreground tracking-wide uppercase">
          {selectedTask.externalKey}
        </span>
        {selectedTask.storyPoint > 0 && (
          <Badge
            variant="secondary"
            className="rounded-xl font-bold bg-primary/5 text-primary border-primary/10 px-2 py-0.5 text-xs"
          >
            {selectedTask.storyPoint} SP
          </Badge>
        )}
        <TaskStatusDropdown
          projectId={projectId}
          task={selectedTask}
          onTransitionSuccess={onTaskUpdated}
          isEnded={isEnded}
        />
      </div>
      <div className="text-xl font-extrabold text-foreground leading-snug">
        {selectedTask.title}
      </div>
      <p className="text-xs text-muted-foreground">
        Chi tiết công việc đồng bộ trực tiếp từ Jira.
      </p>
    </>
  );

  if (variant === "drawer") {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-xl md:max-w-2xl border-l border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              <SheetHeader className="pb-4 border-b border-border/40 space-y-2 text-left">
                <SheetTitle asChild>
                  <div>{headerContent}</div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Chi tiết công việc đồng bộ trực tiếp từ Jira.
                </SheetDescription>
              </SheetHeader>
              {detailBody}
            </div>
          </SheetContent>
        </Sheet>
        <TaskAttachmentModal
          isOpen={isAttachmentModalOpen}
          onClose={() => setIsAttachmentModalOpen(false)}
          projectId={projectId}
          task={selectedTask}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] md:max-w-[580px] max-h-[85vh] rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
          <div>
            <DialogHeader className="pb-4 border-b border-border/40 space-y-2 text-left">
              <DialogTitle asChild>
                <div>{headerContent}</div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Chi tiết công việc đồng bộ trực tiếp từ Jira.
              </DialogDescription>
            </DialogHeader>
            {detailBody}
          </div>
        </DialogContent>
      </Dialog>
      <TaskAttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        projectId={projectId}
        task={selectedTask}
      />
    </>
  );
}
