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
import { ChevronDown, ChevronRight, Calendar, Plus, MoreHorizontal, Play, CheckCircle2 } from "lucide-react";
import { Sprint } from "@/features/projects/types";
import { formatSprintDates } from "./backlog-helpers";

interface SprintHeaderCardProps {
  sprint: Sprint;
  isExpanded: boolean;
  onToggleExpand: () => void;
  taskCount: number;
  isLeader: boolean;
  onOpenCreateTask: (sprintId: string) => void;
  onOpenEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint?: (sprintId: string) => void;
  onCompleteSprint?: (sprintId: string) => void;
}

export function SprintHeaderCard({
  sprint,
  isExpanded,
  onToggleExpand,
  taskCount,
  isLeader,
  onOpenCreateTask,
  onOpenEditSprint,
  onDeleteSprint,
}: SprintHeaderCardProps) {
  const isStateActive = sprint.state === "active" || sprint.state === "ACTIVE";
  const isStateClosed = sprint.state === "closed" || sprint.state === "CLOSED";

  return (
    <div
      onClick={onToggleExpand}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card/80 border border-border/40 hover:border-border transition-all duration-200 cursor-pointer"
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

      {/* Right Controls: Create task in sprint button + Actions dropdown */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenCreateTask(sprint.sprintId)}
          className="h-8 rounded-xl font-bold text-xs border-border/40 hover:bg-muted/50 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={12} />
          Tạo công việc
        </Button>

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
                onClick={() => onOpenEditSprint(sprint)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
              >
                Chỉnh sửa Sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteSprint(sprint.sprintId)}
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
