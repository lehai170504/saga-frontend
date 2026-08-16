"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTaskTransitions, useTransitionTask } from "@/features/projects/hooks/useProjectTasks";
import { TaskTransition } from "@/features/projects/api/taskApi";
import { JiraTask } from "@/features/projects/types";

export function TaskStatusDropdown({
  projectId,
  task,
  onTransitionSuccess,
  isEnded
}: {
  projectId: string;
  task: JiraTask;
  onTransitionSuccess?: (updatedTask: JiraTask) => void;
  isEnded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [prevTaskStatus, setPrevTaskStatus] = useState(task.status);

  if (task.status !== prevTaskStatus) {
    setPrevTaskStatus(task.status);
    setLocalStatus(null);
  }

  const { data: transitionsData, isLoading } = useTaskTransitions(projectId, task.id, isOpen);
  const transitionMutation = useTransitionTask(projectId);

  const translateTransitionName = (name: string) => {
    const map: Record<string, string> = {
      "To Do": "Cần làm",
      "In Progress": "Đang làm",
      "In Review": "Đang đánh giá",
      "Done": "Đã hoàn thành",
      "In Development": "Đang phát triển",
      "Blocked": "Bị chặn",
      "Open": "Mở",
      "Closed": "Đã đóng",
      "Reopened": "Mở lại",
      "Resolved": "Đã giải quyết",
      "Selected for Development": "Chọn để phát triển",
    };
    return map[name] ?? name;
  };

  const handleSelectTransition = (t: TaskTransition) => {
    const key = crypto.randomUUID();
    const label = translateTransitionName(t.name);
    setLocalStatus(label);
    setIsOpen(false);

    const targetStatus = t.targetStatusName || t.name;

    transitionMutation.mutate({
      taskId: task.id,
      transitionId: t.transitionId,
      idempotencyKey: key,
      targetStatus
    }, {
      onSuccess: () => {
        if (onTransitionSuccess) {
          const nextStatus = t.targetStatusName || t.name || task.status;
          onTransitionSuccess({ ...task, status: nextStatus });
        }
      },
      onError: () => {
        setLocalStatus(null);
      }
    });
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s.includes("DONE") || s.includes("HOÀN THÀNH") || s.includes("RESOLVED") || s.includes("CLOSED")) {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
    if (s.includes("PROGRESS") || s.includes("ĐANG LÀM") || s.includes("DEVELOPMENT")) {
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
    if (s.includes("REVIEW") || s.includes("ĐÁNH GIÁ")) {
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
    return "bg-muted text-muted-foreground border-muted-foreground/20";
  };

  const getStatusLabel = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s.includes("DONE") || s.includes("HOÀN THÀNH") || s.includes("RESOLVED") || s.includes("CLOSED")) {
      return "Đã hoàn thành";
    }
    if (s.includes("PROGRESS") || s.includes("ĐANG LÀM") || s.includes("DEVELOPMENT")) {
      return "Đang làm";
    }
    if (s.includes("REVIEW") || s.includes("ĐÁNH GIÁ")) {
      return "Đang đánh giá";
    }
    return "Cần làm";
  };

  const isPending = transitionMutation.isPending;
  const displayStatusLabel = localStatus || getStatusLabel(task.status);
  const displayStatusRaw = localStatus || task.status;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || isEnded}
          className={`h-7 rounded-lg text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1 cursor-pointer border shadow-sm transition-all hover:opacity-90 ${getStatusStyle(displayStatusRaw)}`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin shrink-0 text-current" />
              <span>{displayStatusLabel}</span>
            </>
          ) : (
            <>
              <span>{displayStatusLabel}</span>
              <ChevronDown size={10} className="opacity-60 shrink-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl min-w-[140px] p-1.5 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className="flex items-center justify-center p-3">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          </div>
        ) : !transitionsData || transitionsData.length === 0 ? (
          <div className="text-[10px] text-muted-foreground/60 p-2 italic text-center">
            Không có bước chuyển
          </div>
        ) : (
          transitionsData.map((t: TaskTransition) => (
            <DropdownMenuItem
              key={t.transitionId}
              onClick={() => handleSelectTransition(t)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
            >
              {translateTransitionName(t.name)}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
