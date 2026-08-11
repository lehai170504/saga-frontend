"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectSprints } from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask, useTransitionTask } from "@/features/projects/hooks/useProjectTasks";
import { useAuthStore } from "@/stores/authStore";
import { LayoutGrid, User, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CreateTaskRequest, UpdateTaskRequest, TaskTransition } from "@/features/projects/api/taskApi";
import { JiraTask } from "@/features/projects/types";

// Subcomponents
import { BoardFilterBar } from "./board/board-filter-bar";
import { KanbanColumn } from "./board/kanban-column";
import { TaskDetailModal } from "./board/task-detail-modal";
import { BoardCreateTaskModal, BoardEditTaskModal, BoardDeleteTaskModal } from "./board/board-task-modals";
import { getTodayString } from "./board/board-helpers";

interface StudentBoardViewProps {
  courseId: string;
}

export function StudentBoardView({ courseId }: StudentBoardViewProps) {
  const queryClient = useQueryClient();
  const [selectedSprintId, setSelectedSprintId] = useState<string>("ACTIVE_DEFAULT");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("ALL");
  const [keyword, setKeyword] = useState("");
  const [selectedTask, setSelectedTask] = useState<JiraTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Create Task Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK");
  const [createPriority, setCreatePriority] = useState("MEDIUM");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");
  const [createLabels, setCreateLabels] = useState("");
  const [createComponentIds, setCreateComponentIds] = useState("");

  // Edit Task Form State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editLabels, setEditLabels] = useState("");
  const [editComponentIds, setEditComponentIds] = useState("");

  // Delete Task Form State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // Drag & Drop State
  const [draggedTask, setDraggedTask] = useState<JiraTask | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [pendingTransitions, setPendingTransitions] = useState<Record<string, string>>({});

  // Load team data
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";

  // Auth & Role
  const currentUser = useAuthStore((s) => s.user);
  const isLeader = myTeamData?.roleInTeam === "LEADER";
  const canActOnTask = (task: JiraTask) =>
    isLeader || task.assignee?.id === currentUser?.localProfileId;

  // Load sprints
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];

  // Determine active sprint and effective sprint ID
  const activeSprint = sprints.find((s) => s.state === "active" || s.state === "ACTIVE");
  const currentSprintId = selectedSprintId === "ACTIVE_DEFAULT"
    ? (activeSprint ? activeSprint.sprintId : (sprints[0]?.sprintId || ""))
    : selectedSprintId;

  // Task mutations
  const createTaskMutation = useCreateTask(projectId, currentSprintId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);
  const transitionMutationBoard = useTransitionTask(projectId);

  // Edit Task handlers
  const handleOpenEdit = (task: JiraTask) => {
    setTaskToEdit(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditIssueType(task.type || "TASK");
    setEditPriority(task.priority?.toUpperCase() || "MEDIUM");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditLabels(task.labels ? task.labels.join(", ") : "");
    setEditComponentIds(task.components ? task.components.map((c: { name: string }) => c.name).join(", ") : "");
    setIsEditOpen(true);
  };

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

    const newLabels = editLabels ? editLabels.split(",").map(s => s.trim()).filter(Boolean) : [];
    const origLabels = taskToEdit.labels || [];
    const isLabelsChanged = newLabels.length !== origLabels.length || newLabels.some((l, idx) => l !== origLabels[idx]);

    const newComponents = editComponentIds ? editComponentIds.split(",").map(s => s.trim()).filter(Boolean) : [];
    const origComponents = taskToEdit.components ? taskToEdit.components.map((c: { name: string }) => c.name) : [];
    const isComponentsChanged = newComponents.length !== origComponents.length || newComponents.some((c, idx) => c !== origComponents[idx]);

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) mainPayload.priority = editPriority;

    if (isLabelsChanged) mainPayload.labels = newLabels;
    if (isComponentsChanged) mainPayload.componentIds = newComponents;

    if (Object.keys(mainPayload).length === 0) {
      setIsEditOpen(false);
      setTaskToEdit(null);
      return;
    }

    const key = crypto.randomUUID();
    updateTaskMutation.mutate(
      { taskId: taskToEdit.id, data: mainPayload, mainIdempotencyKey: key },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setTaskToEdit(null);
        }
      }
    );
  };

  // Delete Task handlers
  const handleOpenDelete = (task: JiraTask) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const idempotencyKey = crypto.randomUUID();
    deleteTaskMutation.mutate(
      { taskId: taskToDelete.id, idempotencyKey },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        }
      }
    );
  };

  // Create Task handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc.");
      return;
    }

    const todayStr = getTodayString();
    if (createDueDate && createDueDate < todayStr) {
      toast.error("Hạn hoàn thành công việc không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const payload: CreateTaskRequest = {
      title: createTitle.trim(),
      type: createIssueType,
      priority: createPriority || "MEDIUM",
    };

    if (createDescription.trim()) payload.description = createDescription.trim();
    if (createDueDate) payload.dueDate = createDueDate;
    if (createLabels.trim()) payload.labels = createLabels.split(",").map(s => s.trim()).filter(Boolean);
    if (createComponentIds.trim()) payload.componentIds = createComponentIds.split(",").map(s => s.trim()).filter(Boolean);
    if (createAssignee !== "UNASSIGNED") payload.assigneeId = createAssignee;

    const idempotencyKey = crypto.randomUUID();
    const assignIdempotencyKey = crypto.randomUUID();
    createTaskMutation.mutate(
      { data: payload, idempotencyKey, assignIdempotencyKey },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setCreateTitle("");
          setCreateDescription("");
          setCreateIssueType("TASK");
          setCreatePriority("MEDIUM");
          setCreateDueDate("");
          setCreateAssignee("UNASSIGNED");
          setCreateLabels("");
          setCreateComponentIds("");
        }
      }
    );
  };

  // Load tasks
  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(
    projectId,
    { sprintId: currentSprintId }
  );
  const rawTasks: JiraTask[] = (tasksData as { tasks?: JiraTask[], content?: JiraTask[] })?.tasks || (tasksData as { tasks?: JiraTask[], content?: JiraTask[] })?.content || [];

  // Filter tasks locally by assignee & search keyword
  const tasks = rawTasks.filter((task: JiraTask) => {
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

  const rawMembers = (myTeamData?.members as { content?: { studentId: string; fullName: string }[] })?.content || myTeamData?.members || [];
  const teamMembers = Array.isArray(rawMembers)
    ? (rawMembers as { studentId: string; fullName: string }[]).map((m) => ({
      studentId: m.studentId,
      fullName: m.fullName,
    }))
    : [];

  const columns = [
    { id: "TO_DO", title: "Cần làm", color: "bg-muted/40 border-muted-foreground/20", dotColor: "bg-muted-foreground" },
    { id: "IN_PROGRESS", title: "Đang làm", color: "bg-amber-500/5 border-amber-500/20", dotColor: "bg-amber-500" },
    { id: "IN_REVIEW", title: "Đang đánh giá", color: "bg-purple-500/5 border-purple-500/20", dotColor: "bg-purple-500" },
    { id: "DONE", title: "Đã hoàn thành", color: "bg-emerald-500/5 border-emerald-500/20", dotColor: "bg-emerald-500" },
  ];

  const mapStatusToColumn = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s.includes("DONE") || s.includes("HOÀN THÀNH") || s.includes("RESOLVED") || s.includes("CLOSED")) return "DONE";
    if (s.includes("PROGRESS") || s.includes("ĐANG LÀM") || s.includes("DEVELOPMENT")) return "IN_PROGRESS";
    if (s.includes("REVIEW") || s.includes("ĐÁNH GIÁ")) return "IN_REVIEW";
    return "TO_DO";
  };

  const tasksByColumn = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => mapStatusToColumn(t.status) === col.id);
    return acc;
  }, {} as Record<string, JiraTask[]>);

  const columnStatusTransitionMap: Record<string, string[]> = {
    TO_DO: ["To Do", "Mở", "Open", "Reopened"],
    IN_PROGRESS: ["In Progress", "In Development", "Đang làm", "Đang phát triển"],
    IN_REVIEW: ["In Review", "Đang đánh giá"],
    DONE: ["Done", "Closed", "Resolved", "Đã hoàn thành", "Đã đóng"],
  };

  const handleDragStart = (e: React.DragEvent, task: JiraTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedTask) return;

    const sourceCol = mapStatusToColumn(draggedTask.status);
    if (sourceCol === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    const taskId = draggedTask.id;
    setDraggedTask(null);

    const targetNames = columnStatusTransitionMap[targetColumnId] || [];
    const targetNameStr = targetNames.join(", ");

    try {
      const resp = await fetch(`/api/v1/projects/${projectId}/tasks/${taskId}/transitions`);
      if (!resp.ok) {
        toast.error("Không thể lấy thông tin chuyển trạng thái từ Jira.");
        return;
      }
      const data = await resp.json();
      const transitions: TaskTransition[] = data.transitions || data || [];

      const match = transitions.find((t) => {
        const name = (t.name || "").toLowerCase();
        const targetName = (t.targetStatusName || "").toLowerCase();
        return targetNames.some(
          (tn) => name.includes(tn.toLowerCase()) || targetName.includes(tn.toLowerCase())
        );
      });

      if (!match) {
        const availableNames = transitions.map((t) => t.name).join(", ");
        toast.error(
          `Không thể chuyển từ "${draggedTask.status}" sang "${targetNameStr}". Các bước hợp lệ: ${availableNames || "Không có"}`
        );
        return;
      }

      setPendingTransitions((prev) => ({ ...prev, [taskId]: match.name }));

      const key = crypto.randomUUID();
      const targetStatusName = match.targetStatusName || match.name;

      transitionMutationBoard.mutate(
        { taskId, transitionId: match.transitionId, idempotencyKey: key, targetStatus: targetStatusName },
        {
          onSuccess: () => {
            setPendingTransitions((prev) => {
              const next = { ...prev };
              delete next[taskId];
              return next;
            });
            toast.success(`Đã chuyển trạng thái sang "${match.name}"`);
            queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
          },
          onError: (err: unknown) => {
            setPendingTransitions((prev) => {
              const next = { ...prev };
              delete next[taskId];
              return next;
            });
            const msg = err instanceof Error ? err.message : String(err);
            toast.error(`Lỗi chuyển trạng thái: ${msg}`);
          },
        }
      );
    } catch {
      toast.error("Không thể kiểm tra các bước chuyển khả dụng.");
    }
  };

  const isLoading = isLoadingTeam || isLoadingSprints;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Board công việc Jira"
        description="Xem danh sách công việc và phân loại theo bảng Kanban trực quan từ dự án Jira."
      />

      {!myTeamData ? (
        !isLoading ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
            <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
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
          <LayoutGrid size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
          <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa liên kết dự án nào trên Jira.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
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

          {/* Kanban Board Layout */}
          {isLoadingTasks ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đang tải danh sách công việc...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 text-destructive">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="font-bold text-base">Đã xảy ra lỗi khi tải dữ liệu công việc.</p>
              <p className="text-xs text-muted-foreground mt-1">Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch min-h-[60vh] overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  columnTasks={tasksByColumn[column.id] || []}
                  dragOverColumn={dragOverColumn}
                  draggedTask={draggedTask}
                  pendingTransitions={pendingTransitions}
                  projectId={projectId}
                  canActOnTask={canActOnTask}
                  teamMembers={teamMembers}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                  onDragEnd={() => setDraggedTask(null)}
                  onTaskClick={(task) => {
                    if (pendingTransitions[task.id]) return;
                    setSelectedTask(task);
                    setIsDetailOpen(true);
                  }}
                  onOpenEditTask={handleOpenEdit}
                  onOpenDeleteTask={handleOpenDelete}
                  onOpenCreateTask={() => {
                    if (!isLeader && currentUser?.localProfileId) {
                      setCreateAssignee(currentUser.localProfileId);
                    } else {
                      setCreateAssignee("UNASSIGNED");
                    }
                    setIsCreateOpen(true);
                  }}
                />
              ))}
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
      <BoardCreateTaskModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        createTitle={createTitle}
        onCreateTitleChange={setCreateTitle}
        createIssueType={createIssueType}
        onCreateIssueTypeChange={setCreateIssueType}
        createPriority={createPriority}
        onCreatePriorityChange={setCreatePriority}
        createAssignee={createAssignee}
        onCreateAssigneeChange={setCreateAssignee}
        createDueDate={createDueDate}
        onCreateDueDateChange={setCreateDueDate}
        createDescription={createDescription}
        onCreateDescriptionChange={setCreateDescription}
        createLabels={createLabels}
        onCreateLabelsChange={setCreateLabels}
        isLeader={isLeader}
        teamMembers={teamMembers}
        onSubmit={handleCreateTask}
        isPending={createTaskMutation.isPending}
      />

      {/* Edit Task Modal */}
      <BoardEditTaskModal
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
        editDescription={editDescription}
        onEditDescriptionChange={setEditDescription}
        editLabels={editLabels}
        onEditLabelsChange={setEditLabels}
        onSubmit={handleEditTask}
        isPending={updateTaskMutation.isPending}
      />

      {/* Delete Task Modal */}
      <BoardDeleteTaskModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        taskToDelete={taskToDelete}
        onConfirmDelete={handleConfirmDelete}
        isPending={deleteTaskMutation.isPending}
      />
    </div>
  );
}
