"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2, BookOpen, Clock, Activity } from "lucide-react";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function StudentSelectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { data: semestersPage, isLoading: isLoadingSemesters } = useSemesters({ size: 50 });
  const semesters = useMemo(() => semestersPage?.content || [], [semestersPage?.content]);

  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      requestAnimationFrame(() => setSelectedSemester(semesters[0].id));
    }
  }, [semesters, selectedSemester]);

  const { data: coursesPage, isLoading: isLoadingCourses } = useCourses({
    semesterId: selectedSemester,
    size: 100
  });
  const courses = coursesPage?.content || [];

  const handleConfirmCardSelection = (courseId: string) => {
    // Điều hướng vào trong lớp học
    router.push(`/student/${courseId}`);
  };

  const getSemesterStatus = (semId: string): "active" | "upcoming" | "completed" => {
    const sem = semesters.find(s => s.id === semId);
    if (!sem) return "completed";
    const now = new Date();
    const start = new Date(sem.startDate);
    const end = new Date(sem.endDate);
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

  const handleSemesterChange = (semId: string) => {
    setSelectedSemester(semId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getFirstName = (fullName?: string) => {
    if (!fullName) return "bạn";
    // Loại bỏ phần trong ngoặc đơn (nếu có) như " (K18 HCM)"
    const cleanName = fullName.replace(/\s*\(.*?\)\s*/g, '').trim();
    const parts = cleanName.split(" ");
    return parts.length > 0 ? parts[parts.length - 1] : "bạn";
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)] pb-16 w-full animate-in fade-in duration-500">
      {/* Header Area - Full width background, fluid content */}
      <div className="bg-background border-b border-border/40 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] w-full">
        <div className="w-full px-4 md:px-8 xl:px-12 py-8 md:py-10 space-y-6 md:space-y-8">
          <div className="flex flex-col space-y-2 md:space-y-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              {getGreeting()}, {getFirstName(user?.fullName)}
            </h1>
            <p className="text-muted-foreground font-medium text-base">
              Chọn không gian làm việc môn học của bạn để tiếp tục.
            </p>
          </div>

          {/* Toolbar: Search & Filters */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full">
            {/* Semester Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/30 border border-border/30 rounded-2xl w-full xl:w-auto">
              {isLoadingSemesters ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang tải học kỳ...
                </div>
              ) : semesters.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground font-medium">Không có học kỳ nào</div>
              ) : (
                semesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => handleSemesterChange(sem.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${selectedSemester === sem.id
                      ? "bg-background text-foreground shadow-sm border border-border/40 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    {sem.name}
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
      </div>


      {/* Main Content: Courses Grid */}
      <div className="w-full mt-8 md:mt-10">
        <div className="w-full px-4 md:px-8 xl:px-12">
          {/* Fluid grid: 1 col on mobile, 2 cols on lg, 3 cols on 2xl */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 xl:gap-8 w-full">
            {isLoadingCourses ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 w-full rounded-3xl bg-muted/40 animate-pulse border border-border/30" />
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-5 bg-muted/10 border border-border/40 rounded-[2rem] border-dashed">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-muted-foreground shadow-sm">
                  <BookOpen size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Không tìm thấy môn học</h3>
                <p className="text-base text-muted-foreground max-w-md">
                  Hiện tại không có lớp học nào khớp với bộ lọc. Hãy thử tìm kiếm với từ khóa khác nhé.
                </p>
              </div>
            ) : (
              courses.map((course) => {
                const status = getSemesterStatus(selectedSemester);
                return (
                  <Card
                    key={course.id}
                    onClick={() => handleConfirmCardSelection(course.id)}
                    className="group relative overflow-hidden bg-background border border-border/50 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-[1.75rem] flex flex-col justify-center"
                  >
                    {/* Premium top border glow on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Responsive Vertical Layout for the Card */}
                    <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between relative z-10 w-full gap-6">

                      <div className="flex flex-col space-y-6">
                        {/* Top: Icon & Action Button */}
                        <div className="flex justify-between items-start w-full">
                          <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                            <BookOpen size={32} strokeWidth={1.5} />
                          </div>

                          <div className="w-12 h-12 shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-md">
                            <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Middle: Details */}
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="whitespace-nowrap text-[11px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
                              {course.subject.subjectCode}
                            </span>
                            {status === "active" ? (
                              <span className="whitespace-nowrap flex items-center gap-1.5 text-[11px] font-bold text-success bg-success/15 px-3 py-1 rounded-md border border-success/30">
                                <Activity size={14} strokeWidth={2.5} />
                                ĐANG DIỄN RA
                              </span>
                            ) : status === "upcoming" ? (
                              <span className="whitespace-nowrap flex items-center gap-1.5 text-[11px] font-bold text-warning bg-warning/15 px-3 py-1 rounded-md border border-warning/30">
                                <Clock size={14} strokeWidth={2.5} />
                                SẮP DIỄN RA
                              </span>
                            ) : (
                              <span className="whitespace-nowrap flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-md border border-border/50">
                                <Clock size={14} strokeWidth={2.5} />
                                ĐÃ KẾT THÚC
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                            {course.subject.name}
                          </h3>
                        </div>
                      </div>

                      {/* Bottom: Class Info */}
                      <div className="pt-5 border-t border-border/50 flex items-center justify-between w-full mt-auto">
                        <span className="whitespace-nowrap text-xs text-muted-foreground font-semibold uppercase tracking-wider shrink-0">Lớp học</span>
                        <span className="text-sm md:text-base font-bold text-foreground truncate pl-4 text-right">{course.clazz.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
