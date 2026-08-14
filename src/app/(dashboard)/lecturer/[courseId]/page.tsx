"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Activity, Settings2, ShieldAlert, Zap, Layers, Trophy, HeartPulse, Siren, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BroadcastDialog } from "@/features/notifications/components/broadcast-dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
      <div className="bg-card/80 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
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

export default function LecturerDashboard({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <ShieldCheck size={14} className="text-primary animate-pulse" />
              SAGA Early Warning System
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
              Tổng quan Lớp {courseId}
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi hiệu suất Agile và các rủi ro dự án trên toàn bộ các nhóm.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 md:mt-0">
            <BroadcastDialog courseIds={[courseId]} />
            <Link href={`/lecturer/${courseId}/evaluation-config`}>
              <Button className="gap-2 rounded-xl h-10 px-5 shadow-md shadow-indigo-500/20 bg-primary hover:bg-indigo-700 font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                <Settings2 size={16} />
                Cấu hình AI Rules & Hệ số
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-card/30 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50`} />

              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}`}>
                    <Activity size={12} />
                    {stat.trend}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Biểu đồ Velocity & Slices
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Sản lượng Story Points và Cổ phần Đóng góp qua các Sprints.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-primary"></div> Slices</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-success"></div> Story Points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSlices" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area type="monotone" dataKey="slices" name="Slices" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSlices)" />
                    <Area type="monotone" dataKey="sp" name="Story Points" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart for AI Warnings */}
          {/* Donut Chart for AI Warnings */}
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                <ShieldAlert size={20} />
                Radar Rủi ro AI
              </CardTitle>
              <CardDescription className="font-medium mt-1">Tỷ lệ các loại vi phạm phát hiện bởi Trợ lý SAGA.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
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
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="w-full relative z-10 px-2">
                <ul className="flex flex-col gap-3">
                  {aiWarningData.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center justify-between text-xs font-semibold bg-background/50 p-2 rounded-xl border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}</span>
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
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
                <Siren size={18} />
                Cảnh báo Khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {urgentAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${alert.severity === 'high' ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'} flex items-start gap-3 transition-all hover:scale-[1.02]`}>
                    <div className={`p-2 rounded-lg mt-0.5 ${alert.severity === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                      <AlertTriangle size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${alert.severity === 'high' ? 'text-destructive text-destructive' : 'text-warning text-warning'}`}>{alert.name}</span>
                        <Link href={`/lecturer/${courseId}/projects/${alert.groupId}`}>
                          <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-background/50">
                            <ArrowRight size={12} />
                          </Button>
                        </Link>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">{alert.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-warning/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-warning">
                <Trophy size={18} />
                Bảng xếp hạng Velocity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                {leaderboardData.map((team, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-foreground' : idx === 2 ? 'bg-orange-300 text-orange-950' : 'bg-muted text-muted-foreground'}`}>
                        {idx + 1}
                      </div>
                      <span className="font-bold text-sm text-foreground">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{team.velocity} SP</div>
                        <div className={`text-[10px] font-bold flex items-center justify-end ${team.trendUp ? 'text-success' : 'text-destructive'}`}>
                          {team.trendUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                          {team.trend}
                        </div>
                      </div>
                      <Link href={`/lecturer/${courseId}/projects/${team.groupId}`}>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 hover:bg-primary/10 hover:text-primary">
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
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-success/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-success">
                <HeartPulse size={18} />
                Sức khỏe Lớp học
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-center">
              <div className="h-[160px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {classHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-foreground">12</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Nhóm</span>
                </div>
              </div>

              {/* Progress/Legend */}
              <div className="mt-4 space-y-2">
                {classHealthData.map((entry, idx) => {
                  const percentage = Math.round((entry.value / 12) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground">{entry.name}</span>
                        <span style={{ color: entry.color }}>{entry.value} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: entry.color }} />
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
