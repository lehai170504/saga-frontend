"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectSprints } from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { useAuthStore } from "@/stores/authStore";
import { FolderKanban, Loader2, AlertCircle } from "lucide-react";
import { JiraTask } from "@/features/projects/types";

// Subcomponents & Hooks
import { BacklogFilterHeader } from "./backlog/backlog-filter-header";
import { SprintTaskList, UnassignedBacklogSection } from "./backlog/sprint-task-list";
import { BacklogModalsContainer } from "./backlog/backlog-modals-container";
import { useBacklogTasksState } from "./backlog/hooks/useBacklogTasksState";
import { useBacklogSprintsState } from "./backlog/hooks/useBacklogSprintsState";

interface StudentBacklogViewProps {
  courseId: string;
}

export function StudentBacklogView({ courseId }: StudentBacklogViewProps) {
  // Load team & project data
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";

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
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];

  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(projectId);
  const rawTasks: JiraTask[] = (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.tasks || (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.content || [];

  // Custom Hooks for Tasks & Sprints States
  const tasksState = useBacklogTasksState(projectId);
  const sprintsState = useBacklogSprintsState(projectId, sprints);

  const isLoading = isLoadingTeam || (!!projectId && (isLoadingSprints || isLoadingTasks));

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

  // Group tasks by sprint
  const unassignedTasks = tasks.filter((t) => !t.sprint?.id);

  const getSprintTasks = (sprintId: string) => {
    return tasks.filter((t) => t.sprint?.id === sprintId);
  };

  const teamMembers = (myTeamData?.members?.content || []).map((st) => ({
    studentId: st.studentId,
    fullName: st.fullName,
  }));

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
        isLeader={isLeader}
        onOpenCreateTask={() => tasksState.handleOpenCreate(null)}
        onOpenCreateSprint={() => sprintsState.setIsCreateSprintOpen(true)}
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
                      isLeader={isLeader}
                      projectId={projectId}
                      canActOnTask={canActOnTask}
                      teamMembers={teamMembers}
                      onSelectTask={(t) => {
                        tasksState.setSelectedTask(t);
                        tasksState.setIsDetailOpen(true);
                      }}
                      onOpenCreateTask={tasksState.handleOpenCreate}
                      onOpenEditSprint={sprintsState.handleOpenEditSprint}
                      onDeleteSprint={sprintsState.handleDeleteSprint}
                      onOpenEditTask={tasksState.handleOpenEdit}
                      onOpenDeleteTask={tasksState.handleOpenDelete}
                      onStartSprint={sprintsState.handleStartSprint}
                      onCloseSprint={sprintsState.handleCloseSprint}
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
                onSelectTask={(t) => {
                  tasksState.setSelectedTask(t);
                  tasksState.setIsDetailOpen(true);
                }}
                onOpenCreateSprint={() => sprintsState.setIsCreateSprintOpen(true)}
                onOpenEditTask={tasksState.handleOpenEdit}
                onOpenDeleteTask={tasksState.handleOpenDelete}
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
      />
    </div>
  );
}
