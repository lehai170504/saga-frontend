"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Activity, Settings2, ShieldAlert, Zap, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Legend,
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
  { title: "Tổng Số Nhóm", value: "12", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "Hoạt động", trendUp: true },
  { title: "Tổng Story Points", value: "842", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+125 SP", trendUp: true },
  { title: "Slices Phát sinh", value: "1,240", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", trend: "+18%", trendUp: true },
  { title: "Cảnh báo Đỏ (Red Flags)", value: "12", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", trend: "-2", trendUp: true },
  { title: "Cảnh báo Vàng (Cần theo dõi)", value: "27", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "+5", trendUp: false },
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

export default function LecturerDashboard({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <ShieldCheck size={14} className="text-primary animate-pulse" />
              SAGA Early Warning System
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
              Tổng quan Lớp {classId}
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi hiệu suất Agile và các rủi ro dự án trên toàn bộ các nhóm.</p>
          </div>
          <Link href={`/lecturer/${classId}/evaluation-config`}>
            <Button className="gap-2 rounded-xl h-10 px-5 shadow-md shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
              <Settings2 size={16} />
              Cấu hình AI Rules & Hệ số
            </Button>
          </Link>
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
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                    <Activity size={12} />
                    {stat.trend}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
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
                    <Activity className="text-indigo-500" size={20} />
                    Biểu đồ Velocity & Slices
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Sản lượng Story Points và Cổ phần Đóng góp qua các Sprints.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Slices</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Story Points</span>
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
                      <span className="font-black px-2 py-0.5 rounded-md" style={{ color: entry.color, backgroundColor: `${entry.color}15` }}>
                        {entry.value} ca
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
