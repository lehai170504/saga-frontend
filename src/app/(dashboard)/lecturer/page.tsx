"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Network } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for classes
const MOCK_CLASSES = [
  {
    id: "SE1918",
    name: "Nhập môn Kỹ thuật phần mềm",
    semester: "Spring 2026",
    studentCount: 45,
    status: "active",
    theme: "from-indigo-500 via-purple-500 to-pink-500",
    bgAccent: "bg-primary/10",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
    tasks: 120,
    progress: 75,
  },
  {
    id: "SE1916",
    name: "Kiến trúc phần mềm",
    semester: "Summer 2026",
    studentCount: 38,
    status: "active",
    theme: "from-violet-400 via-indigo-500 to-rose-500",
    bgAccent: "bg-primary/10",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
    tasks: 85,
    progress: 40,
  },
  {
    id: "SE1912",
    name: "Quản lý dự án phần mềm",
    semester: "Spring 2026",
    studentCount: 50,
    status: "active",
    theme: "from-emerald-400 via-teal-500 to-cyan-500",
    bgAccent: "bg-success/10",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)]",
    tasks: 210,
    progress: 90,
  },
  {
    id: "SE1920",
    name: "Nhập môn Kỹ thuật phần mềm",
    semester: "Fall 2025",
    studentCount: 42,
    status: "completed",
    theme: "from-slate-400 via-gray-500 to-zinc-600",
    bgAccent: "bg-muted0/10",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(148,163,184,0.5)]",
    tasks: 150,
    progress: 100,
  },
];

export default function ClassSelectionPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const semesters = useMemo(() => {
    const s = new Set(MOCK_CLASSES.map((c) => c.semester));
    return Array.from(s);
  }, []);

  const filteredClasses = useMemo(() => {
    if (selectedSemester === "all") return MOCK_CLASSES;
    return MOCK_CLASSES.filter((c) => c.semester === selectedSemester);
  }, [selectedSemester]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-8">
          <PageHeader
            workspace="Workspace Giảng viên"
            title="Khởi động ngày mới, Chọn lớp học để quản lý"
            description="Lựa chọn một lớp học để bắt đầu theo dõi tiến độ và quản lý dự án."
          />

          <div className="w-full md:w-[280px]">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full h-12 rounded-xl bg-card/50 backdrop-blur-xl border-border/50 text-foreground font-semibold focus:ring-primary/20 transition-all hover:bg-card/80">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-muted-foreground" />
                  <SelectValue placeholder="Chọn học kỳ" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 backdrop-blur-xl bg-card/90 shadow-xl">
                <SelectItem value="all" className="font-semibold py-3 cursor-pointer">
                  Tất cả học kỳ
                </SelectItem>
                {semesters.map((s) => (
                  <SelectItem key={s} value={s} className="font-semibold py-3 cursor-pointer">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 h-[260px] flex flex-col">
                <div className="h-6 w-24 bg-muted rounded-md animate-pulse mb-4" />
                <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse mb-auto" />
                <div className="space-y-3 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-muted rounded-lg animate-pulse" />
                    <div className="h-14 bg-muted rounded-lg animate-pulse" />
                  </div>
                  <div className="h-10 w-full bg-muted rounded-lg animate-pulse mt-4" />
                </div>
              </div>
            ))
          ) : filteredClasses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
              <BookOpen size={48} className="mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium text-foreground">Không tìm thấy lớp học nào</p>
              <p className="text-sm">Vui lòng chọn học kỳ khác hoặc hiển thị tất cả.</p>
            </div>
          ) : (
            // Real Data State
            filteredClasses.map((cls) => (
              <div key={cls.id} className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-[280px]">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border/50">
                      {cls.id}
                    </div>
                    {cls.status === "active" ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </span>
                        Đang diễn ra
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                        Đã kết thúc
                      </div>
                    )}
                  </div>

                  <div className="mb-auto">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
                      <Calendar size={14} />
                      <span>{cls.semester}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex flex-col p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Users size={12} /> Sinh viên
                      </span>
                      <span className="text-lg font-bold text-foreground">{cls.studentCount}</span>
                    </div>
                    <div className="flex flex-col p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Network size={12} /> Nhiệm vụ
                      </span>
                      <span className="text-lg font-bold text-foreground">{cls.tasks}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link href={`/lecturer/${cls.id}`} className="block w-full">
                    <button className="w-full flex items-center justify-between px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-lg transition-colors group/btn">
                      Truy cập Dashboard
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
