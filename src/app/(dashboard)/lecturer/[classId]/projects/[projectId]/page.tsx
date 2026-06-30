"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Users, GitMerge, FileText, Activity, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamEvaluation } from "@/features/lecturer/components/project-detail/team-evaluation";

export default function ProjectDetailPage({ params }: { params: Promise<{ classId: string, projectId: string }> }) {
  const { classId, projectId } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");

  // Dữ liệu giả lập cho chi tiết nhóm (Mock data):
  const projectDetail = {
    id: projectId,
    name: `Nhóm ${projectId}`,
    project: "Hệ thống quản lý thư viện",
    description: "Xây dựng hệ thống quản lý thư viện sử dụng Next.js, Node.js và PostgreSQL. Tích hợp thanh toán online và mượn trả sách tự động.",
    members: [
      { name: "Nguyễn Văn A", role: "Leader", tasks: 12, completed: 10, contribution: "35%" },
      { name: "Trần Thị B", role: "Member", tasks: 8, completed: 8, contribution: "25%" },
      { name: "Lê Văn C", role: "Member", tasks: 15, completed: 10, contribution: "40%" },
    ],
    status: "healthy",
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
            description="Chi tiết dự án, tiến độ công việc và đánh giá đóng góp của từng thành viên."
          />
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl border-border/50 hover:bg-slate-50 dark:hover:bg-accent/50 shadow-sm">
              <FileText size={16} />
              Xem tài liệu
            </Button>
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
              <GitMerge size={16} />
              Lịch sử Commit
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full md:w-auto h-auto rounded-xl bg-muted/50 p-1 mb-6 gap-1">
          <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
            <Activity className="w-4 h-4 mr-2" /> Tổng quan Nhóm
          </TabsTrigger>
          <TabsTrigger value="slicing-pie" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-12 px-6 flex-1 md:flex-none">
            <PieChartIcon className="w-4 h-4 mr-2" /> Đánh giá Đóng góp & AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Overview */}
            <div className="lg:col-span-1 space-y-6">
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
                      <span className="text-sm font-medium">Tiến độ chung</span>
                      <span className="text-sm font-black text-primary">{projectDetail.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${projectDetail.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-2xl mt-4 border border-emerald-100 dark:border-emerald-900/50">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <span className="text-sm font-bold">Dự án đang tiến triển tốt</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Members */}
            <div className="lg:col-span-2">
              <Card className="rounded-[2rem] shadow-sm border-border h-full bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-bold">Thành viên nhóm</CardTitle>
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Users size={18} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {projectDetail.members.map((member, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:shadow-md hover:border-primary/30 transition-all duration-300 gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                            <AvatarFallback className="font-bold bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground text-base">{member.name}</div>
                            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                              {member.role === 'Leader' ? (
                                <span className="text-amber-600 dark:text-amber-400">Trưởng nhóm</span>
                              ) : (
                                <span>Thành viên</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 sm:gap-8 sm:text-right bg-accent/30 p-3 rounded-xl sm:bg-transparent sm:p-0">
                          <div>
                            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tasks</div>
                            <div className="text-sm font-bold text-foreground">{member.completed}/{member.tasks}</div>
                          </div>
                          <div className="w-[1px] h-8 bg-border/50 sm:hidden"></div>
                          <div>
                            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Slices Tạm tính</div>
                            <div className="text-sm font-black text-primary">{member.contribution}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="slicing-pie" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TeamEvaluation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
