"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FolderKanban, Crown, Plus, Loader2, Settings, Users, Activity, AlertTriangle, FileText, Code, Palette, AlertCircle, ChevronDown, ChevronUp, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useCreateTeamProject } from "@/features/projects/hooks/useProjects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useContributionEvaluation } from "@/features/lecturer/hooks/useContribution";

const truncateDecimal = (val: number | undefined | null, decimals: number = 2): string => {
  if (val === undefined || val === null || isNaN(val)) {
    return (0).toFixed(decimals);
  }
  const strVal = String(val);
  const parts = strVal.split('.');
  if (parts.length === 1) {
    return val.toFixed(decimals);
  }
  const integerPart = parts[0];
  const decimalPart = parts[1].substring(0, decimals).padEnd(decimals, '0');
  return `${integerPart}.${decimalPart}`;
};

interface StudentProjectsListProps {
  courseId?: string;
}

export function StudentProjectsList({ courseId }: StudentProjectsListProps) {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showScores, setShowScores] = useState(false);
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const createProjectMutation = useCreateTeamProject(activeTeamId);
  const { data: evaluationData, isLoading: isLoadingEvaluation } = useContributionEvaluation(activeTeamId, showScores);

  const isLoading = isLoadingCourse || isLoadingMyTeam;

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    createProjectMutation.mutate(
      { name: projectName },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setProjectName("");
          refetch();
        }
      }
    );
  };

  const toggleSprintExpand = (studentId: string) => {
    setExpandedSprints((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const projectId = myTeamData?.project?.id;
  const members = myTeamData?.members?.content || [];

  // Sắp xếp Trưởng nhóm lên đầu
  const sortedMembers = [...members].sort((a, b) => {
    if (a.roleInTeam === "LEADER" && b.roleInTeam !== "LEADER") return -1;
    if (a.roleInTeam !== "LEADER" && b.roleInTeam === "LEADER") return 1;
    return 0;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 ">

        {/* Header Section */}
        <PageHeader
          title="Thông tin Nhóm"
          description={
            courseData
              ? `Xem thông tin chi tiết và không gian làm việc của nhóm trong Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-[2rem] bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
            </div>
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Card for Group Info */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
                    Nhóm của bạn
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">
                    {myTeamData.teamName}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/50 inline-flex shadow-sm">
                  <FolderKanban size={18} className="text-primary" />
                  <span className="font-semibold text-sm">
                    {myTeamData.project?.name || "Chưa có đề tài"}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 relative z-10 flex flex-wrap items-center gap-3">
                {projectId ? (
                  <>
                    <Button
                      onClick={() => setShowScores(!showScores)}
                      variant={showScores ? "secondary" : "outline"}
                      className={`w-full sm:w-auto h-12 px-6 rounded-xl font-bold transition-all duration-300 ${showScores
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-border/80"
                          : "border-border/60 hover:bg-muted text-foreground bg-background"
                        }`}
                    >
                      <Activity size={18} className="mr-2 text-primary" strokeWidth={3} />
                      {showScores ? "Ẩn điểm" : "Xem điểm"}
                    </Button>

                    <Link href={`/student/${courseId}/projects/create`}>
                      <Button className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]">
                        <Settings size={18} className="mr-2" strokeWidth={3} />
                        Cấu hình Dự án
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]">
                        <Plus size={18} className="mr-2" strokeWidth={3} />
                        Khởi tạo Dự án
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">Khởi tạo Dự án mới</DialogTitle>
                        <DialogDescription className="text-sm mt-1 text-muted-foreground/80">
                          Tạo một không gian làm việc mới cho <span className="font-bold text-primary">{myTeamData.teamName}</span>. Sau khi khởi tạo, bạn có thể liên kết dự án với Jira và GitHub.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleCreateProject} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="projectName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Tên Dự án <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="projectName"
                            placeholder="Nhập tên dự án (VD: SAGA Library System)..."
                            className="rounded-xl h-12 bg-muted/30 border-border/50 focus-visible:ring-primary/30 focus-visible:bg-background font-medium transition-all"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-border/40 mt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl h-11 px-6 font-bold hover:bg-muted/50 mt-4"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            className="rounded-xl h-11 px-6 font-bold flex items-center justify-center mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            disabled={createProjectMutation.isPending}
                          >
                            {createProjectMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <FolderKanban className="h-4 w-4 mr-2" />
                            )}
                            Tạo Dự án
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
                <Users size={16} />
                Thành viên trong nhóm ({sortedMembers.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedMembers.map((member) => {
                  const isLeader = member.roleInTeam === "LEADER";
                  return (
                    <div
                      key={member.studentId}
                      className={`glass-panel rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isLeader ? 'border-primary/30 bg-primary/[0.03]' : 'hover:border-border/80'}`}
                    >
                      <Avatar className={`h-12 w-12 border-2 ${isLeader ? 'border-primary shadow-[0_0_12px_rgba(234,88,12,0.3)]' : 'border-background shadow-md'}`}>
                        <AvatarFallback className={`font-bold text-sm ${isLeader ? "bg-gradient-to-br from-primary to-orange-600 text-white" : "bg-muted text-muted-foreground"}`}>
                          {member.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold truncate text-foreground leading-tight">
                            {member.fullName}
                          </h4>
                          {isLeader && (
                            <div className="bg-primary/10 p-1 rounded-full shrink-0 animate-pulse">
                              <Crown size={12} className="fill-primary text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${isLeader ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground border-border/40'}`}>
                            {isLeader ? "Trưởng nhóm" : "Thành viên"}
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold truncate">
                            {member.studentCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contribution Evaluation Section */}
            {showScores && (
              <div className="space-y-5 pt-6 border-t border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <Activity size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-foreground">
                        Bảng điểm & % Đóng góp dự án
                      </h3>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        Điểm số và tỷ lệ đóng góp được hệ thống đánh giá tự động dựa trên hoạt động Jira, Commit và Peer Review.
                      </p>
                    </div>
                  </div>

                  {evaluationData && (
                    <Badge variant="outline" className="rounded-xl px-3 py-1 font-semibold text-xs text-muted-foreground bg-muted/20 border-border/50 shrink-0 self-start sm:self-auto flex items-center">
                      <Clock size={12} className="mr-1.5 text-muted-foreground/80" />
                      Đánh giá lúc: {new Date(evaluationData.evaluatedAt).toLocaleTimeString("vi-VN")} {new Date(evaluationData.evaluatedAt).toLocaleDateString("vi-VN")}
                    </Badge>
                  )}
                </div>

                {isLoadingEvaluation ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-3xl" />
                    <Skeleton className="h-32 w-full rounded-3xl" />
                  </div>
                ) : !evaluationData || !evaluationData.members || evaluationData.members.length === 0 ? (
                  <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
                    <AlertCircle size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <h4 className="text-base font-bold text-foreground">Chưa có kết quả đánh giá</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Dữ liệu tính toán đóng góp cho nhóm này hiện tại chưa khả dụng hoặc chưa được đồng bộ từ hệ thống.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {evaluationData.members.map((member) => {
                      const isExpanded = !!expandedSprints[member.studentId];
                      const warnings = member.warnings || [];
                      const hasWarnings = warnings.length > 0;

                      return (
                        <div
                          key={member.studentId}
                          className="glass-panel rounded-[2rem] border border-border/50 bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          {/* Card Header */}
                          <div className="p-6 bg-muted/20 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                                  {member.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-base font-extrabold text-foreground">{member.fullName}</h4>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">MSSV: {member.studentCode}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <div className="text-right">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75">Tỷ lệ đóng góp cuối</p>
                                <span className={`text-lg font-black ${member.finalContributionPercentage < 50 ? 'text-destructive' : 'text-primary'}`}>
                                  {truncateDecimal(member.finalContributionPercentage)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-6 space-y-6">
                            {/* Warning Section (If Any) */}
                            {hasWarnings && (
                              <div className="space-y-2">
                                {warnings.map((w, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs font-semibold ${w.severity?.toUpperCase() === "HIGH" || w.severity?.toUpperCase() === "CRITICAL"
                                        ? "bg-destructive/10 border-destructive/20 text-destructive"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500"
                                      }`}
                                  >
                                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-extrabold uppercase tracking-wide text-[9px] mr-1.5 px-1.5 py-0.5 rounded bg-current/10">
                                        {w.code}
                                      </span>
                                      <span>{w.message}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Summary Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/10 p-4 rounded-2xl border border-border/30">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Đánh giá chéo</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-extrabold text-foreground">{truncateDecimal(member.peerReviewScore)}</span>
                                  <span className="text-xs text-muted-foreground">/ 5</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Điểm Task</span>
                                <p className="text-sm font-extrabold text-foreground">{truncateDecimal(member.taskContributionScore)}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tỷ lệ Task</span>
                                <p className="text-sm font-extrabold text-foreground">{truncateDecimal(member.taskContributionPercentage)}%</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Số minh chứng</span>
                                <p className="text-sm font-extrabold text-foreground">{member.evidenceCount || 0}</p>
                              </div>
                            </div>

                            {/* Component Slicing Contribution Percentages */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                                <TrendingUp size={13} className="text-primary" />
                                Chi tiết đóng góp phân mảnh
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Code Contribution */}
                                <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                      <Code size={13} className="text-blue-500" />
                                      Lập trình (Code)
                                    </span>
                                    <span className="text-xs font-black text-blue-500">{truncateDecimal(member.codeContributionPercentage)}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(member.codeContributionPercentage || 0, 100)}%` }} />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-semibold">Điểm hoạt động: {truncateDecimal(member.codeContributionScore)}</p>
                                </div>

                                {/* Document Contribution */}
                                <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                      <FileText size={13} className="text-amber-500" />
                                      Tài liệu (Document)
                                    </span>
                                    <span className="text-xs font-black text-amber-500">{truncateDecimal(member.documentContributionPercentage)}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(member.documentContributionPercentage || 0, 100)}%` }} />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-semibold">Điểm hoạt động: {truncateDecimal(member.documentContributionScore)}</p>
                                </div>

                                {/* Design Contribution */}
                                <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                      <Palette size={13} className="text-purple-500" />
                                      Thiết kế (Design)
                                    </span>
                                    <span className="text-xs font-black text-purple-500">{truncateDecimal(member.designContributionPercentage)}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(member.designContributionPercentage || 0, 100)}%` }} />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-semibold">Điểm hoạt động: {truncateDecimal(member.designContributionScore)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Accordion Toggle for Sprint Breakdowns */}
                            {member.sprintBreakdowns && member.sprintBreakdowns.length > 0 && (
                              <div className="border-t border-border/40 pt-4">
                                <Button
                                  type="button"
                                  onClick={() => toggleSprintExpand(member.studentId)}
                                  variant="ghost"
                                  className="w-full justify-between h-9 px-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
                                >
                                  <span>Xem chi tiết điểm từng Sprint ({member.sprintBreakdowns.length})</span>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </Button>

                                {isExpanded && (
                                  <div className="mt-3 overflow-hidden rounded-2xl border border-border/30 bg-muted/5 divide-y divide-border/30 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-5 p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 bg-muted/20">
                                      <div className="col-span-2">Sprint</div>
                                      <div className="text-center">Điểm Task</div>
                                      <div className="text-center">Hệ số Retro</div>
                                      <div className="text-center">Điểm Sprint</div>
                                    </div>
                                    {member.sprintBreakdowns.map((s, sIdx) => (
                                      <div key={sIdx} className="grid grid-cols-5 p-3.5 text-xs items-center font-semibold text-foreground">
                                        <div className="col-span-2 truncate font-bold text-foreground/90">{s.sprintName}</div>
                                        <div className="text-center">{truncateDecimal(s.taskScore)}</div>
                                        <div className="text-center">x{truncateDecimal(s.retrospectiveMultiplier)}</div>
                                        <div className="text-center font-bold text-primary">{truncateDecimal(s.adjustedTaskScore)}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
