"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Activity, Settings2, ShieldAlert, Zap, Trophy, HeartPulse, Siren, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BroadcastDialog } from "@/features/notifications/components/broadcast-dialog";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTeamsProgress,
  useContributionSummary,
  useTrends,
  useAtRiskSummary
} from "../hooks/useCourseDashboard";
import { useCourse } from "@/features/courses/hooks/useCourses";

// Lazy Load Recharts
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-xl" /> });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
        <p className="font-bold mb-2 text-foreground">{label}</p>
        {payload.map((entry, index) => (
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

export function LecturerDashboardClient({ courseId }: { courseId: string }) {
  const { data: teamsProgress, isLoading: loadingProgress } = useTeamsProgress(courseId);
  const { data: contributionSummary, isLoading: loadingContribution } = useContributionSummary(courseId);
  const { data: trends, isLoading: loadingTrends } = useTrends(courseId);
  const { data: atRiskSummary, isLoading: loadingAtRisk } = useAtRiskSummary(courseId);
  const { data: course } = useCourse(courseId);

  const isLoading = loadingProgress || loadingContribution || loadingTrends || loadingAtRisk;

  // Process Trends Data
  const trendData = useMemo(() => {
    return trends?.sprints?.map(s => ({
      date: s.sprintName || s.endDate,
      value: s.currentCompletedStoryPoints || s.completedTasks
    })) || [];
  }, [trends]);

  // Process Warnings Data
  const warningStats = useMemo(() => {
    const distribution = atRiskSummary?.warningDistribution || {};
    const totalWarnings = atRiskSummary?.totalWarnings || 0;

    const data = Object.entries(distribution).map(([type, count]) => {
      let name = type;
      let color = "#f59e0b"; // default warning color
      if (type === "OVERDUE_TASK") {
        name = "Quá hạn Task";
        color = "#ef4444";
      } else if (type === "MSR") {
        name = "Task ảo (MSR)";
        color = "#f59e0b";
      }
      return { name, value: count, color };
    });

    return { data, totalWarnings };
  }, [atRiskSummary]);

  // Process Leaderboard
  const leaderboardData = useMemo(() => {
    if (!teamsProgress?.teams) return [];
    return [...teamsProgress.teams]
      .map(t => {
        const progressPercentage = t.currentSprintTaskCount > 0
          ? (t.currentSprintDoneTaskCount / t.currentSprintTaskCount) * 100
          : 0;
        return { ...t, progressPercentage };
      })
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 5); // top 5
  }, [teamsProgress]);

  // Calculate Average Progress
  const averageProgress = useMemo(() => {
    if (!teamsProgress?.teams || teamsProgress.teams.length === 0) return 0;
    let sum = 0;
    teamsProgress.teams.forEach(t => {
      const p = t.currentSprintTaskCount > 0 ? (t.currentSprintDoneTaskCount / t.currentSprintTaskCount) * 100 : 0;
      sum += p;
    });
    return sum / teamsProgress.teams.length;
  }, [teamsProgress]);

  // Process Class Health
  const classHealthData = useMemo(() => {
    const totalTeams = teamsProgress?.teams?.length || 0;
    if (totalTeams === 0) return [];

    const atRiskCount = atRiskSummary?.affectedTeams || 0;
    const healthyCount = Math.max(0, totalTeams - atRiskCount);

    return [
      { name: "Khỏe mạnh", value: healthyCount, color: "#10b981" }, // emerald
      { name: "Có rủi ro", value: atRiskCount, color: "#f59e0b" }, // amber
    ].filter(d => d.value > 0);
  }, [teamsProgress, atRiskSummary]);

  const totalTeams = teamsProgress?.teams?.length || 0;

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
              Tổng quan Lớp {course?.courseCode || course?.name || courseId}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">Theo dõi toàn cảnh tiến độ các nhóm dự án và xử lý rủi ro kịp thời.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 md:mt-0">
            <BroadcastDialog courseIds={[courseId]} />
            <Link href={`/lecturer/${courseId}/evaluation-config`}>
              <Button className="gap-2 rounded-xl h-10 px-5 shadow-md shadow-indigo-500/20 bg-primary hover:bg-indigo-700 font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                <Settings2 size={16} />
                Cấu hình Đánh giá
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Teams */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/20 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <Users size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tổng Số Nhóm</h3>
                <div className="text-3xl font-black text-foreground tracking-tight">{isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : totalTeams}</div>
              </div>
            </div>
          </div>

          {/* Total Contributions */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-success/20 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-success/10 blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20 shadow-sm">
                  <Zap size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tổng Đóng Góp</h3>
                <div className="text-3xl font-black text-foreground tracking-tight">{isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : contributionSummary?.totalSlicesGenerated || 0}</div>
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/20 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <Activity size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tiến Độ Trung Bình</h3>
                <div className="text-3xl font-black text-foreground tracking-tight">{isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : `${Math.round(averageProgress)}%`}</div>
              </div>
            </div>
          </div>

          {/* Teams at Risk */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-destructive/20 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-destructive/10 blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                  <ShieldAlert size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Nhóm Rủi Ro</h3>
                <div className="text-3xl font-black text-foreground tracking-tight">{isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : atRiskSummary?.affectedTeams || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden group hover:border-primary/20 transition-colors">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Tiến độ Tổng hợp (Trend)
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Sự thay đổi tiến độ theo thời gian toàn khóa học.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight="bold" />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-10} fontWeight="bold" />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                      <Area type="monotone" dataKey="value" name="Giá trị" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">Chưa có dữ liệu Trend</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart for Real Warnings */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col group hover:border-destructive/30 transition-colors">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                <ShieldAlert size={20} />
                Cảnh báo Hệ thống
              </CardTitle>
              <CardDescription className="font-medium mt-1">Phân bổ rủi ro thực tế từ hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center relative">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center"><Skeleton className="h-40 w-40 rounded-full" /></div>
              ) : warningStats.data.length > 0 ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                  <div className="h-[220px] w-full relative z-10 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={warningStats.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={8}
                        >
                          {warningStats.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none cursor-pointer" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full relative z-10 px-2">
                    <ul className="flex flex-col gap-2.5">
                      {warningStats.data.map((entry, index) => (
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
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">Không có cảnh báo nào</div>
              )}
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
                Cần Xử Lý Khẩn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {isLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                ) : atRiskSummary?.students && atRiskSummary.students.length > 0 ? (
                  atRiskSummary.students.map((student, idx) => (
                    <div key={idx} className="p-4 rounded-xl border bg-destructive/10 border-destructive/20 flex items-start gap-3 transition-all hover:scale-[1.02] group/alert">
                      <div className="p-2 rounded-lg mt-0.5 shadow-sm bg-destructive text-white">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm uppercase tracking-wider text-destructive">SV: {student.studentId}</span>
                          <Link href={`/lecturer/${courseId}/students/${student.studentId}`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover/alert:opacity-100 transition-opacity bg-destructive/20 hover:bg-destructive/30">
                              <ArrowRight size={12} />
                            </Button>
                          </Link>
                        </div>
                        <p className="text-xs font-semibold text-foreground/80 leading-snug flex items-center gap-2">
                          <span className="font-bold text-destructive">{student.warningCount} cảnh báo</span>
                          <span className="text-muted-foreground">- Mức độ: <span className="uppercase tracking-wider font-bold">{student.riskLevel}</span></span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm font-medium text-muted-foreground">Không có sinh viên rủi ro cao</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-warning/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-warning">
                <Trophy size={18} />
                Tiến độ Xuất sắc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {isLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
                ) : leaderboardData.length > 0 ? (
                  leaderboardData.map((team, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-background/80 border border-border/50 hover:border-warning/30 hover:bg-warning/5 transition-all hover:scale-[1.02] shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${idx === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border border-amber-200' : idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border border-slate-100' : idx === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-950 border border-orange-100' : 'bg-muted text-muted-foreground border border-border/50'}`}>
                          {idx + 1}
                        </div>
                        <span className="font-bold text-sm text-foreground uppercase truncate max-w-[120px]">{team.teamName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-black text-foreground">{Math.round(team.progressPercentage)} <span className="text-xs text-muted-foreground">%</span></div>
                          <div className="text-[10px] text-muted-foreground font-medium">{team.currentSprintDoneTaskCount}/{team.currentSprintTaskCount} tasks</div>
                        </div>
                        <Link href={`/lecturer/${courseId}/teams/${team.teamId}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0 bg-muted/50 hover:bg-warning/20 hover:text-warning transition-colors border border-border/50">
                            <ArrowRight size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm font-medium text-muted-foreground">Chưa có dữ liệu tiến độ</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class Health */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-success/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-success">
                <HeartPulse size={18} />
                Sức khỏe Toàn lớp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-center">
              {isLoading ? (
                <div className="w-full h-[180px] flex items-center justify-center"><Skeleton className="h-32 w-32 rounded-full" /></div>
              ) : classHealthData.length > 0 ? (
                <>
                  <div className="h-[180px] w-full relative mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={classHealthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={8}
                        >
                          {classHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:scale-105 transition-transform outline-none cursor-pointer" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
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
                    {classHealthData.map((entry, idx) => {
                      const percentage = Math.round((entry.value / totalTeams) * 100) || 0;
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
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">Chưa có thông tin sức khỏe lớp</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
