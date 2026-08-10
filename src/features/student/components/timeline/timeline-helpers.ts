import { Sprint } from "@/features/projects/types";

export function getSprintStatus(sprint: Sprint) {
  if (sprint.state === "CLOSED" || sprint.state === "closed") {
    return {
      label: "Đã hoàn thành",
      style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      colorClass: "text-emerald-500",
      timelineNodeStyle: "bg-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      cardStyle: "border-emerald-500/20 bg-emerald-500/[0.01] opacity-90",
      topLineStyle: "bg-emerald-500",
      dateStyle: "text-muted-foreground"
    };
  }

  if (!sprint.startDate || !sprint.endDate) {
    return {
      label: "Chưa thiết lập",
      style: "bg-muted text-muted-foreground border-muted/20",
      colorClass: "text-muted-foreground",
      timelineNodeStyle: "bg-muted border-muted-foreground/30",
      cardStyle: "border-border/50 bg-card/40 opacity-70",
      topLineStyle: "bg-muted",
      dateStyle: "text-muted-foreground"
    };
  }

  const now = new Date();
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 0) {
    return {
      label: "Quá hạn",
      style: "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_2px_10px_rgba(239,68,68,0.1)]",
      colorClass: "text-destructive",
      timelineNodeStyle: "bg-destructive border-destructive/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
      cardStyle: "border-destructive/30 bg-destructive/[0.01]",
      topLineStyle: "bg-destructive",
      dateStyle: "text-destructive font-bold"
    };
  }

  if (diffDays <= 3) {
    return {
      label: `Sắp kết thúc (Còn ${diffDays} ngày)`,
      style: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]",
      colorClass: "text-amber-600",
      timelineNodeStyle: "bg-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)] scale-110",
      cardStyle: "border-amber-500/30 bg-amber-500/[0.02]",
      topLineStyle: "bg-gradient-to-r from-amber-500 to-orange-500",
      dateStyle: "text-amber-600 font-bold"
    };
  }

  if (sprint.state === "ACTIVE" || sprint.state === "active" || (now >= start && now <= end)) {
    return {
      label: "Đang hoạt động",
      style: "bg-primary/10 text-primary border-primary/20 animate-pulse",
      colorClass: "text-primary",
      timelineNodeStyle: "bg-primary border-primary/30 shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110",
      cardStyle: "border-primary/30 bg-primary/[0.02]",
      topLineStyle: "bg-gradient-to-r from-primary to-orange-500",
      dateStyle: "text-primary font-semibold"
    };
  }

  return {
    label: "Sắp tới",
    style: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    colorClass: "text-blue-500",
    timelineNodeStyle: "bg-blue-500 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    cardStyle: "border-border/50 bg-card/60",
    topLineStyle: "bg-blue-500",
    dateStyle: "text-foreground"
  };
}

export function formatDateTimeForInput(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
