"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Activity, Settings2, ShieldAlert, Zap, Layers, Trophy, HeartPulse, Siren, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BroadcastDialog } from "@/features/notifications/components/broadcast-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

import {
  useDashboardTeamsProgress,
  useDashboardContributionSummary,
  useDashboardTrends,
  useDashboardAtRiskSummary
} from "@/features/lecturer/hooks/useDashboard";
import { useCourse } from "@/features/courses/hooks/useCourses";



const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
        <p className="font-bold mb-2 text-foreground">{label}</p>
        {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LeaderboardTeamItem = ({ team, courseId, index }: { team: any; courseId: string; index: number }) => {
  const activeSprints = team.activeSprints || [];
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(
    activeSprints.length > 0 ? activeSprints[0].sprintId : null
  );

  const currentSprint = activeSprints.find((s: any) => s.sprintId === selectedSprintId)
    || (activeSprints.length === 1 ? activeSprints[0] : null);

  const velocity = currentSprint
    ? currentSprint.completedStoryPoints
    : (team.currentSprintCompletedStoryPoints || 0);

  const trend = team.healthStatus || "N/A";
  const trendUp = team.healthStatus !== "AT_RISK" && team.healthStatus !== "CRITICAL";
  const name = team.teamName || "Nhóm Ẩn danh";

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-background/80 border border-border/50 hover:border-warning/30 hover:bg-warning/5 transition-all hover:scale-[1.02] shadow-sm gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${index === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border border-amber-200' : index === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border border-slate-100' : index === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-950 border border-orange-100' : 'bg-muted text-muted-foreground border border-border/50'}`}>
          {index + 1}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-sm text-foreground uppercase truncate">{name}</span>
          {activeSprints.length === 1 && (
            <span className="text-[10px] text-muted-foreground font-semibold truncate">{activeSprints[0].sprintName}</span>
          )}
          {activeSprints.length > 1 && (
            <div className="mt-0.5">
              <Select value={selectedSprintId || ""} onValueChange={setSelectedSprintId}>
                <SelectTrigger className="h-6 text-[10px] w-[110px] bg-background border-border/50 font-semibold focus:ring-0 px-2">
                  <SelectValue placeholder="Chọn Sprint" />
                </SelectTrigger>
                <SelectContent>
                  {activeSprints.map((s: any) => (
                    <SelectItem key={s.sprintId} value={s.sprintId} className="text-[10px] font-semibold">
                      {s.sprintName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-sm font-black text-foreground">{velocity} <span className="text-xs text-muted-foreground">SP</span></div>
          <div className={`text-[10px] font-bold flex items-center justify-end px-1.5 py-0.5 rounded bg-background border shadow-sm ${trendUp ? 'text-success border-success/20' : 'text-destructive border-destructive/20'}`}>
            {trendUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {trend}
          </div>
        </div>
        <Link href={`/lecturer/${courseId}/projects/${team.teamId}${selectedSprintId ? `?sprintId=${selectedSprintId}` : ''}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0 bg-muted/50 hover:bg-warning/20 hover:text-warning transition-colors border border-border/50">
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export function LecturerDashboardClient({ courseId }: { courseId: string }) {
  // Fetch real data from Backend
  const { data: course } = useCourse(courseId);
  const { data: teamsProgress, isLoading: loadingTeams } = useDashboardTeamsProgress(courseId);
  const { data: contribSummary, isLoading: loadingContrib } = useDashboardContributionSummary(courseId);
  const { data: trendsData, isLoading: loadingTrends } = useDashboardTrends(courseId);
  const { data: atRiskSummary, isLoading: loadingRisk } = useDashboardAtRiskSummary(courseId);

  const [selectedTeamId, setSelectedTeamId] = useState<string>("ALL");

  const isLoading = loadingTeams || loadingContrib || loadingTrends || loadingRisk;

  // 1. Trends Data -> Area Chart & Total SP
  const { dynamicVelocityData, uniqueTeams } = useMemo(() => {
    const sprints = (trendsData as any)?.sprints || [];

    // Extract unique teams
    const teamMap = new Map();
    sprints.forEach((s: any) => {
      if (s.teamId && !teamMap.has(s.teamId)) {
        teamMap.set(s.teamId, { id: s.teamId, name: s.teamName || `Team ${s.teamId.substring(0, 4)}` });
      }
    });
    const teams = Array.from(teamMap.values());

    // Filter and format data
    let formattedData = [];
    if (selectedTeamId === "ALL") {
      const sprintMap = new Map();
      sprints.forEach((s: any) => {
        const name = s.sprintName || "Unknown";
        if (!sprintMap.has(name)) {
          sprintMap.set(name, { date: name, sp: 0, slices: 0, endDate: s.endDate });
        }
        const entry = sprintMap.get(name);
        entry.sp += (s.currentCompletedStoryPoints || 0);
        entry.slices += (s.totalSlicesGenerated || 0);
      });
      formattedData = Array.from(sprintMap.values())
        .sort((a, b) => {
          const timeA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
          const timeB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
          return timeA - timeB;
        });
    } else {
      formattedData = sprints
        .filter((s: any) => s.teamId === selectedTeamId)
        .sort((a: any, b: any) => {
          const timeA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
          const timeB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
          return timeA - timeB;
        })
        .map((s: any) => ({
          date: s.sprintName || "Unknown",
          sp: s.currentCompletedStoryPoints || 0,
          slices: s.totalSlicesGenerated || 0
        }));
    }

    return { dynamicVelocityData: formattedData, uniqueTeams: teams };
  }, [trendsData, selectedTeamId]);

  const totalSP = (trendsData as any)?.sprints?.reduce((sum: number, s: any) => sum + (s.currentCompletedStoryPoints || 0), 0) || 0;

  // 2. Contribution Summary -> Stats
  const totalTeams = (contribSummary as any)?.teamCount || 0;
  const totalSlices = (contribSummary as any)?.totalSlicesGenerated || 0;

  // 3. At Risk Summary -> Stats, Radar Chart, Urgent Alerts, Class Health
  const totalWarnings = (atRiskSummary as any)?.totalWarnings || 0;
  const affectedTeams = (atRiskSummary as any)?.affectedTeams || 0;

  const dynamicRiskData = (atRiskSummary as any)?.warningDistribution
    ? Object.entries((atRiskSummary as any).warningDistribution).map(([key, value]) => ({
      name: key === "OVERDUE_TASK" ? "Quá hạn (Overdue)" : key,
      value: value as number,
      color: key === "OVERDUE_TASK" ? "#f59e0b" : "#ef4444"
    }))
    : [];

  const dynamicLeaderboard = Array.isArray((teamsProgress as any)?.teams) ? (teamsProgress as any).teams : [];

  const dynamicUrgentAlerts = (atRiskSummary as any)?.students?.map((s: any) => {
    // Look up team name from teamsProgress
    const teamObj = (teamsProgress as any)?.teams?.find((t: any) => t.teamId === s.teamId);
    const teamName = teamObj?.teamName || "Nhóm Không Xác Định";

    return {
      groupId: s.teamId,
      name: teamName,
      issue: `Thành viên có ${s.warningCount} cảnh báo: ${Object.keys(s.warningDistribution || {}).join(", ")}`,
      severity: "high"
    };
  }) || [];

  const healthyTeams = Math.max(0, totalTeams - affectedTeams);
  const dynamicClassHealth = [
    { name: "Khỏe mạnh", value: healthyTeams, color: "#10b981" },
    { name: "Rủi ro", value: affectedTeams, color: "#f59e0b" }
  ].filter(d => d.value > 0);

  const currentStatsData = [
    { title: "Tổng Số Nhóm", value: String(totalTeams), icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "Course", trendUp: true },
    { title: "Tổng Story Points", value: String(totalSP), icon: Layers, color: "text-success", bg: "bg-success/10", border: "border-success/20", trend: "Hoàn thành", trendUp: true },
    { title: "Slices Phát sinh", value: String(totalSlices), icon: Zap, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "Hệ thống", trendUp: true },
    { title: "Tổng Cảnh báo", value: String(totalWarnings), icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", trend: "Overdue", trendUp: true },
    { title: "Nhóm Rủi ro", value: String(affectedTeams), icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", trend: "Bị ảnh hưởng", trendUp: false },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold backdrop-blur-md">
              <ShieldCheck size={14} className="animate-pulse" />
              SAGA Agile Control Center
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Tổng quan Lớp {course?.name || courseId}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">Theo dõi toàn cảnh hiệu suất các nhóm dự án và xử lý rủi ro kịp thời.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 md:mt-0">
            <BroadcastDialog
              courseIds={[courseId]}
              triggerClassName="gap-2 rounded-full h-10 px-5 shadow-md shadow-indigo-500/20 bg-background border border-border/50 text-foreground hover:bg-muted font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            />
            <Link href={`/lecturer/${courseId}/evaluation-config`}>
              <Button className="gap-2 rounded-full h-10 px-5 shadow-md shadow-indigo-500/20 bg-primary hover:bg-indigo-700 font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                <Settings2 size={16} />
                Cấu hình Đánh giá
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentStatsData.map((stat, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-[1.5rem] border ${stat.border} bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500`} />

              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border} shadow-sm`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${stat.trendUp ? 'text-success bg-success/10 border-success/20' : 'text-warning bg-warning/10 border-warning/20'}`}>
                    <Activity size={12} />
                    {stat.trend}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden group hover:border-primary/20 transition-colors">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Biểu đồ Tốc độ (Velocity & Slices)
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Sản lượng Story Points và Cổ phần Đóng góp qua các Sprints.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger className="w-[180px] h-8 bg-background border-border/50 text-xs font-semibold shadow-sm rounded-lg">
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="text-xs font-semibold">Tất cả các Nhóm</SelectItem>
                      {uniqueTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id} className="text-xs font-semibold">
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div> Slices</span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm"><div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Story Points</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-[90%] h-[90%] rounded-xl" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynamicVelocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSlices" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight="bold" />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-10} fontWeight="bold" />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                      <Area type="monotone" dataKey="slices" name="Slices" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSlices)" />
                      <Area type="monotone" dataKey="sp" name="Story Points" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart for Warnings */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col group hover:border-destructive/30 transition-colors">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                <ShieldAlert size={20} />
                Radar Rủi ro Hệ thống
              </CardTitle>
              <CardDescription className="font-medium mt-1">Phân bổ rủi ro từ quá trình thực hiện dự án (VD: Quá hạn task).</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

              {isLoading ? (
                <div className="h-[220px] w-full flex items-center justify-center">
                  <Skeleton className="w-32 h-32 rounded-full" />
                </div>
              ) : (
                <div className="h-[220px] w-full relative z-10 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicRiskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={8}
                      >
                        {dynamicRiskData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none cursor-pointer" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Custom Legend */}
              <div className="w-full relative z-10 px-2">
                <ul className="flex flex-col gap-2.5">
                  {!isLoading && dynamicRiskData.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center justify-between text-xs font-semibold bg-background/80 p-2.5 rounded-xl border border-border/50 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                        <span className="text-foreground">{entry.name}</span>
                      </div>
                      <span className="font-bold px-2 py-0.5 rounded-md" style={{ color: entry.color, backgroundColor: `${entry.color}15` }}>
                        {entry.value} ca
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Urgent Alerts */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
                <Siren size={18} className="animate-pulse" />
                Cần Xử Lý Khẩn (Urgent)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {dynamicUrgentAlerts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm font-medium">Không có cảnh báo khẩn nào.</div>
                ) : (
                  dynamicUrgentAlerts.map((alert: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-xl border ${alert.severity === 'high' ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'} flex items-start gap-3 transition-all hover:scale-[1.02] group/alert`}>
                      <div className={`p-2 rounded-lg mt-0.5 shadow-sm ${alert.severity === 'high' ? 'bg-destructive text-white' : 'bg-warning text-white'}`}>
                        <AlertTriangle size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-black text-sm uppercase tracking-wider ${alert.severity === 'high' ? 'text-destructive' : 'text-warning'}`}>{alert.name}</span>
                          <Link href={`/lecturer/${courseId}/projects/${alert.groupId}`}>
                            <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full opacity-0 group-hover/alert:opacity-100 transition-opacity ${alert.severity === 'high' ? 'bg-destructive/20 hover:bg-destructive/30' : 'bg-warning/20 hover:bg-warning/30'}`}>
                              <ArrowRight size={12} />
                            </Button>
                          </Link>
                        </div>
                        <p className="text-xs font-semibold text-foreground/80 leading-snug">{alert.issue}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-warning/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-warning">
                <Trophy size={18} />
                Bảng vàng Năng suất
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {dynamicLeaderboard.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm font-medium">Chưa có dữ liệu năng suất.</div>
                ) : (
                  dynamicLeaderboard.map((team: any, idx: number) => (
                    <LeaderboardTeamItem key={idx} team={team} courseId={courseId} index={idx} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class Health -> Mức độ an toàn */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-success/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-success">
                <HeartPulse size={18} />
                Mức độ an toàn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-center">
              <div className="h-[180px] w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicClassHealth.length > 0 ? dynamicClassHealth : [{ name: "No data", value: 1, color: "#9ca3af" }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {(dynamicClassHealth.length > 0 ? dynamicClassHealth : [{ name: "No data", value: 1, color: "#9ca3af" }]).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:scale-105 transition-transform outline-none cursor-pointer" />
                      ))}
                    </Pie>
                    {dynamicClassHealth.length > 0 && <Tooltip content={<CustomTooltip />} />}
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-foreground drop-shadow-md">{totalTeams}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Tổng số Nhóm</span>
                </div>
              </div>

              {/* Progress/Legend */}
              <div className="mt-2 space-y-3 px-2">
                {dynamicClassHealth.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xs py-2">Chưa có dữ liệu an toàn lớp học.</div>
                ) : (
                  dynamicClassHealth.map((entry: any, idx: number) => {
                    const percentage = totalTeams > 0 ? Math.round((entry.value / totalTeams) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}
                          </span>
                          <span style={{ color: entry.color }}>{entry.value} nhóm ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/50 shadow-inner">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
