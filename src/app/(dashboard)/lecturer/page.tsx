"use client";

import { useState } from "react";
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
import { useAuthStore } from "@/stores/authStore";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useEarlyWarnings } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

function CourseStats({ courseId }: { courseId: string }) {
  const { data: studentsData, isLoading: isLoadingStudents } = useCourseStudents(courseId);
  const { data: warningsData, isLoading: isLoadingWarnings } = useEarlyWarnings(courseId);

  const teamsMap = new Set<string>();
  if (studentsData?.studentsWithTeam?.content) {
    studentsData.studentsWithTeam.content.forEach(student => {
      if (student.team?.teamId) {
        teamsMap.add(student.team.teamId);
      }
    });
  }
  const teamCount = teamsMap.size;
  const warningCount = warningsData?.warnings?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <div className="flex flex-col p-3.5 rounded-2xl bg-secondary/40 border border-border/50 group-hover:bg-secondary/60 transition-colors">
        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Users size={14} className="text-primary/70" /> Nhóm
        </span>
        <span className="text-lg font-black text-foreground">
          {isLoadingStudents ? <Skeleton className="h-5 w-8 mt-1" /> : teamCount}
        </span>
      </div>
      <div className="flex flex-col p-3.5 rounded-2xl bg-secondary/40 border border-border/50 group-hover:bg-secondary/60 transition-colors">
        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Network size={14} className="text-warning/70" /> Cảnh báo
        </span>
        <span className="text-lg font-black text-foreground">
          {isLoadingWarnings ? <Skeleton className="h-5 w-8 mt-1" /> : warningCount}
        </span>
      </div>
    </div>
  );
}

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
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-8">
          <PageHeader
            workspace="Workspace Giảng viên"
            title="Khởi động ngày mới, Chọn lớp học để quản lý"
            description="Lựa chọn một lớp học để bắt đầu theo dõi tiến độ và quản lý dự án."
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full sm:w-[240px] h-12 rounded-xl bg-card/50 backdrop-blur-xl border-border/50 text-foreground font-semibold focus:ring-primary/20 transition-all hover:bg-card/80">
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
              <div key={i} className="rounded-3xl border border-border/50 bg-card p-6 h-full min-h-[320px] flex flex-col shadow-sm">
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse mb-4" />
                <div className="h-8 w-3/4 bg-muted rounded-xl animate-pulse mb-4" />
                <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse mb-auto" />
                <div className="space-y-3 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-muted rounded-2xl animate-pulse" />
                    <div className="h-14 bg-muted rounded-2xl animate-pulse" />
                  </div>
                  <div className="h-12 w-full bg-muted rounded-2xl animate-pulse mt-4" />
                </div>
              </div>
            ))
          ) : courses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed border-border/60 rounded-[2rem] bg-muted/10">
              <div className="p-4 bg-muted/30 rounded-full mb-4">
                <BookOpen size={40} className="text-muted-foreground/60" />
              </div>
              <p className="text-xl font-bold text-foreground">Không tìm thấy lớp học nào</p>
              <p className="text-sm font-medium mt-1">Vui lòng chọn học kỳ khác hoặc thử lại sau.</p>
            </div>
          ) : (
            // Real Data State
            courses.map((course) => {
              const status = getSemesterStatus(course.semester.id);
              return (
                <div key={course.id} className="group relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col h-full min-h-[320px] overflow-hidden">
                  {/* Decorative Gradient Background */}
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  <div className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="mb-auto">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {course.name}
                        </h3>
                        <div className="shrink-0 mt-1">
                          {status === "active" ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-success bg-success/15 px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                              </span>
                              Đang diễn ra
                            </div>
                          ) : status === "upcoming" ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/15 px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                              </span>
                              Sắp diễn ra
                            </div>
                          ) : (
                            <div className="text-[11px] font-bold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                              Đã kết thúc
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                          <BookOpen size={16} className="text-primary/70" />
                          <span className="truncate" title={course.subject.name}>{course.subject.name} ({course.subject.subjectCode})</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                          <Calendar size={16} className="text-primary/70" />
                          <span>Học kỳ {course.semester.name}</span>
                        </div>
                      </div>
                    </div>

                    <CourseStats courseId={course.id} />
                  </div>

                  <div className="p-6 pt-0 mt-auto relative z-10">
                    <Link href={`/lecturer/${course.id}`} className="block w-full">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-sm rounded-2xl transition-all duration-300 group/btn shadow-sm">
                        Truy cập Dashboard
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
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
