"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Activity, Sparkles, Network } from "lucide-react";
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
    bgAccent: "bg-indigo-500/10",
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
    theme: "from-amber-400 via-orange-500 to-rose-500",
    bgAccent: "bg-orange-500/10",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]",
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
    bgAccent: "bg-teal-500/10",
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
    bgAccent: "bg-slate-500/10",
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
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-8">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium backdrop-blur-md">
              <Sparkles size={16} className="animate-pulse" />
              <span>Workspace Giảng viên</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
              Khởi động ngày mới, <br className="hidden md:block" />
              Chọn lớp học để quản lý
            </h1>
          </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 overflow-hidden h-[340px] flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent animate-pulse" />
                <div className="relative flex justify-between items-start mb-6">
                  <div className="h-8 w-24 bg-muted/80 rounded-xl animate-pulse" />
                  <div className="h-8 w-28 bg-muted/80 rounded-full animate-pulse" />
                </div>
                <div className="h-8 w-3/4 bg-muted/80 rounded-lg animate-pulse mb-4" />
                <div className="h-5 w-1/2 bg-muted/80 rounded-lg animate-pulse mb-auto" />
                
                <div className="space-y-4 mt-8">
                  <div className="flex justify-between">
                    <div className="h-10 w-1/3 bg-muted/80 rounded-2xl animate-pulse" />
                    <div className="h-10 w-1/3 bg-muted/80 rounded-2xl animate-pulse" />
                  </div>
                  <div className="h-12 w-full bg-muted/80 rounded-xl animate-pulse mt-4" />
                </div>
              </div>
            ))
          ) : filteredClasses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">Không tìm thấy lớp học nào</p>
              <p className="text-sm">Vui lòng chọn học kỳ khác hoặc hiển thị tất cả.</p>
            </div>
          ) : (
            // Real Data State
            filteredClasses.map((cls, idx) => (
              <Link 
                href={`/lecturer/${cls.id}`} 
                key={cls.id} 
                className={`group block relative rounded-[2rem] transition-all duration-500 ease-out hover:-translate-y-2 ${cls.glow}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Glassmorphism Card */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/40 to-white/10 dark:from-white/5 dark:to-white/0 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] overflow-hidden">
                  {/* Hover Gradient Overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${cls.theme}`} />
                </div>

                {/* Card Content */}
                <div className="relative p-7 h-[340px] flex flex-col">
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className={`px-4 py-1.5 rounded-xl text-sm font-black border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md ${
                      cls.status === "active" ? "bg-white/60 dark:bg-black/40 text-foreground" : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {cls.id}
                    </div>
                    {cls.status === "active" ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        ĐANG DIỄN RA
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border backdrop-blur-md">
                        ĐÃ KẾT THÚC
                      </div>
                    )}
                  </div>

                  {/* Title Area */}
                  <div className="mb-auto">
                    <h3 className="text-2xl font-bold leading-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-300 line-clamp-2">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-3 text-muted-foreground font-medium">
                      <Calendar size={16} />
                      <span className="text-sm">{cls.semester}</span>
                    </div>
                  </div>

                  {/* Stats Area */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`flex flex-col p-3 rounded-2xl ${cls.bgAccent} border border-white/10 backdrop-blur-sm`}>
                      <span className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Users size={12} /> SINH VIÊN
                      </span>
                      <span className="text-xl font-black text-foreground">{cls.studentCount}</span>
                    </div>
                    <div className={`flex flex-col p-3 rounded-2xl ${cls.bgAccent} border border-white/10 backdrop-blur-sm`}>
                      <span className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Network size={12} /> NHIỆM VỤ
                      </span>
                      <span className="text-xl font-black text-foreground">{cls.tasks}</span>
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="relative h-12 w-full overflow-hidden rounded-xl bg-muted/30 border border-border/50 group-hover:border-transparent transition-colors">
                    {/* Progress Bar Background */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${cls.theme} opacity-20 transition-all duration-1000 ease-out`}
                      style={{ width: `${cls.progress}%` }}
                    />
                    
                    {/* Button Text */}
                    <div className="absolute inset-0 flex items-center justify-between px-5 font-semibold text-sm">
                      <span className="text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/70 transition-all">
                        Truy cập Dashboard
                      </span>
                      <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center backdrop-blur-md shadow-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={16} className="text-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
