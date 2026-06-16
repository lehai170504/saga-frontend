// src/app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiStats, weeklyActivityData } from "@/mock-data/overview";
import { Users, GitCommit, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mapping icon cho KPI
const iconMap = {
  "Tổng số Commits (Tuần này)": (
    <GitCommit className="h-4 w-4 text-indigo-500" />
  ),
  "Tương tác nội bộ nhóm": <Users className="h-4 w-4 text-blue-500" />,
  "Sinh viên nguy cơ (Ít hoạt động)": (
    <AlertTriangle className="h-4 w-4 text-rose-500" />
  ),
  "Task đã hoàn thành": <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

export default function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Tổng quan lớp học
        </h2>
        <p className="text-slate-500">
          Theo dõi tiến độ và hoạt động của sinh viên trong dự án.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((kpi, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {kpi.title}
              </CardTitle>
              {iconMap[kpi.title as keyof typeof iconMap]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {kpi.value}
              </div>
              <p
                className={`text-xs mt-1 ${kpi.trend === "up" ? "text-emerald-600" : kpi.trend === "down" ? "text-rose-600" : "text-slate-500"}`}
              >
                {kpi.change} so với tuần trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">
            Biểu đồ hoạt động tổng thể
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyActivityData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  name="Commits (Code)"
                  dataKey="commits"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Comments (Tương tác)"
                  dataKey="comments"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
