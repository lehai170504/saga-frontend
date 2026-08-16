"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Check } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskAssignee } from "@/features/projects/hooks/useProjectTasks";
import { JiraTask } from "@/features/projects/types";
import { getAssigneeInitials } from "./board-helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function TaskAssigneeDropdown({
  projectId,
  task,
  teamMembers,
}: {
  projectId: string;
  task: JiraTask;
  teamMembers: Array<{ studentId: string; fullName: string; avatarUrl?: string; avatar?: string; email?: string }>;
}) {
  const { user: currentUser } = useAuth();
  const updateAssigneeMutation = useUpdateTaskAssignee(projectId);

  const handleSelectAssignee = (studentId: string | null, fullName?: string) => {
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      return;
    }
    updateAssigneeMutation.mutate({
      taskId: task.id,
      assigneeId: studentId,
      assigneeName: studentId ? fullName : undefined,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const currentAssigneeId = task.assignee?.id;
  const currentAssigneeAvatar =
    ((task.assignee as unknown as Record<string, unknown>)?.avatarUrl as string) ||
    ((task.assignee as unknown as Record<string, unknown>)?.avatar as string) ||
    (currentUser &&
      (currentUser.localProfileId === currentAssigneeId || currentUser.email === ((task.assignee as unknown as Record<string, unknown>)?.email as string))
      ? currentUser.avatarUrl || currentUser.avatar
      : "") ||
    "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="h-6 w-6 rounded-full shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all outline-none"
          title={task.assignee?.fullName ? `Người thực hiện: ${task.assignee.fullName}` : "Chưa phân công"}
        >
          <Avatar className="h-6 w-6 border border-background shadow-sm">
            <AvatarImage src={currentAssigneeAvatar} alt={task.assignee?.fullName || "Unassigned"} />
            <AvatarFallback className="bg-cyan-500 text-black font-extrabold text-[10px]">
              {task.assignee?.fullName ? (
                getAssigneeInitials(task.assignee.fullName)
              ) : (
                <User size={10} />
              )}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl min-w-[220px] p-2 animate-in fade-in zoom-in-95 duration-150 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-2.5 py-1">
          Người thực hiện
        </div>

        {teamMembers.map((m) => {
          const isSelected = currentAssigneeId === m.studentId;
          const memberAvatar =
            m.avatarUrl ||
            m.avatar ||
            (currentUser &&
              (currentUser.localProfileId === m.studentId || currentUser.email === m.email || currentUser.fullName === m.fullName)
              ? currentUser.avatarUrl || currentUser.avatar
              : "") ||
            "";

          return (
            <DropdownMenuItem
              key={m.studentId}
              onClick={() => handleSelectAssignee(m.studentId, m.fullName)}
              className={`rounded-xl px-2.5 py-2 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
            >
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={memberAvatar} alt={m.fullName} />
                <AvatarFallback className="bg-cyan-500 text-black font-extrabold text-[10px]">
                  {getAssigneeInitials(m.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate flex-1">{m.fullName}</span>
              {isSelected && <Check size={14} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuItem
          onClick={() => handleSelectAssignee(null)}
          className={`rounded-xl px-2.5 py-2 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${!task.assignee ? "bg-muted text-foreground font-black" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
        >
          <div className="h-6 w-6 rounded-full bg-muted/80 text-muted-foreground flex items-center justify-center font-bold text-[10px] shrink-0 border border-border/30">
            <User size={12} />
          </div>
          <span className="truncate flex-1">Unassigned (Chưa phân công)</span>
          {!task.assignee && <Check size={14} className="text-foreground shrink-0" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
