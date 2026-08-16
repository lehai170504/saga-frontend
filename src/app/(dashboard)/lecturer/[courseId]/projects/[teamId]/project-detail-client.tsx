"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Activity, Flame, Share2, ListTodo, ChevronLeft, ChevronRight, GitCommit, CircleDot, Waypoints } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamDetail } from "@/features/lecturer/hooks/useAnalytics";
import { useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/features/projects/api/projectApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { isCourseEnded } from "@/lib/course-utils";
import dynamic from 'next/dynamic';
import { LecturerUpdateGroupWeightsModal } from "@/features/lecturer/components/project-detail/lecturer-update-group-weights-modal";

// Lớp 2: Lazy Loading các Component nặng (Dynamic Imports)
const ProjectHeatmap = dynamic(() => import('@/features/lecturer/components/project-detail/project-heatmap').then(m => m.ProjectHeatmap), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const ProjectInteractionGraph = dynamic(() => import('@/features/lecturer/components/project-detail/project-interaction-graph').then(m => m.ProjectInteractionGraph), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const ProjectBurndownChart = dynamic(() => import('@/features/lecturer/components/project-detail/project-burndown-chart').then(m => m.ProjectBurndownChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const EarlyWarningAlerts = dynamic(() => import('@/features/lecturer/components/project-detail/charts/early-warning-alerts').then(m => m.EarlyWarningAlerts), { ssr: false });
const SprintVelocityBar = dynamic(() => import('@/features/lecturer/components/project-detail/charts/sprint-velocity-bar').then(m => m.SprintVelocityBar), { ssr: false });
const ProjectTaskList = dynamic(() => import('@/features/projects/components/project-task-list').then(m => m.ProjectTaskList), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const ProjectCommitsView = dynamic(() => import('@/features/lecturer/components/project-detail/project-commits-view').then(m => m.ProjectCommitsView), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const ProjectIssuesView = dynamic(() => import('@/features/lecturer/components/project-detail/project-issues-view').then(m => m.ProjectIssuesView), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });
const ProjectDashboardStats = dynamic(() => import('@/features/lecturer/components/project-detail/project-dashboard-stats').then(m => m.ProjectDashboardStats), { ssr: false });
const ProjectTraceabilityView = dynamic(() => import('@/features/lecturer/components/project-detail/project-traceability-view').then(m => m.ProjectTraceabilityView), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" /> });

interface ProjectDetailClientProps {
  courseId: string;
  teamId: string;
}

export function ProjectDetailClient({ courseId, teamId }: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabValues = ["overview", "tasks", "commits", "issues", "traceability", "heatmap", "interaction", "burndown"];

  const handlePrevTab = () => {
    const idx = tabValues.indexOf(activeTab);
    if (idx > 0) setActiveTab(tabValues[idx - 1]);
  };

  const handleNextTab = () => {
    const idx = tabValues.indexOf(activeTab);
    if (idx < tabValues.length - 1) setActiveTab(tabValues[idx + 1]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.getElementById('tabs-list-container');
      const activeTrigger = container?.querySelector('[data-state="active"]');
      if (container && activeTrigger) {
        const containerRect = container.getBoundingClientRect();
        const triggerRect = activeTrigger.getBoundingClientRect();
        const offset = (triggerRect.left + triggerRect.width / 2) - (containerRect.left + containerRect.width / 2);
        container.scrollBy({ left: offset, behavior: 'smooth' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Fetch real data
  const { data: teamDetail, isLoading: isLoadingMembers } = useTeamDetail(courseId, teamId);
  const { data: courseData } = useCourse(courseId);
  const queryClient = useQueryClient();

  const isEnded = isCourseEnded(courseData?.semester?.endDate);

  // Mồi data (Background Prefetching) ngay khi load xong thông tin dự án
  useEffect(() => {
    if (teamDetail?.project?.id) {
      const projectId = teamDetail.project.id;
      // Tranh thủ gọi ngầm API Dashboard Stats lúc user đang đọc tab Tổng quan
      queryClient.prefetchQuery({
        queryKey: ["project-dashboard-stats", projectId],
        queryFn: () => projectApi.getProjectDashboardStats(projectId)
      });
      // Mồi thêm data GitHub Issues
      queryClient.prefetchQuery({
        queryKey: ["project-github-issues", projectId, undefined, 0, 20],
        queryFn: () => projectApi.getGithubIssues(projectId, undefined, 0, 20)
      });
    }
  }, [teamDetail?.project?.id, queryClient]);

  const teamName = teamDetail?.teamName || "Đang tải thông tin nhóm...";
  const projectName = teamDetail?.project?.name || "Chưa có dự án";

  const projectDetail = {
    id: teamId,
    name: teamName,
    project: projectName,
    projectId: teamDetail?.project?.id,
    members: teamDetail?.members?.content?.map(s => ({
      id: s.studentId,
      name: s.fullName,
      role: s.roleInTeam === "LEADER" ? "Leader" : "Thành viên",
    })) || [],
    repositories: teamDetail?.project?.repositories || [],
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href={`/lecturer/${courseId}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft size={16} />
          Quay lại Dashboard Lớp
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <PageHeader
            title={`${projectDetail.name}${projectDetail.project && projectDetail.project !== "Chưa có dự án" ? ` - ${projectDetail.project}` : ''}`}
            description="Chi tiết dự án, tiến độ Agile và đánh giá cổ phần Slices của từng thành viên."
          />
          {projectDetail.projectId && (
            <div className="flex items-center gap-3 w-full sm:w-auto mt-4 md:mt-0 shrink-0">
              <LecturerUpdateGroupWeightsModal
                projectId={projectDetail.projectId}
                courseId={courseId}
                teamId={teamId}
                teamName={projectDetail.name}
                isEnded={isEnded}
              />
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {projectDetail.project && projectDetail.project !== "Chưa có dự án" && (
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl shrink-0 bg-muted/50 border-none hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handlePrevTab}
              disabled={tabValues.indexOf(activeTab) === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <TabsList className="flex w-full max-w-full overflow-x-auto justify-start !h-auto rounded-xl bg-muted/50 p-1 gap-1 [&::-webkit-scrollbar]:hidden scroll-smooth" id="tabs-list-container">
              <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" /> Tổng quan Nhóm
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                onMouseEnter={() => import('@/features/projects/components/project-task-list')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <ListTodo className="w-4 h-4 mr-2" /> Công việc (Jira)
              </TabsTrigger>
              <TabsTrigger
                value="commits"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-commits-view')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <GitCommit className="w-4 h-4 mr-2" /> Lịch sử Commit (Github)
              </TabsTrigger>
              <TabsTrigger
                value="issues"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-issues-view')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <CircleDot className="w-4 h-4 mr-2" /> Issues (Github)
              </TabsTrigger>
              <TabsTrigger
                value="traceability"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-traceability-view')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <Waypoints className="w-4 h-4 mr-2" /> Dòng thời gian
              </TabsTrigger>
              <TabsTrigger
                value="heatmap"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-heatmap')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <Flame className="w-4 h-4 mr-2" /> Biểu đồ Nhiệt
              </TabsTrigger>
              <TabsTrigger
                value="interaction"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-interaction-graph')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <Share2 className="w-4 h-4 mr-2" /> Mạng Tương Tác
              </TabsTrigger>
              <TabsTrigger
                value="burndown"
                onMouseEnter={() => import('@/features/lecturer/components/project-detail/project-burndown-chart')}
                className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" /> Sprint Burndown
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl shrink-0 bg-muted/50 border-none hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleNextTab}
              disabled={tabValues.indexOf(activeTab) === tabValues.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <Card className="rounded-[2rem] shadow-sm border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-bold">Thông tin dự án</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectDetail.project && projectDetail.project !== "Chưa có dự án" ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Thông tin chi tiết về dự án đang được cập nhật từ hệ thống.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-warning">
                        Nhóm chưa được liên kết với không gian làm việc (Workspace).
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Các cấu hình còn thiếu:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-destructive" /> Chưa kết nối GitHub Repository</li>
                          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-destructive" /> Chưa kết nối Jira Board</li>
                          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-warning" /> Chưa cập nhật Tài liệu Thiết kế Hệ thống</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] shadow-sm border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-bold">Danh sách Thành viên</CardTitle>
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Users size={18} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {isLoadingMembers ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col p-4 rounded-2xl border border-border/50 bg-background gap-3">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : projectDetail.members.length > 0 ? (
                      projectDetail.members.map((member, idx) => (
                        <div key={idx} className="flex flex-col p-4 rounded-2xl border border-border/50 bg-background hover:shadow-md hover:border-primary/30 transition-all duration-300 gap-3">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                              <AvatarFallback className="font-bold bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-foreground text-sm">{member.name}</div>
                              </div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                                {member.role === 'Leader' ? (
                                  <span className="text-primary">Leader</span>
                                ) : (
                                  <span>Thành viên</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 text-sm text-muted-foreground border border-dashed rounded-xl">
                        Chưa có thành viên nào trong nhóm
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-2 space-y-6">
              {projectDetail.project && projectDetail.project !== "Chưa có dự án" ? (
                <>
                  {projectDetail.projectId && <ProjectDashboardStats projectId={projectDetail.projectId} />}
                  <EarlyWarningAlerts courseId={courseId} teamId={teamId} members={projectDetail.members} />
                  <SprintVelocityBar courseId={courseId} teamId={teamId} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center border border-dashed rounded-[2rem] bg-muted/30 p-12">
                  <Activity size={48} className="text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-bold text-foreground">Chưa có dự án</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm">
                    Nhóm này hiện tại chưa kết nối với bất kỳ Dự án nào.
                    Vui lòng yêu cầu nhóm tạo hoặc liên kết không gian làm việc để xem phân tích cảnh báo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {projectDetail.project && projectDetail.project !== "Chưa có dự án" && (
          <>
            <TabsContent value="heatmap" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectHeatmap courseId={courseId} teamId={projectDetail.id} />
            </TabsContent>

            <TabsContent value="interaction" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectInteractionGraph courseId={courseId} teamId={projectDetail.id} />
            </TabsContent>

            <TabsContent value="burndown" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectBurndownChart courseId={courseId} teamId={projectDetail.id} />
            </TabsContent>

            {projectDetail.projectId && (
              <>
                <TabsContent value="tasks" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectTaskList projectId={projectDetail.projectId} members={projectDetail.members} />
                </TabsContent>
                <TabsContent value="commits" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectCommitsView projectId={projectDetail.projectId} repositories={projectDetail.repositories} />
                </TabsContent>
                <TabsContent value="issues" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectIssuesView projectId={projectDetail.projectId} repositories={projectDetail.repositories} />
                </TabsContent>
                <TabsContent value="traceability" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectTraceabilityView projectId={projectDetail.projectId} />
                </TabsContent>
              </>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
