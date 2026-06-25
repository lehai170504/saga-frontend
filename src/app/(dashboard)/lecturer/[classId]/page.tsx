"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  LineChart,
  Line,
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
  { name: "Commit", value: 487, color: "#3b82f6" }, // blue-500
  { name: "Issue Activity", value: 346, color: "#22c55e" }, // green-500
  { name: "Pull Request", value: 224, color: "#f97316" }, // orange-500
  { name: "Comment", value: 158, color: "#a855f7" }, // purple-500
  { name: "Review", value: 101, color: "#ef4444" }, // red-500
];

export default function LecturerDashboard({ params }: { params: { classId: string } }) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Tổng quan hoạt động lớp (Overview)"
        description={`Lớp ${params.classId} - PBL Project | Khoảng thời gian: 01/05/2026 - 31/05/2026`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600">25</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-orange-500">142</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">578</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pull Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-600">186</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comments & Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-rose-500">324</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        {/* Line Chart Section */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">Hoạt động theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    name="Commits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="prs"
                    name="Pull Requests"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    name="Issues"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    name="Comments"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart Section */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Phân bố hoạt động theo loại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
