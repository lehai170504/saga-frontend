"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Activity, Settings2, ShieldAlert, Zap, Layers, Trophy, HeartPulse, Siren, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BroadcastDialog } from "@/features/notifications/components/broadcast-dialog";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy Load Recharts để tối ưu Bundle Size
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

// Mock data: Slices and Velocity (Story Points) accumulation over sprints/days
const velocityData = [
  { date: "Sprint 1", sp: 45, slices: 70 },
  { date: "Sprint 2", sp: 78, slices: 120 },
  { date: "Sprint 3", sp: 112, slices: 180 },
  { date: "Sprint 4", sp: 156, slices: 250 },
  { date: "Sprint 5", sp: 130, slices: 210 },
  { date: "Sprint 6", sp: 180, slices: 290 },
];

// Mock data: AI Early Warning Distribution across the entire class
const aiWarningData = [
  { name: "Ghosting (Zero Contribution)", value: 12, color: "#ef4444" }, // red-500
  { name: "Bus Factor (Mất cân bằng Slices)", value: 8, color: "#f59e0b" }, // amber-500
  { name: "Velocity Drop (Tiến độ lệch chuẩn)", value: 6, color: "#10b981" }, // emerald-500
  { name: "Technical Debt (Tỷ lệ Bug > 30%)", value: 15, color: "#6366f1" }, // indigo-500
  { name: "Xung đột NLP (Cãi vã PR)", value: 4, color: "#ec4899" }, // pink-500
];

const statsData = [
  { title: "Tổng Số Nhóm", value: "12", icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "Hoạt động", trendUp: true },
  { title: "Tổng Story Points", value: "842", icon: Layers, color: "text-success", bg: "bg-success/10", border: "border-success/20", trend: "+125 SP", trendUp: true },
  { title: "Slices Phát sinh", value: "1,240", icon: Zap, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "+18%", trendUp: true },
  { title: "Cảnh báo Đỏ (Red Flags)", value: "12", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", trend: "-2", trendUp: true },
  { title: "Cảnh báo Vàng (Cần theo dõi)", value: "27", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", trend: "+5", trendUp: false },
];

const urgentAlerts = [
  { groupId: "P03", name: "Nhóm 3", issue: "Nguy cơ trễ Sprint 4 (Tiến độ 30%)", severity: "high" },
  { groupId: "P05", name: "Nhóm 5", issue: "Ghosting: Lê Văn C (0 commits)", severity: "high" },
  { groupId: "P08", name: "Nhóm 8", issue: "Nợ kỹ thuật cao (Bug rate > 40%)", severity: "medium" },
];

const leaderboardData = [
  { groupId: "P01", name: "Nhóm 1", velocity: 156, trend: "+12%", trendUp: true },
  { groupId: "P07", name: "Nhóm 7", velocity: 142, trend: "+5%", trendUp: true },
  { groupId: "P02", name: "Nhóm 2", velocity: 138, trend: "-2%", trendUp: false },
  { groupId: "P04", name: "Nhóm 4", velocity: 120, trend: "+1%", trendUp: true },
];

const classHealthData = [
  { name: "On-track (Khỏe mạnh)", value: 8, color: "#10b981" }, // emerald
  { name: "At-risk (Có rủi ro)", value: 3, color: "#f59e0b" }, // amber
  { name: "Critical (Báo động)", value: 1, color: "#ef4444" }, // red
];

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

export function LecturerDashboardClient({ courseId }: { courseId: string }) {
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
              Tổng quan Lớp {courseId}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">Theo dõi toàn cảnh hiệu suất các nhóm dự án và xử lý rủi ro kịp thời.</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsData.map((stat, idx) => (
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Biểu đồ Tốc độ (Velocity & Slices)
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Sản lượng Story Points và Cổ phần Đóng góp qua các Sprints.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div> Slices</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm"><div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Story Points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart for AI Warnings */}
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col group hover:border-destructive/30 transition-colors">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                <ShieldAlert size={20} />
                Radar Rủi ro AI
              </CardTitle>
              <CardDescription className="font-medium mt-1">Phân bổ rủi ro phát hiện tự động bởi SAGA.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
              <div className="h-[220px] w-full relative z-10 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiWarningData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {aiWarningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="w-full relative z-10 px-2">
                <ul className="flex flex-col gap-2.5">
                  {aiWarningData.map((entry, index) => (
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
                {urgentAlerts.map((alert, idx) => (
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
                ))}
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
                {leaderboardData.map((team, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-background/80 border border-border/50 hover:border-warning/30 hover:bg-warning/5 transition-all hover:scale-[1.02] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${idx === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border border-amber-200' : idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border border-slate-100' : idx === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-950 border border-orange-100' : 'bg-muted text-muted-foreground border border-border/50'}`}>
                        {idx + 1}
                      </div>
                      <span className="font-bold text-sm text-foreground uppercase">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-black text-foreground">{team.velocity} <span className="text-xs text-muted-foreground">SP</span></div>
                        <div className={`text-[10px] font-bold flex items-center justify-end px-1.5 py-0.5 rounded bg-background border shadow-sm ${team.trendUp ? 'text-success border-success/20' : 'text-destructive border-destructive/20'}`}>
                          {team.trendUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                          {team.trend}
                        </div>
                      </div>
                      <Link href={`/lecturer/${courseId}/projects/${team.groupId}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0 bg-muted/50 hover:bg-warning/20 hover:text-warning transition-colors border border-border/50">
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
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
                  <span className="text-4xl font-black text-foreground drop-shadow-md">12</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Tổng số Nhóm</span>
                </div>
              </div>

              {/* Progress/Legend */}
              <div className="mt-2 space-y-3 px-2">
                {classHealthData.map((entry, idx) => {
                  const percentage = Math.round((entry.value / 12) * 100);
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
