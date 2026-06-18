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

const iconMap = {
  "Tổng số Commits (Tuần này)": (
    <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-100 shadow-sm">
      <GitCommit className="h-5 w-5 text-orange-600" />
    </div>
  ),
  "Tương tác nội bộ nhóm": (
    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
      <Users className="h-5 w-5 text-blue-600" />
    </div>
  ),
  "Sinh viên nguy cơ (Ít hoạt động)": (
    <div className="p-2.5 bg-red-50 rounded-xl border border-red-100 shadow-sm">
      <AlertTriangle className="h-5 w-5 text-red-500" />
    </div>
  ),
  "Task đã hoàn thành": (
    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    </div>
  ),
};

export default function OverviewDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Tổng quan lớp học
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Theo dõi tiến độ, hiệu suất và hoạt động của sinh viên trong toàn bộ
          dự án.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((kpi, index) => (
          <Card
            key={index}
            className="border-slate-200/60 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white"
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-600 w-2/3 leading-snug">
                {kpi.title}
              </CardTitle>
              {iconMap[kpi.title as keyof typeof iconMap]}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-xs font-medium mt-3 flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${
                    kpi.trend === "up"
                      ? "bg-emerald-100 text-emerald-700"
                      : kpi.trend === "down"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-slate-500">so với tuần trước</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
            Biểu đồ hoạt động tổng thể
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyActivityData}
                margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px", fontWeight: 500 }}
                />
                <Line
                  type="monotone"
                  name="Commits (Code)"
                  dataKey="commits"
                  stroke="#f97316" /* Orange SAGA */
                  strokeWidth={3.5}
                  dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                  activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  name="Comments (Tương tác)"
                  dataKey="comments"
                  stroke="#0052CC" /* Jira Blue */
                  strokeWidth={3.5}
                  dot={{ r: 4, fill: "#0052CC", strokeWidth: 0 }}
                  activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
