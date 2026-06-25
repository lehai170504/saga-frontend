"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CheckCircle2, GitCommit, GitPullRequest, MessageSquare, TrendingUp, Sparkles, Activity } from "lucide-react";
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

// Mock data for activity timeline
const activityData = [
  { date: "01/05", commits: 45, prs: 12, issues: 20, comments: 15 },
  { date: "05/05", commits: 78, prs: 25, issues: 35, comments: 28 },
  { date: "10/05", commits: 112, prs: 40, issues: 45, comments: 50 },
  { date: "15/05", commits: 156, prs: 65, issues: 58, comments: 85 },
  { date: "20/05", commits: 130, prs: 55, issues: 40, comments: 65 },
  { date: "25/05", commits: 180, prs: 80, issues: 75, comments: 110 },
  { date: "31/05", commits: 245, prs: 110, issues: 90, comments: 145 },
];

// Mock data for activity distribution
const distributionData = [
  { name: "Commit", value: 487, color: "#6366f1" }, // indigo-500
  { name: "Issue", value: 346, color: "#14b8a6" }, // teal-500
  { name: "Pull Request", value: 224, color: "#f59e0b" }, // amber-500
  { name: "Comment", value: 158, color: "#ec4899" }, // pink-500
  { name: "Review", value: 101, color: "#8b5cf6" }, // violet-500
];

const statsData = [
  { title: "Tổng Sinh Viên", value: "25", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "+2", trendUp: true },
  { title: "Nhiệm Vụ Hoàn Thành", value: "142", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+15%", trendUp: true },
  { title: "Tổng Commits", value: "578", icon: GitCommit, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", trend: "+84", trendUp: true },
  { title: "Pull Requests", value: "186", icon: GitPullRequest, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "+12", trendUp: true },
  { title: "Tương tác & Review", value: "324", icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", trend: "+28%", trendUp: true },
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
              <Activity size={14} className="text-primary animate-pulse" />
              Real-time Analytics
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
              Dashboard Lớp {classId}
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi chi tiết hiệu suất và tương tác của sinh viên</p>
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
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <TrendingUp size={12} />
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
                    <Sparkles className="text-indigo-500" size={20} />
                    Tiến độ hoạt động dự án
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Xu hướng đóng góp theo thời gian thực</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Commits</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><div className="w-2 h-2 rounded-full bg-amber-500"></div> PRs</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area type="monotone" dataKey="commits" name="Commits" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" />
                    <Area type="monotone" dataKey="prs" name="Pull Requests" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPrs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="text-teal-500" size={20} />
                Phân bổ loại hình
              </CardTitle>
              <CardDescription className="font-medium mt-1">Tỷ lệ các hành động hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
              <div className="h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
