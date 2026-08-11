"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Calendar, Users, Flag, Clock, ArrowRight, ShieldAlert, FolderKanban, Loader2, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useProjectSprints, useCreateSprint, useStartSprint, useCloseSprint, useUpdateSprint, useDeleteSprint } from "@/features/projects/hooks/useTeamSprints";
import { StudentSprintTasksPanel } from "./student-sprint-tasks-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StudentTimelineViewProps {
  courseId?: string;
}

export function StudentTimelineView({ courseId }: StudentTimelineViewProps) {
  const [mounted, setMounted] = useState(false);

  // Create sprint modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [startingSprintId, setStartingSprintId] = useState<string | null>(null);
  const [closingSprintId, setClosingSprintId] = useState<string | null>(null);

  // Edit sprint modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSprintId, setEditSprintId] = useState("");
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editIdempotencyKey, setEditIdempotencyKey] = useState("");

  // Delete sprint modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState<typeof sprints[0] | null>(null);
  const [deleteIdempotencyKey, setDeleteIdempotencyKey] = useState("");

  // Tasks list side sheet states
  const [selectedSprintForTasks, setSelectedSprintForTasks] = useState<typeof sprints[0] | null>(null);
  const [isTasksOpen, setIsTasksOpen] = useState(false);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const projectId = myTeamData?.project?.id || "";
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const createSprintMutation = useCreateSprint(projectId);
  const startSprintMutation = useStartSprint(projectId);
  const closeSprintMutation = useCloseSprint(projectId);
  const updateSprintMutation = useUpdateSprint(projectId);
  const deleteSprintMutation = useDeleteSprint(projectId);

  const isLoading = isLoadingTeam || isLoadingCourse || (!!projectId && isLoadingSprints);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isCreateOpen) {
      const timer = setTimeout(() => setIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isCreateOpen]);

  useEffect(() => {
    if (isEditOpen) {
      const timer = setTimeout(() => setEditIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isEditOpen]);

  useEffect(() => {
    if (isDeleteOpen) {
      const timer = setTimeout(() => setDeleteIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isDeleteOpen]);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const sprints = sprintsData?.sprints || [];

  // Sort sprints chronologically by startDate
  const sortedSprints = [...sprints].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const getSprintStatus = (sprint: typeof sprints[0]) => {
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
  };

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      toast.error("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
      return;
    }

    createSprintMutation.mutate(
      {
        name: name.trim(),
        goal: goal.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        idempotencyKey
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setName("");
          setGoal("");
          setStartDate("");
          setEndDate("");
        }
      }
    );
  };

  const handleStartSprint = (sprintId: string) => {
    setStartingSprintId(sprintId);
    const key = crypto.randomUUID();
    startSprintMutation.mutate(
      { sprintId, idempotencyKey: key },
      {
        onSettled: () => setStartingSprintId(null)
      }
    );
  };

  const handleCloseSprint = (sprintId: string) => {
    setClosingSprintId(sprintId);
    const key = crypto.randomUUID();
    closeSprintMutation.mutate(
      { sprintId, idempotencyKey: key },
      {
        onSettled: () => setClosingSprintId(null)
      }
    );
  };

  const handleOpenEdit = (sprint: typeof sprints[0]) => {
    setEditSprintId(sprint.sprintId);
    setEditName(sprint.sprintName);
    setEditGoal(sprint.goal || "");

    const formatForInput = (dateStr: string | null) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setEditStartDate(formatForInput(sprint.startDate));
    setEditEndDate(formatForInput(sprint.endDate));
    setIsEditOpen(true);
  };

  const handleUpdateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    if (editStartDate && editEndDate && new Date(editEndDate) <= new Date(editStartDate)) {
      toast.error("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
      return;
    }

    updateSprintMutation.mutate(
      {
        sprintId: editSprintId,
        name: editName.trim(),
        goal: editGoal.trim(),
        startDate: editStartDate ? new Date(editStartDate).toISOString() : null,
        endDate: editEndDate ? new Date(editEndDate).toISOString() : null,
        idempotencyKey: editIdempotencyKey
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditName("");
          setEditGoal("");
          setEditStartDate("");
          setEditEndDate("");
          setEditSprintId("");
        }
      }
    );
  };

  const handleDeleteSprint = () => {
    if (!sprintToDelete) return;
    deleteSprintMutation.mutate(
      {
        sprintId: sprintToDelete.sprintId,
        idempotencyKey: deleteIdempotencyKey
      },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSprintToDelete(null);
        }
      }
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-600">

        <PageHeader
          title="Timeline Tiến Độ"
          description={
            courseData
              ? `Theo dõi toàn bộ lộ trình các Sprints dự án cho Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        >
          {!isLoading && myTeamData?.roleInTeam === "LEADER" && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg h-11 px-5 cursor-pointer transition-all"
            >
              + Tạo Sprint
            </Button>
          )}
        </PageHeader>

        {!isLoading && myTeamData && (
          /* Hero Card for Group Info */
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
                  Nhóm của bạn
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {myTeamData.teamName}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium mt-1">
                  <FolderKanban size={14} className="text-primary" />
                  Dự án: <span className="font-bold text-foreground">{myTeamData.project?.name || "Chưa có đề tài"}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-8 pl-10 relative border-l-2 border-muted/30 ml-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[51px] top-1.5 w-6 h-6 rounded-full bg-muted animate-pulse" />
                <Skeleton className="h-32 w-full rounded-3xl bg-muted/40" />
              </div>
            ))}
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : !projectId ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <ShieldAlert size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
            <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa liên kết dự án nào để xem Timeline.</p>
          </div>
        ) : sortedSprints.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
            <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h4 className="text-lg font-bold text-foreground">Không có Sprint nào</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Không tìm thấy Sprint nào được đồng bộ cho dự án này. Vui lòng kiểm tra lại cấu hình trên Jira.
            </p>
          </div>
        ) : (
          <div className="relative pl-8 md:pl-12 border-l border-border/70 ml-4 md:ml-6 py-4 space-y-12">
            {/* Ambient Line highlight */}
            <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-primary via-blue-500 to-emerald-500 pointer-events-none opacity-60" />

            {sortedSprints.map((sprint) => {
              const status = getSprintStatus(sprint);
              const hasDates = sprint.startDate && sprint.endDate;

              return (
                <div key={sprint.sprintId} className="relative group transition-all duration-300">

                  {/* Timeline Bullet Node */}
                  <div className={`absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-4 border-background transition-transform duration-300 group-hover:scale-125 z-10 flex items-center justify-center ${status.timelineNodeStyle
                    }`}>
                    {status.label === "Đã hoàn thành" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    )}
                  </div>

                  {/* Timeline Card */}
                  <Card
                    onClick={() => {
                      setSelectedSprintForTasks(sprint);
                      setIsTasksOpen(true);
                    }}
                    className={`rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.99] hover:border-primary/40 cursor-pointer ${status.cardStyle}`}
                  >
                    <CardContent className="p-6 md:p-8 space-y-6">

                      {/* Card Header with Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                        <h3 className="text-xl font-bold text-foreground">
                          {sprint.sprintName}
                        </h3>
                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          <Badge variant="outline" className={`${status.style} rounded-full font-bold px-4 py-1.5 text-xs`}>
                            {status.label}
                          </Badge>
                          {status.label === "Sắp tới" && myTeamData?.roleInTeam === "LEADER" && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartSprint(sprint.sprintId);
                              }}
                              disabled={startSprintMutation.isPending || closeSprintMutation.isPending}
                              size="sm"
                              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg h-8 px-4 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              {startingSprintId === sprint.sprintId ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  Đang bắt đầu...
                                </>
                              ) : (
                                "Bắt đầu"
                              )}
                            </Button>
                          )}
                          {(status.label === "Đang hoạt động" || status.label === "Sắp kết thúc" || status.label === "Quá hạn") && myTeamData?.roleInTeam === "LEADER" && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseSprint(sprint.sprintId);
                              }}
                              disabled={startSprintMutation.isPending || closeSprintMutation.isPending}
                              size="sm"
                              className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white shadow-md hover:shadow-lg h-8 px-4 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              {closingSprintId === sprint.sprintId ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  Đang đóng...
                                </>
                              ) : (
                                "Đóng Sprint"
                              )}
                            </Button>
                          )}
                          {status.label !== "Đã hoàn thành" && myTeamData?.roleInTeam === "LEADER" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center transition-all"
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[120px] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <DropdownMenuItem
                                  onClick={() => handleOpenEdit(sprint)}
                                  className="rounded-xl px-3 py-2 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                                >
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSprintToDelete(sprint);
                                    setIsDeleteOpen(true);
                                  }}
                                  className="rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                                >
                                  Xóa Sprint
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Running Dates */}
                        <div className="flex items-start gap-3.5">
                          <div className="p-3 bg-muted/50 text-muted-foreground rounded-2xl shrink-0 border border-border/10">
                            <Clock size={16} />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                              Thời gian hoạt động
                            </p>
                            <p className={`text-sm ${status.dateStyle}`}>
                              {hasDates ? (
                                <>
                                  {new Date(sprint.startDate!).toLocaleDateString("vi-VN")}
                                  <ArrowRight size={12} className="inline-block mx-2 text-muted-foreground" />
                                  {new Date(sprint.endDate!).toLocaleDateString("vi-VN")}
                                </>
                              ) : (
                                <span className="text-muted-foreground/75 italic font-medium">Chưa thiết lập</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Sprint Goal */}
                        <div className="flex items-start gap-3.5">
                          <div className="p-3 bg-muted/50 text-muted-foreground rounded-2xl shrink-0 border border-border/10">
                            <Flag size={16} />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                              Mục tiêu Sprint
                            </p>
                            <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
                              {sprint.goal || (
                                <span className="text-muted-foreground/75 italic">Không có mục tiêu nào được thiết lập</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Sprint Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground">Tạo Sprint mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tạo Sprint và đồng bộ trực tiếp với dự án Jira của nhóm.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSprint} className="space-y-5 pt-4">
            {/* Sprint Name */}
            <div className="space-y-1.5">
              <Label htmlFor="sprint-name" className="text-sm font-bold text-foreground">
                Tên Sprint <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sprint-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Sprint 1"
                className="rounded-xl border-border/50 bg-background/80 h-11"
              />
            </div>

            {/* Sprint Goal */}
            <div className="space-y-1.5">
              <Label htmlFor="sprint-goal" className="text-sm font-bold text-foreground">
                Mục tiêu Sprint
              </Label>
              <Textarea
                id="sprint-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Mô tả mục tiêu của Sprint này..."
                className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[80px]"
              />
            </div>

            {/* Dates Container */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start-date" className="text-sm font-bold text-foreground">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end-date" className="text-sm font-bold text-foreground">
                  Ngày kết thúc
                </Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
                />
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-11 px-5"
                onClick={() => setIsCreateOpen(false)}
                disabled={createSprintMutation.isPending}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
                disabled={createSprintMutation.isPending}
              >
                {createSprintMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo Sprint"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Sprint Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground">Chỉnh sửa Sprint</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cấu hình thông tin Sprint và đồng bộ trực tiếp với dự án Jira của nhóm.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSprint} className="space-y-5 pt-4">
            {/* Sprint Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-sprint-name" className="text-sm font-bold text-foreground">
                Tên Sprint <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-sprint-name"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ví dụ: Sprint 1"
                className="rounded-xl border-border/50 bg-background/80 h-11"
              />
            </div>

            {/* Sprint Goal */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-sprint-goal" className="text-sm font-bold text-foreground">
                Mục tiêu Sprint
              </Label>
              <Textarea
                id="edit-sprint-goal"
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                placeholder="Mô tả mục tiêu của Sprint này..."
                className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[80px]"
              />
            </div>

            {/* Dates Container */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-start-date" className="text-sm font-bold text-foreground">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="edit-start-date"
                  type="datetime-local"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-end-date" className="text-sm font-bold text-foreground">
                  Ngày kết thúc
                </Label>
                <Input
                  id="edit-end-date"
                  type="datetime-local"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="rounded-xl border-border/50 bg-background/80 h-11 cursor-pointer"
                />
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-11 px-5"
                onClick={() => setIsEditOpen(false)}
                disabled={updateSprintMutation.isPending}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
                disabled={updateSprintMutation.isPending}
              >
                {updateSprintMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Sprint Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground">Xóa Sprint</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Hành động này không thể hoàn tác. Sprint sẽ bị xóa vĩnh viễn khỏi SAGA và Jira.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bạn có chắc chắn muốn xóa Sprint <strong className="text-foreground">{sprintToDelete?.sprintName}</strong> không?
            </p>

            {/* Dialog Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-11 px-5"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSprintToDelete(null);
                }}
                disabled={deleteSprintMutation.isPending}
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleDeleteSprint}
                className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
                disabled={deleteSprintMutation.isPending}
              >
                {deleteSprintMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xác nhận xóa"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedSprintForTasks && (
        <StudentSprintTasksPanel
          isOpen={isTasksOpen}
          onClose={() => {
            setIsTasksOpen(false);
            setSelectedSprintForTasks(null);
          }}
          projectId={projectId}
          sprintId={selectedSprintForTasks.sprintId}
          sprintName={selectedSprintForTasks.sprintName}
          sprintGoal={selectedSprintForTasks.goal}
        />
      )}
    </div>
  );
}
