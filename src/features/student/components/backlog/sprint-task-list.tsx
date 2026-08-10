"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, FolderKanban } from "lucide-react";
import { JiraTask, Sprint } from "@/features/projects/types";
import { SprintHeaderCard } from "./sprint-header-card";
import { BacklogTaskRow } from "./backlog-task-row";

interface SprintTaskListProps {
  sprint: Sprint;
  sprintTasks: JiraTask[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isLeader: boolean;
  projectId: string;
  canActOnTask: (task: JiraTask) => boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onSelectTask: (task: JiraTask) => void;
  onOpenCreateTask: (sprintId: string) => void;
  onOpenEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onOpenEditTask: (task: JiraTask) => void;
  onOpenDeleteTask: (task: JiraTask) => void;
}

export function SprintTaskList({
  sprint,
  sprintTasks,
  isExpanded,
  onToggleExpand,
  isLeader,
  projectId,
  canActOnTask,
  teamMembers,
  onSelectTask,
  onOpenCreateTask,
  onOpenEditSprint,
  onDeleteSprint,
  onOpenEditTask,
  onOpenDeleteTask,
}: SprintTaskListProps) {
  return (
    <div className="space-y-3">
      <SprintHeaderCard
        sprint={sprint}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        taskCount={sprintTasks.length}
        isLeader={isLeader}
        onOpenCreateTask={onOpenCreateTask}
        onOpenEditSprint={onOpenEditSprint}
        onDeleteSprint={onDeleteSprint}
      />

      {isExpanded && (
        <div className="pl-2 space-y-2">
          {sprintTasks.length === 0 ? (
            <div className="p-8 border border-dashed border-border/30 rounded-2xl text-center text-muted-foreground/40">
              <ClipboardList size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold uppercase tracking-wider">Chưa có công việc nào trong Sprint này</p>
            </div>
          ) : (
            sprintTasks.map((task) => (
              <BacklogTaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                canAct={canActOnTask(task)}
                teamMembers={teamMembers}
                onSelectTask={onSelectTask}
                onOpenEdit={onOpenEditTask}
                onOpenDelete={onOpenDeleteTask}
              />
            ))
          )}

          <button
            onClick={() => onOpenCreateTask(sprint.sprintId)}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-dashed border-border/30 text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 hover:border-border/50 transition-all text-xs font-bold w-full cursor-pointer mt-1"
          >
            <Plus size={14} />
            Thêm công việc vào {sprint.sprintName}
          </button>
        </div>
      )}
    </div>
  );
}

interface UnassignedBacklogSectionProps {
  unassignedTasks: JiraTask[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  projectId: string;
  canActOnTask: (task: JiraTask) => boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;
  onSelectTask: (task: JiraTask) => void;
  onOpenCreateTask: (sprintId: null) => void;
  onOpenEditTask: (task: JiraTask) => void;
  onOpenDeleteTask: (task: JiraTask) => void;
}

export function UnassignedBacklogSection({
  unassignedTasks,
  isExpanded,
  onToggleExpand,
  projectId,
  canActOnTask,
  teamMembers,
  onSelectTask,
  onOpenCreateTask,
  onOpenEditTask,
  onOpenDeleteTask,
}: UnassignedBacklogSectionProps) {
  return (
    <div className="space-y-3 pt-4">
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/30 hover:border-border transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <button type="button" className="p-1 rounded-lg text-muted-foreground shrink-0">
            <FolderKanban size={18} />
          </button>
          <h4 className="text-sm font-extrabold text-foreground">
            Backlog (Chưa phân Sprint)
          </h4>
          <span className="text-xs font-bold text-muted-foreground">
            ({unassignedTasks.length} công việc)
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCreateTask(null);
          }}
          className="h-8 rounded-xl font-bold text-xs border-border/40 hover:bg-muted/50 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={12} />
          Tạo công việc
        </Button>
      </div>

      {isExpanded && (
        <div className="pl-2 space-y-2">
          {unassignedTasks.length === 0 ? (
            <div className="p-8 border border-dashed border-border/30 rounded-2xl text-center text-muted-foreground/40">
              <ClipboardList size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold uppercase tracking-wider">Không có công việc nào trong Backlog</p>
            </div>
          ) : (
            unassignedTasks.map((task) => (
              <BacklogTaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                canAct={canActOnTask(task)}
                teamMembers={teamMembers}
                onSelectTask={onSelectTask}
                onOpenEdit={onOpenEditTask}
                onOpenDelete={onOpenDeleteTask}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
