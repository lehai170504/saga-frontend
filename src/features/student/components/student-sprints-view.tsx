"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { Calendar, FolderKanban, Users, Flag, Clock } from "lucide-react";
import { toast } from "sonner";

import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useTeamSprints } from "@/features/projects/hooks/useTeamSprints";
import { useProjectDetail } from "@/features/projects/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentSprintsViewProps {
  courseId?: string;
  hideHeader?: boolean;
}

export function StudentSprintsView({ courseId, hideHeader = false }: StudentSprintsViewProps) {

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const { data: projectDetail } = useProjectDetail(myTeamData?.project?.id || "");
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(activeTeamId);

  const isLoading = isLoadingTeam || isLoadingCourse || (!!activeTeamId && isLoadingSprints);

  const sprints = sprintsData?.sprints || [];

  const mainContent = (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Đánh giá chéo"
          description={
            courseData
              ? `Chọn Sprint để thực hiện tự đánh giá và đánh giá chéo thành viên trong nhóm cho Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />
      )}

      {isLoading ? (
        <div className="glass-panel rounded-[2rem] p-6 space-y-4">
          <Skeleton className="h-40 w-full rounded-[2rem] bg-muted/40" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            <Skeleton className="h-44 w-full rounded-2xl bg-muted/40" />
            <Skeleton className="h-44 w-full rounded-2xl bg-muted/40" />
            <Skeleton className="h-44 w-full rounded-2xl bg-muted/40" />
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
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

            <div className="space-y-4 relative z-10 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
                  Nhóm của bạn
                </span>
                <h2 className="text-3xl font-black tracking-tight text-foreground">{myTeamData.teamName}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2.5 text-muted-foreground bg-background/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/50 inline-flex shadow-sm">
                  <FolderKanban size={18} className="text-primary shrink-0" />
                  <span className="font-extrabold text-sm text-foreground">
                    {projectDetail?.name || myTeamData.project?.name || "Chưa có đề tài"}
                  </span>
                </div>

                {projectDetail?.projectType && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 font-extrabold text-xs px-3 py-2 rounded-xl shadow-sm"
                  >
                    {projectDetail.projectType.code
                      ? `${projectDetail.projectType.name} (${projectDetail.projectType.code})`
                      : projectDetail.projectType.name}
                  </Badge>
                )}
              </div>

              {projectDetail?.description && (
                <p className="text-xs text-foreground/80 font-medium max-w-2xl border-l-2 border-primary/30 pl-3 leading-relaxed">
                  {projectDetail.description}
                </p>
              )}
            </div>
          </div>

          {/* Sprints Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
              <Calendar size={16} />
              Danh sách Sprints cần đánh giá ({sprints.length})
            </h3>

            {sprints.length === 0 ? (
              <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
                <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h4 className="text-lg font-bold text-foreground">Chưa có Sprint nào</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Không tìm thấy Sprint nào được đồng bộ từ Jira cho nhóm của bạn. Vui lòng kiểm tra lại cấu hình tích hợp Jira.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sprints.map((sprint) => {
                  const hasDates = sprint.startDate && sprint.endDate;

                  const getSprintStatus = () => {
                    if (sprint.state === "CLOSED" || sprint.state === "closed") {
                      return {
                        label: "Đã hoàn thành",
                        style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]",
                        cardStyle: "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-emerald-500/5",
                        topLineStyle: "bg-emerald-500",
                        dateStyle: "text-muted-foreground"
                      };
                    }

                    if (!sprint.endDate) return null;
                    const now = new Date();
                    const end = new Date(sprint.endDate);
                    const diffTime = end.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffTime < 0) {
                      return {
                        label: "Quá hạn",
                        style: "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_2px_10px_rgba(239,68,68,0.1)]",
                        cardStyle: "border-destructive/30 hover:border-destructive/50 hover:shadow-destructive/5",
                        topLineStyle: "bg-destructive",
                        dateStyle: "text-destructive font-bold"
                      };
                    }

                    if (diffDays <= 3) {
                      return {
                        label: `Sắp kết thúc (Còn ${diffDays} ngày)`,
                        style: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]",
                        cardStyle: "border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/5",
                        topLineStyle: "bg-gradient-to-r from-amber-500 to-orange-500",
                        dateStyle: "text-amber-600 font-bold"
                      };
                    }

                    if (sprint.state === "ACTIVE" || sprint.state === "active") {
                      return {
                        label: "Đang hoạt động",
                        style: "bg-primary/10 text-primary border-primary/20 shadow-[0_2px_10px_rgba(234,88,12,0.1)]",
                        cardStyle: "border-primary/30 hover:border-primary/50 hover:shadow-primary/5",
                        topLineStyle: "bg-gradient-to-r from-primary to-orange-500",
                        dateStyle: "text-primary font-semibold"
                      };
                    }

                    return null;
                  };

                  const status = getSprintStatus();
                  const sprintTargetId = sprint.sprintId || (sprint as unknown as { id?: string }).id || (sprint as unknown as { sprint_id?: string }).sprint_id;

                  const getPeerReviewOpenStatus = () => {
                    if (!sprint.endDate) {
                      return {
                        isOpen: false,
                        reason: "Chưa thiết lập ngày kết thúc cho Sprint này trên Jira.",
                        badgeLabel: "🔒 Chưa thiết lập lịch",
                        badgeStyle: "bg-muted/50 text-muted-foreground border-border/50",
                        openDateStr: null,
                      };
                    }

                    const openD = new Date(new Date(sprint.endDate).getTime() - 7 * 24 * 60 * 60 * 1000);
                    const now = new Date();
                    const openDateFormatted = `${String(openD.getDate()).padStart(2, '0')}-${String(openD.getMonth() + 1).padStart(2, '0')}-${openD.getFullYear()}`;
                    const isClosed = sprint.state === "CLOSED" || sprint.state === "closed";

                    if (isClosed || now >= openD) {
                      return {
                        isOpen: true,
                        reason: null,
                        badgeLabel: "● Đang mở đánh giá",
                        badgeStyle: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]",
                        openDateStr: openDateFormatted,
                      };
                    }

                    return {
                      isOpen: false,
                      reason: `Đợt đánh giá chéo chưa tới ngày mở.`,
                      badgeLabel: "🔒 Chưa đến hạn mở",
                      badgeStyle: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]",
                      openDateStr: openDateFormatted,
                    };
                  };

                  const reviewStatus = getPeerReviewOpenStatus();

                  const cardInner = (
                    <Card className={`rounded-3xl border bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 flex flex-col relative overflow-hidden h-full ${reviewStatus.isOpen
                      ? (status ? status.cardStyle : 'border-border/50 hover:border-border hover:bg-muted/10 cursor-pointer hover:shadow-xl')
                      : 'border-border/40 bg-muted/10 opacity-75 cursor-not-allowed'
                      }`}>
                      <div className={`absolute top-0 left-0 w-full h-[4px] opacity-80 ${reviewStatus.isOpen
                        ? (status ? status.topLineStyle : 'bg-gradient-to-r from-primary to-orange-500')
                        : 'bg-muted-foreground/30'
                        }`} />

                      <CardHeader className="pb-4 pt-6 flex flex-row items-center justify-between gap-4">
                        <CardTitle className={`text-lg font-bold transition-colors ${reviewStatus.isOpen ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
                          }`}>
                          {sprint.sprintName}
                        </CardTitle>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {status && (
                            <Badge variant="outline" className={`${status.style} font-bold rounded-full text-[10px] py-1 px-3.5`}>
                              {status.label}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`${reviewStatus.badgeStyle} font-extrabold rounded-full text-[10px] py-0.5 px-2.5`}>
                            {reviewStatus.badgeLabel}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-2 pb-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3.5">
                          {/* Start & End Dates */}
                          <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 bg-muted/60 text-muted-foreground rounded-xl">
                              <Clock size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">
                                Thời gian chạy
                              </p>
                              <p className={`text-xs truncate ${status ? status.dateStyle : 'text-foreground font-semibold'}`}>
                                {hasDates ? (
                                  <>
                                    {(() => { const d = new Date(sprint.startDate!); return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`; })()} - {(() => { const d = new Date(sprint.endDate!); return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`; })()}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground/75 italic font-medium">Chưa thiết lập thời gian</span>
                                )}
                              </p>
                            </div>
                          </div>



                          {/* Goal */}
                          <div className="flex items-start gap-3 text-sm">
                            <div className="p-2 bg-muted/60 text-muted-foreground rounded-xl shrink-0">
                              <Flag size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">
                                Mục tiêu Sprint
                              </p>
                              <p className="text-xs font-medium text-foreground line-clamp-2">
                                {sprint.goal || <span className="text-muted-foreground/75 italic">Không có mục tiêu nào được thiết lập</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );

                  if (reviewStatus.isOpen) {
                    return (
                      <Link
                        key={sprintTargetId}
                        href={`/student/${courseId}/sprints/${sprintTargetId}`}
                        className="block group"
                      >
                        {cardInner}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={sprintTargetId}
                      onClick={() => toast.warning("Đánh giá chéo chưa được mở", { description: reviewStatus.reason })}
                      className="block group cursor-not-allowed"
                    >
                      {cardInner}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (hideHeader) {
    return mainContent;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6">
        {mainContent}
      </div>
    </div>
  );
}
