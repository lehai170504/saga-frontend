"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame } from "lucide-react";
import { Sprint } from "@/features/projects/types";

interface BurndownHeaderSelectorProps {
  sprints: Sprint[];
  selectedSprintId: string;
  onSelectSprint: (sprintId: string) => void;
}

export function BurndownHeaderSelector({
  sprints,
  selectedSprintId,
  onSelectSprint,
}: BurndownHeaderSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 border border-border/50 p-6 rounded-[2rem] backdrop-blur-xl shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Flame size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Biểu đồ Tiến độ Sprint (Burndown Chart)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-medium pl-10">
          Đối chiếu số lượng task còn lại thực tế với đường tiêu thụ lý tưởng theo thời gian
        </p>
      </div>

      {/* Sprint Select */}
      <div className="w-full sm:w-64">
        <Select value={selectedSprintId} onValueChange={onSelectSprint}>
          <SelectTrigger className="w-full bg-background border border-border/60 rounded-xl h-11 focus:ring-2 focus:ring-primary/20 font-bold text-foreground">
            <SelectValue placeholder="Chọn Sprint" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-xl">
            {sprints.map((sprint) => (
              <SelectItem
                key={sprint.sprintId}
                value={sprint.sprintId}
                className="rounded-lg cursor-pointer font-semibold py-2.5"
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <span>{sprint.sprintName}</span>
                  {sprint.state?.toUpperCase() === "ACTIVE" && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
                      Đang diễn ra
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
