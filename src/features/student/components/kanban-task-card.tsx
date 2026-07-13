import React from "react";
import { JiraTask } from "./kanban-types";
import { User, ChevronRight, ChevronLeft, Edit2, Trash2, GitBranch, GitCommit, GitPullRequest } from "lucide-react";

interface KanbanTaskCardProps {
  task: JiraTask;
  isLecturerView: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onOpenTaskModal: (task: JiraTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskColumn: (taskId: string, direction: "left" | "right") => void;
}

export function KanbanTaskCard({
  task,
  isLecturerView,
  onDragStart,
  onOpenTaskModal,
  onDeleteTask,
  onMoveTaskColumn
}: KanbanTaskCardProps) {
  const getConicGradientColor = (priority: string) => {
    if (priority === "high") return "bg-[conic-gradient(from_0deg,transparent_35%,#f43f5e_50%,transparent_65%)]";
    if (priority === "medium") return "bg-[conic-gradient(from_0deg,transparent_35%,#f59e0b_50%,transparent_65%)]";
    return "bg-[conic-gradient(from_0deg,transparent_35%,#0ea5e9_50%,transparent_65%)]";
  };

  const getLeftBorderColor = (priority: string) => {
    if (priority === "high") return "border-l-rose-500";
    if (priority === "medium") return "border-l-violet-500";
    return "border-l-sky-500";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (priority === "medium") return "bg-violet-500/10 text-violet-500 border-violet-500/20";
    return "bg-sky-50/10 text-sky-500 border-sky-500/20";
  };

  return (
    <div
      draggable={!isLecturerView}
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`relative p-[1.5px] overflow-hidden rounded-2xl group/card transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${!isLecturerView ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      {/* Rotating Gradient Running Border on Hover */}
      <div className="absolute inset-[-500%] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <div className={`w-full h-full ${getConicGradientColor(task.priority)} animate-border-rotate`} />
      </div>

      {/* Card Inner Content */}
      <div className={`relative bg-card/90 dark:bg-zinc-950 border-y border-r border-border/60 border-l-[5px] ${getLeftBorderColor(task.priority)} rounded-[15px] p-4 space-y-3.5 w-full h-full z-10`}>
        {/* Card top details */}
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted/50 px-2 py-0.5 rounded border border-border/40">
            {task.key}
          </span>

          {/* Micro Actions Menu */}
          {!isLecturerView && (
            <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <button
                onClick={() => onOpenTaskModal(task)}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                title="Sửa Task"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive cursor-pointer"
                title="Xóa Task"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Task Title */}
        <p className="text-xs font-bold text-foreground leading-relaxed line-clamp-2">
          {task.title}
        </p>

        {/* Integration Info (Commits/PRs) */}
        {(task.commitsCount || task.pullRequestsCount || task.branch) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {task.branch && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded-sm border border-border/50">
                <GitBranch size={10} />
                {task.branch}
              </div>
            )}
            {task.commitsCount ? (
              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded-sm border border-border/50">
                <GitCommit size={10} />
                {task.commitsCount}
              </div>
            ) : null}
            {task.pullRequestsCount ? (
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20">
                <GitPullRequest size={10} />
                {task.pullRequestsCount}
              </div>
            ) : null}
          </div>
        )}

        {/* Card Footer details */}
        <div className="flex justify-between items-center pt-3 border-t border-border/40 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <User size={12} className="text-muted-foreground shrink-0" />
            <span className="text-[10px] font-bold text-muted-foreground truncate">{task.assignee}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Priority indicator */}
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>

            {/* Story Points */}
            <span className="text-[10px] font-black text-primary-foreground bg-primary rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {task.storyPoints}
            </span>
          </div>
        </div>

        {/* Mobile Quick Column Shifters */}
        {!isLecturerView && (
          <div className="absolute right-2 top-2 flex gap-1 lg:hidden">
            {task.status !== "todo" && (
              <button
                onClick={() => onMoveTaskColumn(task.id, "left")}
                className="p-1 bg-background border border-border/60 hover:border-primary rounded-full text-muted-foreground hover:text-primary cursor-pointer"
              >
                <ChevronLeft size={10} />
              </button>
            )}
            {task.status !== "done" && (
              <button
                onClick={() => onMoveTaskColumn(task.id, "right")}
                className="p-1 bg-background border border-border/60 hover:border-primary rounded-full text-muted-foreground hover:text-primary cursor-pointer"
              >
                <ChevronRight size={10} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
