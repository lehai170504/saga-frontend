import { useState } from "react";
import { toast } from "sonner";
import { JiraTask } from "@/features/projects/types";
import { UpdateTaskRequest } from "@/features/projects/api/taskApi";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/features/projects/hooks/useProjectTasks";
import { getTodayString } from "../backlog-helpers";

export function useBacklogTasksState(projectId: string) {
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  // Detail Task
  const [selectedTask, setSelectedTask] = useState<JiraTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Create Task
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [targetSprintIdForCreate, setTargetSprintIdForCreate] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK");
  const [createPriority, setCreatePriority] = useState("MEDIUM");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");
  const [createLabels, setCreateLabels] = useState("saga:code");

  // Edit Task
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState("UNASSIGNED");
  const [editLabels, setEditLabels] = useState("");

  // Delete Task
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // Move Task Confirm
  const [isMoveConfirmOpen, setIsMoveConfirmOpen] = useState(false);
  const [taskToMove, setTaskToMove] = useState<JiraTask | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [targetSprintForMove, setTargetSprintForMove] = useState<string | null>(null);

  // Handlers
  const handleMoveTaskSprint = (taskId: string, sprintId: string | null) => {
    const sprintIdempotencyKey = crypto.randomUUID();
    updateTaskMutation.mutate({
      taskId,
      sprintId,
      sprintIdempotencyKey,
    });
  };

  const handleOpenCreate = (sprintId: string | null = null) => {
    setTargetSprintIdForCreate(sprintId);
    setCreateTitle("");
    setCreateDescription("");
    setCreateIssueType("TASK");
    setCreatePriority("MEDIUM");
    setCreateDueDate("");
    setCreateAssignee("UNASSIGNED");
    setCreateLabels("saga:code");
    setIsCreateOpen(true);
  };

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

    const parsedLabels = createLabels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: createTitle.trim(),
      description: createDescription.trim() || undefined,
      type: createIssueType,
      priority: createPriority || "MEDIUM",
      dueDate: createDueDate || undefined,
      assigneeId: createAssignee === "UNASSIGNED" ? undefined : createAssignee,
      labels: parsedLabels.length > 0 ? parsedLabels : undefined,
    };

    const idempotencyKey = crypto.randomUUID();
    const assignIdempotencyKey = crypto.randomUUID();
    const activeSprintId = targetSprintIdForCreate || undefined;

    createTaskMutation.mutate(
      {
        data: payload,
        idempotencyKey,
        assignIdempotencyKey: activeSprintId ? assignIdempotencyKey : "",
      },
      {
        onSuccess: (task: JiraTask) => {
          if (activeSprintId) {
            handleMoveTaskSprint(task.id, activeSprintId);
          }
          setIsCreateOpen(false);
        },
      }
    );
  };

  const handleOpenEdit = (task: JiraTask) => {
    setTaskToEdit(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditIssueType(task.type || "TASK");
    setEditPriority(task.priority?.toUpperCase() || "MEDIUM");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditAssignee(task.assignee?.id || "UNASSIGNED");
    setEditLabels(task.labels ? task.labels.join(", ") : "");
    setIsEditOpen(true);
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    if (!editTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc.");
      return;
    }

    const origDueDate = taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "";
    const isDueDateChanged = editDueDate !== origDueDate;

    const todayStr = getTodayString();
    if (isDueDateChanged && editDueDate && editDueDate < todayStr) {
      toast.error("Hạn hoàn thành công việc không được chọn ngày trước ngày hiện tại thực tế!");
      return;
    }

    const isTitleChanged = editTitle.trim() !== (taskToEdit.title || "").trim();
    const isDescriptionChanged = editDescription.trim() !== (taskToEdit.description || "").trim();
    const origType = (taskToEdit.type || "TASK").toUpperCase();
    const isIssueTypeChanged = editIssueType.toUpperCase() !== origType;
    const origPriority = taskToEdit.priority?.toUpperCase() || "MEDIUM";
    const isPriorityChanged = editPriority !== origPriority;

    const origLabelsStr = taskToEdit.labels ? taskToEdit.labels.join(", ") : "";
    const isLabelsChanged = editLabels.trim() !== origLabelsStr.trim();
    const parsedEditLabels = editLabels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isIssueTypeChanged) mainPayload.type = editIssueType;
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) mainPayload.priority = editPriority;
    if (isLabelsChanged) mainPayload.labels = parsedEditLabels;

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
      taskId: taskToEdit.id,
    };

    if (Object.keys(mainPayload).length > 0) {
      mutationArgs.data = mainPayload;
      mutationArgs.mainIdempotencyKey = crypto.randomUUID();
    }

    if (isAssigneeChanged) {
      mutationArgs.assigneeId = editAssignee === "UNASSIGNED" ? null : editAssignee;
      mutationArgs.assigneeIdempotencyKey = crypto.randomUUID();
    }

    updateTaskMutation.mutate(mutationArgs, {
      onSuccess: () => {
        setIsEditOpen(false);
        setTaskToEdit(null);
      },
    });
  };

  const handleOpenDelete = (task: JiraTask) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    const key = crypto.randomUUID();
    deleteTaskMutation.mutate(
      { taskId: taskToDelete.id, idempotencyKey: key },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        },
      }
    );
  };

  const handleConfirmMoveTask = () => {
    if (!taskToMove) return;
    handleMoveTaskSprint(taskToMove.id, targetSprintForMove);
    setIsMoveConfirmOpen(false);
    setTaskToMove(null);
  };

  return {
    selectedTask,
    setSelectedTask,
    isDetailOpen,
    setIsDetailOpen,
    isCreateOpen,
    setIsCreateOpen,
    createTitle,
    setCreateTitle,
    createDescription,
    setCreateDescription,
    createIssueType,
    setCreateIssueType,
    createPriority,
    setCreatePriority,
    createDueDate,
    setCreateDueDate,
    createAssignee,
    setCreateAssignee,
    createLabels,
    setCreateLabels,
    isEditOpen,
    setIsEditOpen,
    taskToEdit,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editIssueType,
    setEditIssueType,
    editPriority,
    setEditPriority,
    editDueDate,
    setEditDueDate,
    editAssignee,
    setEditAssignee,
    editLabels,
    setEditLabels,
    isDeleteOpen,
    setIsDeleteOpen,
    taskToDelete,
    isMoveConfirmOpen,
    setIsMoveConfirmOpen,
    taskToMove,
    targetSprintForMove,
    handleOpenCreate,
    handleCreateTask,
    handleOpenEdit,
    handleEditTask,
    handleOpenDelete,
    handleDeleteTask,
    handleConfirmMoveTask,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
