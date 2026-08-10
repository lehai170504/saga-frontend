"use client";

import React, { useState } from "react";
import { 
  Loader2, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User, 
  Equal, 
  ChevronsUp, 
  ChevronsDown, 
  Bug, 
  CheckSquare, 
  FolderKanban, 
  Trash2, 
  Edit3, 
  ArrowRightLeft 
} from "lucide-react";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { 
  useProjectSprints, 
  useCreateSprint, 
  useStartSprint, 
  useCloseSprint, 
  useUpdateSprint, 
  useDeleteSprint 
} from "@/features/projects/hooks/useTeamSprints";
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask, useTaskTransitions, useTransitionTask } from "@/features/projects/hooks/useProjectTasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { JiraTask, Sprint } from "@/features/projects/types";
import { UpdateTaskRequest, TaskTransition } from "@/features/projects/api/taskApi";

function TaskStatusDropdown({ 
  projectId, 
  task 
}: { 
  projectId: string; 
  task: JiraTask; 
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

interface StudentBacklogViewProps {
  courseId?: string;
}

export function StudentBacklogView({ courseId }: StudentBacklogViewProps) {
  const [keyword, setKeyword] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  
  // Collapse/Expand state for sprints
  const [collapsedSprints, setCollapsedSprints] = useState<Record<string, boolean>>({});
  const [isBacklogCollapsed, setIsBacklogCollapsed] = useState(false);

  // Create Task dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [targetSprintIdForCreate, setTargetSprintIdForCreate] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIssueType, setCreateIssueType] = useState("TASK");
  const [createPriority, setCreatePriority] = useState("DEFAULT");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createAssignee, setCreateAssignee] = useState("UNASSIGNED");

  // Edit Task dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<JiraTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIssueType, setEditIssueType] = useState("TASK");
  const [editPriority, setEditPriority] = useState("DEFAULT");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState("UNASSIGNED");

  // Delete Task dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<JiraTask | null>(null);

  // Sprint actions state hooks
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

  // Drag & drop move confirmation state
  const [isMoveConfirmOpen, setIsMoveConfirmOpen] = useState(false);
  const [taskToMove, setTaskToMove] = useState<JiraTask | null>(null);
  const [sourceSprintName, setSourceSprintName] = useState("");
  const [targetSprintId, setTargetSprintId] = useState<string | null>(null);
  const [targetSprintName, setTargetSprintName] = useState("");
  const [dragOverSprintId, setDragOverSprintId] = useState<string | null>(null);

  // Queries
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const { data: tasksData, isLoading: isLoadingTasks } = useProjectTasks(projectId, {
    size: 100, // Load up to 100 tasks (maximum allowed by backend)
  });

  // Mutations
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  // Sprint Mutations
  const createSprintMutation = useCreateSprint(projectId);
  const startSprintMutation = useStartSprint(projectId);
  const closeSprintMutation = useCloseSprint(projectId);
  const updateSprintMutation = useUpdateSprint(projectId);
  const deleteSprintMutation = useDeleteSprint(projectId);

  // Sprint Actions Handlers
  const handleOpenCreateSprint = () => {
    setSprintNameInput(`Sprint ${sprints.length + 1}`);
    setSprintGoalInput("");
    setSprintStartDateInput("");
    setSprintEndDateInput("");
    setIsCreateSprintOpen(true);
  };

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintNameInput.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
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

  const handleStartSprint = (sprintId: string) => {
    const key = crypto.randomUUID();
    startSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

  const handleCloseSprint = (sprintId: string) => {
    const key = crypto.randomUUID();
    closeSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

  // Drag & Drop handlers
  const handleInitiateMove = (taskId: string, originalSprintId: string, destSprintId: string | null, destSprintName: string) => {
    if (originalSprintId === (destSprintId || "backlog")) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let srcName = "Backlog";
    if (originalSprintId !== "backlog") {
      const srcSprint = sprints.find(s => s.sprintId === originalSprintId);
      if (srcSprint) srcName = srcSprint.sprintName;
    }

    setTaskToMove(task);
    setSourceSprintName(srcName);
    setTargetSprintId(destSprintId);
    setTargetSprintName(destSprintName);
    setIsMoveConfirmOpen(true);
  };

  const handleConfirmMoveTask = () => {
    if (!taskToMove) return;
    handleMoveTaskSprint(taskToMove.id, targetSprintId);
    setIsMoveConfirmOpen(false);
    setTaskToMove(null);
  };



  const sprints = sprintsData?.sprints || [];
  const tasks = tasksData?.content || [];

  // Filter tasks based on search & filter fields
  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";
    const key = task.externalKey || "";
    const matchesKeyword = 
      title.toLowerCase().includes(keyword.toLowerCase()) ||
      key.toLowerCase().includes(keyword.toLowerCase());
    
    const matchesAssignee = 
      assigneeFilter === "ALL" ||
      (assigneeFilter === "UNASSIGNED" && !task.assignee) ||
      (task.assignee?.id === assigneeFilter);
      
    const matchesPriority =
      priorityFilter === "ALL" ||
      (task.priority || "").toUpperCase() === priorityFilter.toUpperCase();

    return matchesKeyword && matchesAssignee && matchesPriority;
  });

  // Group tasks
  const tasksBySprint: Record<string, JiraTask[]> = {};
  sprints.forEach(s => {
    tasksBySprint[s.sprintId] = [];
  });

  const backlogTasks: JiraTask[] = [];

  filteredTasks.forEach(task => {
    const taskSprintId = task.sprint?.id;
    if (taskSprintId && tasksBySprint[taskSprintId] !== undefined) {
      tasksBySprint[taskSprintId].push(task);
    } else {
      backlogTasks.push(task);
    }
  });

  // Toggle Collapse
  const toggleSprintCollapse = (sprintId: string) => {
    setCollapsedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  // Helper formats
  const formatSprintDates = (startStr?: string | null, endStr?: string | null) => {
    if (!startStr || !endStr) return "Chưa thiết lập thời gian";
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      return `${start.toLocaleDateString("vi-VN", options)} – ${end.toLocaleDateString("vi-VN", options)}`;
    } catch {
      return "Lỗi định dạng ngày";
    }
  };

  const getPriorityIcon = (priority: string) => {
    const p = priority?.toUpperCase();
    if (p === "HIGH" || p === "HIGHEST") {
      return <ChevronsUp size={16} className="text-destructive shrink-0" />;
    }
    if (p === "MEDIUM") {
      return <Equal size={16} className="text-amber-500 shrink-0" />;
    }
    return <ChevronsDown size={16} className="text-blue-500 shrink-0" />;
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



  // Move task handler
  const handleMoveTaskSprint = (taskId: string, sprintId: string | null) => {
    const sprintIdempotencyKey = crypto.randomUUID();
    
    // Perform only sprint change mutation
    updateTaskMutation.mutate({
      taskId,
      sprintId, // null if moving to backlog
      sprintIdempotencyKey
    });
  };

  // Open Create Dialog
  const handleOpenCreate = (sprintId: string | null) => {
    setTargetSprintIdForCreate(sprintId);
    setCreateTitle("");
    setCreateDescription("");
    setCreateIssueType("TASK");
    setCreatePriority("DEFAULT");
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

    const payload = {
      title: createTitle.trim(),
      description: createDescription.trim() || undefined,
      type: createIssueType,
      priority: createPriority === "DEFAULT" ? undefined : createPriority,
      dueDate: createDueDate || undefined,
      assigneeId: createAssignee === "UNASSIGNED" ? undefined : createAssignee,
    };

    const idempotencyKey = crypto.randomUUID();
    const assignIdempotencyKey = crypto.randomUUID();

    // If target sprint is configured, we pass it to query mutation logic
    const activeSprintId = targetSprintIdForCreate || undefined;

    createTaskMutation.mutate(
      { 
        data: payload, 
        idempotencyKey,
        assignIdempotencyKey: activeSprintId ? assignIdempotencyKey : ""
      },
      {
        onSuccess: (task) => {
          // If created directly in a sprint, assign task to sprint
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
    setEditPriority(task.priority || "DEFAULT");
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

    const isTitleChanged = editTitle.trim() !== (taskToEdit.title || "").trim();
    const isDescriptionChanged = editDescription.trim() !== (taskToEdit.description || "").trim();
    const origDueDate = taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "";
    const isDueDateChanged = editDueDate !== origDueDate;
    const isPriorityChanged = editPriority !== (taskToEdit.priority || "DEFAULT");

    const mainPayload: UpdateTaskRequest = {};
    if (isTitleChanged) mainPayload.title = editTitle.trim();
    if (isDescriptionChanged) mainPayload.description = editDescription.trim();
    if (isDueDateChanged) mainPayload.dueDate = editDueDate || null;
    if (isPriorityChanged) mainPayload.priority = editPriority === "DEFAULT" ? undefined : editPriority;

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

  const isLoading = isLoadingTeam || isLoadingSprints || isLoadingTasks;
  const teamMembers = myTeamData?.members?.content || [];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background p-6 space-y-6 animate-in fade-in duration-500">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Filters toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-border/40">
        <div className="flex flex-1 items-center gap-3 max-w-md bg-background/50 border border-border/30 rounded-xl px-3 py-1.5 focus-within:border-primary/50 transition-colors">
          <Search size={16} className="text-muted-foreground/60 shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề hoặc mã task..."
            className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Assignee Filter */}
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-9 w-[150px] rounded-xl bg-background/40 border-border/30 text-xs px-3 cursor-pointer">
              <SelectValue placeholder="Người thực hiện" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/30">
              <SelectItem value="ALL" className="text-xs">Tất cả Assignee</SelectItem>
              <SelectItem value="UNASSIGNED" className="text-xs">Chưa giao việc</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                  {m.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-9 w-[130px] rounded-xl bg-background/40 border-border/30 text-xs px-3 cursor-pointer">
              <SelectValue placeholder="Mức độ ưu tiên" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/30">
              <SelectItem value="ALL" className="text-xs">Tất cả Priority</SelectItem>
              <SelectItem value="LOW" className="text-xs">Low</SelectItem>
              <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
              <SelectItem value="HIGH" className="text-xs">High</SelectItem>
            </SelectContent>
          </Select>

          {!isLoading && myTeamData?.roleInTeam === "LEADER" && (
            <Button
              onClick={() => handleOpenCreate(null)}
              className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white h-9 px-4 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={14} className="mr-1" />
              Tạo Task
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !myTeamData ? (
        <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
          <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
          <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
        </div>
      ) : !projectId ? (
        <div className="text-center p-12 glass-panel rounded-[2rem] max-w-md mx-auto mt-12">
          <FolderKanban size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
          <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa liên kết dự án Jira nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sprints Group */}
          {sprints.map((sprint) => {
            const sprintTasksList = tasksBySprint[sprint.sprintId] || [];
            const isCollapsed = collapsedSprints[sprint.sprintId] || false;
            
            // Stats
            const todoCount = sprintTasksList.filter(t => t.status === "TODO").length;
            const progressCount = sprintTasksList.filter(t => t.status === "IN_PROGRESS" || t.status === "IN_REVIEW").length;
            const doneCount = sprintTasksList.filter(t => t.status === "DONE").length;

            return (
              <div 
                key={sprint.sprintId} 
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverSprintId !== sprint.sprintId) {
                    setDragOverSprintId(sprint.sprintId);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverSprintId === sprint.sprintId) {
                    setDragOverSprintId(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverSprintId(null);
                  const taskId = e.dataTransfer.getData("text/plain");
                  const originalSprintId = e.dataTransfer.getData("originalSprintId");
                  handleInitiateMove(taskId, originalSprintId, sprint.sprintId, sprint.sprintName);
                }}
                className={`glass-panel border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                  dragOverSprintId === sprint.sprintId 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.01]" 
                    : "border-border/30"
                }`}
              >
                {/* Sprint Header */}
                <div 
                  onClick={() => toggleSprintCollapse(sprint.sprintId)}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors border-b border-border/10 select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground/70 hover:text-foreground">
                      {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <span className="font-extrabold text-sm text-foreground">
                      {sprint.sprintName}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      ({formatSprintDates(sprint.startDate, sprint.endDate)})
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 px-2 py-0.5 bg-muted/60 border border-border/20 rounded-md">
                      {sprintTasksList.length} Tasks
                    </span>
                  </div>

                  <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    {/* Status count badges */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/10">
                        {todoCount}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/10">
                        {progressCount}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                        {doneCount}
                      </span>
                    </div>

                    {sprint.state?.toUpperCase() === "ACTIVE" ? (
                      <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold px-2.5 py-1">
                        Đang hoạt động
                      </Badge>
                    ) : sprint.state?.toUpperCase() === "CLOSED" ? (
                      <Badge className="bg-muted text-muted-foreground border border-border/20 rounded-lg text-[10px] font-bold px-2.5 py-1">
                        Đã đóng
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1">
                        Sắp tới
                      </Badge>
                    )}

                    {/* Start/Complete/Options buttons for Sprint */}
                    {!isLoadingTeam && myTeamData?.roleInTeam === "LEADER" && (
                      <div className="flex items-center gap-2">
                        {sprint.state?.toUpperCase() === "ACTIVE" ? (
                          <Button
                            size="sm"
                            onClick={() => handleCloseSprint(sprint.sprintId)}
                            disabled={closeSprintMutation.isPending}
                            className="h-8 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm cursor-pointer"
                          >
                            {closeSprintMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            Hoàn thành Sprint
                          </Button>
                        ) : sprint.state?.toUpperCase() === "CLOSED" ? null : (
                          <Button
                            size="sm"
                            onClick={() => handleStartSprint(sprint.sprintId)}
                            disabled={startSprintMutation.isPending}
                            className="h-8 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm cursor-pointer"
                          >
                            {startSprintMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            Bắt đầu Sprint
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center"
                            >
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[120px] p-1.5 animate-in fade-in duration-200">
                            <DropdownMenuItem
                              onClick={() => handleOpenEditSprint(sprint)}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                            >
                              Chỉnh sửa Sprint
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteSprint(sprint.sprintId)}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                            >
                              Xóa Sprint
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>

                {sprint.goal && (
                  <div className="px-4 py-2 bg-muted/5 border-b border-border/10 text-[11px] text-muted-foreground/80 italic font-medium">
                    Mục tiêu: {sprint.goal}
                  </div>
                )}

                {/* Sprint Content (Tasks List) */}
                {!isCollapsed && (
                  <div className="p-2 space-y-1">
                    {sprintTasksList.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-border/30 rounded-xl m-2 bg-muted/5">
                        <span className="text-xs text-muted-foreground/60 italic">Sprint này chưa có công việc.</span>
                      </div>
                    ) : (
                      sprintTasksList.map(task => (
                        <div 
                          key={task.id} 
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", task.id);
                            e.dataTransfer.setData("originalSprintId", sprint.sprintId);
                          }}
                          className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-muted/30 border border-transparent hover:border-border/30 transition-all group cursor-grab active:cursor-grabbing select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {getTypeIcon(task.type)}
                            <span className="text-xs font-black text-muted-foreground select-none shrink-0">
                              {task.externalKey}
                            </span>
                            <span className="text-xs font-semibold text-foreground truncate max-w-md">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {/* Status */}
                            <TaskStatusDropdown projectId={projectId} task={task} />

                            {/* Due Date */}
                            {task.dueDate ? (
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                <Calendar size={12} />
                                <span>{new Date(task.dueDate).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/40 font-medium">-</span>
                            )}

                            {/* Story points */}
                            <span className="w-6 text-center text-xs font-bold text-muted-foreground bg-muted/40 border border-border/20 rounded-md py-0.5">
                              {task.storyPoint || "-"}
                            </span>

                            {/* Priority */}
                            {getPriorityIcon(task.priority)}

                            {/* Assignee Avatar */}
                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary select-none" title={task.assignee?.fullName || "Chưa giao việc"}>
                              {task.assignee?.fullName ? (
                                (task.assignee.fullName.split(" ").slice(-1)[0]?.substring(0, 2) || "??").toUpperCase()
                              ) : (
                                <User size={12} className="text-muted-foreground/60" />
                              )}
                            </div>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-7 w-7 p-0 rounded-lg hover:bg-muted cursor-pointer shrink-0">
                                  <MoreHorizontal size={14} className="text-muted-foreground/80" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                                <DropdownMenuItem onClick={() => handleOpenEdit(task)} className="text-xs gap-2 rounded-lg cursor-pointer">
                                  <Edit3 size={12} />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                
                                {/* Move Sprint Submenu */}
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="text-xs gap-2 rounded-lg cursor-pointer">
                                    <ArrowRightLeft size={12} />
                                    Di chuyển sang
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="rounded-xl border-border/40">
                                    <DropdownMenuItem 
                                      onClick={() => handleMoveTaskSprint(task.id, null)}
                                      className="text-xs rounded-lg cursor-pointer"
                                    >
                                      Backlog
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {sprints
                                      .filter(s => s.sprintId !== sprint.sprintId)
                                      .map(s => (
                                        <DropdownMenuItem 
                                          key={s.sprintId}
                                          onClick={() => handleMoveTaskSprint(task.id, s.sprintId)}
                                          className="text-xs rounded-lg cursor-pointer"
                                        >
                                          {s.sprintName}
                                        </DropdownMenuItem>
                                      ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenDelete(task)} className="text-xs gap-2 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer">
                                  <Trash2 size={12} />
                                  Xóa task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Inline Create button */}
                    {myTeamData?.roleInTeam === "LEADER" && (
                      <button 
                        onClick={() => handleOpenCreate(sprint.sprintId)}
                        className="flex items-center gap-1.5 justify-start py-2.5 px-4 rounded-xl border border-dashed border-border/20 text-muted-foreground/60 hover:text-foreground hover:bg-muted/20 hover:border-border/30 transition-all text-xs font-bold w-full cursor-pointer mt-1"
                      >
                        <Plus size={14} />
                        Thêm công việc
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Backlog Group */}
          <div 
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverSprintId !== "backlog") {
                setDragOverSprintId("backlog");
              }
            }}
            onDragLeave={() => {
              if (dragOverSprintId === "backlog") {
                setDragOverSprintId(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverSprintId(null);
              const taskId = e.dataTransfer.getData("text/plain");
              const originalSprintId = e.dataTransfer.getData("originalSprintId");
              handleInitiateMove(taskId, originalSprintId, null, "Backlog");
            }}
            className={`glass-panel border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
              dragOverSprintId === "backlog" 
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.01]" 
                : "border-border/30"
            }`}
          >
            {/* Backlog Header */}
            <div 
              onClick={() => setIsBacklogCollapsed(prev => !prev)}
              className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors border-b border-border/10 select-none"
            >
              <div className="flex items-center gap-3">
                <button className="text-muted-foreground/70 hover:text-foreground">
                  {isBacklogCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                </button>
                <span className="font-extrabold text-sm text-foreground">
                  Backlog
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 px-2 py-0.5 bg-muted/60 border border-border/20 rounded-md">
                  {backlogTasks.length} Tasks
                </span>
              </div>

              {/* Create Sprint Button */}
              {!isLoadingTeam && myTeamData?.roleInTeam === "LEADER" && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpenCreateSprint}
                    className="h-8 rounded-xl text-xs font-bold bg-background/50 border-border/40 hover:bg-muted cursor-pointer shadow-sm"
                  >
                    Tạo Sprint
                  </Button>
                </div>
              )}
            </div>

            {/* Backlog Content */}
            {!isBacklogCollapsed && (
              <div className="p-2 space-y-1">
                {backlogTasks.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-border/30 rounded-xl m-2 bg-muted/5">
                    <span className="text-xs text-muted-foreground/60 italic">Hộp thư Backlog trống.</span>
                  </div>
                ) : (
                  backlogTasks.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", task.id);
                        e.dataTransfer.setData("originalSprintId", "backlog");
                      }}
                      className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-muted/30 border border-transparent hover:border-border/30 transition-all group cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getTypeIcon(task.type)}
                        <span className="text-xs font-black text-muted-foreground select-none shrink-0">
                          {task.externalKey}
                        </span>
                        <span className="text-xs font-semibold text-foreground truncate max-w-md">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Status */}
                        <TaskStatusDropdown projectId={projectId} task={task} />

                        {/* Due Date */}
                        {task.dueDate ? (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/40 font-medium">-</span>
                        )}

                        {/* Story points */}
                        <span className="w-6 text-center text-xs font-bold text-muted-foreground bg-muted/40 border border-border/20 rounded-md py-0.5">
                          {task.storyPoint || "-"}
                        </span>

                        {/* Priority */}
                        {getPriorityIcon(task.priority)}

                        {/* Assignee */}
                        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary select-none" title={task.assignee?.fullName || "Chưa giao việc"}>
                          {task.assignee?.fullName ? (
                            (task.assignee.fullName.split(" ").slice(-1)[0]?.substring(0, 2) || "??").toUpperCase()
                          ) : (
                            <User size={12} className="text-muted-foreground/60" />
                          )}
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 p-0 rounded-lg hover:bg-muted cursor-pointer shrink-0">
                              <MoreHorizontal size={14} className="text-muted-foreground/80" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                            <DropdownMenuItem onClick={() => handleOpenEdit(task)} className="text-xs gap-2 rounded-lg cursor-pointer">
                              <Edit3 size={12} />
                              Chỉnh sửa
                            </DropdownMenuItem>

                            {/* Move Sprint Submenu */}
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="text-xs gap-2 rounded-lg cursor-pointer">
                                <ArrowRightLeft size={12} />
                                Di chuyển sang
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="rounded-xl border-border/40">
                                {sprints.map(s => (
                                  <DropdownMenuItem 
                                    key={s.sprintId}
                                    onClick={() => handleMoveTaskSprint(task.id, s.sprintId)}
                                    className="text-xs rounded-lg cursor-pointer"
                                  >
                                    {s.sprintName}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenDelete(task)} className="text-xs gap-2 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer">
                              <Trash2 size={12} />
                              Xóa task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}

                {/* Inline Create button */}
                {myTeamData?.roleInTeam === "LEADER" && (
                  <button 
                    onClick={() => handleOpenCreate(null)}
                    className="flex items-center gap-1.5 justify-start py-2.5 px-4 rounded-xl border border-dashed border-border/20 text-muted-foreground/60 hover:text-foreground hover:bg-muted/20 hover:border-border/30 transition-all text-xs font-bold w-full cursor-pointer mt-1"
                  >
                    <Plus size={14} />
                    Thêm công việc
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer">
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
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="DEFAULT" className="text-xs">Mặc định (Không chỉ định)</SelectItem>
                    <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
                <Input
                  type="date"
                  value={createDueDate}
                  onChange={(e) => setCreateDueDate(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Người thực hiện</label>
                <Select value={createAssignee} onValueChange={setCreateAssignee}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="UNASSIGNED" className="text-xs">Chưa giao việc</SelectItem>
                    {teamMembers.map(m => (
                      <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                        {m.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả công việc</label>
              <Textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Nhập chi tiết mô tả công việc..."
                className="min-h-24 rounded-2xl bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border/40 gap-2">
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
                className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white h-10 px-5 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                {createTaskMutation.isPending ? (
                  <>
                    <Loader2 size={12} className="mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo công việc"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Chỉnh sửa công việc: {taskToEdit?.externalKey}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật các thông tin công việc và đồng bộ về Jira.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditTask} className="space-y-4 pt-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tiêu đề công việc *</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Issue Type & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Loại công việc</label>
                <Select value={editIssueType} onValueChange={setEditIssueType} disabled>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-not-allowed opacity-60">
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
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="DEFAULT" className="text-xs">Mặc định (Không chỉ định)</SelectItem>
                    <SelectItem value="LOW" className="text-xs">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-xs">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Hạn hoàn thành</label>
                <Input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Người thực hiện</label>
                <Select value={editAssignee} onValueChange={setEditAssignee}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="UNASSIGNED" className="text-xs">Chưa giao việc</SelectItem>
                    {teamMembers.map(m => (
                      <SelectItem key={m.studentId} value={m.studentId} className="text-xs">
                        {m.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mô tả công việc</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Nhập mô tả công việc..."
                className="min-h-24 rounded-2xl bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border/40 gap-2">
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
                className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white h-10 px-5 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                {updateTaskMutation.isPending ? (
                  <>
                    <Loader2 size={12} className="mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Xác nhận xóa công việc?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              Hành động này sẽ xóa vĩnh viễn công việc <span className="font-extrabold text-foreground">{taskToDelete?.externalKey}</span> khỏi hệ thống SAGA và Jira. Bạn có chắc chắn muốn tiếp tục không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleteTaskMutation.isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => {
                setIsDeleteOpen(false);
                setTaskToDelete(null);
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={deleteTaskMutation.isPending}
              className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white h-10 px-5 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
              onClick={handleDeleteTask}
            >
              {deleteTaskMutation.isPending ? (
                <>
                  <Loader2 size={12} className="mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Sprint Dialog */}
      <Dialog open={isCreateSprintOpen} onOpenChange={setIsCreateSprintOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Tạo Sprint mới
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tạo Sprint mới trên Jira và đồng bộ về hệ thống SAGA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSprint} className="space-y-4 pt-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tên Sprint *</label>
              <Input
                value={sprintNameInput}
                onChange={(e) => setSprintNameInput(e.target.value)}
                placeholder="Ví dụ: Sprint 1"
                required
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Goal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mục tiêu Sprint</label>
              <Textarea
                value={sprintGoalInput}
                onChange={(e) => setSprintGoalInput(e.target.value)}
                placeholder="Mô tả mục tiêu của Sprint..."
                className="rounded-xl min-h-[80px] bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày bắt đầu</label>
                <Input
                  type="date"
                  value={sprintStartDateInput}
                  onChange={(e) => setSprintStartDateInput(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày kết thúc</label>
                <Input
                  type="date"
                  value={sprintEndDateInput}
                  onChange={(e) => setSprintEndDateInput(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
                onClick={() => setIsCreateSprintOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createSprintMutation.isPending}
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
              >
                {createSprintMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Tạo mới
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Sprint Dialog */}
      <Dialog open={isEditSprintOpen} onOpenChange={setIsEditSprintOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug">
              Chỉnh sửa Sprint
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật thông tin của Sprint trực tiếp trên Jira.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSprint} className="space-y-4 pt-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Tên Sprint *</label>
              <Input
                value={editSprintNameInput}
                onChange={(e) => setEditSprintNameInput(e.target.value)}
                placeholder="Ví dụ: Sprint 1"
                required
                className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
              />
            </div>

            {/* Goal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Mục tiêu Sprint</label>
              <Textarea
                value={editSprintGoalInput}
                onChange={(e) => setEditSprintGoalInput(e.target.value)}
                placeholder="Mô tả mục tiêu của Sprint..."
                className="rounded-xl min-h-[80px] bg-background/50 border-border/40 text-xs p-4"
              />
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày bắt đầu</label>
                <Input
                  type="date"
                  value={editSprintStartDateInput}
                  onChange={(e) => setEditSprintStartDateInput(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Ngày kết thúc</label>
                <Input
                  type="date"
                  value={editSprintEndDateInput}
                  onChange={(e) => setEditSprintEndDateInput(e.target.value)}
                  className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
                onClick={() => {
                  setIsEditSprintOpen(false);
                  setSprintToEdit(null);
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateSprintMutation.isPending}
                className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
              >
                {updateSprintMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Drag & Drop Move Task Confirmation Dialog */}
      <Dialog open={isMoveConfirmOpen} onOpenChange={setIsMoveConfirmOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
            <DialogTitle className="text-base font-extrabold text-foreground leading-snug flex items-center gap-2">
              <span className="p-2 bg-primary/10 text-primary rounded-xl">
                <ArrowRightLeft size={16} />
              </span>
              Di chuyển công việc?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal pt-2">
              Bạn có chắc chắn muốn di chuyển công việc{" "}
              <strong className="text-foreground font-bold">
                {taskToMove?.externalKey} - {taskToMove?.title}
              </strong>{" "}
              từ <strong className="text-foreground font-bold">{sourceSprintName}</strong> sang{" "}
              <strong className="text-foreground font-bold">{targetSprintName}</strong> không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={updateTaskMutation.isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-xs"
              onClick={() => {
                setIsMoveConfirmOpen(false);
                setTaskToMove(null);
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={updateTaskMutation.isPending}
              className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white h-10 px-5 text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
              onClick={handleConfirmMoveTask}
            >
              {updateTaskMutation.isPending ? (
                <>
                  <Loader2 size={12} className="mr-2 animate-spin" />
                  Đang di chuyển...
                </>
              ) : (
                "Xác nhận di chuyển"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
