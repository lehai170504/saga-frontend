"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { burndownData } from "@/mock-data/progress";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/DataState";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CheckCircle2 } from "lucide-react";

interface BurndownDay {
  day: string;
  ideal: number;
  actual: number;
}

export default function StudentBurndownPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<BurndownDay | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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

  const getClassName = (semId: string, classId: string) => {
    if (!semId || !classId) return "";
    const subjects = subjectsData[semId] || [];
    for (const sub of subjects) {
      const cls = sub.classes.find((c) => c.id === classId);
      if (cls) return `${sub.name} - ${cls.name}`;
    }
    return classId;
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    setSelectedSemester(sem);
    setSelectedClass(cls);

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-background min-h-screen">
      <PageHeader
        title="Biểu đồ Burndown"
        description={`Số Story Points còn lại — Sprint 4 của ${getClassName(selectedSemester, selectedClass)}`}
      />

      <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground flex flex-col pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 pb-8 gap-4">
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className="w-6 border-b-2 border-dashed"
                style={{ borderColor: "var(--secondary)" }}
              ></span>
              Tiến độ lý tưởng
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 border-b-2"
                style={{ borderColor: "var(--primary)" }}
              ></span>
              Tiến độ thực tế
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isLoading ? (
              <>
                <Skeleton className="w-28 h-8 rounded-full bg-muted" />
                <Skeleton className="w-28 h-8 rounded-full bg-muted" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                  Cam kết{" "}
                  <span className="text-foreground font-bold text-sm">80</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/80 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 rounded-full text-xs font-semibold transition-colors">
                  Còn lại <span className="font-bold text-sm">24</span>
                </div>
              </>
            )}
          </div>
        </div>

        <CardContent className="px-2 pb-6">
          <div className="h-[450px] w-full">
            {!mounted || isLoading ? (
              <div className="w-full h-full px-6">
                <Skeleton className="w-full h-full rounded-xl opacity-50 bg-muted" />
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => setIsError(false)} />
            ) : (
              <ResponsiveContainer width="100%" height={450} minWidth={0}>
                <ComposedChart
                  data={burndownData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  onClick={(e) => {
                    if (e && typeof e === "object" && "activePayload" in e) {
                      const activePayload = (
                        e as { activePayload?: { payload: BurndownDay }[] }
                      ).activePayload;
                      if (activePayload && activePayload.length > 0) {
                        setSelectedDay(activePayload[0].payload);
                      }
                    }
                  }}
                  className="cursor-pointer"
                >
                  <defs>
                    <linearGradient
                      id="colorActual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    domain={[0, 80]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--card-foreground)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    strokeWidth={3.5}
                    activeDot={{ r: 6, fill: "var(--primary)", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    stroke="var(--secondary)"
                    strokeDasharray="6 6"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <SheetContent className="bg-background border-l border-border sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl text-primary">
              Chi tiết ngày {selectedDay?.day}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Dữ liệu cập nhật từ Jira & GitHub
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted/40 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">
                Story Points còn lại
              </p>
              <p className="text-3xl font-extrabold text-foreground">
                {selectedDay?.actual}
              </p>
            </div>
            <h4 className="font-bold text-foreground pt-4 border-b border-border pb-2">
              Tasks đã hoàn thành
            </h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      SAGA-10{i}: API Integration
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hoàn thành bởi Minh Anh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
