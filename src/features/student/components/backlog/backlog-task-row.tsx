"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";
import { getTypeIcon } from "./backlog-helpers";
import { TaskStatusDropdown } from "../board/task-status-dropdown";
import { TaskPriorityDropdown } from "../board/task-priority-dropdown";
import { TaskAssigneeDropdown } from "../board/task-assignee-dropdown";
import { shouldIgnoreTaskCardClick } from "@/features/student/components/board/utils/popoverCloseGuard";
import { getSagaMarkerBadgeStyle, getSagaMarkerDisplayName } from "../board/modals/task-labels-input";

interface BacklogTaskRowProps {
  task: JiraTask;
  projectId: string;
  canAct: boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onSelectTask: (task: JiraTask) => void;
  onOpenEdit: (task: JiraTask) => void;
  onOpenDelete: (task: JiraTask) => void;
}

export function BacklogTaskRow({
  task,
  projectId,
  canAct,
  teamMembers,
  onSelectTask,
  onOpenEdit,
  onOpenDelete,
}: BacklogTaskRowProps) {
  const dueDateInfo = getTaskDueDateInfo(task.dueDate, task.status);

  return (
    <div
      onClick={() => {
        if (shouldIgnoreTaskCardClick()) return;
        onSelectTask(task);
      }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card dark:bg-card/90 border border-border/70 dark:border-border/60 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Left Info: Type icon + Key + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="shrink-0 p-1.5 rounded-xl bg-muted/40 border border-border/20">
          {getTypeIcon(task.type)}
        </div>

        <span className="text-[11px] font-black text-muted-foreground/80 tracking-wider uppercase shrink-0">
          {task.externalKey}
        </span>

        <h5 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {task.title}
        </h5>

        {task.storyPoint > 0 && (
          <Badge variant="secondary" className="rounded-lg text-[10px] font-extrabold px-1.5 py-0.5 shrink-0 bg-secondary/80 border border-border/40">
            {task.storyPoint} SP
          </Badge>
        )}

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.labels.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className={`rounded-lg text-[9px] py-0.5 px-2 font-extrabold border truncate shrink-0 ${getSagaMarkerBadgeStyle(label)}`}
              >
                {getSagaMarkerDisplayName(label)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Due Date Badge + Status Dropdown + Priority Dropdown + Assignee Dropdown + Actions */}
      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
        {/* Due Date Warning Badge */}
        {dueDateInfo && (
          <Badge variant="outline" className={`rounded-xl text-[10px] py-0.5 px-2 flex items-center gap-1 border ${dueDateInfo.badgeStyle}`}>
            <Calendar size={11} className={dueDateInfo.iconColorStyle} />
            <span>{dueDateInfo.badgeLabel}</span>
          </Badge>
        )}

        {/* Status Dropdown */}
        <TaskStatusDropdown projectId={projectId} task={task} />

        {/* Priority Dropdown */}
        <TaskPriorityDropdown projectId={projectId} task={task} />

        {/* Assignee Dropdown */}
        <TaskAssigneeDropdown projectId={projectId} task={task} teamMembers={teamMembers} />

        {/* More Actions (Edit / Delete) */}
        {canAct && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer shrink-0"
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl min-w-[100px] p-1.5 animate-in fade-in duration-200">
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
        )}
      </div>
    </div>
  );
}
