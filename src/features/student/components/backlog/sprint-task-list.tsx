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
  sprints?: Sprint[];
  onMoveTaskSprint?: (taskId: string, sprintId: string | null) => void;
  onSelectTask: (task: JiraTask) => void;
  onOpenCreateTask: (sprintId: string) => void;
  onOpenEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onOpenEditTask: (task: JiraTask) => void;
  onOpenDeleteTask: (task: JiraTask) => void;
  onStartSprint?: (sprintId: string) => void;
  onCloseSprint?: (sprintId: string) => void;
  isEnded?: boolean;
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
  sprints,
  onMoveTaskSprint,
  onSelectTask,
  onOpenCreateTask,
  onOpenEditSprint,
  onDeleteSprint,
  onOpenEditTask,
  onOpenDeleteTask,
  onStartSprint,
  onCloseSprint,
  isEnded,
}: SprintTaskListProps) {
  return (
    <div id={`sprint-card-${sprint.sprintId}`} className="space-y-3 scroll-mt-24">
      <SprintHeaderCard
        sprint={sprint}
        sprintTasks={sprintTasks}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        taskCount={sprintTasks.length}
        isLeader={isLeader}
        onOpenCreateTask={onOpenCreateTask}
        onOpenEditSprint={onOpenEditSprint}
        onDeleteSprint={onDeleteSprint}
        onStartSprint={onStartSprint}
        onCloseSprint={onCloseSprint}
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
                sprints={sprints}
                onMoveTaskSprint={onMoveTaskSprint}
                onSelectTask={onSelectTask}
                onOpenEdit={onOpenEditTask}
                onOpenDelete={onOpenDeleteTask}
                isEnded={isEnded}
              />
            ))
          )}

          {!isEnded && (
            <button
              onClick={() => onOpenCreateTask(sprint.sprintId)}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-dashed border-border/30 text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 hover:border-border/50 transition-all text-xs font-bold w-full cursor-pointer mt-1"
            >
              <Plus size={14} />
              Thêm công việc vào {sprint.sprintName}
            </button>
          )}
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
  sprints?: Sprint[];
  onMoveTaskSprint?: (taskId: string, sprintId: string | null) => void;
  onSelectTask: (task: JiraTask) => void;
  onOpenCreateSprint: () => void;
  onOpenEditTask: (task: JiraTask) => void;
  onOpenDeleteTask: (task: JiraTask) => void;
  isEnded?: boolean;
}

export function UnassignedBacklogSection({
  unassignedTasks,
  isExpanded,
  onToggleExpand,
  projectId,
  canActOnTask,
  teamMembers,
  sprints,
  onMoveTaskSprint,
  onSelectTask,
  onOpenCreateSprint,
  onOpenEditTask,
  onOpenDeleteTask,
  isEnded,
}: UnassignedBacklogSectionProps) {
  return (
    <div id="unassigned-backlog-section" className="space-y-3 pt-4 scroll-mt-24">
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 dark:bg-muted/40 border border-border/80 dark:border-border/70 hover:border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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

        {!isEnded && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl h-8 text-xs font-bold gap-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateSprint();
            }}
          >
            <Plus size={14} /> Tạo Sprint mới
          </Button>
        )}
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
                sprints={sprints}
                onMoveTaskSprint={onMoveTaskSprint}
                onSelectTask={onSelectTask}
                onOpenEdit={onOpenEditTask}
                onOpenDelete={onOpenDeleteTask}
                isEnded={isEnded}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
