"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectDashboardStats } from "@/features/projects/hooks/useProjectDashboardStats";
import { StudentBurndownTab } from "./stats/student-burndown-tab";
import { StudentOverviewActivityTab } from "./stats/student-overview-activity-tab";
import { StudentHeatmapTab } from "./stats/student-heatmap-tab";
import { StudentInteractionTab } from "./stats/student-interaction-tab";
import {
  CheckCircle2,
  CheckSquare,
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertTriangle,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  Flame,
  Zap,
  Crown,
  UserCheck,
  Sparkles,
  Network,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface StudentProjectStatsViewProps {
  courseId?: string;
}

export function StudentProjectStatsView({ courseId }: StudentProjectStatsViewProps) {
  const [mounted, setMounted] = useState(false);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  const teamId = myTeamData?.teamId || "";

  const userRole = myTeamData?.roleInTeam || "MEMBER";
  const isLeader = userRole === "LEADER";

  // Members list for interaction tab
  const membersList = (myTeamData?.members?.content || []).map((m: any) => ({
    studentId: m.studentId,
    fullName: m.fullName,
    studentCode: m.studentCode,
    roleInTeam: m.roleInTeam,
  }));

  const { data: stats, isLoading: isLoadingStats } = useProjectDashboardStats(projectId);

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  // Chart 1 Data: Task Completion Status
  const taskChartData = [
    { name: "Đã hoàn thành", value: stats?.tasks.completed || 0, color: "var(--color-emerald-500, #10b981)" },
    { name: "Chưa hoàn thành", value: stats?.tasks.incomplete || 0, color: "var(--color-amber-500, #f59e0b)" },
  ];

  // Chart 2 Data: GitHub Activity Overview
  const githubChartData = [
    { name: "Repositories", count: stats?.github.repositoryCount || 0, fill: "oklch(0.6 0.18 250)" },
    { name: "Commits", count: stats?.github.commitCount || 0, fill: "oklch(0.65 0.2 145)" },
    { name: "Pull Requests", count: stats?.github.pullRequestCount || 0, fill: "oklch(0.62 0.22 30)" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header */}
        <PageHeader
          title="Thống kê Tiến độ Dự án"
          description="Tổng quan tiến độ thực hiện công việc (Jira), chỉ số đóng góp mã nguồn (GitHub), biểu đồ Burndown, tổng quan hoạt động, biểu đồ nhiệt và mạng tương tác"
        />

        {isLoadingTeam ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : !myTeamData?.project ? (
          <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-destructive">Nhóm chưa đăng ký đề tài</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Dự án của nhóm bạn chưa được khởi tạo. Vui lòng đăng ký đề tài tại mục &quot;Thông tin Nhóm&quot; trước khi xem thống kê dự án.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Role Permission Scope Info Banner */}
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl shrink-0 ${isLeader ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                  {isLeader ? <Crown size={16} /> : <UserCheck size={16} />}
                </div>
                <div>
                  <span className="font-extrabold text-foreground">
                    {isLeader ? "Chế độ Trưởng nhóm (Leader View)" : "Chế độ Thành viên (Member Personal View)"}
                  </span>
                  <p className="text-[11px] font-medium text-muted-foreground leading-snug">
                    {isLeader
                      ? "Bạn có quyền LEADER — Hệ thống đang tổng hợp và hiển thị biểu đồ chỉ số hoạt động của toàn bộ nhóm."
                      : "Bạn đang ở vai trò Thành viên — Hệ thống tự động phân quyền hiển thị thông số và biểu đồ hoạt động cá nhân của bạn."}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`shrink-0 font-extrabold text-[10px] px-3 py-1 rounded-xl border ${isLeader ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : "bg-primary/10 text-primary border-primary/30"}`}>
                {isLeader ? "Dữ liệu Toàn nhóm" : "Dữ liệu Cá nhân"}
              </Badge>
            </div>

            <Tabs defaultValue="overall" className="w-full space-y-6">
              <TabsList className="bg-muted/60 p-1.5 rounded-2xl border border-border/50 h-auto gap-1.5 flex-wrap">
                <TabsTrigger
                  value="overall"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  <span>Tổng quan & Đóng góp</span>
                </TabsTrigger>

                <TabsTrigger
                  value="heatmap"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-rose-500" />
                  <span>Biểu đồ Nhiệt (Heatmap)</span>
                </TabsTrigger>

                <TabsTrigger
                  value="interaction"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Network size={16} className="text-purple-500" />
                  <span>Mạng Tương tác</span>
                </TabsTrigger>
              </TabsList>

            {/* Tab 1: Overall Stats */}
            <TabsContent value="overall" className="space-y-6 outline-none">
              {isLoadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Top Stats Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Tasks */}
                    <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Tổng số Công việc</span>
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                          <CheckSquare size={18} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black tracking-tight text-foreground">{stats?.tasks.total || 0}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Đồng bộ từ Jira Project</p>
                      </div>
                    </Card>

                    {/* Card 2: Completed Tasks */}
                    <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Đã Hoàn thành (Done)</span>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{stats?.tasks.completed || 0}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                          Còn lại <strong className="text-amber-500">{stats?.tasks.incomplete || 0}</strong> công việc
                        </p>
                      </div>
                    </Card>

                    {/* Card 3: Completion Percentage */}
                    <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Tỷ lệ Hoàn thành</span>
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                          <TrendingUp size={18} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black tracking-tight text-primary">
                          {stats?.tasks.completionPercentage?.toFixed(1) || 0}%
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, stats?.tasks.completionPercentage || 0)}%` }}
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Card 4: Commits & PRs */}
                    <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Hoạt động GitHub</span>
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                          <GitCommit size={18} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <div className="text-3xl font-black tracking-tight text-foreground">{stats?.github.commitCount || 0}</div>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Commits</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{stats?.github.pullRequestCount || 0}</div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Pull Requests</p>
                        </div>
                      </div>
                    </Card>

                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Chart 1: Donut Chart - Tiến độ Công việc */}
                    <Card className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <PieChartIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-foreground">Phân bổ Trạng thái Công việc</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Tỉ lệ Hoàn thành vs Chưa xong</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-xl text-[10px] font-bold py-0.5 px-2.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
                          {stats?.tasks.completionPercentage?.toFixed(1) || 0}% Đã xong
                        </Badge>
                      </div>

                      <div className="h-[260px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={taskChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={95}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {taskChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                borderColor: "rgba(255, 255, 255, 0.15)",
                                borderRadius: "1rem",
                                color: "#ffffff",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                              itemStyle={{ color: "#ffffff" }}
                              labelStyle={{ color: "#ffffff" }}
                              formatter={(val: unknown) => [`${val ?? 0} công việc`, "Số lượng"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text inside Donut */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-foreground">
                            {stats?.tasks.completed || 0}/{stats?.tasks.total || 0}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tasks</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-6 pt-2 border-t border-border/20">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-foreground">Hoàn thành: {stats?.tasks.completed || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="text-xs font-bold text-foreground">Chưa hoàn thành: {stats?.tasks.incomplete || 0}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Chart 2: Bar Chart - Hoạt động GitHub */}
                    <Card className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <BarChart3 size={18} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-foreground">Thống kê Hoạt động GitHub</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Số lượng Repositories, Commits và Pull Requests</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-xl text-[10px] font-bold py-0.5 px-2.5 border-primary/30 text-primary bg-primary/5 flex items-center gap-1">
                          <GitBranch size={12} />
                          <span>{stats?.github.repositoryCount || 0} Repos</span>
                        </Badge>
                      </div>

                      <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={githubChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                            <XAxis
                              dataKey="name"
                              stroke="currentColor"
                              className="text-[11px] font-bold text-muted-foreground"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="currentColor"
                              className="text-[10px] font-bold text-muted-foreground"
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                borderColor: "rgba(255, 255, 255, 0.15)",
                                borderRadius: "1rem",
                                color: "#ffffff",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                              itemStyle={{ color: "#ffffff" }}
                              labelStyle={{ color: "#ffffff" }}
                              formatter={(val: unknown) => [`${val ?? 0}`, "Số lượng"]}
                              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                            />
                            <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={45} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pt-2 border-t border-border/20 px-2">
                        <div className="flex items-center gap-1.5">
                          <Layers size={14} className="text-primary" />
                          <span>Kho lưu trữ: <strong className="text-foreground">{stats?.github.repositoryCount || 0}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GitCommit size={14} className="text-emerald-500" />
                          <span>Commits: <strong className="text-foreground">{stats?.github.commitCount || 0}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GitPullRequest size={14} className="text-amber-500" />
                          <span>PRs: <strong className="text-foreground">{stats?.github.pullRequestCount || 0}</strong></span>
                        </div>
                      </div>
                    </Card>

                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Heatmap Chart */}
            <TabsContent value="heatmap" className="outline-none">
              <StudentHeatmapTab courseId={courseId || ""} teamId={teamId} />
            </TabsContent>

            {/* Tab 5: Interaction Graph Chart */}
            <TabsContent value="interaction" className="outline-none">
              <StudentInteractionTab
                courseId={courseId || ""}
                teamId={teamId}
                teamMembers={membersList}
              />
            </TabsContent>
          </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

