"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, User, Award, AlertCircle, Flag, CheckSquare, BarChart3, Calendar } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";


interface StudentSprintTasksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sprintId: string;
  sprintName: string;
  sprintGoal: string | null;
}

export function StudentSprintTasksPanel({
  isOpen,
  onClose,
  projectId,
  sprintId,
  sprintName,
  sprintGoal,
}: StudentSprintTasksPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: tasksData, isLoading, error } = useProjectTasks(projectId, {
    sprintId,
    keyword: keyword.trim() || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    size: 100,
  });

  const tasks = tasksData?.content || [];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: JiraTask) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t: JiraTask) => t.status === "IN_PROGRESS").length;
  const todoTasks = tasks.filter((t: JiraTask) => t.status === "TODO").length;
  const totalStoryPoints = tasks.reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || 0), 0);
  const completedStoryPoints = tasks
    .filter((t: JiraTask) => t.status === "DONE")
    .reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || 0), 0);

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const spCompletionRate = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 rounded-full font-bold text-[10px]">Hoàn thành</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 rounded-full font-bold text-[10px]">Đang làm</Badge>;
      case "IN_REVIEW":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/10 rounded-full font-bold text-[10px]">Đang đánh giá</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-muted-foreground/10 hover:bg-muted rounded-full font-bold text-[10px]">Cần làm</Badge>;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
      case "HIGHEST":
        return "text-destructive font-bold";
      case "MEDIUM":
        return "text-amber-500 font-bold";
      default:
        return "text-muted-foreground font-medium";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "BUG":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-extrabold uppercase rounded-lg px-2">Bug</Badge>;
      case "STORY":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-extrabold uppercase rounded-lg px-2">Story</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-extrabold uppercase rounded-lg px-2">Task</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="!max-w-none rounded-[2rem] p-0 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ width: "min(90vw, 1100px)" }}
      >
        {/* Modal Header */}
        <DialogHeader className="p-6 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 rounded-full px-3 py-1 font-bold text-xs shrink-0">
              Sprint
            </Badge>
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              {sprintName}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
            {sprintGoal ? (
              <span className="italic flex items-center gap-1.5">
                <Flag size={12} className="text-primary shrink-0" />
                &quot;{sprintGoal}&quot;
              </span>

            ) : (
              <span className="text-muted-foreground/60">Không có mục tiêu nào được thiết lập.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Body: Two-column layout */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

          {/* LEFT COLUMN: Stats + Filter */}
          <div className="md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border/30 flex flex-col">
            {/* Stats */}
            <div className="p-5 space-y-5 border-b border-border/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <BarChart3 size={12} />
                Tổng quan Sprint
              </p>

              {/* Task count cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/30 rounded-2xl p-3 text-center border border-border/20">
                  <p className="text-xl font-black text-foreground">{todoTasks}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/70 mt-0.5">To Do</p>
                </div>
                <div className="bg-amber-500/5 rounded-2xl p-3 text-center border border-amber-500/10">
                  <p className="text-xl font-black text-amber-500">{inProgressTasks}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/70 mt-0.5">Đang làm</p>
                </div>
                <div className="bg-emerald-500/5 rounded-2xl p-3 text-center border border-emerald-500/10">
                  <p className="text-xl font-black text-emerald-500">{completedTasks}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/70 mt-0.5">Xong</p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <CheckSquare size={10} />
                      Tiến độ Task
                    </span>
                    <span className="font-extrabold text-foreground text-[11px]">{taskCompletionRate}%</span>
                  </div>
                  <Progress value={taskCompletionRate} className="h-2 rounded-full" />
                  <p className="text-[10px] text-muted-foreground/60 text-right">{completedTasks}/{totalTasks} Tasks</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Story Points</span>
                    <span className="font-extrabold text-foreground text-[11px]">{spCompletionRate}%</span>
                  </div>
                  <Progress value={spCompletionRate} className="h-2 rounded-full" />
                  <p className="text-[10px] text-muted-foreground/60 text-right">{completedStoryPoints}/{totalStoryPoints} SP</p>
                </div>
              </div>
            </div>

            {/* Status filter tabs */}
            <div className="p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Lọc theo trạng thái</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { val: "ALL", label: "Tất cả", count: totalTasks },
                  { val: "TODO", label: "Cần làm", count: todoTasks },
                  { val: "IN_PROGRESS", label: "Đang làm", count: inProgressTasks },
                  { val: "IN_REVIEW", label: "Đang đánh giá", count: tasks.filter((t: JiraTask) => t.status === "IN_REVIEW").length },
                  { val: "DONE", label: "Hoàn thành", count: completedTasks },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => setStatusFilter(tab.val)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer flex items-center justify-between ${
                      statusFilter === tab.val
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-muted/20 text-muted-foreground border-border/30 hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${statusFilter === tab.val ? "bg-white/20" : "bg-muted/50"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Search + Task List */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Search bar */}
            <div className="p-5 border-b border-border/30 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm theo mã Task hoặc tiêu đề..."
                  className="pl-10 rounded-xl bg-muted/30 border-border/40"
                />
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đang tải danh sách công việc...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm font-bold">Đã xảy ra lỗi khi tải dữ liệu công việc.</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
                  <Award className="mx-auto h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-semibold">Không tìm thấy công việc nào.</p>
                </div>
              ) : (
                tasks.map((task: JiraTask) => {
                  const dueDateInfo = getTaskDueDateInfo(task.dueDate, task.status);
                  return (
                    <div
                      key={task.id}
                      className={`group p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden ${
                        dueDateInfo?.cardBorderStyle ? dueDateInfo.cardBorderStyle : 'bg-muted/10 border-border/40 hover:border-primary/20 hover:bg-muted/20 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {getTypeBadge(task.type)}
                            <span className="text-[11px] font-black text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
                              {task.externalKey}
                            </span>
                            {dueDateInfo && (
                              <Badge variant="outline" className={`rounded-xl text-[10px] py-0.5 px-2 flex items-center gap-1 border ${dueDateInfo.badgeStyle}`}>
                                <Calendar size={11} className={dueDateInfo.iconColorStyle} />
                                <span>{dueDateInfo.badgeLabel}</span>
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                        </div>
                        {task.storyPoint > 0 && (
                          <Badge variant="secondary" className="rounded-xl font-bold bg-primary/5 text-primary border-primary/10 shrink-0 px-2.5 py-1">
                            {task.storyPoint} SP
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/20 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {task.assignee?.fullName ? (() => {
                              const words = task.assignee.fullName.trim().split(/\s+/);
                              const first = words[0]?.[0] ?? "";
                              const last = words.length > 1 ? words[words.length - 1]?.[0] ?? "" : "";
                              return (first + last).toUpperCase();
                            })() : <User size={10} />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">
                              {task.assignee?.fullName || "Chưa giao việc"}
                            </p>
                            {task.assignee?.studentCode && (
                              <p className="text-[9px] font-bold text-muted-foreground/60 tracking-wider">
                                {task.assignee.studentCode}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wide">
                            Ưu tiên: <span className={getPriorityStyle(task.priority)}>{task.priority}</span>
                          </span>
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                    </div>
                  );
                })

              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
