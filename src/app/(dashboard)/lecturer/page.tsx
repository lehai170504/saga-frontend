"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users, Calendar, ArrowRight, Activity } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";

// Mock data for classes
const MOCK_CLASSES = [
  {
    id: "SE102-1",
    name: "Nhập môn Kỹ thuật phần mềm",
    semester: "Học kỳ 1 - 2026",
    studentCount: 45,
    status: "active",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
  },
  {
    id: "SE104-2",
    name: "Kiến trúc phần mềm",
    semester: "Học kỳ 1 - 2026",
    studentCount: 38,
    status: "active",
    color: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20",
  },
  {
    id: "SE114-1",
    name: "Quản lý dự án phần mềm",
    semester: "Học kỳ 1 - 2026",
    studentCount: 50,
    status: "active",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
  },
  {
    id: "SE102-3",
    name: "Nhập môn Kỹ thuật phần mềm",
    semester: "Học kỳ 2 - 2025",
    studentCount: 42,
    status: "completed",
    color: "from-gray-400 to-slate-400",
    shadow: "shadow-gray-400/20",
  },
];

export default function ClassSelectionPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Xin chào, Giảng viên!
        </h1>
        <p className="text-muted-foreground text-lg">
          Dưới đây là tổng quan các lớp học bạn đang phụ trách.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="text-primary" />
          Lớp học của bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-2xl border-border overflow-hidden">
                  <div className="h-2 w-full bg-muted" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </CardContent>
                </Card>
              ))
            : MOCK_CLASSES.map((cls) => (
                <Link href={`/lecturer/${cls.id}`} key={cls.id} className="group">
                  <Card className={`rounded-2xl border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col ${cls.shadow} bg-card/50 backdrop-blur-sm border-white/10`}>
                    <div className={`h-2 w-full bg-gradient-to-r ${cls.color} transition-all duration-500 group-hover:h-3`} />
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="px-3 py-1 rounded-md bg-background/80 backdrop-blur-md shadow-sm text-foreground text-xs font-bold border border-border/50">
                          {cls.id}
                        </div>
                        {cls.status === "active" ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1 rounded-full shadow-inner">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Đang diễn ra
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                            Đã kết thúc
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 mt-2">
                        {cls.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-2 font-medium">
                        <Calendar size={14} />
                        {cls.semester}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between mb-5 text-sm text-muted-foreground font-medium bg-muted/30 p-3 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-primary" />
                          <span>{cls.studentCount} SV</span>
                        </div>
                        <div className="w-[1px] h-4 bg-border"></div>
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-orange-500" />
                          <span>Hoạt động tốt</span>
                        </div>
                      </div>
                      <div className="w-full py-3 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
                        Vào bảng điều khiển
                        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
