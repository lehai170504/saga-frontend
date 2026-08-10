"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectSprints } from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask, useTaskTransitions, useTransitionTask, useUpdateTaskEstimation, useUpdateTaskAssignee, useUpdateTaskPriority } from "@/features/projects/hooks/useProjectTasks";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  Search,
  User,
  Calendar,
  Flag,
  Clock,
  Loader2,
  AlertCircle,
  ClipboardList,
  CheckSquare,
  Equal,
  ChevronsUp,
  ChevronsDown,
  Bug,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreateTaskRequest, UpdateTaskRequest, TaskTransition } from "@/features/projects/api/taskApi";
import { JiraTask } from "@/features/projects/types";

function TaskStatusDropdown({ 
  projectId, 
  task,
  onTransitionSuccess
}: { 
  projectId: string; 
  task: JiraTask; 
  onTransitionSuccess?: (updatedTask: JiraTask) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: transitionsData, isLoading } = useTaskTransitions(projectId, task.id, isOpen);
  const transitionMutation = useTransitionTask(projectId);

  const handleSelectTransition = (transitionId: string) => {
    const key = crypto.randomUUID();
    transitionMutation.mutate({
      taskId: task.id,
      transitionId,
      idempotencyKey: key
    }, {
      onSuccess: () => {
        if (onTransitionSuccess) {
          // Optimistically update status using targetStatusName from transitions list
          const matched = transitionsData?.find(t => t.transitionId === transitionId);
          const nextStatus = matched?.targetStatusName || task.status;
          onTransitionSuccess({ ...task, status: nextStatus });
        }
      }
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DONE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "IN_REVIEW":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DONE":
        return "Đã hoàn thành";
      case "IN_PROGRESS":
        return "Đang làm";
      case "IN_REVIEW":
        return "Đang đánh giá";
      default:
        return "Cần làm";
    }
  };

  const translateTransitionName = (name: string) => {
    const map: Record<string, string> = {
      "To Do": "Cần làm",
      "In Progress": "Đang làm",
      "In Review": "Đang đánh giá",
      "Done": "Đã hoàn thành",
      "In Development": "Đang phát triển",
      "Blocked": "Bị chặn",
      "Open": "Mở",
      "Closed": "Đã đóng",
      "Reopened": "Mở lại",
      "Resolved": "Đã giải quyết",
      "Selected for Development": "Chọn để phát triển",
    };
    return map[name] ?? name;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`h-7 rounded-lg text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1 cursor-pointer border shadow-sm transition-all hover:opacity-90 ${getStatusStyle(task.status)}`}
        >
          {getStatusLabel(task.status)}
          <ChevronDown size={10} className="opacity-60 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl min-w-[140px] p-1.5 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className="flex items-center justify-center p-3">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          </div>
        ) : !transitionsData || transitionsData.length === 0 ? (
          <div className="text-[10px] text-muted-foreground/60 p-2 italic text-center">
            Không có bước chuyển
          </div>
        ) : (
          transitionsData.map((t: TaskTransition) => (
            <DropdownMenuItem
              key={t.transitionId}
              onClick={() => handleSelectTransition(t.transitionId)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
            >
              {translateTransitionName(t.name)}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CardStoryPointPicker({
  projectId,
  task,
}: {
  projectId: string;
  task: JiraTask;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState<string>("");

  const updateEstimationMutation = useUpdateTaskEstimation(projectId);

  const hasPoint = task.storyPoint !== undefined && task.storyPoint !== null && Number(task.storyPoint) > 0;
  const initialVal = hasPoint ? String(task.storyPoint) : "";

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVal(initialVal);
    setIsEditing(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      setIsEditing(false);
      return;
    }
    const point = val.trim() !== "" ? Number(val) : 0;
    setIsEditing(false);
    updateEstimationMutation.mutate({
      taskId: task.id,
      storyPoint: point,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setVal(initialVal);
  };

  const displayValue = hasPoint ? String(task.storyPoint) : "-";

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={handleStartEdit}
        title="Click để cập nhật Story Point (Điểm SP)"
        className="h-6 px-2 min-w-[24px] rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black text-[11px] flex items-center justify-center border border-border/50 transition-all cursor-pointer hover:border-primary/50 shrink-0 shadow-xs"
      >
        {displayValue}
      </button>
    );
  }

  return (
    <div
      className="relative shrink-0 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center">
        <Input
          type="number"
          min={0}
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="w-14 h-7 text-xs text-center font-extrabold rounded-md bg-background border-primary focus:ring-1 focus:ring-primary shadow-md px-1"
        />
        <div className="absolute top-8 right-0 flex items-center gap-1 p-1 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={updateEstimationMutation.isPending}
            className="h-6 w-6 rounded-md hover:bg-emerald-500/10 hover:text-emerald-500 text-foreground cursor-pointer"
            title="Lưu"
          >
            {updateEstimationMutation.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={updateEstimationMutation.isPending}
            className="h-6 w-6 rounded-md hover:bg-destructive/10 hover:text-destructive text-foreground cursor-pointer"
            title="Hủy"
          >
            <X size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskAssigneeDropdown({
  projectId,
  task,
  teamMembers,
}: {
  projectId: string;
  task: JiraTask;
  teamMembers: Array<{ studentId: string; fullName: string }>;
}) {
  const updateAssigneeMutation = useUpdateTaskAssignee(projectId);

  const handleSelectAssignee = (studentId: string | null, fullName?: string) => {
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      return;
    }
    updateAssigneeMutation.mutate({
      taskId: task.id,
      assigneeId: studentId,
      assigneeName: studentId ? fullName : undefined,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const getAssigneeInitials = (name: string) => {
    if (!name) return "??";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "??";
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);
    return (firstLetter + lastLetter).toUpperCase();
  };

  const currentAssigneeId = task.assignee?.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="h-6 w-6 rounded-full bg-cyan-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0 border border-background shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all outline-none"
          title={task.assignee?.fullName ? `Người thực hiện: ${task.assignee.fullName}` : "Chưa phân công"}
        >
          {task.assignee?.fullName ? (
            getAssigneeInitials(task.assignee.fullName)
          ) : (
            <User size={10} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl min-w-[220px] p-2 animate-in fade-in zoom-in-95 duration-150 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-2.5 py-1">
          Người thực hiện
        </div>

        {teamMembers.map((m) => {
          const isSelected = currentAssigneeId === m.studentId;
          return (
            <DropdownMenuItem
              key={m.studentId}
              onClick={() => handleSelectAssignee(m.studentId, m.fullName)}
              className={`rounded-xl px-2.5 py-2 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-cyan-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                {getAssigneeInitials(m.fullName)}
              </div>
              <span className="truncate flex-1">{m.fullName}</span>
              {isSelected && <Check size={14} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuItem
          onClick={() => handleSelectAssignee(null)}
          className={`rounded-xl px-2.5 py-2 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
            !task.assignee ? "bg-muted text-foreground font-black" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <div className="h-6 w-6 rounded-full bg-muted/80 text-muted-foreground flex items-center justify-center font-bold text-[10px] shrink-0 border border-border/30">
            <User size={12} />
          </div>
          <span className="truncate flex-1">Unassigned (Chưa phân công)</span>
          {!task.assignee && <Check size={14} className="text-foreground shrink-0" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PRIORITIES = [
  { id: "HIGHEST", label: "Highest", icon: <ChevronsUp size={14} className="text-red-500 shrink-0" /> },
  { id: "HIGH", label: "High", icon: <ChevronUp size={14} className="text-red-400 shrink-0" /> },
  { id: "MEDIUM", label: "Medium", icon: <Equal size={14} className="text-amber-500 shrink-0" /> },
  { id: "LOW", label: "Low", icon: <ChevronDown size={14} className="text-blue-400 shrink-0" /> },
  { id: "LOWEST", label: "Lowest", icon: <ChevronsDown size={14} className="text-blue-500 shrink-0" /> },
];

function TaskPriorityDropdown({
  projectId,
  task,
}: {
  projectId: string;
  task: JiraTask;
}) {
  const updatePriorityMutation = useUpdateTaskPriority(projectId);

  const handleSelectPriority = (priorityId: string) => {
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      return;
    }
    updatePriorityMutation.mutate({
      taskId: task.id,
      priority: priorityId,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const currentPriority = task.priority?.toUpperCase() || "MEDIUM";
  const matched = PRIORITIES.find((p) => p.id === currentPriority) || PRIORITIES[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="p-1 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none flex items-center justify-center"
          title={`Độ ưu tiên: ${matched.label}`}
        >
          {matched.icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl min-w-[160px] p-1.5 animate-in fade-in zoom-in-95 duration-150 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
          Độ ưu tiên
        </div>
        {PRIORITIES.map((p) => {
          const isSelected = currentPriority === p.id;
          return (
            <DropdownMenuItem
              key={p.id}
              onClick={() => handleSelectPriority(p.id)}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
              }`}
            >
              {p.icon}
              <span className="truncate flex-1">{p.label}</span>
              {isSelected && <Check size={14} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK"); // default TASK
  const [createPriority, setCreatePriority] = useState("DEFAULT"); // default Mặc định
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");
  const [createLabels, setCreateLabels] = useState("");
  const [createComponentIds, setCreateComponentIds] = useState("");

  // Load team data
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";

  // Auth & Role
  const currentUser = useAuthStore((s) => s.user);
  const isLeader = myTeamData?.roleInTeam === "LEADER";
  // Kiểm tra xem task có phải của mình không (so localProfileId với assignee.id)
  const canActOnTask = (task: JiraTask) =>
    isLeader || task.assignee?.id === currentUser?.localProfileId;

  // Load sprints
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];

  // Determine active sprint and effective sprint ID
  const activeSprint = sprints.find((s) => s.state === "active" || s.state === "ACTIVE");
  const currentSprintId = selectedSprintId === "ACTIVE_DEFAULT"
    ? (activeSprint ? activeSprint.sprintId : "ALL")
    : selectedSprintId;

  // Task creation mutation
  const createTaskMutation = useCreateTask(projectId, currentSprintId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("DEFAULT");
  const [editDueDate, setEditDueDate] = useState("");
  const [editLabels, setEditLabels] = useState("");
  const [editComponentIds, setEditComponentIds] = useState("");


  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // ── Drag & Drop state ──────────────────────────────────────────────────────
  const [draggedTask, setDraggedTask] = useState<JiraTask | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [pendingTransitions, setPendingTransitions] = useState<Record<string, string>>({});
  const transitionMutationBoard = useTransitionTask(projectId);

  // Map column IDs to the Jira status name variants we might receive
  const columnStatusNameMap: Record<string, string[]> = {
    TODO:        ["To Do", "Backlog", "Open", "Reopened"],
    IN_PROGRESS: ["In Progress", "In Development", "Selected for Development"],
    IN_REVIEW:   ["In Review", "Review", "Code Review"],
    DONE:        ["Done", "Closed", "Resolved"],
  };

  const handleDragStart = (e: React.DragEvent, task: JiraTask) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedTask || !projectId) { setDraggedTask(null); return; }

    const targetTask = draggedTask;
    setDraggedTask(null);

    // Ignore drop if already in target column or currently pending transition
    const currentStatus = pendingTransitions[targetTask.id] || targetTask.status?.toUpperCase() || "TODO";
    if (currentStatus === targetColumnId) return;

    try {
      const { taskApi } = await import("@/features/projects/api/taskApi");
      const transitions = await taskApi.getTaskTransitions(projectId, targetTask.id);
      const candidates = columnStatusNameMap[targetColumnId] || [];
      const matched = transitions.find(t =>
        candidates.some(c => t.targetStatusName?.toLowerCase() === c.toLowerCase())
      );
      if (!matched) {
        toast.error("Không tìm thấy bước chuyển hợp lệ sang trạng thái này.");
        return;
      }

      // Optimistically move task to target column with loading/opaque state
      const taskId = targetTask.id;
      setPendingTransitions((prev) => ({ ...prev, [taskId]: targetColumnId }));

      transitionMutationBoard.mutate(
        {
          taskId,
          transitionId: matched.transitionId,
          idempotencyKey: crypto.randomUUID(),
        },
        {
          onSuccess: () => {
            // Optimistically update cache so task stays in targetColumnId permanently without jumping back
            queryClient.setQueriesData({ queryKey: ["project-tasks", projectId] }, (oldData: unknown) => {
              const data = oldData as { content?: JiraTask[] };
              if (!data || !data.content) return oldData;
              return {
                ...data,
                content: data.content.map((t: JiraTask) =>
                  t.id === taskId ? { ...t, status: targetColumnId } : t
                ),
              };
            });
          },
          onSettled: () => {
            setPendingTransitions((prev) => {
              const next = { ...prev };
              delete next[taskId];
              return next;
            });
          },
        }
      );
    } catch {
      toast.error("Không thể kiểm tra các bước chuyển khả dụng.");
    }
  };

  const handleOpenEdit = (task: JiraTask) => {
    setTaskToEdit(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditIssueType(task.type || "TASK");
    setEditPriority(task.priority || "DEFAULT");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditLabels(task.labels ? task.labels.join(", ") : "");
    setEditComponentIds(task.components ? task.components.map(c => c.name).join(", ") : "");
    setIsEditOpen(true);
  };


  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    if (!editTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc.");
      return;
    }

    // 1. Check dirty main fields
    const isTitleChanged = editTitle.trim() !== (taskToEdit.title || "").trim();
    const isDescriptionChanged = editDescription.trim() !== (taskToEdit.description || "").trim();
    const origDueDate = taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "";
    const isDueDateChanged = editDueDate !== origDueDate;
    const isPriorityChanged = editPriority !== (taskToEdit.priority || "DEFAULT");

    const newLabels = editLabels ? editLabels.split(",").map(s => s.trim()).filter(Boolean) : [];
    const origLabels = taskToEdit.labels || [];
    const isLabelsChanged = newLabels.length !== origLabels.length || newLabels.some((l, idx) => l !== origLabels[idx]);

    const newComponents = editComponentIds ? editComponentIds.split(",").map(s => s.trim()).filter(Boolean) : [];
    const origComponents = taskToEdit.components ? taskToEdit.components.map(c => c.name) : [];
    const isComponentsChanged = newComponents.length !== origComponents.length || newComponents.some((c, idx) => c !== origComponents[idx]);

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) {
      const pVal = editPriority === "DEFAULT" ? undefined : editPriority;
      mainPayload.priority = pVal;
      mainPayload.priorityId = pVal;
      mainPayload.priorityName = pVal;
    }
    if (isLabelsChanged) mainPayload.labels = newLabels;
    if (isComponentsChanged) mainPayload.componentIds = newComponents;

    // 2. If nothing changed, just close
    if (Object.keys(mainPayload).length === 0) {
      setIsEditOpen(false);
      setTaskToEdit(null);
      return;
    }

    const mutationArgs: {
      taskId: string;
      data?: UpdateTaskRequest;
      mainIdempotencyKey?: string;
    } = {
      taskId: taskToEdit.id
    };

    if (Object.keys(mainPayload).length > 0) {
      mutationArgs.data = mainPayload;
      mutationArgs.mainIdempotencyKey = crypto.randomUUID();
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

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc.");
      return;
    }

    const payload: CreateTaskRequest = {
      title: createTitle.trim(),
      type: createIssueType,
    };

    if (createPriority !== "DEFAULT") {
      payload.priority = createPriority;
    }

    if (createDescription.trim()) {
      payload.description = createDescription.trim();
    }
    if (createDueDate) {
      payload.dueDate = createDueDate;
    }
    if (createLabels.trim()) {
      payload.labels = createLabels.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (createComponentIds.trim()) {
      payload.componentIds = createComponentIds.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (createAssignee !== "UNASSIGNED") {
      payload.assigneeId = createAssignee;
    }

    const idempotencyKey = crypto.randomUUID();
    const assignIdempotencyKey = crypto.randomUUID();
    createTaskMutation.mutate(
      { data: payload, idempotencyKey, assignIdempotencyKey },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          // Reset form
          setCreateTitle("");
          setCreateDescription("");
          setCreateIssueType("TASK");
          setCreatePriority("DEFAULT");
          setCreateDueDate("");
          setCreateAssignee("UNASSIGNED");
          setCreateLabels("");
          setCreateComponentIds("");
        }
      }
    );
  };

  // Load tasks
  const { data: tasksData, isLoading: isLoadingTasks, error } = useProjectTasks(projectId, {
    sprintId: currentSprintId === "ALL" ? undefined : currentSprintId,
    assigneeId: selectedAssigneeId === "ALL" ? undefined : selectedAssigneeId,
    keyword: keyword.trim() || undefined,
    size: 100, // Fetch up to 100 tasks (maximum allowed by backend)
  });

  const tasks = tasksData?.content || [];
  const teamMembers = myTeamData?.members?.content || [];

  // Columns definition
  const columns = [
    { id: "TODO", title: "Cần làm", color: "border-slate-500/30 bg-slate-500/5", dotColor: "bg-slate-500" },
    { id: "IN_PROGRESS", title: "Đang làm", color: "border-amber-500/30 bg-amber-500/5", dotColor: "bg-amber-500" },
    { id: "IN_REVIEW", title: "Đang đánh giá", color: "border-purple-500/30 bg-purple-500/5", dotColor: "bg-purple-500" },
    { id: "DONE", title: "Hoàn thành", color: "border-emerald-500/30 bg-emerald-500/5", dotColor: "bg-emerald-500" },
  ];

  // Group tasks by status
  const tasksByColumn: Record<string, JiraTask[]> = {
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  };

  tasks.forEach((task) => {
    const status = pendingTransitions[task.id] || task.status?.toUpperCase() || "TODO";
    if (status === "CANCELLED") return; // Ignore cancelled tasks
    if (tasksByColumn[status]) {
      tasksByColumn[status].push(task);
    } else {
      // Fallback
      tasksByColumn.TODO.push(task);
    }
  });

  const formatDueDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Chưa thiết lập";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Chưa thiết lập";
    }
  };


  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "BUG":
        return <Bug size={14} className="text-destructive shrink-0" />;
      case "STORY":
        return <CheckSquare size={14} className="text-emerald-500 shrink-0" />;
      default:
        return <CheckSquare size={14} className="text-blue-500 shrink-0" />;
    }
  };


  const getTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "BUG":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-extrabold uppercase rounded-lg px-2 shrink-0">Bug</Badge>;
      case "STORY":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-extrabold uppercase rounded-lg px-2 shrink-0">Story</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-extrabold uppercase rounded-lg px-2 shrink-0">Task</Badge>;
    }
  };

  const isLoading = isLoadingTeam || (!!projectId && isLoadingSprints);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background p-6 space-y-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-panel border border-border/40 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Sprint Select */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <Select value={currentSprintId} onValueChange={setSelectedSprintId}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 font-semibold px-4 cursor-pointer text-xs w-full sm:w-auto">
                    <SelectValue placeholder="Lọc theo Sprint" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border-border/40">
                    <SelectItem value="ALL" className="rounded-xl font-medium text-xs">Tất cả Sprint</SelectItem>
                    {sprints
                      .filter((s) => s.state?.toUpperCase() !== "CLOSED")
                      .map((s) => (
                        <SelectItem key={s.sprintId} value={s.sprintId} className="rounded-xl font-medium text-xs">
                          {s.sprintName} {(s.state === "active" || s.state === "ACTIVE") ? "(Hiện tại)" : ""}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Select */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <Select value={selectedAssigneeId} onValueChange={setSelectedAssigneeId}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 font-semibold px-4 cursor-pointer text-xs w-full sm:w-auto">
                    <SelectValue placeholder="Lọc theo thành viên" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border-border/40">
                    <SelectItem value="ALL" className="rounded-xl font-medium text-xs">Tất cả thành viên</SelectItem>
                    {teamMembers.map((m) => (
                      <SelectItem key={m.studentId} value={m.studentId} className="rounded-xl font-medium text-xs">
                        {m.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo mã Task hoặc tiêu đề..."
                className="h-10 pl-10 rounded-xl bg-background/50 border-border/40 text-xs"
              />
            </div>
          </div>

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
              {columns.map((column) => {
                const columnTasks = tasksByColumn[column.id] || [];

                return (
                <div
                    key={column.id}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
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
                        columnTasks.map((task) => {
                          const isPendingMove = !!pendingTransitions[task.id];
                          const isDraggingThis = draggedTask?.id === task.id;

                          return (
                            <Card
                              key={task.id}
                              draggable={!isPendingMove && canActOnTask(task)}
                              onDragStart={(e) => canActOnTask(task) && handleDragStart(e, task)}
                              onDragEnd={() => setDraggedTask(null)}
                              onClick={() => {
                                if (isPendingMove) return;
                                setSelectedTask(task);
                                setIsDetailOpen(true);
                              }}
                              className={`rounded-2xl border border-border/40 bg-card transition-all duration-300 p-4 flex flex-col justify-between min-h-[140px] ${
                                isPendingMove
                                  ? "opacity-60 bg-muted/40 border-dashed border-primary/50 cursor-wait animate-pulse"
                                  : isDraggingThis
                                  ? "opacity-50 scale-95 ring-2 ring-primary/40 cursor-grabbing"
                                  : canActOnTask(task)
                                  ? "hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-grab active:cursor-grabbing"
                                  : "hover:border-border/60 hover:shadow-md cursor-pointer"
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 flex-1">
                                    {task.title}
                                  </h5>
                                  {isPendingMove ? (
                                    <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold shrink-0 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 animate-pulse">
                                      <Loader2 size={12} className="animate-spin" />
                                      <span>Đang chuyển...</span>
                                    </div>
                                  ) : canActOnTask(task) ? (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 cursor-pointer shrink-0 flex items-center justify-center"
                                        >
                                          <MoreVertical size={14} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[100px] p-1.5 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem
                                          onClick={() => handleOpenEdit(task)}
                                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                                        >
                                          Sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleOpenDelete(task)}
                                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                                        >
                                          Xóa
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) : null}
                                </div>

                              <div className="space-y-0.5 mt-2.5">
                                <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Hạn hoàn thành</span>
                                <p className="text-xs text-foreground font-semibold">
                                  {formatDueDate(task.dueDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-border/10">
                              {/* Left: Type Icon + Key */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                {getTypeIcon(task.type)}
                                <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase truncate">
                                  {task.externalKey}
                                </span>
                              </div>

                              {/* Right: Story Point Picker + Priority Dropdown + Assignee Avatar Dropdown */}
                              <div className="flex items-center gap-2 shrink-0">
                                <CardStoryPointPicker projectId={projectId} task={task} />
                                <TaskPriorityDropdown projectId={projectId} task={task} />
                                <TaskAssigneeDropdown projectId={projectId} task={task} teamMembers={teamMembers} />
                              </div>
                            </div>
                          </Card>
                        );
                      })
                    )}

                      <button
                        onClick={() => {
                          // Nếu là MEMBER, mặc định assignee vào bản thân
                          if (!isLeader && currentUser?.localProfileId) {
                            setCreateAssignee(currentUser.localProfileId);
                          } else {
                            setCreateAssignee("UNASSIGNED");
                          }
                          setIsCreateOpen(true);
                        }}
                        className="flex items-center gap-1.5 justify-start py-2.5 px-4 rounded-xl border border-dashed border-border/30 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 hover:border-border transition-all duration-300 text-xs font-bold w-full cursor-pointer mt-2"
                      >
                        <Plus size={14} />
                        Thêm công việc
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Task Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          {selectedTask && (
            <>
              <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {getTypeBadge(selectedTask.type)}
                  <span className="text-xs font-black text-muted-foreground tracking-wide uppercase">
                    {selectedTask.externalKey}
                  </span>
                  {selectedTask.storyPoint > 0 && (
                    <Badge variant="secondary" className="rounded-xl font-bold bg-primary/5 text-primary border-primary/10 px-2 py-0.5 text-xs">
                      {selectedTask.storyPoint} SP
                    </Badge>
                  )}
                  <TaskStatusDropdown 
                    projectId={projectId} 
                    task={selectedTask} 
                    onTransitionSuccess={(updatedTask) => setSelectedTask(updatedTask)} 
                  />
                </div>
                <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
                  {selectedTask.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Xem thông tin chi tiết nhiệm vụ đồng bộ từ Jira.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Mô tả công việc</span>
                  <div className="p-3 bg-muted/20 border border-border/30 rounded-2xl text-xs leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {selectedTask.description || (
                      <span className="text-muted-foreground/60 italic">Không có mô tả công việc.</span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Assignee */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                      <User size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Người thực hiện</span>
                      <p className="text-xs font-bold text-foreground">
                        {selectedTask.assignee?.fullName || "Chưa giao việc"}
                      </p>
                      {selectedTask.assignee?.studentCode && (
                        <p className="text-[9px] font-medium text-muted-foreground">
                          {selectedTask.assignee.studentCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reporter */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                      <User size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Người báo cáo</span>
                      <p className="text-xs font-bold text-foreground">
                        {selectedTask.reporter?.fullName || "Hệ thống"}
                      </p>
                      {selectedTask.reporter?.studentCode && (
                        <p className="text-[9px] font-medium text-muted-foreground">
                          {selectedTask.reporter.studentCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sprint */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                      <Flag size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Sprint</span>
                      <p className="text-xs font-bold text-foreground">
                        {selectedTask.sprint?.name || "Backlog / Chưa gán"}
                      </p>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-muted/40 text-muted-foreground rounded-xl shrink-0 border border-border/10">
                      <Calendar size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Hạn hoàn thành</span>
                      <p className="text-xs font-bold text-foreground">
                        {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString("vi-VN") : "Không có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estimation / Story Point Display */}
                <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/30 rounded-2xl mt-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">Điểm SP (Story Point)</span>
                  </div>
                  <span className="text-xs font-extrabold text-foreground px-3 py-1 bg-muted/40 border border-border/30 rounded-xl">
                    {selectedTask.storyPoint ?? 0}
                  </span>
                </div>

                {/* Dates footer */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground/60 pt-4 border-t border-border/20">
                  <Clock size={10} />
                  <span>Cập nhật cuối trên Jira: {selectedTask.externalUpdatedAt ? new Date(selectedTask.externalUpdatedAt).toLocaleString("vi-VN") : "Không xác định"}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
                    onClick={() => {
                      setIsDetailOpen(false);
                      setSelectedTask(null);
                    }}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Tạo công việc mới (Jira Task)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tạo công việc mới trực tiếp trên Jira và đồng bộ về hệ thống SAGA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tiêu đề công việc *</label>
              <Input
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="Ví dụ: Thiết kế giao diện Dashboard"
                required
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Issue Type & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Loại công việc</label>
                <Select value={createIssueType} onValueChange={setCreateIssueType}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="TASK" className="text-xs">Task (Mặc định)</SelectItem>
                    <SelectItem value="BUG" className="text-xs">Bug</SelectItem>
                    <SelectItem value="STORY" className="text-xs">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mức độ ưu tiên</label>
                <Select value={createPriority} onValueChange={setCreatePriority}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="DEFAULT" className="text-xs">Mặc định (Không chỉ định)</SelectItem>
                    <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                    <SelectItem value="CRITICAL" className="text-xs">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Người thực hiện
                  {!isLeader && <span className="ml-1 text-primary/70 normal-case tracking-normal font-normal">(bản thân)</span>}
                </label>
                <Select
                  value={createAssignee}
                  onValueChange={setCreateAssignee}
                  disabled={!isLeader}
                >
                  <SelectTrigger className={`h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 ${!isLeader ? "opacity-70 cursor-not-allowed" : ""}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="UNASSIGNED" className="text-xs">Chưa phân công</SelectItem>
                    {teamMembers.map((m) => (
                      <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                        {m.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
                <Input
                  type="date"
                  value={createDueDate}
                  onChange={(e) => setCreateDueDate(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả chi tiết</label>
              <Textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Nhập mô tả nhiệm vụ chi tiết..."
                className="rounded-xl min-h-[100px] bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            {/* Labels */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Nhãn (Labels)</label>
              <Input
                value={createLabels}
                onChange={(e) => setCreateLabels(e.target.value)}
                placeholder="Ngăn cách bằng dấu phẩy, ví dụ: FE, API, design"
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
                onClick={() => setIsCreateOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
              >
                {createTaskMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Tạo mới
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Chỉnh sửa công việc (Jira Task)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật các trường thông tin của công việc này trực tiếp trên Jira.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditTask} className="space-y-4 pt-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tiêu đề công việc *</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Ví dụ: Thiết kế giao diện Dashboard"
                required
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Issue Type & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Loại công việc</label>
                <Select value={editIssueType} onValueChange={setEditIssueType}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="TASK" className="text-xs">Task</SelectItem>
                    <SelectItem value="BUG" className="text-xs">Bug</SelectItem>
                    <SelectItem value="STORY" className="text-xs">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mức độ ưu tiên</label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="DEFAULT" className="text-xs">Mặc định (Không chỉ định)</SelectItem>
                    <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                    <SelectItem value="CRITICAL" className="text-xs">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
              />
            </div>


            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả chi tiết</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Nhập mô tả nhiệm vụ chi tiết..."
                className="rounded-xl min-h-[100px] bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            {/* Labels */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Nhãn (Labels)</label>
              <Input
                value={editLabels}
                onChange={(e) => setEditLabels(e.target.value)}
                placeholder="Ngăn cách bằng dấu phẩy, ví dụ: FE, API, design"
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
                onClick={() => {
                  setIsEditOpen(false);
                  setTaskToEdit(null);
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateTaskMutation.isPending}
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
              >
                {updateTaskMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-2 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug flex items-center gap-2">
              <span className="p-2 bg-destructive/10 text-destructive rounded-xl">
                <AlertCircle size={18} />
              </span>
              Xác nhận xóa công việc
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-2">
              Bạn có chắc chắn muốn xóa công việc <strong className="text-foreground font-bold">&ldquo;{taskToDelete?.title}&rdquo;</strong> không? Hành động này sẽ xóa vĩnh viễn công việc này khỏi hệ thống Jira và không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => {
                setIsDeleteOpen(false);
                setTaskToDelete(null);
              }}
              disabled={deleteTaskMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={deleteTaskMutation.isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1.5"
              onClick={handleConfirmDelete}
            >
              {deleteTaskMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Xác nhận xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
