import { useState } from "react";
import { toast } from "sonner";
import { CreateTaskRequest, UpdateTaskRequest } from "@/features/projects/api/taskApi";
import { JiraTask } from "@/features/projects/types";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/features/projects/hooks/useProjectTasks";
import { getTodayString } from "../board-helpers";

export function useBoardTasksState(projectId: string, currentSprintId: string) {
  // Detail Task State
  const [selectedTask, setSelectedTask] = useState<JiraTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Create Task State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK");
  const [createPriority, setCreatePriority] = useState("MEDIUM");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");
  const [createLabels, setCreateLabels] = useState("");
  const [createComponentIds, setCreateComponentIds] = useState("");

  // Edit Task State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editLabels, setEditLabels] = useState("");
  const [editComponentIds, setEditComponentIds] = useState("");

  // Delete Task State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // Task Mutations
  const createTaskMutation = useCreateTask(projectId, currentSprintId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  // Edit Task Handlers
  const handleOpenEdit = (task: JiraTask) => {
    setTaskToEdit(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditIssueType(task.type || "TASK");
    setEditPriority(task.priority?.toUpperCase() || "MEDIUM");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditLabels(task.labels ? task.labels.join(", ") : "");
    setEditComponentIds(
      task.components ? task.components.map((c: { name: string }) => c.name).join(", ") : ""
    );
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

    const newLabels = editLabels ? editLabels.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const origLabels = taskToEdit.labels || [];
    const isLabelsChanged =
      newLabels.length !== origLabels.length || newLabels.some((l, idx) => l !== origLabels[idx]);

    const newComponents = editComponentIds
      ? editComponentIds.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const origComponents = taskToEdit.components
      ? taskToEdit.components.map((c: { name: string }) => c.name)
      : [];
    const isComponentsChanged =
      newComponents.length !== origComponents.length ||
      newComponents.some((c, idx) => c !== origComponents[idx]);

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isIssueTypeChanged) mainPayload.type = editIssueType;
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) mainPayload.priority = editPriority;

    if (isLabelsChanged) mainPayload.labels = newLabels;
    if (isComponentsChanged) mainPayload.componentIds = newComponents;

    if (Object.keys(mainPayload).length === 0) {
      toast.info("Không có thông tin nào thay đổi.");
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
          updateTaskMutation.reset();
        },
        onError: (err: unknown) => {
          console.error("Edit task error:", err);
          const rawMsg = (err as { message?: string })?.message || "";
          let userMsg = "Không thể cập nhật công việc. Vui lòng thử lại!";
          if (rawMsg.includes("Jira resource") || rawMsg.includes("no longer accessible")) {
            userMsg = "Tài nguyên Jira không còn khả dụng hoặc đã ngắt kết nối. Vui lòng kiểm tra lại kết nối Jira trong Cấu hình Dự án!";
          } else if (rawMsg) {
            userMsg = rawMsg;
          }
          toast.error(userMsg);
          updateTaskMutation.reset();
        },
      }
    );
  };

  // Delete Task Handlers
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
        },
      }
    );
  };

  // Create Task Handler
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
    if (createLabels.trim())
      payload.labels = createLabels.split(",").map((s) => s.trim()).filter(Boolean);
    if (createComponentIds.trim())
      payload.componentIds = createComponentIds.split(",").map((s) => s.trim()).filter(Boolean);
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
        },
      }
    );
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
    createComponentIds,
    setCreateComponentIds,
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
    editLabels,
    setEditLabels,
    editComponentIds,
    setEditComponentIds,
    isDeleteOpen,
    setIsDeleteOpen,
    taskToDelete,
    handleOpenEdit,
    handleEditTask,
    handleOpenDelete,
    handleConfirmDelete,
    handleCreateTask,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
