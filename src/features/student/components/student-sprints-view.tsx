"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { Calendar, FolderKanban, Users, Flag, Clock } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useTeamSprints } from "@/features/projects/hooks/useTeamSprints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentSprintsViewProps {
  courseId?: string;
}

export function StudentSprintsView({ courseId }: StudentSprintsViewProps) {
  const [mounted, setMounted] = useState(false);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(activeTeamId);

  const isLoading = isLoadingTeam || isLoadingCourse || (!!activeTeamId && isLoadingSprints);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const sprints = sprintsData?.sprints || [];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        <PageHeader
          title="Sprints"
          description={
            courseData
              ? `Xem danh sách Sprints được đồng bộ từ Jira cho Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />

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
            </div>

            {/* Sprints Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
                <Calendar size={16} />
                Danh sách Sprints ({sprints.length})
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
                    return (
                      <Link
                        key={sprint.sprintId}
                        href={`/student/${courseId}/sprints/${sprint.sprintId}`}
                        className="block group"
                      >
                        <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 flex flex-col relative overflow-hidden h-full cursor-pointer hover:bg-muted/10">
                          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-orange-500 opacity-80" />
                          
                          <CardHeader className="pb-4 pt-6">
                            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {sprint.sprintName}
                            </CardTitle>
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
                                  <p className="text-xs font-semibold text-foreground truncate">
                                    {hasDates ? (
                                      <>
                                        {new Date(sprint.startDate!).toLocaleDateString("vi-VN")} - {new Date(sprint.endDate!).toLocaleDateString("vi-VN")}
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
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
