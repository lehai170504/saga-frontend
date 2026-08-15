"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  CheckCircle2,
  CheckSquare,
  GitBranch,
  GitCommit,
  GitPullRequest,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
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
import { ProjectDashboardStatsResponse } from "@/features/projects/types";

interface OverallStatsTabProps {
  stats?: ProjectDashboardStatsResponse | null;
  isLoadingStats: boolean;
}

export function OverallStatsTab({ stats, isLoadingStats }: OverallStatsTabProps) {
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

  if (isLoadingStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks */}
        <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Tổng số Công việc
            </span>
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
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Đã Hoàn thành (Done)
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats?.tasks.completed || 0}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Còn lại <strong className="text-amber-500">{stats?.tasks.incomplete || 0}</strong> công việc
            </p>
          </div>
        </Card>

        {/* Card 3: Completion Percentage */}
        <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Tỷ lệ Hoàn thành
            </span>
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
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Hoạt động GitHub
            </span>
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
  );
}
