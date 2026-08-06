"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, GitMerge, FileText, Activity, PieChart as PieChartIcon, Flame, Share2, KanbanSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamEvaluation } from "@/features/lecturer/components/project-detail/team-evaluation";
import { ProjectHeatmap } from "@/features/lecturer/components/project-detail/project-heatmap";
import { ProjectInteractionGraph } from "@/features/lecturer/components/project-detail/project-interaction-graph";
import { EarlyWarningAlerts } from "@/features/lecturer/components/project-detail/charts/early-warning-alerts";
import { SprintVelocityBar } from "@/features/lecturer/components/project-detail/charts/sprint-velocity-bar";
import { useTeamDetail } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailPage({ params }: { params: Promise<{ courseId: string, teamId: string }> }) {
  const { courseId, teamId } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch real data
  const { data: teamDetail, isLoading: isLoadingMembers } = useTeamDetail(courseId, teamId);

  const teamName = teamDetail?.teamName || `Nhóm ${teamId.slice(0, 8)}...`;
  const projectName = teamDetail?.project?.name || "Chưa có dự án";

  const projectDetail = {
    id: teamId,
    name: teamName,
    project: projectName,
    members: teamDetail?.members.content.map(s => ({
      name: s.fullName,
      role: s.roleInTeam === "LEADER" ? "Leader" : "Thành viên",
    })) || [],
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
            title={`${projectDetail.name}: ${projectDetail.project}`}
            description="Chi tiết dự án, tiến độ Agile và đánh giá cổ phần Slices của từng thành viên."
          />
          {projectDetail.project && projectDetail.project !== "Chưa có dự án" && (
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 rounded-xl border-border/50 bg-muted dark:hover:bg-accent/50 shadow-sm">
                <FileText size={16} />
                Báo cáo Sprint
              </Button>
              <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                <GitMerge size={16} />
                Lịch sử Commit
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {projectDetail.project && projectDetail.project !== "Chưa có dự án" && (
          <TabsList className="flex flex-wrap w-full md:w-auto h-auto rounded-xl bg-muted/50 p-1 mb-6 gap-1">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
              <Activity className="w-4 h-4 mr-2" /> Tổng quan Nhóm
            </TabsTrigger>
            <TabsTrigger value="slicing-pie" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
              <PieChartIcon className="w-4 h-4 mr-2" /> Đánh giá Đóng góp & AI
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
              <Flame className="w-4 h-4 mr-2" /> Biểu đồ Nhiệt
            </TabsTrigger>
            <TabsTrigger value="interaction" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
              <Share2 className="w-4 h-4 mr-2" /> Mạng Tương Tác
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chưa có mô tả dự án từ hệ thống.
                  </p>
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
                  <EarlyWarningAlerts courseId={courseId} teamId={teamId} />
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
            <TabsContent value="slicing-pie" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TeamEvaluation courseId={courseId} teamId={teamId} />
            </TabsContent>

            <TabsContent value="heatmap" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectHeatmap courseId={courseId} teamId={projectDetail.id} />
            </TabsContent>

            <TabsContent value="interaction" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectInteractionGraph courseId={courseId} teamId={projectDetail.id} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
