"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useProjectSprints } from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { isCourseEnded } from "@/lib/course-utils";
import { useProjectTraceability } from "@/features/projects/hooks/useTraceability";
import { getLinkedTaskIds } from "@/features/projects/utils/linkedTasksStorage";
import { useAuthStore } from "@/stores/authStore";
import { LayoutGrid, User, Loader2, AlertCircle } from "lucide-react";
import { JiraTask } from "@/features/projects/types";

// Subcomponents & Custom Hooks
import { BoardFilterBar } from "./board/board-filter-bar";
import { KanbanColumn } from "./board/kanban-column";
import { BoardModalsContainer } from "./board/board-modals-container";
import { useBoardTasksState } from "./board/hooks/useBoardTasksState";
import { useBoardKanbanState } from "./board/hooks/useBoardKanbanState";
import { shouldIgnoreTaskCardClick } from "./board/utils/popoverCloseGuard";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";

interface StudentBoardViewProps {
  courseId: string;
}

export function StudentBoardView({ courseId }: StudentBoardViewProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>("ACTIVE_DEFAULT");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("ALL");
  const [keyword, setKeyword] = useState("");

  // Load team data
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  const isEnded = isCourseEnded(courseData?.semester?.endDate);

  // Auth & Role
  const currentUser = useAuthStore((s) => s.user);
  const isLeader = myTeamData?.roleInTeam === "LEADER";
  const canActOnTask = (task: JiraTask) =>
    isLeader || task.assignee?.id === currentUser?.localProfileId;

  // Load sprints
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];

  // Determine active sprint and effective sprint ID
  const openSprints = sprints.filter((s) => s.state?.toUpperCase() !== "CLOSED");
  const activeSprint = sprints.find((s) => s.state === "active" || s.state === "ACTIVE");
  const currentSprintId =
    selectedSprintId === "ACTIVE_DEFAULT"
      ? activeSprint
        ? activeSprint.sprintId
        : openSprints[0]?.sprintId || sprints[0]?.sprintId || ""
      : selectedSprintId;

  // Custom Hooks
  const tasksState = useBoardTasksState(projectId, currentSprintId);
  const { data: traceabilityData } = useProjectTraceability(projectId);

  const [localLinkedTaskIds, setLocalLinkedTaskIds] = React.useState<Set<string>>(() => getLinkedTaskIds(projectId));

  React.useEffect(() => {
    const handleUpdate = () => {
      setLocalLinkedTaskIds(getLinkedTaskIds(projectId));
    };
    window.addEventListener("saga_linked_tasks_updated", handleUpdate);
    return () => window.removeEventListener("saga_linked_tasks_updated", handleUpdate);
  }, [projectId]);

  const linkedTaskIds = React.useMemo(() => {
    const ids = new Set<string>(localLinkedTaskIds);

    if (!traceabilityData) return ids;

    // 1. Trích xuất từ tasks (nếu backend trả mảng tasks có git issues/linked items)
    if (Array.isArray(traceabilityData.tasks)) {
      traceabilityData.tasks.forEach((t) => {
        const hasGithubIssues = Array.isArray(t.githubIssues) && t.githubIssues.length > 0;
        const rawLinkedIssues = (t as unknown as { linkedIssues?: { items?: unknown[] } | unknown[] }).linkedIssues;
        const hasLinkedItems =
          rawLinkedIssues &&
          ((Array.isArray(rawLinkedIssues) && rawLinkedIssues.length > 0) ||
            (typeof rawLinkedIssues === "object" &&
              "items" in rawLinkedIssues &&
              Array.isArray(rawLinkedIssues.items) &&
              rawLinkedIssues.items.length > 0));

        if (hasGithubIssues || hasLinkedItems) {
          const idVal = t.taskId || t.task?.id;
          const keyVal = t.jiraKey || t.task?.externalKey;
          if (idVal) ids.add(idVal);
          if (keyVal) ids.add(keyVal);
        }
      });
    }

    return ids;
  }, [traceabilityData, localLinkedTaskIds]);

  // Load tasks for current sprint
  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(projectId, {
    sprintId: currentSprintId,
  });
  const rawTasks: JiraTask[] =
    (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.tasks ||
    (tasksData as { tasks?: JiraTask[]; content?: JiraTask[] })?.content ||
    [];

  // Filter tasks locally by assignee & search keyword
  const filteredTasks = rawTasks.filter((task: JiraTask) => {
    const matchesAssignee =
      selectedAssigneeId === "ALL" ||
      (selectedAssigneeId === "UNASSIGNED" && !task.assignee) ||
      task.assignee?.id === selectedAssigneeId;

    const kw = keyword.trim().toLowerCase();
    const matchesKeyword =
      !kw ||
      task.title?.toLowerCase().includes(kw) ||
      task.externalKey?.toLowerCase().includes(kw);

    return matchesAssignee && matchesKeyword;
  });

  const kanbanState = useBoardKanbanState(projectId, filteredTasks);

  const rawMembers =
    (myTeamData?.members as { content?: { studentId: string; fullName: string }[] })?.content ||
    myTeamData?.members ||
    [];
  const teamMembers = Array.isArray(rawMembers)
    ? (rawMembers as { studentId: string; fullName: string }[]).map((m) => ({
      studentId: m.studentId,
      fullName: m.fullName,
    }))
    : [];

  const isLoading = isLoadingTeam || isLoadingCourse || isLoadingSprints;

  return (
    <div className="space-y-8 ">
      <PageHeader
        title="Board công việc Jira"
        description="Xem danh sách công việc và phân loại theo bảng Kanban trực quan từ dự án Jira."
      />

      {!myTeamData ? (
        !isLoading ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
            <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Bạn chưa tham gia vào nhóm nào trong khóa học này.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
      ) : !projectId ? (
        <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
          <LayoutGrid size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Nhóm của bạn chưa được liên kết với dự án Jira nào.
          </p>
        </div>
      ) : (
        <>
          <BoardFilterBar
            currentSprintId={currentSprintId}
            onSprintChange={setSelectedSprintId}
            sprints={sprints}
            selectedAssigneeId={selectedAssigneeId}
            onAssigneeChange={setSelectedAssigneeId}
            teamMembers={teamMembers}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />

          {isLoadingTasks ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Đang tải danh sách công việc...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-destructive/30 rounded-[2rem] bg-destructive/5 max-w-lg mx-auto">
              <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">Không thể nạp dữ liệu Board</h3>
              <p className="text-xs text-muted-foreground">
                Vui lòng kiểm tra lại kết nối dự án Jira của nhóm.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              {kanbanState.columns.map((column) => {
                const columnTasks = kanbanState.tasksByColumn[column.id] || [];

                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    columnTasks={columnTasks}
                    dragOverColumn={kanbanState.dragOverColumn}
                    draggedTask={kanbanState.draggedTask}
                    pendingTransitions={kanbanState.pendingTransitions}
                    projectId={projectId}
                    canActOnTask={canActOnTask}
                    linkedTaskIds={linkedTaskIds}
                    teamMembers={teamMembers}
                    onDragOver={kanbanState.handleDragOver}
                    onDragLeave={kanbanState.handleDragLeave}
                    onDrop={(e, columnId) => {
                      if (!isEnded) kanbanState.handleDrop(e, columnId);
                    }}
                    onDragStart={(e, t) => {
                      if (!isEnded) kanbanState.handleDragStart(e, t);
                    }}
                    onDragEnd={() => { }}
                    onTaskClick={(task) => {
                      if (shouldIgnoreTaskCardClick()) return;
                      tasksState.setSelectedTask(task);
                      tasksState.setIsDetailOpen(true);
                    }}
                    onOpenEditTask={(t) => {
                      if (!isEnded) tasksState.handleOpenEdit(t);
                    }}
                    onOpenDeleteTask={(t) => {
                      if (!isEnded) tasksState.handleOpenDelete(t);
                    }}
                    onOpenCreateTask={() => {
                      if (!isEnded) tasksState.setIsCreateOpen(true);
                    }}
                    isEnded={isEnded}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Board Modals Container */}
      <BoardModalsContainer
        projectId={projectId}
        isLeader={isLeader}
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
        editLabels={tasksState.editLabels}
        setEditLabels={tasksState.setEditLabels}
        editDescription={tasksState.editDescription}
        setEditDescription={tasksState.setEditDescription}
        handleEditTask={tasksState.handleEditTask}
        isEditTaskPending={tasksState.updateTaskMutation.isPending}
        isDeleteOpen={tasksState.isDeleteOpen}
        setIsDeleteOpen={tasksState.setIsDeleteOpen}
        taskToDelete={tasksState.taskToDelete}
        handleConfirmDelete={tasksState.handleConfirmDelete}
        isDeleteTaskPending={tasksState.deleteTaskMutation.isPending}
        isEnded={isEnded}
      />
    </div>
  );
}
