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
import { Calendar, MoreHorizontal, Zap } from "lucide-react";
import { JiraTask, Sprint } from "@/features/projects/types";
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
  sprints?: Sprint[];
  onMoveTaskSprint?: (taskId: string, sprintId: string | null) => void;
  onSelectTask: (task: JiraTask) => void;
  onOpenEdit: (task: JiraTask) => void;
  onOpenDelete: (task: JiraTask) => void;
  isEnded?: boolean;
}

export function BacklogTaskRow({
  task,
  projectId,
  canAct,
  teamMembers,
  sprints,
  onMoveTaskSprint,
  onSelectTask,
  onOpenEdit,
  onOpenDelete,
  isEnded,
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
        <TaskStatusDropdown projectId={projectId} task={task} isEnded={isEnded} />

        {/* Priority Dropdown */}
        <TaskPriorityDropdown projectId={projectId} task={task} isEnded={isEnded} />

        {/* Assignee Dropdown */}
        <TaskAssigneeDropdown projectId={projectId} task={task} teamMembers={teamMembers} isEnded={isEnded} />

        {/* Sprint Selection Dropdown */}
        {sprints && sprints.length > 0 && onMoveTaskSprint && !isEnded && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="outline"
                className="rounded-xl h-8 px-2.5 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 cursor-pointer font-extrabold text-[10px] gap-1 flex items-center shrink-0 transition-all shadow-xs"
              >
                <Zap size={11} className="text-primary fill-primary/30 shrink-0" />
                <span className="max-w-[100px] truncate">{task.sprint?.name || "Backlog"}</span>
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl min-w-[180px] p-1.5 animate-in fade-in duration-200">
              <div className="px-2 py-1 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Chuyển sang Sprint
              </div>
              <DropdownMenuItem
                onClick={() => onMoveTaskSprint(task.id, null)}
                className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors flex items-center justify-between"
              >
                <span>Backlog (Chưa phân)</span>
                {!task.sprint?.id && <span className="text-primary font-black">✓</span>}
              </DropdownMenuItem>
              <div className="my-1 border-t border-border/40" />
              {sprints
                .filter((s) => s.state !== "closed" && s.state !== "CLOSED")
                .map((s) => {
                  const isCurrent = task.sprint?.id === s.sprintId;
                  return (
                    <DropdownMenuItem
                      key={s.sprintId}
                      onClick={() => onMoveTaskSprint(task.id, s.sprintId)}
                      className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{s.sprintName}</span>
                      {isCurrent && <span className="text-primary font-black">✓</span>}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
