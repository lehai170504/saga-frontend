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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight, Calendar, MoreHorizontal } from "lucide-react";
import { JiraTask, Sprint } from "@/features/projects/types";
import { formatSprintDates } from "./backlog-helpers";

interface SprintHeaderCardProps {
  sprint: Sprint;
  sprintTasks?: JiraTask[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  taskCount: number;
  isLeader: boolean;
  onOpenCreateTask?: (sprintId: string) => void;
  onOpenEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint?: (sprintId: string) => void;
  onCloseSprint?: (sprintId: string) => void;
}

export function SprintHeaderCard({
  sprint,
  sprintTasks = [],
  isExpanded,
  onToggleExpand,
  taskCount,
  isLeader,
  onOpenEditSprint,
  onDeleteSprint,
  onStartSprint,
  onCloseSprint,
}: SprintHeaderCardProps) {
  const isStateActive = sprint.state === "active" || sprint.state === "ACTIVE";
  const isStateClosed = sprint.state === "closed" || sprint.state === "CLOSED";

  // Calculate Story Points for 4 status categories
  const totalSP = sprintTasks.reduce((sum, t) => sum + (t.storyPoint || 0), 0);
  let todoSP = 0;
  let inProgressSP = 0;
  let inReviewSP = 0;
  let doneSP = 0;

  sprintTasks.forEach((t) => {
    const sp = t.storyPoint || 0;
    const st = (t.status || "").toUpperCase();

    if (st === "DONE" || st === "CLOSED" || st === "RESOLVED" || st === "COMPLETED") {
      doneSP += sp;
    } else if (st === "IN_REVIEW" || st === "TESTING" || st === "REVIEW") {
      inReviewSP += sp;
    } else if (st === "IN_PROGRESS" || st === "IN_DEV") {
      inProgressSP += sp;
    } else {
      todoSP += sp;
    }
  });

  return (
    <div
      onClick={onToggleExpand}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/60 dark:bg-muted/50 border border-border/80 dark:border-border/70 hover:border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Left: Accordion Chevron + Sprint Name + State Badge + Date */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          className="p-1 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors shrink-0"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        <h4 className="text-sm font-extrabold text-foreground truncate">
          {sprint.sprintName}
        </h4>

        {/* State Badge */}
        {isStateActive ? (
          <Badge className="rounded-xl text-[10px] font-black px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            Đang diễn ra
          </Badge>
        ) : isStateClosed ? (
          <Badge variant="outline" className="rounded-xl text-[10px] font-bold px-2.5 py-0.5 text-muted-foreground shrink-0">
            Đã hoàn thành
          </Badge>
        ) : (
          <Badge variant="secondary" className="rounded-xl text-[10px] font-bold px-2.5 py-0.5 bg-muted/60 text-muted-foreground border border-border/20 shrink-0">
            Tương lai
          </Badge>
        )}

        {/* Date Range */}
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground font-semibold">
          <Calendar size={13} className="text-muted-foreground/60 shrink-0" />
          <span>{formatSprintDates(sprint.startDate, sprint.endDate)}</span>
        </div>

        {/* Task Count Badge */}
        <Badge variant="outline" className="rounded-full bg-background/60 font-bold border-border/20 px-2 py-0.5 text-xs text-muted-foreground shrink-0">
          {taskCount} công việc
        </Badge>
      </div>

      {/* Right Controls: Story Points Stats Badges + Start/Close sprint button + Actions dropdown */}
      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
        {/* Story Points Stats Badges */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={100}>
            {/* Cần làm (To Do) SP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-6 px-2 min-w-[24px] rounded-md bg-slate-500/25 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center justify-center cursor-default select-none border border-slate-500/20 transition-all hover:scale-105">
                  {todoSP}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-foreground text-background shadow-xl border border-border/20">
                Cần làm: {todoSP} trên {totalSP} (điểm SP)
              </TooltipContent>
            </Tooltip>

            {/* Đang làm (In Progress) SP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-6 px-2 min-w-[24px] rounded-md bg-blue-600/25 dark:bg-blue-600/50 text-blue-700 dark:text-blue-200 text-xs font-extrabold flex items-center justify-center cursor-default select-none border border-blue-500/30 transition-all hover:scale-105">
                  {inProgressSP}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-foreground text-background shadow-xl border border-border/20">
                Đang làm: {inProgressSP} trên {totalSP} (điểm SP)
              </TooltipContent>
            </Tooltip>

            {/* Đang xem xét (In Review) SP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-6 px-2 min-w-[24px] rounded-md bg-purple-600/25 dark:bg-purple-600/50 text-purple-700 dark:text-purple-200 text-xs font-extrabold flex items-center justify-center cursor-default select-none border border-purple-500/30 transition-all hover:scale-105">
                  {inReviewSP}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-foreground text-background shadow-xl border border-border/20">
                Đang xem xét: {inReviewSP} trên {totalSP} (điểm SP)
              </TooltipContent>
            </Tooltip>

            {/* Đã xong (Done) SP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-6 px-2 min-w-[24px] rounded-md bg-emerald-600/25 dark:bg-emerald-600/50 text-emerald-700 dark:text-emerald-200 text-xs font-extrabold flex items-center justify-center cursor-default select-none border border-emerald-500/30 transition-all hover:scale-105">
                  {doneSP}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-foreground text-background shadow-xl border border-border/20">
                Đã xong: {doneSP} trên {totalSP} (điểm SP)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isLeader && !isStateClosed && (
          isStateActive ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCloseSprint?.(sprint.sprintId)}
              className="h-8 rounded-xl font-bold text-xs bg-destructive hover:bg-destructive/90 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Đóng Sprint
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onStartSprint?.(sprint.sprintId)}
              className="h-8 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Bắt đầu
            </Button>
          )
        )}

        {isLeader && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer"
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl min-w-[140px] p-1.5 animate-in fade-in duration-200">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEditSprint(sprint);
                }}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
              >
                Chỉnh sửa Sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSprint(sprint.sprintId);
                }}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
              >
                Xóa Sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
