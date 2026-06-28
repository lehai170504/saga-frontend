"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { weeklyActivityData } from "@/mock-data/overview";
import {
  GitCommit,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";

// Đã nâng cấp mảng data để hỗ trợ Dark Mode cho các badge màu nền
const recentActivities = [
  {
    user: "Minh Anh",
    action: "đã merge PR #142",
    time: "2 phút trước",
    status: "Success",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    icon: (
      <GitCommit className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    ),
  },
  {
    user: "Hoang Long",
    action: "đã bình luận trên Jira PBL-118",
    time: "11 phút trước",
    status: "Active",
    bg: "bg-blue-100 dark:bg-blue-950/40",
    icon: (
      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    ),
  },
  {
    user: "Thu Hien",
    action: "đã đóng task 'DB scripts'",
    time: "34 phút trước",
    status: "Done",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    icon: (
      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    ),
  },
];

export default function OverviewDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // Semester and Class descriptions mapping (matching layout.tsx)
  const semestersData = [
    { id: "summer-2026", name: "Summer 2026" },
    { id: "spring-2026", name: "Spring 2026" },
    { id: "fall-2025", name: "Fall 2025" },
  ];

  interface Subject {
    id: string;
    code: string;
    name: string;
    icon: string;
    classes: { id: string; name: string; project: string }[];
  }

  const subjectsData: Record<string, Subject[]> = {
    "summer-2026": [
      {
        id: "cse391",
        code: "CSE391",
        name: "Công nghệ phần mềm",
        icon: "code",
        classes: [
          { id: "cse391-pbl07", name: "Lớp SE102.O12", project: "Nhóm PBL-07" },
          { id: "cse391-pbl08", name: "Lớp SE102.O13", project: "Nhóm PBL-08" },
        ]
      },
      {
        id: "prn231",
        code: "PRN231",
        name: "Lập trình Web với .NET",
        icon: "globe",
        classes: [
          { id: "prn231-pbl02", name: "Lớp SE103.A11", project: "Nhóm PBL-02" },
          { id: "prn231-pbl03", name: "Lớp SE103.A12", project: "Nhóm PBL-03" },
        ]
      }
    ],
    "spring-2026": [
      {
        id: "swp391",
        code: "SWP391",
        name: "Dự án Phát triển Phần mềm",
        icon: "terminal",
        classes: [
          { id: "swp391-pbl03", name: "Lớp SE104.M21", project: "Nhóm PBL-03" },
          { id: "swp391-pbl04", name: "Lớp SE104.M22", project: "Nhóm PBL-04" },
        ]
      },
      {
        id: "swr302",
        code: "SWR302",
        name: "Yêu cầu phần mềm",
        icon: "book",
        classes: [
          { id: "swr302-pbl01", name: "Lớp SE105.D11", project: "Nhóm PBL-01" },
        ]
      }
    ],
    "fall-2025": [
      {
        id: "prn211",
        code: "PRN211",
        name: "Lập trình C# cơ bản",
        icon: "cpu",
        classes: [
          { id: "prn211-pbl05", name: "Lớp SE106.T12", project: "Nhóm PBL-05" },
        ]
      },
      {
        id: "mad101",
        code: "MAD101",
        name: "Toán rời rạc ứng dụng",
        icon: "database",
        classes: [
          { id: "mad101-pbl04", name: "Lớp SE107.V11", project: "Nhóm PBL-04" },
        ]
      }
    ],
  };

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

    // Listen to custom class changed events
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
            ? `${getSemesterName(selectedSemester)} · ${getClassName(selectedSemester, selectedClass)}`
            : "CSE391 - Công nghệ phần mềm"
        }
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : [...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-muted">
                  <GitCommit className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-bold transition-colors">
                  +12%
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">
                1.284
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Tổng số Commits
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
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="name" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--card-foreground)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                        fontWeight: 600,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="var(--primary)"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
                      activeDot={{
                        r: 7,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="var(--secondary)"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: "var(--secondary)", strokeWidth: 0 }}
                      activeDot={{
                        r: 7,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
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
    </div>
  );
}
