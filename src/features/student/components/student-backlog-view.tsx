"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useProjectSprints } from "@/features/projects/hooks/useTeamSprints";
import { isCourseEnded } from "@/lib/course-utils";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { useAuthStore } from "@/stores/authStore";
import { FolderKanban, Loader2, AlertCircle } from "lucide-react";
import { JiraTask, Sprint } from "@/features/projects/types";

// Subcomponents & Hooks
import { BacklogFilterHeader } from "./backlog/backlog-filter-header";
import { SprintTaskList, UnassignedBacklogSection } from "./backlog/sprint-task-list";
import { BacklogModalsContainer } from "./backlog/backlog-modals-container";
import { useBacklogTasksState } from "./backlog/hooks/useBacklogTasksState";
import { useBacklogSprintsState } from "./backlog/hooks/useBacklogSprintsState";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";

interface StudentBacklogViewProps {
  courseId: string;
}

export function StudentBacklogView({ courseId }: StudentBacklogViewProps) {
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  const isEnded = isCourseEnded(courseData);

  // Auth & role
  const currentUser = useAuthStore((s) => s.user);
  const isLeader = true;
  const canActOnTask = (task: JiraTask) =>
    isLeader || task.assignee?.id === currentUser?.localProfileId;

  // Search & Filter States
  const [keyword, setKeyword] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Queries
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(
    projectId,
    { refetchInterval: 10000, refetchOnWindowFocus: true }
  );
  const sprints = sprintsData?.sprints || [];

  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(
    projectId,
    { page: 0, size: 100 },
    { refetchInterval: 10000, refetchOnWindowFocus: true }
  );
  const rawTasks: JiraTask[] = (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.tasks || (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.content || [];

  // Custom Hooks for Tasks & Sprints States
  const tasksState = useBacklogTasksState(projectId);
  const sprintsState = useBacklogSprintsState(projectId, sprints);

  const isLoading = isLoadingTeam || isLoadingCourse || (!!projectId && (isLoadingSprints || isLoadingTasks));

  // Sort sprints: Sprint cũ nằm trên, Sprint mới hơn nằm dưới
  const sortedSprints = [...sprints].sort((a, b) => {
    if (a.startDate && b.startDate) {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    if (a.startDate) return -1;
    if (b.startDate) return 1;
    return a.sprintName.localeCompare(b.sprintName, undefined, { numeric: true, sensitivity: "base" });
  });

  // Filter tasks locally by keyword, assignee & priority
  const tasks = rawTasks.filter((t) => {
    const matchesKeyword =
      !keyword.trim() ||
      t.title?.toLowerCase().includes(keyword.trim().toLowerCase()) ||
      t.externalKey?.toLowerCase().includes(keyword.trim().toLowerCase());

    const matchesAssignee =
      assigneeFilter === "ALL" ||
      (assigneeFilter === "UNASSIGNED" && !t.assignee) ||
      t.assignee?.id === assigneeFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      t.priority?.toUpperCase() === priorityFilter;

    return matchesKeyword && matchesAssignee && matchesPriority;
  });

  // Helper to extract Sprint ID from Task securely
  const getTaskSprintId = (task: JiraTask): string | null => {
    if (!task.sprint) return null;
    const s = task.sprint as unknown as Record<string, unknown>;
    const val = s.id || s.sprintId || s.sprint_id || s.externalId || (typeof task.sprint === "string" ? task.sprint : null);
    if (!val || val === "null" || val === "undefined") return null;
    return String(val);
  };

  const isTaskInSprint = (task: JiraTask, sprint: Sprint): boolean => {
    const taskSprintId = getTaskSprintId(task);
    if (!taskSprintId) return false;

    const targetSprintId = String(sprint.sprintId);
    const targetExternalId = (sprint as unknown as Record<string, unknown>).externalId ? String((sprint as unknown as Record<string, unknown>).externalId) : null;
    const targetId = (sprint as unknown as Record<string, unknown>).id ? String((sprint as unknown as Record<string, unknown>).id) : null;

    if (taskSprintId === targetSprintId) return true;
    if (targetExternalId && taskSprintId === targetExternalId) return true;
    if (targetId && taskSprintId === targetId) return true;
    if (task.sprint?.name && sprint.sprintName && task.sprint.name.trim().toLowerCase() === sprint.sprintName.trim().toLowerCase()) return true;
    return false;
  };

  // Group tasks by sprint
  const getSprintTasks = (sprintId: string) => {
    const targetSprint = sortedSprints.find((s) => s.sprintId === sprintId);
    if (!targetSprint) return [];
    return tasks.filter((t) => isTaskInSprint(t, targetSprint));
  };

  const unassignedTasks = tasks.filter((t) => {
    const taskSprintId = getTaskSprintId(t);
    if (!taskSprintId) return true;
    const belongsToAnySprint = sortedSprints.some((s) => isTaskInSprint(t, s));
    return !belongsToAnySprint;
  });

  const teamMembers = (myTeamData?.members?.content || []).map((st) => ({
    studentId: st.studentId,
    fullName: st.fullName,
  }));

  const handleMoveTaskWithAutoJump = (taskId: string, sprintId: string | null) => {
    tasksState.handleMoveTaskSprint(taskId, sprintId);

    if (!sprintId) {
      sprintsState.setExpandedUnassigned(true);
      setTimeout(() => {
        const el = document.getElementById("unassigned-backlog-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
      toast.success("Đã chuyển công việc về Backlog (Chưa phân Sprint)");
    } else {
      sprintsState.setExpandedSprints((prev) => ({ ...prev, [sprintId]: true }));
      const targetSprint = sortedSprints.find((s) => s.sprintId === sprintId);
      const name = targetSprint?.sprintName || "Sprint mới";
      setTimeout(() => {
        const el = document.getElementById(`sprint-card-${sprintId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
      toast.success(`Đã chuyển công việc sang ${name}`);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background text-foreground ">
      <PageHeader
        title="Quản lý Backlog Jira"
        description="Lập kế hoạch công việc, phân chia Sprint và quản lý danh mục công việc của dự án."
      />

      <BacklogFilterHeader
        keyword={keyword}
        onKeywordChange={setKeyword}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        teamMembers={teamMembers}
        isLeader={isLeader && !isEnded}
        isEnded={isEnded}
        onOpenCreateTask={() => {
          if (!isEnded) tasksState.handleOpenCreate(null);
        }}
        onOpenCreateSprint={() => {
          if (!isEnded) sprintsState.setIsCreateSprintOpen(true);
        }}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider">Đang tải dữ liệu Backlog...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sprints.length === 0 && unassignedTasks.length === 0 ? (
            <div className="p-12 border border-dashed border-border/40 rounded-3xl text-center bg-card/40">
              <FolderKanban size={36} className="mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="text-base font-bold text-foreground mb-1">Chưa có dữ liệu Backlog</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                Dự án chưa có Sprint hoặc công việc nào. Hãy bắt đầu bằng cách tạo Sprint mới hoặc thêm công việc.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-24 text-destructive">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="font-bold text-base">Đã xảy ra lỗi khi tải dữ liệu Backlog.</p>
              <p className="text-xs text-muted-foreground mt-1">Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sprints List (Sprint cũ lên trước, Sprint mới hơn ở dưới, ẩn Sprint đã hoàn thành) */}
              {sortedSprints
                .filter((sprint) => sprint.state !== "closed" && sprint.state !== "CLOSED")
                .map((sprint) => {
                  const sprintTasks = getSprintTasks(sprint.sprintId);
                  const isExpanded = sprintsState.expandedSprints[sprint.sprintId] !== false;

                  return (
                    <SprintTaskList
                      key={sprint.sprintId}
                      sprint={sprint}
                      sprintTasks={sprintTasks}
                      isExpanded={isExpanded}
                      onToggleExpand={() => sprintsState.toggleSprintExpanded(sprint.sprintId)}
                      isLeader={isLeader && !isEnded}
                      projectId={projectId}
                      canActOnTask={canActOnTask}
                      teamMembers={teamMembers}
                      sprints={sortedSprints}
                      onMoveTaskSprint={handleMoveTaskWithAutoJump}
                      onSelectTask={(t) => {
                        tasksState.setSelectedTask(t);
                        tasksState.setIsDetailOpen(true);
                      }}
                      onOpenCreateTask={(sprintId) => {
                        if (!isEnded) tasksState.handleOpenCreate(sprintId);
                      }}
                      onOpenEditSprint={(sprint) => {
                        if (!isEnded) sprintsState.handleOpenEditSprint(sprint);
                      }}
                      onDeleteSprint={(sprint) => {
                        if (!isEnded) sprintsState.handleDeleteSprint(sprint);
                      }}
                      onOpenEditTask={(task) => {
                        if (!isEnded) tasksState.handleOpenEdit(task);
                      }}
                      onOpenDeleteTask={(task) => {
                        if (!isEnded) tasksState.handleOpenDelete(task);
                      }}
                      onStartSprint={(sprintId) => {
                        if (!isEnded) sprintsState.handleStartSprint(sprintId);
                      }}
                      onCloseSprint={(sprintId) => {
                        if (!isEnded) sprintsState.handleCloseSprint(sprintId);
                      }}
                      isEnded={isEnded}
                    />
                  );
                })}

              {/* Unassigned / Backlog Section */}
              <UnassignedBacklogSection
                unassignedTasks={unassignedTasks}
                isExpanded={sprintsState.expandedUnassigned}
                onToggleExpand={() => sprintsState.setExpandedUnassigned(!sprintsState.expandedUnassigned)}
                projectId={projectId}
                canActOnTask={canActOnTask}
                teamMembers={teamMembers}
                sprints={sortedSprints}
                onMoveTaskSprint={handleMoveTaskWithAutoJump}
                onSelectTask={(t) => {
                  tasksState.setSelectedTask(t);
                  tasksState.setIsDetailOpen(true);
                }}
                onOpenCreateSprint={() => {
                  if (!isEnded) sprintsState.setIsCreateSprintOpen(true);
                }}
                onOpenEditTask={(task) => {
                  if (!isEnded) tasksState.handleOpenEdit(task);
                }}
                onOpenDeleteTask={(task) => {
                  if (!isEnded) tasksState.handleOpenDelete(task);
                }}
                isEnded={isEnded}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals Container */}
      <BacklogModalsContainer
        projectId={projectId}
        sprints={sprints}
        teamMembers={teamMembers}
        isDetailOpen={tasksState.isDetailOpen}
        setIsDetailOpen={tasksState.setIsDetailOpen}
        selectedTask={tasksState.selectedTask}
        setSelectedTask={tasksState.setSelectedTask}
        isCreateOpen={tasksState.isCreateOpen}
        setIsCreateOpen={tasksState.setIsCreateOpen}
        createTitle={tasksState.createTitle}
        setCreateTitle={tasksState.setCreateTitle}
        createIssueType={tasksState.createIssueType}
        setCreateIssueType={tasksState.setCreateIssueType}
        createPriority={tasksState.createPriority}
        setCreatePriority={tasksState.setCreatePriority}
        createDueDate={tasksState.createDueDate}
        setCreateDueDate={tasksState.setCreateDueDate}
        createAssignee={tasksState.createAssignee}
        setCreateAssignee={tasksState.setCreateAssignee}
        createLabels={tasksState.createLabels}
        setCreateLabels={tasksState.setCreateLabels}
        createDescription={tasksState.createDescription}
        setCreateDescription={tasksState.setCreateDescription}
        handleCreateTask={tasksState.handleCreateTask}
        isCreateTaskPending={tasksState.createTaskMutation.isPending}
        isEditOpen={tasksState.isEditOpen}
        setIsEditOpen={tasksState.setIsEditOpen}
        editTitle={tasksState.editTitle}
        setEditTitle={tasksState.setEditTitle}
        editIssueType={tasksState.editIssueType}
        setEditIssueType={tasksState.setEditIssueType}
        editPriority={tasksState.editPriority}
        setEditPriority={tasksState.setEditPriority}
        editDueDate={tasksState.editDueDate}
        setEditDueDate={tasksState.setEditDueDate}
        editAssignee={tasksState.editAssignee}
        setEditAssignee={tasksState.setEditAssignee}
        editLabels={tasksState.editLabels}
        setEditLabels={tasksState.setEditLabels}
        editDescription={tasksState.editDescription}
        setEditDescription={tasksState.setEditDescription}
        handleEditTask={tasksState.handleEditTask}
        isEditTaskPending={tasksState.updateTaskMutation.isPending}
        isDeleteOpen={tasksState.isDeleteOpen}
        setIsDeleteOpen={tasksState.setIsDeleteOpen}
        taskToDelete={tasksState.taskToDelete}
        handleDeleteTask={tasksState.handleDeleteTask}
        isDeleteTaskPending={tasksState.deleteTaskMutation.isPending}
        isCreateSprintOpen={sprintsState.isCreateSprintOpen}
        setIsCreateSprintOpen={sprintsState.setIsCreateSprintOpen}
        sprintNameInput={sprintsState.sprintNameInput}
        setSprintNameInput={sprintsState.setSprintNameInput}
        sprintGoalInput={sprintsState.sprintGoalInput}
        setSprintGoalInput={sprintsState.setSprintGoalInput}
        sprintStartDateInput={sprintsState.sprintStartDateInput}
        setSprintStartDateInput={sprintsState.setSprintStartDateInput}
        sprintEndDateInput={sprintsState.sprintEndDateInput}
        setSprintEndDateInput={sprintsState.setSprintEndDateInput}
        handleCreateSprint={sprintsState.handleCreateSprint}
        isCreateSprintPending={sprintsState.createSprintMutation.isPending}
        isEditSprintOpen={sprintsState.isEditSprintOpen}
        setIsEditSprintOpen={sprintsState.setIsEditSprintOpen}
        editSprintNameInput={sprintsState.editSprintNameInput}
        setEditSprintNameInput={sprintsState.setEditSprintNameInput}
        editSprintGoalInput={sprintsState.editSprintGoalInput}
        setEditSprintGoalInput={sprintsState.setEditSprintGoalInput}
        editSprintStartDateInput={sprintsState.editSprintStartDateInput}
        setEditSprintStartDateInput={sprintsState.setEditSprintStartDateInput}
        editSprintEndDateInput={sprintsState.editSprintEndDateInput}
        setEditSprintEndDateInput={sprintsState.setEditSprintEndDateInput}
        handleUpdateSprint={sprintsState.handleUpdateSprint}
        isEditSprintPending={sprintsState.updateSprintMutation.isPending}
        isAutoStart={!!sprintsState.autoStartSprintId}
        isMoveConfirmOpen={tasksState.isMoveConfirmOpen}
        setIsMoveConfirmOpen={tasksState.setIsMoveConfirmOpen}
        taskToMove={tasksState.taskToMove}
        targetSprintForMove={tasksState.targetSprintForMove}
        handleConfirmMoveTask={tasksState.handleConfirmMoveTask}
        isMoveTaskPending={tasksState.updateTaskMutation.isPending}
        isEnded={isEnded}
      />
    </div>
  );
}
