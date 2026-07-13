"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Users, GitMerge, FileText, Activity, PieChart as PieChartIcon, Flame, Share2, KanbanSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamEvaluation } from "@/features/lecturer/components/project-detail/team-evaluation";
import { ProjectHeatmap } from "@/features/lecturer/components/project-detail/project-heatmap";
import { ProjectInteractionGraph } from "@/features/lecturer/components/project-detail/project-interaction-graph";
import { EarlyWarningAlerts } from "@/features/lecturer/components/project-detail/charts/early-warning-alerts";
import { SprintVelocityBar } from "@/features/lecturer/components/project-detail/charts/sprint-velocity-bar";
import { StudentKanbanBoard } from "@/features/student/components/student-kanban-board";

export default function ProjectDetailPage({ params }: { params: Promise<{ classId: string, projectId: string }> }) {
  const { classId, projectId } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");

  // Dữ liệu giả lập cho chi tiết nhóm (Mock data theo SAGA Agile):
  const projectDetail = {
    id: projectId,
    name: `Nhóm ${projectId}`,
    project: "Hệ thống quản lý thư viện",
    description: "Xây dựng hệ thống quản lý thư viện sử dụng Next.js, Node.js và PostgreSQL. Đánh giá dựa trên mô hình Slicing Pie Scrum & Early Warning AI.",
    members: [
      { name: "Nguyễn Văn A", role: "Core Member", totalSp: 45, completedSp: 38, slices: "42.75", warning: "Bus Factor" },
      { name: "Trần Thị B", role: "Thành viên", totalSp: 25, completedSp: 25, slices: "19.0", warning: null },
      { name: "Lê Văn C", role: "Thành viên", totalSp: 15, completedSp: 5, slices: "1.0", warning: "Ghosting (PIP)" },
    ],
    status: "warning",
    progress: 75,
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href={`/lecturer/${classId}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft size={16} />
          Quay lại Dashboard Lớp
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <PageHeader
            title={`${projectDetail.name}: ${projectDetail.project}`}
            description="Chi tiết dự án, tiến độ Agile và đánh giá cổ phần Slices của từng thành viên."
          />
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl border-border/50 hover:bg-slate-50 dark:hover:bg-accent/50 shadow-sm">
              <FileText size={16} />
              Báo cáo Sprint
            </Button>
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
              <GitMerge size={16} />
              Lịch sử Commit
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <TabsTrigger value="kanban" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
            <KanbanSquare className="w-4 h-4 mr-2" /> Kanban Board
          </TabsTrigger>
        </TabsList>

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
                    {projectDetail.description}
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tiến độ chung (Burn-down)</span>
                      <span className="text-sm font-black text-primary">{projectDetail.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${projectDetail.progress}%` }} />
                    </div>
                  </div>
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
                    {projectDetail.members.map((member, idx) => (
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
                              {member.role === 'Core Member' ? (
                                <span className="text-violet-600 dark:text-violet-400">Core Member</span>
                              ) : (
                                <span>Thành viên</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-accent/30 p-2.5 rounded-xl">
                          <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Story Points</div>
                            <div className="text-xs font-bold text-foreground">{member.completedSp}/{member.totalSp} SP</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Slices</div>
                            <div className="text-xs font-black text-primary">{member.slices}</div>
                          </div>
                        </div>
                        {member.warning && (
                          <div className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl text-center ${member.warning.includes('Ghosting') ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            Cảnh báo: {member.warning}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: AI Warning & Velocity */}
            <div className="xl:col-span-2 space-y-6">
              <EarlyWarningAlerts />
              <SprintVelocityBar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="slicing-pie" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TeamEvaluation />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectHeatmap projectId={projectDetail.id} />
        </TabsContent>

        <TabsContent value="interaction" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectInteractionGraph projectId={projectDetail.id} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] overflow-hidden -mx-6 sm:mx-0 shadow-sm relative pt-4">
            <StudentKanbanBoard isLecturerView={true} classId={classId} projectId={projectDetail.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
