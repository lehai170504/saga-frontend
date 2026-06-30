"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitCommit, MessageSquare, CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { semestersData, subjectsData } from "@/mock-data/classes";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";
import { StudentScoreTraceGraph } from "@/features/student/components/student-score-trace-graph";

const recentActivities = [
  {
    user: "Minh Anh",
    action: "đã merge PR #142",
    time: "2 phút trước",
    status: "Success",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    icon: <GitCommit className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  },
  {
    user: "Hoang Long",
    action: "đã bình luận trên Jira PBL-118",
    time: "11 phút trước",
    status: "Active",
    bg: "bg-blue-100 dark:bg-blue-950/40",
    icon: <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  },
  {
    user: "Thu Hien",
    action: "đã đóng task 'DB scripts'",
    time: "34 phút trước",
    status: "Done",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  },
];

export function StudentDashboardView() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const offset = selectedClass ? selectedClass.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50 : 0;

  const dynamicActivityData = [
    { name: "Thứ 2", commits: 12 + offset % 5, comments: 8 + offset % 3 },
    { name: "Thứ 3", commits: 19 + offset % 8, comments: 15 + offset % 5 },
    { name: "Thứ 4", commits: 15 + offset % 4, comments: 10 + offset % 2 },
    { name: "Thứ 5", commits: 25 + offset % 10, comments: 20 + offset % 6 },
    { name: "Thứ 6", commits: 32 + offset % 15, comments: 22 + offset % 8 },
    { name: "Thứ 7", commits: 14 + offset % 6, comments: 12 + offset % 4 },
    { name: "CN", commits: 8 + offset % 3, comments: 5 + offset % 2 },
  ];

  const statsData = [
    {
      title: "Tổng số Commits",
      value: (124 + offset * 5).toString(),
      trend: "+12%",
      trendUp: true,
      icon: <GitCommit className="h-5 w-5 text-foreground" />,
    },
    {
      title: "Bình luận",
      value: (45 + offset * 2).toString(),
      trend: "+5%",
      trendUp: true,
      icon: <MessageSquare className="h-5 w-5 text-foreground" />,
    },
    {
      title: "Task hoàn thành",
      value: (32 + offset).toString(),
      trend: "+18%",
      trendUp: true,
      icon: <CheckCircle2 className="h-5 w-5 text-foreground" />,
    },
    {
      title: "Cảnh báo rủi ro",
      value: (offset % 5).toString(),
      trend: "-2%",
      trendUp: false,
      icon: <AlertTriangle className="h-5 w-5 text-foreground" />,
    },
  ];

  const getSemesterName = (semId: string) => {
    return semestersData.find((s) => s.id === semId)?.name ?? semId;
  };

  const getClassName = (semId: string, classId: string) => {
    if (!semId || !classId) return "";
    const subjects = subjectsData[semId] || [];
    for (const sub of subjects) {
      const cls = sub.classes.find((c) => c.id === classId);
      if (cls) return `${sub.name} - ${cls.name}`;
    }
    return classId;
  };

  const getClassProject = (semId: string, classId: string) => {
    if (!semId || !classId) return "";
    const subjects = subjectsData[semId] || [];
    for (const sub of subjects) {
      const cls = sub.classes.find((c) => c.id === classId);
      if (cls) return cls.project;
    }
    return "";
  };

  useEffect(() => {
    setMounted(true);

    const loadSelection = () => {
      const sem = localStorage.getItem("saga-student-semester") || "";
      const cls = localStorage.getItem("saga-student-class") || "";
      setSelectedSemester(sem);
      setSelectedClass(cls);
    };

    loadSelection();
    const timer = setTimeout(() => setIsLoading(false), 800);

    window.addEventListener("saga-student-class-changed", loadSelection);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("saga-student-class-changed", loadSelection);
    };
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <PageHeader
        title="Tổng quan — Sprint 4"
        description={
          selectedSemester && selectedClass
            ? `${getSemesterName(selectedSemester)} · ${getClassName(selectedSemester, selectedClass)} · ${getClassProject(selectedSemester, selectedClass)}`
            : "Đang tải dữ liệu lớp học..."
        }
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : statsData.map((stat, i) => (
            <Card
              key={i}
              className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-muted">
                  {stat.icon}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${stat.trendUp ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400' : 'text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">
                {stat.value}
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </p>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border shadow-sm rounded-2xl bg-card text-card-foreground flex flex-col pt-2">
          <SectionHeader
            title="Mã nguồn & Tương tác"
            description="Chỉ số hoạt động hàng ngày"
          />
          <CardContent className="px-2 pb-6">
            <div className="h-80 w-full mt-4">
              {!mounted || isLoading ? (
                <Skeleton className="w-full h-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <AreaChart data={dynamicActivityData}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--card-foreground)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                        fontWeight: 600,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="commits"
                      name="Commits"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCommits)"
                      activeDot={{
                        r: 6,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      name="Bình luận"
                      stroke="var(--secondary)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorComments)"
                      activeDot={{
                        r: 6,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-border shadow-sm rounded-2xl bg-card text-card-foreground flex flex-col pt-2">
          <SectionHeader title="Hoạt động gần đây" />
          <CardContent className="p-6">
            {recentActivities.length === 0 ? (
              <EmptyState message="Chưa có hoạt động mới" />
            ) : (
              <div className="space-y-6">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div
                      className={`p-2 rounded-full ${act.bg} shrink-0 transition-colors`}
                    >
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {act.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {act.action}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Score Trace Graph */}
      <StudentScoreTraceGraph />
    </div>
  );
}
