"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprint } from "@/features/projects/types";

interface BoardFilterBarProps {
  currentSprintId: string;
  onSprintChange: (sprintId: string) => void;
  sprints: Sprint[];
  selectedAssigneeId: string;
  onAssigneeChange: (assigneeId: string) => void;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

export function BoardFilterBar({
  currentSprintId,
  onSprintChange,
  sprints,
  selectedAssigneeId,
  onAssigneeChange,
  teamMembers,
  keyword,
  onKeywordChange,
}: BoardFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-panel border border-border/40 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Sprint Select */}
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <Select value={currentSprintId} onValueChange={onSprintChange}>
            <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 font-semibold px-4 cursor-pointer text-xs w-full sm:w-auto">
              <SelectValue placeholder="Lọc theo Sprint" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" className="rounded-2xl shadow-xl border-border/40 mt-1">
              {[...sprints]
                .filter((s) => s.state?.toUpperCase() !== "CLOSED")
                .sort((a, b) => {
                  const getOrder = (state?: string) => {
                    const st = state?.toUpperCase();
                    if (st === "ACTIVE" || st === "IN_PROGRESS") return 1;
                    return 2;
                  };
                  return getOrder(a.state) - getOrder(b.state);
                })
                .map((s) => {
                  const st = s.state?.toUpperCase();
                  let badgeText = "";
                  if (st === "ACTIVE" || st === "IN_PROGRESS") badgeText = "(Hiện tại)";
                  else if (st === "FUTURE" || st === "PLANNED") badgeText = "(Sắp tới)";

                  return (
                    <SelectItem key={s.sprintId} value={s.sprintId} className="rounded-xl font-medium text-xs">
                      {s.sprintName} {badgeText}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Select */}
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <Select value={selectedAssigneeId} onValueChange={onAssigneeChange}>
            <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 font-semibold px-4 cursor-pointer text-xs w-full sm:w-auto">
              <SelectValue placeholder="Lọc theo thành viên" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" className="rounded-2xl shadow-xl border-border/40 mt-1">
              <SelectItem value="ALL" className="rounded-xl font-medium text-xs">Tất cả thành viên</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.studentId} value={m.studentId} className="rounded-xl font-medium text-xs">
                  {m.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm kiếm theo mã Task hoặc tiêu đề..."
          className="h-10 pl-10 rounded-xl bg-background/50 border-border/40 text-xs"
        />
      </div>
    </div>
  );
}
