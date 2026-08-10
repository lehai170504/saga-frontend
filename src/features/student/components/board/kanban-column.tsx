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
  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
      className={`flex flex-col gap-4 p-4 rounded-3xl border transition-all duration-200 min-w-[250px] ${
        dragOverColumn === column.id
          ? `border-primary/60 ${column.color} ring-2 ring-primary/30 scale-[1.01] shadow-lg`
          : `border-border/30 ${column.color}`
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-border/20 pb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
          <h4 className="text-sm font-extrabold text-foreground">{column.title}</h4>
        </div>
        <Badge variant="outline" className="rounded-full bg-background/60 font-bold border-border/20 px-2 py-0.5 text-xs text-muted-foreground">
          {columnTasks.length}
        </Badge>
      </div>

      {/* Column Task Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
        {columnTasks.length === 0 ? (
          <div className="h-32 border border-dashed border-border/20 rounded-2xl flex flex-col items-center justify-center text-muted-foreground/30">
            <ClipboardList size={24} className="mb-1" />
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
