"use client";

import React, { useState } from "react";
import { useProjectTasks } from "@/features/projects/hooks/useProjectTasks";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, User, Award, AlertCircle, CheckSquare, BarChart3, Calendar } from "lucide-react";
import { JiraTask } from "@/features/projects/types";
import { getTaskDueDateInfo } from "@/features/projects/utils/dueDateUtils";

interface TimelineSprintTasksDropdownProps {
  projectId: string;
  sprintId: string;
}

export function TimelineSprintTasksDropdown({
  projectId,
  sprintId,
}: TimelineSprintTasksDropdownProps) {
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
  const inReviewTasks = tasks.filter((t: JiraTask) => t.status === "IN_REVIEW").length;
  const totalStoryPoints = tasks.reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || t.storyPoints || 0), 0);
  const completedStoryPoints = tasks
    .filter((t: JiraTask) => t.status === "DONE")
    .reduce((sum: number, t: JiraTask) => sum + (t.storyPoint || t.storyPoints || 0), 0);

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const spCompletionRate = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
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

  const getTypeBadge = (type?: string) => {
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
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-4 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl bg-card/60 border border-border/40 overflow-hidden cursor-default text-foreground"
    >
      {/* 2-COLUMN LAYOUT identical to old modal */}
      <div className="flex flex-col lg:flex-row min-h-[380px]">
        {/* LEFT COLUMN: Stats + Filter */}
        <div className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border/30 flex flex-col bg-muted/20">
          {/* Stats */}
          <div className="p-4 space-y-4 border-b border-border/30">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
              <BarChart3 size={13} />
              Tổng quan Sprint
            </p>

            {/* Task count cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/40 rounded-xl p-2.5 text-center border border-border/20">
                <p className="text-lg font-black text-foreground">{todoTasks}</p>
                <p className="text-[9px] font-extrabold text-muted-foreground/70 mt-0.5">To Do</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-2.5 text-center border border-amber-500/20">
                <p className="text-lg font-black text-amber-500">{inProgressTasks}</p>
                <p className="text-[9px] font-extrabold text-muted-foreground/70 mt-0.5">Đang làm</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-2.5 text-center border border-emerald-500/20">
                <p className="text-lg font-black text-emerald-500">{completedTasks}</p>
                <p className="text-[9px] font-extrabold text-muted-foreground/70 mt-0.5">Xong</p>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare size={11} />
                    Tiến độ Task
                  </span>
                  <span className="font-black text-foreground text-[11px]">{taskCompletionRate}%</span>
                </div>
                <Progress value={taskCompletionRate} className="h-2 rounded-full" />
                <p className="text-[10px] font-bold text-muted-foreground/70 text-right">{completedTasks}/{totalTasks} Tasks</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Award size={11} />
                    Story Points
                  </span>
                  <span className="font-black text-foreground text-[11px]">{spCompletionRate}%</span>
                </div>
                <Progress value={spCompletionRate} className="h-2 rounded-full" />
                <p className="text-[10px] font-bold text-muted-foreground/70 text-right">{completedStoryPoints}/{totalStoryPoints} SP</p>
              </div>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="p-4 space-y-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Lọc theo trạng thái</p>
            <div className="flex flex-col gap-1.5">
              {[
                { val: "ALL", label: "Tất cả", count: totalTasks },
                { val: "TODO", label: "Cần làm", count: todoTasks },
                { val: "IN_PROGRESS", label: "Đang làm", count: inProgressTasks },
                { val: "IN_REVIEW", label: "Đang đánh giá", count: inReviewTasks },
                { val: "DONE", label: "Hoàn thành", count: completedTasks },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setStatusFilter(tab.val)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer flex items-center justify-between ${
                    statusFilter === tab.val
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-background/80 text-muted-foreground border-border/30 hover:bg-muted/40 hover:text-foreground"
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
        <div className="flex-1 flex flex-col min-h-0 bg-background/40">
          {/* Search bar */}
          <div className="p-4 border-b border-border/30 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo mã Task hoặc tiêu đề..."
                className="pl-9 h-9 text-xs rounded-xl bg-background/90 border-border/40 font-medium"
              />
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[360px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Đang tải danh sách công việc...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive bg-destructive/5 rounded-xl border border-destructive/20 p-4">
                <AlertCircle className="mx-auto h-7 w-7 mb-2" />
                <p className="text-xs font-bold">Đã xảy ra lỗi khi tải dữ liệu công việc.</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border/50 rounded-2xl p-6">
                <Award className="mx-auto h-7 w-7 mb-2 opacity-30" />
                <p className="text-xs font-extrabold">Không tìm thấy công việc nào.</p>
              </div>
            ) : (
              tasks.map((task: JiraTask) => {
                const dueDateInfo = getTaskDueDateInfo(task.dueDate, task.status);
                const keyVal = task.externalKey;
                const assigneeName = task.assignee?.fullName || task.assignee?.studentCode;

                return (
                  <div
                    key={task.id}
                    className={`group p-3.5 rounded-2xl border transition-all duration-300 flex flex-col gap-2.5 relative overflow-hidden ${
                      dueDateInfo?.cardBorderStyle ? dueDateInfo.cardBorderStyle : "bg-background/90 border-border/40 hover:border-primary/30 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {getTypeBadge(task.issueType || task.type)}
                        {keyVal && (
                          <span className="font-mono text-[10px] font-black text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md shrink-0">
                            {keyVal}
                          </span>
                        )}
                        <h4 className="font-extrabold text-xs text-foreground leading-snug group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20 text-[11px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {assigneeName ? (
                          <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-lg text-foreground">
                            <User size={11} className="text-primary" />
                            {assigneeName}
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground/60">Chưa giao</span>
                        )}
                      </div>

                      {dueDateInfo && dueDateInfo.badgeLabel && (
                        <span className={`text-[10px] font-extrabold flex items-center gap-1 px-2 py-0.5 rounded-lg border ${dueDateInfo.badgeStyle}`}>
                          <Calendar size={11} />
                          {dueDateInfo.badgeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
