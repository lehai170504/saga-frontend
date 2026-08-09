"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, User, Award, AlertCircle } from "lucide-react";
import { JiraTask } from "@/features/projects/types";

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
    size: 100, // Load up to 100 tasks
  });

  const tasks = tasksData?.content || [];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: JiraTask) => t.status === "DONE").length;
  const totalStoryPoints = tasks.reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || 0), 0);
  const completedStoryPoints = tasks
    .filter((t: JiraTask) => t.status === "DONE")
    .reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || 0), 0);

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const spCompletionRate = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 rounded-full font-bold">Hoàn thành</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 rounded-full font-bold">Đang làm</Badge>;
      case "IN_REVIEW":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/10 rounded-full font-bold">Review</Badge>;
      case "CANCELLED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10 rounded-full font-bold">Hủy bỏ</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-muted-foreground/10 hover:bg-muted rounded-full font-bold">To Do</Badge>;
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-[540px] w-full p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader className="p-6 border-b border-border/40 space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 rounded-full px-3 py-1 font-bold text-xs">
              Sprint
            </Badge>
            <SheetTitle className="text-xl font-black tracking-tight text-foreground">
              {sprintName}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground leading-relaxed">
            {sprintGoal ? (
              <span className="italic">“{sprintGoal}”</span>
            ) : (
              <span className="text-muted-foreground/60">Không có mục tiêu nào được thiết lập.</span>
            )}
          </SheetDescription>
        </SheetHeader>

        {/* Task Stats Block */}
        <div className="px-6 py-4 bg-muted/20 border-b border-border/30 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Tiến độ công việc</span>
              <span className="font-extrabold text-foreground">{completedTasks}/{totalTasks} Tasks ({taskCompletionRate}%)</span>
            </div>
            <Progress value={taskCompletionRate} className="h-2 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Story Points tích lũy</span>
              <span className="font-extrabold text-foreground">{completedStoryPoints}/{totalStoryPoints} SP ({spCompletionRate}%)</span>
            </div>
            <Progress value={spCompletionRate} className="h-2 rounded-full" />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-border/30 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm theo mã Task hoặc tiêu đề..."
              className="pl-10 rounded-xl bg-muted/30 border-border/40"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { val: "ALL", label: "Tất cả" },
              { val: "TODO", label: "To Do" },
              { val: "IN_PROGRESS", label: "Đang làm" },
              { val: "IN_REVIEW", label: "Review" },
              { val: "DONE", label: "Xong" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                  statusFilter === tab.val
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
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
            tasks.map((task: JiraTask) => (
              <div
                key={task.id}
                className="group p-4 bg-muted/10 border border-border/40 rounded-2xl hover:border-primary/20 hover:bg-muted/20 hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(task.type)}
                      <span className="text-[11px] font-black text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
                        {task.externalKey}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
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
                      {task.assignee?.fullName ? task.assignee.fullName.split(" ").pop()?.substring(0, 2).toUpperCase() : <User size={10} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate max-w-[120px]">
                        {task.assignee?.fullName || "Chưa giao việc"}
                      </p>
                      {task.assignee?.studentCode && (
                        <p className="text-[9px] font-bold text-muted-foreground/60 tracking-wider">
                          {task.assignee.studentCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Ưu tiên: <span className={getPriorityStyle(task.priority)}>{task.priority}</span>
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
