"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
    dotColor: string;
  };
  columnTasks: JiraTask[];
  dragOverColumn: string | null;
  draggedTask: JiraTask | null;
  pendingTransitions: Record<string, string>;
  projectId: string;
  canActOnTask: (task: JiraTask) => boolean;
  linkedTaskIds?: Set<string>;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, task: JiraTask) => void;
  onDragEnd: () => void;
  onTaskClick: (task: JiraTask) => void;
  onOpenEditTask: (task: JiraTask) => void;
  onOpenDeleteTask: (task: JiraTask) => void;
  onOpenCreateTask: () => void;
}

export function KanbanColumn({
  column,
  columnTasks,
  dragOverColumn,
  draggedTask,
  pendingTransitions,
  projectId,
  canActOnTask,
  linkedTaskIds,
  teamMembers,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onTaskClick,
  onOpenEditTask,
  onOpenDeleteTask,
  onOpenCreateTask,
}: KanbanColumnProps) {
  const isOver = dragOverColumn === column.id;

  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
      className={`rounded-[2rem] p-4 transition-all duration-300 min-h-[500px] border flex flex-col justify-between ${
        column.color
      } ${
        isOver
          ? "ring-2 ring-primary/40 border-primary/50 bg-primary/[0.02] shadow-xl scale-[1.01]"
          : "hover:border-border/60"
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between px-1 pb-2 border-b border-border/20">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`} />
            <h4 className="text-xs font-black text-foreground tracking-wide uppercase">
              {column.title}
            </h4>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-muted/60 text-muted-foreground border-border/20"
          >
            {columnTasks.length}
          </Badge>
        </div>

        {/* List of Task Cards */}
        {columnTasks.length === 0 ? (
          <div className="py-12 border border-dashed border-border/20 rounded-2xl flex flex-col items-center justify-center text-muted-foreground/40 space-y-1 bg-background/20">
            <ClipboardList size={24} className="stroke-[1.5]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Trống</span>
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              isPendingMove={!!pendingTransitions[task.id]}
              isDraggingThis={draggedTask?.id === task.id}
              canAct={canActOnTask(task)}
              isGitLinked={linkedTaskIds?.has(task.id)}
              teamMembers={teamMembers}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={() => onTaskClick(task)}
              onOpenEdit={onOpenEditTask}
              onOpenDelete={onOpenDeleteTask}
            />
          ))
        )}

        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 justify-start py-2.5 px-4 rounded-xl border border-dashed border-border/30 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 hover:border-border transition-all duration-300 text-xs font-bold w-full cursor-pointer mt-2"
        >
          <Plus size={14} />
          Thêm công việc
        </button>
      </div>
    </div>
  );
}
