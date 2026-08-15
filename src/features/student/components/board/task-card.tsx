"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Loader2, MoreVertical } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";
import { formatDueDate, getTypeIcon } from "./board-helpers";
import { CardStoryPointPicker } from "./card-story-point-picker";
import { TaskPriorityDropdown } from "./task-priority-dropdown";
import { TaskAssigneeDropdown } from "./task-assignee-dropdown";

import { GithubDevelopmentPopover, GithubBadgeTriggerButton } from "./github-development-popover";
import { shouldIgnoreTaskCardClick } from "./utils/popoverCloseGuard";

interface TaskCardProps {
  task: JiraTask;
  projectId: string;
  isPendingMove: boolean;
  isDraggingThis: boolean;
  canAct: boolean;
  isGitLinked?: boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onDragStart: (e: React.DragEvent, task: JiraTask) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onOpenEdit: (task: JiraTask) => void;
  onOpenDelete: (task: JiraTask) => void;
}

export function TaskCard({
  task,
  projectId,
  isPendingMove,
  isDraggingThis,
  canAct,
  teamMembers,
  onDragStart,
  onDragEnd,
  onClick,
  onOpenEdit,
  onOpenDelete,
}: TaskCardProps) {
  const dueDateInfo = getTaskDueDateInfo(task.dueDate, task.status);



  return (
    <Card
      draggable={!isPendingMove && canAct}
      onDragStart={(e) => canAct && onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onPointerDown={(e) => {
        if (shouldIgnoreTaskCardClick()) {
          e.stopPropagation();
        }
      }}
      onMouseDown={(e) => {
        if (shouldIgnoreTaskCardClick()) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        if (shouldIgnoreTaskCardClick()) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        onClick();
      }}
      className={`rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between min-h-[140px] ${
        isPendingMove
          ? "opacity-60 bg-muted/40 border-dashed border-primary/50 cursor-wait animate-pulse"
          : isDraggingThis
          ? "opacity-50 scale-95 ring-2 ring-primary/40 cursor-grabbing"
          : canAct
          ? `hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-grab active:cursor-grabbing ${
              dueDateInfo?.cardBorderStyle ? dueDateInfo.cardBorderStyle : 'border-border/40 bg-card'
            }`
          : `hover:border-border/60 hover:shadow-md cursor-pointer ${
              dueDateInfo?.cardBorderStyle ? dueDateInfo.cardBorderStyle : 'border-border/40 bg-card'
            }`
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h5 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 flex-1">
            {task.title}
          </h5>
          {isPendingMove ? (
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold shrink-0 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              <span>Đang chuyển...</span>
            </div>
          ) : canAct ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[100px] p-1.5 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                  onClick={() => onOpenEdit(task)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                >
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpenDelete(task)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Hạn hoàn thành</span>
            {dueDateInfo ? (
              <div>
                <Badge variant="outline" className={`rounded-xl text-[10px] py-0.5 px-2 flex items-center gap-1 border w-fit ${dueDateInfo.badgeStyle}`}>
                  <Calendar size={11} className={dueDateInfo.iconColorStyle} />
                  <span>{dueDateInfo.badgeLabel}</span>
                </Badge>
              </div>
            ) : (
              <p className="text-xs text-foreground font-semibold">
                {formatDueDate(task.dueDate ?? undefined)}
              </p>
            )}
          </div>

          {/* GitHub Badge đối diện Hạn hoàn thành */}
          <GithubDevelopmentPopover projectId={projectId} taskId={task.id}>
            <GithubBadgeTriggerButton projectId={projectId} taskId={task.id} />
          </GithubDevelopmentPopover>
        </div>
      </div>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="rounded-lg text-[9px] py-0 px-1.5 font-bold border-primary/20 bg-primary/5 text-primary/80 truncate max-w-[80px]"
            >
              {label}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-border/10">
        {/* Left: Type Icon + Key */}
        <div className="flex items-center gap-1.5 min-w-0">
          {getTypeIcon(task.type)}
          <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase truncate">
            {task.externalKey}
          </span>
        </div>

        {/* Right: Story Point Picker -> Priority Dropdown -> Assignee Avatar Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <CardStoryPointPicker projectId={projectId} task={task} />

          <TaskPriorityDropdown projectId={projectId} task={task} />
          <TaskAssigneeDropdown projectId={projectId} task={task} teamMembers={teamMembers} />
        </div>
      </div>
    </Card>
  );
}
