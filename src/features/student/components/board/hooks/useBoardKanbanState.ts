import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { JiraTask } from "@/features/projects/types";
import { TaskTransition } from "@/features/projects/api/taskApi";
import { useTransitionTask } from "@/features/projects/hooks/useProjectTasks";

export function useBoardKanbanState(projectId: string, tasks: JiraTask[]) {
  const queryClient = useQueryClient();
  const transitionMutationBoard = useTransitionTask(projectId);

  // Drag & Drop State
  const [draggedTask, setDraggedTask] = useState<JiraTask | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [pendingTransitions, setPendingTransitions] = useState<Record<string, string>>({});

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

  return {
    columns,
    tasksByColumn,
    draggedTask,
    dragOverColumn,
    pendingTransitions,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
