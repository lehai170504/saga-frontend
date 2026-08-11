"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectSprints, useCreateSprint, useUpdateSprint, useDeleteSprint } from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/features/projects/hooks/useProjectTasks";
import { useAuthStore } from "@/stores/authStore";
import { FolderKanban, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { UpdateTaskRequest } from "@/features/projects/api/taskApi";
import { JiraTask, Sprint } from "@/features/projects/types";

// Subcomponents
import { BacklogFilterHeader } from "./backlog/backlog-filter-header";
import { SprintTaskList, UnassignedBacklogSection } from "./backlog/sprint-task-list";
import { CreateSprintModal, EditSprintModal, MoveTaskConfirmModal } from "./backlog/sprint-modals";
import { BacklogCreateTaskModal, BacklogEditTaskModal, BacklogDeleteTaskModal } from "./backlog/backlog-task-modals";
import { TaskDetailModal } from "./board/task-detail-modal";
import { getTodayString } from "./backlog/backlog-helpers";


interface StudentBacklogViewProps {
  courseId: string;
}

export function StudentBacklogView({ courseId }: StudentBacklogViewProps) {
  // Load team & project data
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";

  // Auth & role
  const currentUser = useAuthStore((s) => s.user);
  const isLeader = myTeamData?.roleInTeam === "LEADER";
  const canActOnTask = (task: JiraTask) =>
    isLeader || task.assignee?.id === currentUser?.localProfileId;

  // Search & Filter States
  const [keyword, setKeyword] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Accordion State for Sprints
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
  const [expandedUnassigned, setExpandedUnassigned] = useState(true);

  // Task Dialog States
  const [selectedTask, setSelectedTask] = useState<JiraTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [targetSprintIdForCreate, setTargetSprintIdForCreate] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK");
  const [createPriority, setCreatePriority] = useState("MEDIUM");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState("UNASSIGNED");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // Sprint Dialog States
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [sprintNameInput, setSprintNameInput] = useState("");
  const [sprintGoalInput, setSprintGoalInput] = useState("");
  const [sprintStartDateInput, setSprintStartDateInput] = useState("");
  const [sprintEndDateInput, setSprintEndDateInput] = useState("");

  const [isEditSprintOpen, setIsEditSprintOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);
  const [editSprintNameInput, setEditSprintNameInput] = useState("");
  const [editSprintGoalInput, setEditSprintGoalInput] = useState("");
  const [editSprintStartDateInput, setEditSprintStartDateInput] = useState("");
  const [editSprintEndDateInput, setEditSprintEndDateInput] = useState("");

  // Move Task Confirm Dialog State
  const [isMoveConfirmOpen, setIsMoveConfirmOpen] = useState(false);
  const [taskToMove, setTaskToMove] = useState<JiraTask | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [targetSprintForMove, setTargetSprintForMove] = useState<string | null>(null);

  // Queries & Mutations
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];

  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(projectId);
  const rawTasks: JiraTask[] = (tasksData as { tasks?: JiraTask[], content?: JiraTask[] })?.tasks || (tasksData as { tasks?: JiraTask[], content?: JiraTask[] })?.content || [];

  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  const createSprintMutation = useCreateSprint(projectId);
  const updateSprintMutation = useUpdateSprint(projectId);
  const deleteSprintMutation = useDeleteSprint(projectId);

  // Toggle sprint accordion
  const toggleSprintExpanded = (sprintId: string) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: prev[sprintId] !== undefined ? !prev[sprintId] : false,
    }));
  };

  // Sprint Actions
  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintNameInput.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    const todayStr = getTodayString();
    if (sprintStartDateInput && sprintStartDateInput < todayStr) {
      toast.error("Ngày bắt đầu Sprint không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }
    if (sprintEndDateInput && sprintStartDateInput && sprintEndDateInput < sprintStartDateInput) {
      toast.error("Ngày kết thúc Sprint không được trước ngày bắt đầu!");
      return;
    }
    if (sprintEndDateInput && sprintEndDateInput < todayStr) {
      toast.error("Ngày kết thúc Sprint không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const key = crypto.randomUUID();
    createSprintMutation.mutate(
      {
        name: sprintNameInput.trim(),
        goal: sprintGoalInput.trim(),
        startDate: sprintStartDateInput || null,
        endDate: sprintEndDateInput || null,
        idempotencyKey: key,
      },
      {
        onSuccess: () => {
          setIsCreateSprintOpen(false);
          setSprintNameInput("");
          setSprintGoalInput("");
          setSprintStartDateInput("");
          setSprintEndDateInput("");
        },
      }
    );
  };

  const handleOpenEditSprint = (sprint: Sprint) => {
    setSprintToEdit(sprint);
    setEditSprintNameInput(sprint.sprintName || "");
    setEditSprintGoalInput(sprint.goal || "");
    setEditSprintStartDateInput(sprint.startDate ? sprint.startDate.split("T")[0] : "");
    setEditSprintEndDateInput(sprint.endDate ? sprint.endDate.split("T")[0] : "");
    setIsEditSprintOpen(true);
  };

  const handleUpdateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintToEdit) return;
    if (!editSprintNameInput.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    const todayStr = getTodayString();
    if (editSprintStartDateInput && editSprintStartDateInput < todayStr) {
      toast.error("Ngày bắt đầu Sprint không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }
    if (editSprintEndDateInput && editSprintStartDateInput && editSprintEndDateInput < editSprintStartDateInput) {
      toast.error("Ngày kết thúc Sprint không được trước ngày bắt đầu!");
      return;
    }
    if (editSprintEndDateInput && editSprintEndDateInput < todayStr) {
      toast.error("Ngày kết thúc Sprint không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const key = crypto.randomUUID();
    updateSprintMutation.mutate(
      {
        sprintId: sprintToEdit.sprintId,
        name: editSprintNameInput.trim(),
        goal: editSprintGoalInput.trim(),
        startDate: editSprintStartDateInput || null,
        endDate: editSprintEndDateInput || null,
        idempotencyKey: key,
      },
      {
        onSuccess: () => {
          setIsEditSprintOpen(false);
          setSprintToEdit(null);
        },
      }
    );
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Sprint này không?")) return;
    const key = crypto.randomUUID();
    deleteSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

  // Move task handler
  const handleMoveTaskSprint = (taskId: string, sprintId: string | null) => {
    const sprintIdempotencyKey = crypto.randomUUID();
    updateTaskMutation.mutate({
      taskId,
      sprintId,
      sprintIdempotencyKey,
    });
  };

  // Open Create Task Dialog
  const handleOpenCreate = (sprintId: string | null = null) => {
    setTargetSprintIdForCreate(sprintId);
    setCreateTitle("");
    setCreateDescription("");
    setCreateIssueType("TASK");
    setCreatePriority("MEDIUM");
    setCreateDueDate("");
    setCreateAssignee("UNASSIGNED");
    setIsCreateOpen(true);
  };

  // Create Task Form Submit
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề task.");
      return;
    }

    const todayStr = getTodayString();
    if (createDueDate && createDueDate < todayStr) {
      toast.error("Hạn hoàn thành công việc không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const payload = {
      title: createTitle.trim(),
      description: createDescription.trim() || undefined,
      type: createIssueType,
      priority: createPriority || "MEDIUM",
      dueDate: createDueDate || undefined,
      assigneeId: createAssignee === "UNASSIGNED" ? undefined : createAssignee,
    };

    const idempotencyKey = crypto.randomUUID();
    const assignIdempotencyKey = crypto.randomUUID();
    const activeSprintId = targetSprintIdForCreate || undefined;

    createTaskMutation.mutate(
      {
        data: payload,
        idempotencyKey,
        assignIdempotencyKey: activeSprintId ? assignIdempotencyKey : ""
      },
      {
        onSuccess: (task: JiraTask) => {
          if (activeSprintId) {
            handleMoveTaskSprint(task.id, activeSprintId);
          }
          setIsCreateOpen(false);
        }
      }
    );
  };

  // Open Edit Dialog
  const handleOpenEdit = (task: JiraTask) => {
    setTaskToEdit(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditIssueType(task.type || "TASK");
    setEditPriority(task.priority?.toUpperCase() || "MEDIUM");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditAssignee(task.assignee?.id || "UNASSIGNED");
    setIsEditOpen(true);
  };

  // Save Edit Form
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    if (!editTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc.");
      return;
    }

    const todayStr = getTodayString();
    if (editDueDate && editDueDate < todayStr) {
      toast.error("Hạn hoàn thành công việc không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const isTitleChanged = editTitle.trim() !== (taskToEdit.title || "").trim();
    const isDescriptionChanged = editDescription.trim() !== (taskToEdit.description || "").trim();
    const origDueDate = taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "";
    const isDueDateChanged = editDueDate !== origDueDate;
    const origPriority = taskToEdit.priority?.toUpperCase() || "MEDIUM";
    const isPriorityChanged = editPriority !== origPriority;

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) mainPayload.priority = editPriority;

    const origAssignee = taskToEdit.assignee?.id || "UNASSIGNED";
    const isAssigneeChanged = editAssignee !== origAssignee;

    if (Object.keys(mainPayload).length === 0 && !isAssigneeChanged) {
      setIsEditOpen(false);
      setTaskToEdit(null);
      return;
    }

    const mutationArgs: {
      taskId: string;
      data?: UpdateTaskRequest;
      assigneeId?: string | null;
      mainIdempotencyKey?: string;
      assigneeIdempotencyKey?: string;
    } = {
      taskId: taskToEdit.id
    };

    if (Object.keys(mainPayload).length > 0) {
      mutationArgs.data = mainPayload;
      mutationArgs.mainIdempotencyKey = crypto.randomUUID();
    }

    if (isAssigneeChanged) {
      mutationArgs.assigneeId = editAssignee === "UNASSIGNED" ? null : editAssignee;
      mutationArgs.assigneeIdempotencyKey = crypto.randomUUID();
    }

    updateTaskMutation.mutate(
      mutationArgs,
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setTaskToEdit(null);
        }
      }
    );
  };

  // Open Delete dialog
  const handleOpenDelete = (task: JiraTask) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  // Confirm delete task
  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    const key = crypto.randomUUID();
    deleteTaskMutation.mutate(
      { taskId: taskToDelete.id, idempotencyKey: key },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        }
      }
    );
  };

  // Move task confirmation
  const handleConfirmMoveTask = () => {
    if (!taskToMove) return;
    handleMoveTaskSprint(taskToMove.id, targetSprintForMove);
    setIsMoveConfirmOpen(false);
    setTaskToMove(null);
  };

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
  const rawMembers = (myTeamData?.members as { content?: { studentId: string; fullName: string }[] })?.content || myTeamData?.members || [];
  const teamMembers = Array.isArray(rawMembers)
    ? (rawMembers as { studentId: string; fullName: string }[]).map((m) => ({
      studentId: m.studentId,
      fullName: m.fullName,
    }))
    : [];

  const isLoading = isLoadingTeam || isLoadingSprints;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      <PageHeader
        title="Quản lý Backlog Jira"
        description="Lập kế hoạch công việc, phân chia Sprint và quản lý danh mục công việc của dự án."
      />

      {!myTeamData ? (
        !isLoading ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
            <FolderKanban size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
      ) : !projectId ? (
        <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
          <FolderKanban size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
          <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa liên kết dự án nào trên Jira.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Controls Bar */}
          <BacklogFilterHeader
            keyword={keyword}
            onKeywordChange={setKeyword}
            assigneeFilter={assigneeFilter}
            onAssigneeFilterChange={setAssigneeFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            teamMembers={teamMembers}
            onOpenCreateTask={handleOpenCreate}
            onOpenCreateSprint={() => setIsCreateSprintOpen(true)}
            isLeader={isLeader}
          />

          {isLoadingTasks ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đang tải danh sách công việc...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 text-destructive">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="font-bold text-base">Đã xảy ra lỗi khi tải dữ liệu Backlog.</p>
              <p className="text-xs text-muted-foreground mt-1">Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sprints List */}
              {sprints.map((sprint) => {
                const sprintTasks = getSprintTasks(sprint.sprintId);
                const isExpanded = expandedSprints[sprint.sprintId] !== false;

                return (
                  <SprintTaskList
                    key={sprint.sprintId}
                    sprint={sprint}
                    sprintTasks={sprintTasks}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleSprintExpanded(sprint.sprintId)}
                    isLeader={isLeader}
                    projectId={projectId}
                    canActOnTask={canActOnTask}
                    teamMembers={teamMembers}
                    onSelectTask={(t) => {
                      setSelectedTask(t);
                      setIsDetailOpen(true);
                    }}
                    onOpenCreateTask={handleOpenCreate}
                    onOpenEditSprint={handleOpenEditSprint}
                    onDeleteSprint={handleDeleteSprint}
                    onOpenEditTask={handleOpenEdit}
                    onOpenDeleteTask={handleOpenDelete}
                  />
                );
              })}

              {/* Unassigned / Backlog Section */}
              <UnassignedBacklogSection
                unassignedTasks={unassignedTasks}
                isExpanded={expandedUnassigned}
                onToggleExpand={() => setExpandedUnassigned(!expandedUnassigned)}
                projectId={projectId}
                canActOnTask={canActOnTask}
                teamMembers={teamMembers}
                onSelectTask={(t) => {
                  setSelectedTask(t);
                  setIsDetailOpen(true);
                }}
                onOpenCreateTask={handleOpenCreate}
                onOpenEditTask={handleOpenEdit}
                onOpenDeleteTask={handleOpenDelete}
              />
            </div>

          )}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        selectedTask={selectedTask}
        projectId={projectId}
        onTaskUpdated={(updatedTask) => setSelectedTask(updatedTask)}
      />

      {/* Create Task Modal */}
      <BacklogCreateTaskModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        createTitle={createTitle}
        onCreateTitleChange={setCreateTitle}
        createIssueType={createIssueType}
        onCreateIssueTypeChange={setCreateIssueType}
        createPriority={createPriority}
        onCreatePriorityChange={setCreatePriority}
        createDueDate={createDueDate}
        onCreateDueDateChange={setCreateDueDate}
        createAssignee={createAssignee}
        onCreateAssigneeChange={setCreateAssignee}
        createDescription={createDescription}
        onCreateDescriptionChange={setCreateDescription}
        teamMembers={teamMembers}
        onSubmit={handleCreateTask}
        isPending={createTaskMutation.isPending}
      />

      {/* Edit Task Modal */}
      <BacklogEditTaskModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editTitle={editTitle}
        onEditTitleChange={setEditTitle}
        editIssueType={editIssueType}
        onEditIssueTypeChange={setEditIssueType}
        editPriority={editPriority}
        onEditPriorityChange={setEditPriority}
        editDueDate={editDueDate}
        onEditDueDateChange={setEditDueDate}
        editAssignee={editAssignee}
        onEditAssigneeChange={setEditAssignee}
        editDescription={editDescription}
        onEditDescriptionChange={setEditDescription}
        teamMembers={teamMembers}
        onSubmit={handleEditTask}
        isPending={updateTaskMutation.isPending}
      />

      {/* Delete Task Modal */}
      <BacklogDeleteTaskModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        taskToDelete={taskToDelete}
        onConfirmDelete={handleDeleteTask}
        isPending={deleteTaskMutation.isPending}
      />

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        sprintNameInput={sprintNameInput}
        onSprintNameChange={setSprintNameInput}
        sprintGoalInput={sprintGoalInput}
        onSprintGoalChange={setSprintGoalInput}
        sprintStartDateInput={sprintStartDateInput}
        onSprintStartDateChange={setSprintStartDateInput}
        sprintEndDateInput={sprintEndDateInput}
        onSprintEndDateChange={setSprintEndDateInput}
        onSubmit={handleCreateSprint}
        isPending={createSprintMutation.isPending}
      />

      {/* Edit Sprint Modal */}
      <EditSprintModal
        isOpen={isEditSprintOpen}
        onOpenChange={setIsEditSprintOpen}
        editSprintNameInput={editSprintNameInput}
        onEditSprintNameChange={setEditSprintNameInput}
        editSprintGoalInput={editSprintGoalInput}
        onEditSprintGoalChange={setEditSprintGoalInput}
        editSprintStartDateInput={editSprintStartDateInput}
        onEditSprintStartDateChange={setEditSprintStartDateInput}
        editSprintEndDateInput={editSprintEndDateInput}
        onEditSprintEndDateChange={setEditSprintEndDateInput}
        onSubmit={handleUpdateSprint}
        isPending={updateSprintMutation.isPending}
      />

      {/* Move Task Confirmation Dialog */}
      <MoveTaskConfirmModal
        isOpen={isMoveConfirmOpen}
        onOpenChange={setIsMoveConfirmOpen}
        taskToMove={taskToMove}
        sourceSprintName={taskToMove?.sprint?.name || "Backlog"}
        targetSprintName={sprints.find((s) => s.sprintId === targetSprintForMove)?.sprintName || "Backlog"}
        onConfirm={handleConfirmMoveTask}
        isPending={updateTaskMutation.isPending}
      />
    </div>
  );
}
