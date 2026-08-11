"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2, BookOpen, Calendar, Clock } from "lucide-react";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    const cleanName = fullName.replace(/\s*\(.*?\)\s*/g, '').trim();
    const parts = cleanName.split(" ");
    return parts.length > 0 ? parts[parts.length - 1] : "bạn";
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/10 p-8 md:p-10 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {getGreeting()}, <span className="text-primary">{getFirstName(user?.fullName)}</span> 👋
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base max-w-lg">
              Xem danh sách các môn học trong học kỳ hiện tại và truy cập nhanh vào không gian làm việc của bạn.
            </p>
          </div>

          <div className="w-full md:w-72 shrink-0 bg-background/50 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 shadow-sm">
            {isLoadingSemesters ? (
              <div className="h-11 rounded-xl bg-muted/50 animate-pulse w-full flex items-center px-4">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : semesters.length === 0 ? (
              <div className="h-11 rounded-xl bg-muted w-full flex items-center px-4 text-sm text-muted-foreground font-medium">
                Không có dữ liệu
              </div>
            ) : (
              <Select value={selectedSemester} onValueChange={handleSemesterChange}>
                <SelectTrigger className="w-full bg-background border-none shadow-none rounded-xl h-11 focus:ring-0 focus:ring-offset-0 font-semibold text-foreground">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  {semesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id} className="rounded-lg cursor-pointer font-medium py-2.5">
                      {sem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Decorative ambient elements */}
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[80px] opacity-60 pointer-events-none" />
        <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[60px] opacity-50 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Courses */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <BookOpen size={20} strokeWidth={2.5} />
              </div>
              Lớp học của bạn
            </h2>

            {courses.length > 0 && (
              <span className="text-xs font-bold uppercase tracking-wider bg-muted px-4 py-2 rounded-full text-muted-foreground border border-border/50">
                {courses.length} Lớp học
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoadingCourses ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[220px] w-full rounded-[2rem] bg-muted/40 animate-pulse border border-border/30" />
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-5 bg-card/50 border border-border/40 rounded-[2.5rem] border-dashed shadow-sm">
                <div className="w-20 h-20 bg-muted/50 rounded-[2rem] flex items-center justify-center text-muted-foreground border border-border/50">
                  <BookOpen size={32} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Chưa có môn học nào</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Không tìm thấy lớp học nào trong học kỳ này. Bạn thử chọn một học kỳ khác xem sao nhé.
                  </p>
                </div>
              </div>
            ) : (
              courses.map((course) => {
                const status = getSemesterStatus(selectedSemester);
                return (
                  <Card
                    key={course.id}
                    onClick={() => handleConfirmCardSelection(course.id)}
                    className="group overflow-hidden bg-background border border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer rounded-[2rem] flex flex-col"
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Header: Status and Subject Code */}
                      <div className="p-6 pb-4 flex items-start justify-between gap-4 bg-muted/20 group-hover:bg-primary/5 transition-colors duration-300 border-b border-border/40">
                        <span className="text-xs font-black text-primary tracking-widest uppercase bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10 shadow-sm">
                          {course.subject.subjectCode}
                        </span>
                        {status === "active" ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-emerald-500/20">
                            Đang diễn ra
                          </span>
                        ) : status === "upcoming" ? (
                          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-amber-500/20">
                            Sắp diễn ra
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-border/50">
                            Đã kết thúc
                          </span>
                        )}
                      </div>

                      {/* Body: Subject Name */}
                      <div className="p-6 pt-5 flex-1 bg-card">
                        <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {course.subject.name}
                        </h3>
                      </div>

                      {/* Footer: Class Name & Action */}
                      <div className="px-6 py-5 border-t border-border/50 flex items-center justify-between mt-auto bg-card">
                        <div className="flex items-center text-muted-foreground gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/50">
                            <span className="text-[10px] font-black text-foreground">{course.clazz.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-semibold">Lớp {course.clazz.name}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-sm">
                          <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Schedule / Quick Stats (Placeholder to fill space nicely) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            Lịch trình & Nhiệm vụ
          </h2>

          <Card className="rounded-[2rem] border-border/60 shadow-sm bg-card/50 overflow-hidden flex-1 min-h-[350px]">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-muted/50 rounded-[2rem] flex items-center justify-center text-muted-foreground border border-border/50">
                <Clock size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-2 max-w-[250px]">
                <h3 className="text-lg font-bold text-foreground">Chưa có nhiệm vụ</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Bạn đang rảnh rỗi! Không có lịch học hay bài tập nào sắp đến hạn trong tuần này.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
