"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, Filter, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";

// Mock data generator for a specific group
const generateHeatmapData = (groupName: string) => {
  const students = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung", "Hoàng Văn Em", "Nguyễn Tuấn Anh"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1); // 30 days
  
  return students.map(student => ({
    name: student,
    group: groupName,
    data: days.map(day => {
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      let count = 0;
      if (!isWeekend) {
        count = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
        if (Math.random() > 0.9) count += Math.floor(Math.random() * 8) + 5;
      } else {
        count = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;
      }
      return { day, count };
    })
  }));
};

const getColorClass = (count: number) => {
  if (count === 0) return "bg-muted/20 border-border/10";
  if (count <= 2) return "bg-primary/20 border-primary/20";
  if (count <= 5) return "bg-primary/50 border-primary/30";
  if (count <= 8) return "bg-primary/80 border-primary/50";
  return "bg-primary border-primary shadow-[0_0_12px_rgba(234,88,12,0.4)]";
};

interface StudentHeatmapItem {
  name: string;
  group: string;
  data: { day: number; count: number }[];
}

export function StudentHeatmap() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [heatmapData, setHeatmapData] = useState<StudentHeatmapItem[]>([]);

  const subjectsData = [
    { code: "WDP301", name: "Dự án phát triển web", classId: "wdp301-pbl", className: "SE1801", project: "Nhóm PBL-01" },
    { code: "PRN211", name: "Lập trình C# nâng cao", classId: "prn211-pbl", className: "SE1802", project: "Nhóm PBL-02" },
    { code: "CS101", name: "Nhập môn Lập trình", classId: "cs101-pbl", className: "SE1803", project: "Nhóm PBL-03" },
    { code: "SWT301", name: "Kiểm thử phần mềm", classId: "swt301-pbl", className: "SE1804", project: "Nhóm PBL-04" },
    { code: "DBI202", name: "Hệ cơ sở dữ liệu", classId: "dbi202-pbl", className: "SE1805", project: "Nhóm PBL-05" },
  ];

  const getClassName = (classId: string) => {
    if (!classId) return "";
    const match = subjectsData.find((c) => c.classId === classId);
    if (match) return `${match.code} - Lớp ${match.className}`;
    return classId.toUpperCase();
  };

  const getStudentGroup = (classId: string) => {
    const match = subjectsData.find((c) => c.classId === classId);
    return match ? match.project : "Nhóm PBL-01";
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    
    setSelectedSemester(sem);
    setSelectedClass(cls);

    const groupName = subjectsData.find(c => c.classId === cls)?.project || "Nhóm PBL-01";
    setHeatmapData(generateHeatmapData(groupName));

    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <PageHeader
            title="Biểu đồ nhiệt Hoạt động"
            description={`Bản đồ nhiệt độ theo dõi tần suất đóng góp của các thành viên trong ${getStudentGroup(selectedClass)} (Lớp ${getClassName(selectedClass)})`}
          />

          {isLoading ? (
            <div className="flex gap-2">
              <Skeleton className="w-[140px] h-10 rounded-xl bg-muted" />
              <Skeleton className="w-[160px] h-10 rounded-xl bg-muted" />
              <Skeleton className="w-[140px] h-10 rounded-xl bg-muted" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Locked Group Indicator */}
              <div className="flex items-center gap-2 px-4 h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs shadow-[0_2px_8px_rgba(234,88,12,0.08)]">
                <Users size={14} />
                <span>{getStudentGroup(selectedClass)}</span>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card/40 backdrop-blur-md border-border/50 rounded-xl font-bold focus:ring-primary/20 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-muted-foreground" />
                    <SelectValue placeholder="Loại hoạt động" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50 rounded-xl">
                  <SelectItem value="all" className="text-xs font-semibold">Tất cả hoạt động</SelectItem>
                  <SelectItem value="commit" className="text-xs font-semibold">Chỉ Commits</SelectItem>
                  <SelectItem value="pr" className="text-xs font-semibold">Chỉ PRs</SelectItem>
                  <SelectItem value="issue" className="text-xs font-semibold">Chỉ Issues</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="month">
                <SelectTrigger className="w-full sm:w-[140px] h-10 bg-card/40 backdrop-blur-md border-border/50 rounded-xl font-bold focus:ring-primary/20 text-xs">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-muted-foreground" />
                    <SelectValue placeholder="Thời gian" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50 rounded-xl">
                  <SelectItem value="week" className="text-xs font-semibold">7 ngày qua</SelectItem>
                  <SelectItem value="month" className="text-xs font-semibold">30 ngày qua</SelectItem>
                  <SelectItem value="semester" className="text-xs font-semibold">Cả học kỳ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Heatmap Card */}
        <Card className="rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <Sparkles className="text-primary" size={18} />
                Tần suất hoạt động theo ngày (30 ngày qua)
              </CardTitle>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-muted-foreground bg-background/50 px-3.5 py-1.5 rounded-full border border-border/40">
                <span>Ít</span>
                <div className="flex gap-1 mx-2">
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-muted/20 border border-border/10" />
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-primary/20 border border-primary/20" />
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-primary/50 border border-primary/30" />
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-primary/80 border border-primary/50" />
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-primary border border-primary" />
                </div>
                <span>Nhiều</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 overflow-x-auto custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-[140px] h-6 rounded-lg bg-muted" />
                    <Skeleton className="flex-1 h-6 rounded-lg bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-w-[900px]">
                {/* Days Header */}
                <div className="flex mb-4 ml-[160px]">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] font-black text-muted-foreground/60 uppercase w-6">
                      {(i + 1) % 5 === 0 || i === 0 ? i + 1 : ""}
                    </div>
                  ))}
                </div>

                {/* Grid Rows */}
                <div className="space-y-3.5">
                  {heatmapData.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-[140px] shrink-0 flex flex-col items-end">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate w-full text-right">
                          {student.name}
                        </span>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wide">
                          {student.group}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex gap-1.5">
                        {student.data.map((dayData, dayIdx) => (
                          <div 
                            key={dayIdx} 
                            className="relative flex-1 group/cell"
                          >
                            <div 
                              className={`w-full aspect-shadow rounded-[4px] aspect-square border transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(dayData.count)}`}
                            />
                            {/* Custom Tooltip on Hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-foreground text-background text-[11px] font-bold rounded-xl opacity-0 invisible group-hover/cell:opacity-100 group-hover/cell:visible transition-all z-20 shadow-xl pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
                              {dayData.count === 0 ? 'Không có hoạt động' : `${dayData.count} hoạt động`} vào Ngày {dayData.day}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
