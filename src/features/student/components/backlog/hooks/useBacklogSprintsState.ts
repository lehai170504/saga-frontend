import { useState } from "react";
import { toast } from "sonner";
import { Sprint } from "@/features/projects/types";
import {
  useCreateSprint,
  useUpdateSprint,
  useDeleteSprint,
  useStartSprint,
  useCloseSprint,
} from "@/features/projects/hooks/useTeamSprints";
import { getTodayString } from "../backlog-helpers";

export function useBacklogSprintsState(projectId: string, sprints: Sprint[]) {
  const createSprintMutation = useCreateSprint(projectId);
  const updateSprintMutation = useUpdateSprint(projectId);
  const deleteSprintMutation = useDeleteSprint(projectId);
  const startSprintMutation = useStartSprint(projectId);
  const closeSprintMutation = useCloseSprint(projectId);

  // Accordion state
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
  const [expandedUnassigned, setExpandedUnassigned] = useState(true);

  // Create Sprint Modal
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [sprintNameInput, setSprintNameInput] = useState("");
  const [sprintGoalInput, setSprintGoalInput] = useState("");
  const [sprintStartDateInput, setSprintStartDateInput] = useState("");
  const [sprintEndDateInput, setSprintEndDateInput] = useState("");

  // Edit Sprint Modal
  const [isEditSprintOpen, setIsEditSprintOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);
  const [editSprintNameInput, setEditSprintNameInput] = useState("");
  const [editSprintGoalInput, setEditSprintGoalInput] = useState("");
  const [editSprintStartDateInput, setEditSprintStartDateInput] = useState("");
  const [editSprintEndDateInput, setEditSprintEndDateInput] = useState("");

  // Auto Start after setting date
  const [autoStartSprintId, setAutoStartSprintId] = useState<string | null>(null);

  const toggleSprintExpanded = (sprintId: string) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: prev[sprintId] !== undefined ? !prev[sprintId] : false,
    }));
  };

  const handleOpenEditSprint = (sprint: Sprint) => {
    setSprintToEdit(sprint);
    setEditSprintNameInput(sprint.sprintName || "");
    setEditSprintGoalInput(sprint.goal || "");
    setEditSprintStartDateInput(sprint.startDate ? sprint.startDate.split("T")[0] : "");
    setEditSprintEndDateInput(sprint.endDate ? sprint.endDate.split("T")[0] : "");
    setIsEditSprintOpen(true);
  };

  const handleStartSprint = (sprintId: string) => {
    const targetSprint = sprints.find((s) => s.sprintId === sprintId);
    if (targetSprint && (!targetSprint.startDate || !targetSprint.endDate)) {
      toast.info("Vui lòng cập nhật thời gian bắt đầu và kết thúc trước khi khởi động Sprint.");
      setAutoStartSprintId(sprintId);
      handleOpenEditSprint(targetSprint);
      return;
    }

    const key = crypto.randomUUID();
    startSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

  const handleCloseSprint = (sprintId: string) => {
    const key = crypto.randomUUID();
    closeSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

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
          const currentEditId = sprintToEdit.sprintId;
          const isAutoStart = autoStartSprintId === currentEditId;

          setIsEditSprintOpen(false);
          setSprintToEdit(null);
          setAutoStartSprintId(null);

          if (isAutoStart) {
            const startKey = crypto.randomUUID();
            startSprintMutation.mutate({ sprintId: currentEditId, idempotencyKey: startKey });
          }
        },
      }
    );
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Sprint này không?")) return;
    const key = crypto.randomUUID();
    deleteSprintMutation.mutate({ sprintId, idempotencyKey: key });
  };

  return {
    expandedSprints,
    expandedUnassigned,
    setExpandedUnassigned,
    toggleSprintExpanded,
    isCreateSprintOpen,
    setIsCreateSprintOpen,
    sprintNameInput,
    setSprintNameInput,
    sprintGoalInput,
    setSprintGoalInput,
    sprintStartDateInput,
    setSprintStartDateInput,
    sprintEndDateInput,
    setSprintEndDateInput,
    isEditSprintOpen,
    setIsEditSprintOpen,
    editSprintNameInput,
    setEditSprintNameInput,
    editSprintGoalInput,
    setEditSprintGoalInput,
    editSprintStartDateInput,
    setEditSprintStartDateInput,
    editSprintEndDateInput,
    setEditSprintEndDateInput,
    autoStartSprintId,
    handleStartSprint,
    handleCloseSprint,
    handleCreateSprint,
    handleOpenEditSprint,
    handleUpdateSprint,
    handleDeleteSprint,
    createSprintMutation,
    updateSprintMutation,
    deleteSprintMutation,
  };
}
