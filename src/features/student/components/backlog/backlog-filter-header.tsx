"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BacklogFilterHeaderProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onOpenCreateTask: (sprintId?: string | null) => void;
  onOpenCreateSprint: () => void;
  isLeader: boolean;
  isEnded?: boolean;
}

export function BacklogFilterHeader({
  keyword,
  onKeywordChange,
  assigneeFilter,
  onAssigneeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  teamMembers,
  onOpenCreateTask,
  onOpenCreateSprint,
  isLeader,
  isEnded,
}: BacklogFilterHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 glass-panel border border-border/40 rounded-2xl">
      {/* Search & Select Filters */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
          <Input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm kiếm công việc..."
            className="h-10 pl-10 rounded-xl bg-background/50 border-border/40 text-xs"
          />
        </div>

        {/* Assignee Filter */}
        <div className="w-[180px]">
          <Select value={assigneeFilter} onValueChange={onAssigneeFilterChange}>
            <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs font-semibold px-3">
              <SelectValue placeholder="Người thực hiện" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" className="rounded-xl border-border/40">
              <SelectItem value="ALL" className="text-xs">Tất cả người thực hiện</SelectItem>
              <SelectItem value="UNASSIGNED" className="text-xs">Chưa giao việc</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                  {m.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="w-[150px]">
          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs font-semibold px-3">
              <SelectValue placeholder="Độ ưu tiên" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" className="rounded-xl border-border/40">
              <SelectItem value="ALL" className="text-xs">Tất cả Priority</SelectItem>
              <SelectItem value="HIGHEST" className="text-xs">Highest</SelectItem>
              <SelectItem value="HIGH" className="text-xs">High</SelectItem>
              <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
              <SelectItem value="LOW" className="text-xs">Low</SelectItem>
              <SelectItem value="LOWEST" className="text-xs">Lowest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={() => onOpenCreateTask(null)}
          disabled={isEnded}
          className="h-10 px-4 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          Tạo công việc
        </Button>

        {isLeader && (
          <Button
            variant="outline"
            onClick={onOpenCreateSprint}
            className="h-10 px-4 rounded-xl font-bold text-xs border-border/50 hover:bg-muted/50 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            Tạo Sprint
          </Button>
        )}
      </div>
    </div>
  );
}
