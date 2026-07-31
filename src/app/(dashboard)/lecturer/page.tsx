"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Network, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";

export default function ClassSelectionPage() {
  const { user } = useAuthStore();
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const { data: semestersPage, isLoading: isLoadingSemesters } = useSemesters({ size: 50 });
  const semesters = semestersPage?.content || [];

  const { data: coursesPage, isLoading: isLoadingCourses } = useCourses({
    semesterId: selectedSemester === "all" ? undefined : selectedSemester,
    instructorId: user?.localProfileId,
    size: 100
  });
  const courses = coursesPage?.content || [];

  const getSemesterStatus = (semId: string) => {
    const sem = semesters.find(s => s.id === semId);
    if (!sem) return "completed";
    const now = new Date();
    const start = new Date(sem.startDate);
    const end = new Date(sem.endDate);
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

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
                {isLoadingSemesters ? (
                  <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                ) : (
                  semesters.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="font-semibold py-3 cursor-pointer">
                      {s.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCourses ? (
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
          ) : courses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-xl bg-muted/20">
              <BookOpen size={48} className="mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium text-foreground">Không tìm thấy lớp học nào</p>
              <p className="text-sm">Vui lòng chọn học kỳ khác hoặc hiển thị tất cả.</p>
            </div>
          ) : (
            // Real Data State
            courses.map((course) => {
              const status = getSemesterStatus(course.semester.id);
              return (
                <div key={course.id} className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-[280px]">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border/50">
                        {course.clazz.name}
                      </div>
                      {status === "active" ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                          </span>
                          Đang diễn ra
                        </div>
                      ) : status === "upcoming" ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          Sắp diễn ra
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                          Đã kết thúc
                        </div>
                      )}
                    </div>

                    <div className="mb-auto">
                      <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {course.subject.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
                        <Calendar size={14} />
                        <span>{course.semester.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 opacity-30 cursor-not-allowed" title="Chức năng đang chờ API phân tích tích hợp">
                      <div className="flex flex-col p-3 rounded-lg bg-muted/50 border border-border/50">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Users size={12} /> Nhóm
                        </span>
                        <span className="text-lg font-bold text-foreground">--</span>
                      </div>
                      <div className="flex flex-col p-3 rounded-lg bg-muted/50 border border-border/50">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Network size={12} /> Cảnh báo
                        </span>
                        <span className="text-lg font-bold text-foreground">--</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/lecturer/${course.id}`} className="block w-full">
                      <button className="w-full flex items-center justify-between px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-lg transition-colors group/btn">
                        Truy cập Dashboard
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}
