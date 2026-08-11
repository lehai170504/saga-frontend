export interface TaskDueDateInfo {
  isOverdue: boolean;
  isNearDeadline: boolean;
  diffDays: number | null;
  formattedDate: string;
  badgeLabel: string;
  badgeStyle: string;
  cardBorderStyle: string;
  iconColorStyle: string;
}

export const getTaskDueDateInfo = (dueDate?: string | null, status?: string): TaskDueDateInfo | null => {
  if (!dueDate) return null;

  const _d = new Date(dueDate);
  const _dd = String(_d.getDate()).padStart(2, "0");
  const _mm = String(_d.getMonth() + 1).padStart(2, "0");
  const _yyyy = _d.getFullYear();
  const formattedDate = `${_dd}-${_mm}-${_yyyy}`;

  // If task is completed/closed, treat as normal without warning/overdue alerts
  const s = status?.toUpperCase() || "";
  const isDone = s.includes("DONE") || s.includes("HOÀN THÀNH") || s.includes("RESOLVED") || s.includes("CLOSED");
  if (isDone) {
    return {
      isOverdue: false,
      isNearDeadline: false,
      diffDays: null,
      formattedDate,
      badgeLabel: formattedDate,
      badgeStyle: "bg-muted/30 text-muted-foreground/80 border-border/30",
      cardBorderStyle: "",
      iconColorStyle: "text-muted-foreground/60"
    };
  }

  const now = new Date();
  const due = new Date(dueDate);

  // Compare dates strictly at start of day (midnight)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const diffTime = dueStart - todayStart;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isOverdue: true,
      isNearDeadline: false,
      diffDays,
      formattedDate,
      badgeLabel: `Quá hạn (${formattedDate})`,
      badgeStyle: "bg-destructive/15 text-destructive border-destructive/30 font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.15)]",
      cardBorderStyle: "border-destructive/40 bg-destructive/[0.02]",
      iconColorStyle: "text-destructive"
    };
  }

  if (diffDays <= 3) {
    const dayText = diffDays === 0 ? "Hạn hôm nay" : `Còn ${diffDays} ngày`;
    return {
      isOverdue: false,
      isNearDeadline: true,
      diffDays,
      formattedDate,
      badgeLabel: `${dayText} (${formattedDate})`,
      badgeStyle: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.15)]",
      cardBorderStyle: "border-amber-500/40 bg-amber-500/[0.01]",
      iconColorStyle: "text-amber-500"
    };
  }

  return {
    isOverdue: false,
    isNearDeadline: false,
    diffDays,
    formattedDate,
    badgeLabel: formattedDate,
    badgeStyle: "bg-muted/40 text-muted-foreground border-border/40",
    cardBorderStyle: "",
    iconColorStyle: "text-muted-foreground"
  };
};
