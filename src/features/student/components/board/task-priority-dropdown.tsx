"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskPriority } from "@/features/projects/hooks/useProjectTasks";
import { JiraTask } from "@/features/projects/types";
import { PRIORITIES } from "./board-helpers";

export function TaskPriorityDropdown({
  projectId,
  task,
  isEnded,
}: {
  projectId: string;
  task: JiraTask;
  isEnded?: boolean;
}) {
  const updatePriorityMutation = useUpdateTaskPriority(projectId);

  const handleSelectPriority = (priorityId: string) => {
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      return;
    }
    updatePriorityMutation.mutate({
      taskId: task.id,
      priority: priorityId,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const currentPriority = task.priority?.toUpperCase() || "MEDIUM";
  const matched = PRIORITIES.find((p) => p.id === currentPriority) || PRIORITIES[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          disabled={updatePriorityMutation.isPending || isEnded}
          className="p-1 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Độ ưu tiên: ${matched.label}`}
        >
          {matched.icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl min-w-[160px] p-1.5 animate-in fade-in zoom-in-95 duration-150 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
          Độ ưu tiên
        </div>
        {PRIORITIES.map((p) => {
          const isSelected = currentPriority === p.id;
          return (
            <DropdownMenuItem
              key={p.id}
              onClick={() => handleSelectPriority(p.id)}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
            >
              {p.icon}
              <span className="truncate flex-1">{p.label}</span>
              {isSelected && <Check size={14} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
