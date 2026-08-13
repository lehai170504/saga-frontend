"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Activity, Flame, Share2, ListTodo } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeatmap } from "@/features/lecturer/components/project-detail/project-heatmap";
import { ProjectInteractionGraph } from "@/features/lecturer/components/project-detail/project-interaction-graph";
import { ProjectBurndownChart } from "@/features/lecturer/components/project-detail/project-burndown-chart";
import { EarlyWarningAlerts } from "@/features/lecturer/components/project-detail/charts/early-warning-alerts";
import { SprintVelocityBar } from "@/features/lecturer/components/project-detail/charts/sprint-velocity-bar";
import { useTeamDetail } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectTaskList } from "@/features/projects/components/project-task-list";
import { ProjectCommitsView } from "@/features/lecturer/components/project-detail/project-commits-view";
import { ProjectIssuesView } from "@/features/lecturer/components/project-detail/project-issues-view";
import { ProjectDashboardStats } from "@/features/lecturer/components/project-detail/project-dashboard-stats";
import { ProjectTraceabilityView } from "@/features/lecturer/components/project-detail/project-traceability-view";
import { GitCommit, CircleDot, Waypoints } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ courseId: string, teamId: string }> }) {
  const { courseId, teamId } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch real data
  const { data: teamDetail, isLoading: isLoadingMembers } = useTeamDetail(courseId, teamId);

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
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {projectDetail.project && projectDetail.project !== "Chưa có dự án" && (
          <TabsList className="flex w-full max-w-full overflow-x-auto justify-start !h-auto rounded-xl bg-muted/50 p-1 mb-6 gap-1 [&::-webkit-scrollbar]:hidden">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <Activity className="w-4 h-4 mr-2" /> Tổng quan Nhóm
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <ListTodo className="w-4 h-4 mr-2" /> Công việc (Jira)
            </TabsTrigger>
            <TabsTrigger value="commits" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <GitCommit className="w-4 h-4 mr-2" /> Lịch sử Commit (Github)
            </TabsTrigger>
            <TabsTrigger value="issues" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <CircleDot className="w-4 h-4 mr-2" /> Issues (Github)
            </TabsTrigger>
            <TabsTrigger value="traceability" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <Waypoints className="w-4 h-4 mr-2" /> Dòng thời gian
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <Flame className="w-4 h-4 mr-2" /> Biểu đồ Nhiệt
            </TabsTrigger>
            <TabsTrigger value="interaction" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <Share2 className="w-4 h-4 mr-2" /> Mạng Tương Tác
            </TabsTrigger>
            <TabsTrigger value="burndown" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none shrink-0 whitespace-nowrap">
              <Activity className="w-4 h-4 mr-2" /> Sprint Burndown
            </TabsTrigger>
            
          </TabsList>
        )}

        <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Info & Members */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="rounded-[2rem] shadow-sm border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
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

            {/* Right Column: AI Warning & Velocity */}
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
