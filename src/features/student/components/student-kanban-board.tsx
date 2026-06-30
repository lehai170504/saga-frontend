"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Settings
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";

interface JiraSprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface JiraTask {
  id: string;
  key: string;
  title: string;
  assignee: string;
  storyPoints: number;
  priority: "high" | "medium" | "low";
  status: "todo" | "inprogress" | "inreview" | "done";
  sprintId: string;
}

const DEFAULT_SPRINTS: JiraSprint[] = [
  { id: "sprint-1", name: "Sprint 1 — Core Setup", startDate: "2026-06-01", endDate: "2026-06-14", isActive: false },
  { id: "sprint-2", name: "Sprint 2 — Database Design", startDate: "2026-06-15", endDate: "2026-06-28", isActive: false },
  { id: "sprint-3", name: "Sprint 3 — Auth Integration", startDate: "2026-06-29", endDate: "2026-07-12", isActive: true },
];

const DEFAULT_TASKS: JiraTask[] = [
  { id: "task-1", key: "SAGA-10", title: "Cấu hình Next.js Router & Tailwind v4", assignee: "Trần Thị Bình", storyPoints: 3, priority: "high", status: "done", sprintId: "sprint-1" },
  { id: "task-2", key: "SAGA-11", title: "Tạo Mock Database Schema cho Lớp Học", assignee: "Nguyễn Văn An", storyPoints: 5, priority: "high", status: "done", sprintId: "sprint-2" },
  { id: "task-3", key: "SAGA-12", title: "Tích hợp Context Auth Provider & Login State", assignee: "Lê Văn Cường", storyPoints: 5, priority: "high", status: "inprogress", sprintId: "sprint-3" },
  { id: "task-4", key: "SAGA-13", title: "Thiết kế giao diện Bảng Kanban của sinh viên", assignee: "Trần Thị Bình", storyPoints: 3, priority: "medium", status: "inprogress", sprintId: "sprint-3" },
  { id: "task-5", key: "SAGA-14", title: "Viết Unit Tests cho bộ lọc xếp nhóm", assignee: "Phạm Thị Dung", storyPoints: 2, priority: "low", status: "todo", sprintId: "sprint-3" },
  { id: "task-6", key: "SAGA-15", title: "Đồng bộ hóa API Webhooks từ GitHub", assignee: "Hoàng Văn Em", storyPoints: 8, priority: "high", status: "todo", sprintId: "sprint-3" },
];

const TEAM_MEMBERS = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Văn Cường",
  "Phạm Thị Dung",
  "Hoàng Văn Em",
  "Nguyễn Tuấn Anh"
];

export function StudentKanbanBoard() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Kanban states
  const [sprints, setSprints] = useState<JiraSprint[]>([]);
  const [tasks, setTasks] = useState<JiraTask[]>([]);
  const [currentSprintId, setCurrentSprintId] = useState("");

  // Modals / forms states
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<JiraSprint | null>(null);
  const [sprintName, setSprintName] = useState("");
  const [sprintStart, setSprintStart] = useState("");
  const [sprintEnd, setSprintEnd] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<JiraTask | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskSP, setTaskSP] = useState(3);
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [taskStatus, setTaskStatus] = useState<"todo" | "inprogress" | "inreview" | "done">("todo");

  const subjectsData = [
    { code: "WDP301", name: "Dự án phát triển web", classId: "wdp301-pbl", className: "SE1801", project: "Nhóm PBL-01" },
    { code: "PRN211", name: "Lập trình C# nâng cao", classId: "prn211-pbl", className: "SE1802", project: "Nhóm PBL-02" },
    { code: "CS101", name: "Nhập môn Lập trình", classId: "cs101-pbl", className: "SE1803", project: "Nhóm PBL-03" },
    { code: "SWT301", name: "Kiểm thử phần mềm", classId: "swt301-pbl", className: "SE1804", project: "Nhóm PBL-04" },
    { code: "DBI202", name: "Hệ cơ sở dữ liệu", classId: "dbi202-pbl", className: "SE1805", project: "Nhóm PBL-05" },
  ];

  const getClassName = (classId: string) => {
    if (!classId) return "";
    const match = subjectsData.find((c) => c.classId === classId);
    if (match) return `${match.code} - Lớp ${match.className}`;
    return classId.toUpperCase();
  };

  const getStudentGroup = (classId: string) => {
    const match = subjectsData.find((c) => c.classId === classId);
    return match ? match.project : "Nhóm PBL-01";
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    setSelectedSemester(sem);
    setSelectedClass(cls);

    const localSprints = localStorage.getItem(`saga-kanban-sprints-${cls}`);
    const localTasks = localStorage.getItem(`saga-kanban-tasks-${cls}`);

    if (localSprints) {
      const parsedSprints = JSON.parse(localSprints);
      setSprints(parsedSprints);
      const active = parsedSprints.find((s: JiraSprint) => s.isActive);
      setCurrentSprintId(active ? active.id : (parsedSprints[0]?.id || ""));
    } else {
      setSprints(DEFAULT_SPRINTS);
      setCurrentSprintId("sprint-3");
      localStorage.setItem(`saga-kanban-sprints-${cls}`, JSON.stringify(DEFAULT_SPRINTS));
    }

    if (localTasks) {
      setTasks(JSON.parse(localTasks));
    } else {
      setTasks(DEFAULT_TASKS);
      localStorage.setItem(`saga-kanban-tasks-${cls}`, JSON.stringify(DEFAULT_TASKS));
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedClass]);

  const syncSprints = (updatedSprints: JiraSprint[]) => {
    setSprints(updatedSprints);
    if (selectedClass) {
      localStorage.setItem(`saga-kanban-sprints-${selectedClass}`, JSON.stringify(updatedSprints));
    }
  };

  const syncTasks = (updatedTasks: JiraTask[]) => {
    setTasks(updatedTasks);
    if (selectedClass) {
      localStorage.setItem(`saga-kanban-tasks-${selectedClass}`, JSON.stringify(updatedTasks));
    }
  };

  const handleOpenSprintModal = (sprint: JiraSprint | null = null) => {
    if (sprint) {
      setEditingSprint(sprint);
      setSprintName(sprint.name);
      setSprintStart(sprint.startDate);
      setSprintEnd(sprint.endDate);
    } else {
      setEditingSprint(null);
      setSprintName(`Sprint ${sprints.length + 1}`);
      setSprintStart(new Date().toISOString().substring(0, 10));
      setSprintEnd(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    }
    setIsSprintModalOpen(true);
  };

  const handleSaveSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintName.trim()) return;

    if (editingSprint) {
      const updated = sprints.map(s => s.id === editingSprint.id ? { ...s, name: sprintName, startDate: sprintStart, endDate: sprintEnd } : s);
      syncSprints(updated);
      toast.success("Đã cập nhật thông tin Sprint!");
    } else {
      const newSprint: JiraSprint = {
        id: `sprint-${Date.now()}`,
        name: sprintName,
        startDate: sprintStart,
        endDate: sprintEnd,
        isActive: false
      };
      syncSprints([...sprints, newSprint]);
      setCurrentSprintId(newSprint.id);
      toast.success("Tạo mới Sprint thành công!");
    }
    setIsSprintModalOpen(false);
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (sprints.length <= 1) {
      toast.error("Phải có ít nhất một Sprint hoạt động!");
      return;
    }
    const updated = sprints.filter(s => s.id !== sprintId);
    syncSprints(updated);
    const filteredTasks = tasks.filter(t => t.sprintId !== sprintId);
    syncTasks(filteredTasks);

    if (currentSprintId === sprintId) {
      setCurrentSprintId(updated[0].id);
    }
    toast.info("Đã xóa Sprint và các task liên quan.");
  };

  const handleOpenTaskModal = (task: JiraTask | null = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskAssignee(task.assignee);
      setTaskSP(task.storyPoints);
      setTaskPriority(task.priority);
      setTaskStatus(task.status);
    } else {
      setEditingTask(null);
      setTaskTitle("");
      setTaskAssignee(TEAM_MEMBERS[0]);
      setTaskSP(3);
      setTaskPriority("medium");
      setTaskStatus("todo");
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentSprintId) {
      toast.error("Vui lòng nhập tiêu đề task!");
      return;
    }

    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title: taskTitle,
        assignee: taskAssignee,
        storyPoints: Number(taskSP),
        priority: taskPriority,
        status: taskStatus
      } : t);
      syncTasks(updated);
      toast.success("Đã cập nhật thông tin Task!");
    } else {
      const lastTask = tasks[tasks.length - 1];
      const nextNum = lastTask ? Number(lastTask.key.split("-")[1]) + 1 : 101;
      const newTask: JiraTask = {
        id: `task-${Date.now()}`,
        key: `SAGA-${nextNum}`,
        title: taskTitle,
        assignee: taskAssignee,
        storyPoints: Number(taskSP),
        priority: taskPriority,
        status: taskStatus,
        sprintId: currentSprintId
      };
      syncTasks([...tasks, newTask]);
      toast.success("Thêm Task mới vào Sprint thành công!");
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    syncTasks(updated);
    toast.info("Đã xóa Task thành công.");
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: JiraTask["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const updated = tasks.map(t => t.id === taskId ? { ...t, status: targetStatus } : t);
    syncTasks(updated);
    toast.success(`Đã chuyển trạng thái Task sang ${targetStatus.toUpperCase()}`);
  };

  const moveTaskColumn = (taskId: string, direction: "left" | "right") => {
    const columns: JiraTask["status"][] = ["todo", "inprogress", "inreview", "done"];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = columns.indexOf(task.status);
    let targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex >= 0 && targetIndex < columns.length) {
      const updated = tasks.map(t => t.id === taskId ? { ...t, status: columns[targetIndex] } : t);
      syncTasks(updated);
    }
  };

  const sprintTasks = tasks.filter(t => t.sprintId === currentSprintId);
  const activeGroup = getStudentGroup(selectedClass);

  const statusConfig: Record<JiraTask["status"], {
    title: string;
    bgClass: string;
    borderClass: string;
    accentClass: string;
    glowBg: string;
    dotBg: string;
    headerGradient: string;
  }> = {
    todo: {
      title: "Cần làm (To Do)",
      bgClass: "bg-sky-50/40 dark:bg-sky-950/25",
      borderClass: "border-sky-500/30 dark:border-sky-500/20 focus-within:border-sky-500/40",
      accentClass: "text-sky-500 dark:text-sky-400",
      glowBg: "bg-gradient-to-b from-sky-500/10 via-transparent to-transparent",
      dotBg: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]",
      headerGradient: "from-sky-500/10 to-transparent",
    },
    inprogress: {
      title: "Đang làm (In Progress)",
      bgClass: "bg-amber-50/40 dark:bg-amber-950/25",
      borderClass: "border-amber-500/30 dark:border-amber-500/20 focus-within:border-amber-500/40",
      accentClass: "text-amber-500 dark:text-amber-400",
      glowBg: "bg-gradient-to-b from-amber-500/10 via-transparent to-transparent",
      dotBg: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
      headerGradient: "from-amber-500/10 to-transparent",
    },
    inreview: {
      title: "Đang duyệt (In Review)",
      bgClass: "bg-indigo-50/40 dark:bg-indigo-950/25",
      borderClass: "border-indigo-500/30 dark:border-indigo-500/20 focus-within:border-indigo-500/40",
      accentClass: "text-indigo-500 dark:text-indigo-400",
      glowBg: "bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent",
      dotBg: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]",
      headerGradient: "from-indigo-500/10 to-transparent",
    },
    done: {
      title: "Hoàn thành (Done)",
      bgClass: "bg-emerald-50/40 dark:bg-emerald-950/25",
      borderClass: "border-emerald-500/30 dark:border-emerald-500/20 focus-within:border-emerald-500/40",
      accentClass: "text-emerald-500 dark:text-emerald-400",
      glowBg: "bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent",
      dotBg: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
      headerGradient: "from-emerald-500/10 to-transparent",
    },
  };

  const getConicGradientColor = (priority: string) => {
    if (priority === "high") return "bg-[conic-gradient(from_0deg,transparent_35%,#f43f5e_50%,transparent_65%)]";
    if (priority === "medium") return "bg-[conic-gradient(from_0deg,transparent_35%,#f59e0b_50%,transparent_65%)]";
    return "bg-[conic-gradient(from_0deg,transparent_35%,#0ea5e9_50%,transparent_65%)]";
  };

  const getLeftBorderColor = (priority: string) => {
    if (priority === "high") return "border-l-rose-500";
    if (priority === "medium") return "border-l-amber-500";
    return "border-l-sky-500";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (priority === "medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-sky-50/10 text-sky-500 border-sky-500/20";
  };

  const renderColumn = (status: JiraTask["status"]) => {
    const config = statusConfig[status];
    const columnTasks = sprintTasks.filter(t => t.status === status);
    
    return (
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, status)}
        className={`flex-1 flex flex-col min-w-[280px] ${config.bgClass} border ${config.borderClass} backdrop-blur-3xl rounded-3xl p-4 space-y-4 shadow-sm min-h-[550px] relative overflow-hidden transition-all duration-300 hover:shadow-md`}
      >
        {/* Glow Background Header */}
        <div className={`absolute top-0 inset-x-0 h-28 ${config.glowBg} pointer-events-none`} />

        <div className="flex justify-between items-center px-1 border-b border-border/40 pb-2.5 relative z-10">
          <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${config.dotBg}`} />
            <span className={config.accentClass}>{config.title}</span>
          </h4>
          <span className="text-[10px] font-black text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {columnTasks.length}
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 relative z-10">
          {columnTasks.map(task => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="relative p-[1.5px] overflow-hidden rounded-2xl group/card transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-grab active:cursor-grabbing"
            >
              {/* Rotating Gradient Running Border on Hover */}
              <div className="absolute inset-[-500%] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div className={`w-full h-full ${getConicGradientColor(task.priority)} animate-border-rotate`} />
              </div>

              {/* Card Inner Content */}
              <div className={`relative bg-card/90 dark:bg-zinc-950 border-y border-r border-border/60 border-l-[5px] ${getLeftBorderColor(task.priority)} rounded-[15px] p-4 space-y-3.5 w-full h-full z-10`}>
                {/* Card top details */}
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted/50 px-2 py-0.5 rounded border border-border/40">
                    {task.key}
                  </span>
                  
                  {/* Micro Actions Menu */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenTaskModal(task)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Sửa Task"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Xóa Task"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Task Title */}
                <p className="text-xs font-bold text-foreground leading-relaxed line-clamp-2">
                  {task.title}
                </p>

                {/* Card Footer details */}
                <div className="flex justify-between items-center pt-3 border-t border-border/40 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User size={12} className="text-muted-foreground shrink-0" />
                    <span className="text-[10px] font-bold text-muted-foreground truncate">{task.assignee}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Priority indicator */}
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    {/* Story Points */}
                    <span className="text-[10px] font-black text-primary-foreground bg-primary rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {task.storyPoints}
                    </span>
                  </div>
                </div>

                {/* Mobile Quick Column Shifters */}
                <div className="absolute right-2 top-2 flex gap-1 lg:hidden">
                  {task.status !== "todo" && (
                    <button 
                      onClick={() => moveTaskColumn(task.id, "left")}
                      className="p-1 bg-background border border-border/60 hover:border-primary rounded-full text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      <ChevronLeft size={10} />
                    </button>
                  )}
                  {task.status !== "done" && (
                    <button 
                      onClick={() => moveTaskColumn(task.id, "right")}
                      className="p-1 bg-background border border-border/60 hover:border-primary rounded-full text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/60 border-2 border-dashed border-border/30 rounded-2xl min-h-[160px]">
              <ClipboardList size={24} className="opacity-30 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cột trống</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-border-rotate {
          animation: border-rotate 4s linear infinite;
        }
      `}} />
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <PageHeader
            title="Bảng Kanban Tasks (Jira)"
            description={`Theo dõi và quản lý các Tasks công việc của ${activeGroup} (Lớp ${getClassName(selectedClass)})`}
          />

          {isLoading ? (
            <div className="flex gap-2">
              <Skeleton className="w-[180px] h-10 rounded-xl bg-muted" />
              <Skeleton className="w-[120px] h-10 rounded-xl bg-muted" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Sprint Select Filter */}
              <div className="flex items-center gap-2">
                <Select value={currentSprintId} onValueChange={setCurrentSprintId}>
                  <SelectTrigger className="w-[220px] h-10 bg-card/45 backdrop-blur-md border-border/50 rounded-xl font-bold text-xs focus:ring-primary/20">
                    <div className="flex items-center gap-2 truncate">
                      <Calendar size={14} className="text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Chọn Sprint" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50 rounded-xl">
                    {sprints.map(s => (
                      <SelectItem key={s.id} value={s.id} className="text-xs font-semibold">
                        {s.name} {s.isActive ? "— Active" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Edit active sprint details */}
                {currentSprintId && (
                  <button 
                    onClick={() => {
                      const sprint = sprints.find(s => s.id === currentSprintId);
                      if (sprint) handleOpenSprintModal(sprint);
                    }}
                    className="p-2.5 bg-card/45 hover:bg-muted/40 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Cấu hình Sprint"
                  >
                    <Settings size={15} />
                  </button>
                )}
              </div>

              {/* Sprint Add Button */}
              <Button 
                onClick={() => handleOpenSprintModal(null)}
                className="h-10 rounded-xl font-bold text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 dark:border-indigo-500/20 hover:border-indigo-500/50 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] cursor-pointer"
              >
                <Plus size={14} className="mr-1.5" />
                Sprint mới
              </Button>

              {/* Task Add Button */}
              <Button 
                onClick={() => handleOpenTaskModal(null)}
                className="h-10 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-orange-500 via-primary to-amber-500 text-white hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.45)] cursor-pointer"
              >
                <Plus size={14} className="mr-1.5" />
                Tạo Task mới
              </Button>

            </div>
          )}
        </div>

        {/* Sprint deletion button */}
        {!isLoading && currentSprintId && (
          <div className="flex justify-end pr-1 text-xs">
            <button 
              onClick={() => handleDeleteSprint(currentSprintId)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive font-bold transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Xóa Sprint hiện tại</span>
            </button>
          </div>
        )}

        {/* Board Columns Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-3xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {renderColumn("todo")}
            {renderColumn("inprogress")}
            {renderColumn("inreview")}
            {renderColumn("done")}
          </div>
        )}

        {/* SPRINT FORM MODAL */}
        {isSprintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-sm space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">
                {editingSprint ? "Sửa Sprint" : "Tạo Sprint mới"}
              </h3>

              <form onSubmit={handleSaveSprint} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sprint-name" className="text-[10px] font-bold text-muted-foreground uppercase">Tên Sprint</Label>
                  <Input 
                    id="sprint-name"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    placeholder="Ví dụ: Sprint 4"
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sprint-start" className="text-[10px] font-bold text-muted-foreground uppercase">Ngày bắt đầu</Label>
                    <Input 
                      id="sprint-start"
                      type="date"
                      value={sprintStart}
                      onChange={(e) => setSprintStart(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sprint-end" className="text-[10px] font-bold text-muted-foreground uppercase">Ngày kết thúc</Label>
                    <Input 
                      id="sprint-end"
                      type="date"
                      value={sprintEnd}
                      onChange={(e) => setSprintEnd(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3.5 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsSprintModalOpen(false)}
                    className="flex-1 h-10 rounded-xl"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    Lưu lại
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TASK FORM MODAL */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-sm space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">
                {editingTask ? "Cập nhật Task" : "Tạo Task mới"}
              </h3>

              <form onSubmit={handleSaveTask} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="task-title" className="text-[10px] font-bold text-muted-foreground uppercase">Tiêu đề công việc</Label>
                  <Input 
                    id="task-title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Nhập nội dung công việc..."
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="task-assignee" className="text-[10px] font-bold text-muted-foreground uppercase">Người thực hiện</Label>
                  <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                    <SelectTrigger className="h-10 bg-background border-border rounded-xl">
                      <SelectValue placeholder="Chọn người thực hiện" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {TEAM_MEMBERS.map(member => (
                        <SelectItem key={member} value={member} className="text-xs font-semibold">
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="task-sp" className="text-[10px] font-bold text-muted-foreground uppercase">Story Points (SP)</Label>
                    <Select value={taskSP.toString()} onValueChange={(val) => setTaskSP(Number(val))}>
                      <SelectTrigger className="h-10 bg-background border-border rounded-xl">
                        <SelectValue placeholder="SP" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {[1, 2, 3, 5, 8, 13].map(points => (
                          <SelectItem key={points} value={points.toString()} className="text-xs font-semibold">
                            {points} SP
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="task-priority" className="text-[10px] font-bold text-muted-foreground uppercase">Độ ưu tiên</Label>
                    <Select value={taskPriority} onValueChange={(val: any) => setTaskPriority(val)}>
                      <SelectTrigger className="h-10 bg-background border-border rounded-xl">
                        <SelectValue placeholder="Độ ưu tiên" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="high" className="text-xs font-semibold text-rose-500">Cao (High)</SelectItem>
                        <SelectItem value="medium" className="text-xs font-semibold text-amber-500">Vừa (Medium)</SelectItem>
                        <SelectItem value="low" className="text-xs font-semibold text-sky-500">Thấp (Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="task-status" className="text-[10px] font-bold text-muted-foreground uppercase">Cột trạng thái</Label>
                  <Select value={taskStatus} onValueChange={(val: any) => setTaskStatus(val)}>
                    <SelectTrigger className="h-10 bg-background border-border rounded-xl">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="todo" className="text-xs font-semibold">Cần làm</SelectItem>
                      <SelectItem value="inprogress" className="text-xs font-semibold">Đang làm</SelectItem>
                      <SelectItem value="inreview" className="text-xs font-semibold">Đang duyệt</SelectItem>
                      <SelectItem value="done" className="text-xs font-semibold">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3.5 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="flex-1 h-10 rounded-xl"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    Lưu lại
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
