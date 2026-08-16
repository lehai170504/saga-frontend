"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/axios";
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

  const { data: semestersPage, isLoading: isLoadingSemesters, error: semestersError } = useSemesters({ size: 50 });
  const semesters = useMemo(() => semestersPage?.content || [], [semestersPage?.content]);

  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      requestAnimationFrame(() => setSelectedSemester(semesters[0].id));
    }
  }, [semesters, selectedSemester]);

  const { data: coursesPage, isLoading: isLoadingCourses, error: coursesError } = useCourses({
    semesterId: selectedSemester,
    size: 100
  });
  const courses = coursesPage?.content || [];

  const isAccountInactive =
    (user?.accountStatus && user.accountStatus !== "ACTIVE") ||
    (semestersError instanceof ApiError && (semestersError.errorName === "ACCOUNT_STATUS_ACCESS_DENIED" || semestersError.status === 403)) ||
    (coursesError instanceof ApiError && (coursesError.errorName === "ACCOUNT_STATUS_ACCESS_DENIED" || coursesError.status === 403));

  const handleConfirmCardSelection = (courseId: string) => {
    router.push(`/student/${courseId}`);
  };

  const getSemesterStatus = (semId: string): "active" | "completed" => {
    const sem = semesters.find(s => s.id === semId);
    if (!sem) return "completed";
    const now = new Date();
    const start = new Date(sem.startDate);
    const end = new Date(sem.endDate);
    if (now >= start && now <= end) return "active";
    return "completed";
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

      {/* Account Inactive / Access Warning Banner */}
      {isAccountInactive && (
        <div className="p-6 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-start sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
            <AlertCircle size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-base text-foreground">Tài khoản chưa ở trạng thái hoạt động</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Tài khoản của bạn hiện ở trạng thái chưa kích hoạt hoặc chưa được xếp vào môn học/nhóm nào. Vui lòng xác nhận qua email hoặc liên hệ Quản trị viên hoặc Giảng viên để được kích hoạt và tham gia môn học.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCourses ? (
            Array.from({ length: 3 }).map((_, i) => (
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
                      ) : (
                        <span className="text-[10px] font-extrabold text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-border/50">
                          Đã kết thúc
                        </span>
                      )}
                    </div>

                    {/* Body: Subject Name & Instructor Info */}
                    <div className="p-6 pt-5 flex-1 bg-card flex flex-col justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {course.subject.name}
                      </h3>

                      {/* Instructor Info */}
                      {course.instructor ? (
                        <div className="flex items-center gap-2.5 pt-2 border-t border-border/30 text-xs">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0 overflow-hidden">
                            {course.instructor.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={course.instructor.avatarUrl} alt={course.instructor.fullName} className="w-full h-full object-cover" />
                            ) : (
                              course.instructor.fullName?.charAt(0) || "G"
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-foreground line-clamp-1 text-[13px]" title={course.instructor.fullName}>
                              GV: {course.instructor.fullName}
                            </span>
                            {course.instructor.email && (
                              <span className="text-[11px] text-muted-foreground line-clamp-1" title={course.instructor.email}>
                                {course.instructor.email}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic font-medium pt-2 border-t border-border/30">
                          Chưa phân công giảng viên
                        </span>
                      )}
                    </div>

                    {/* Footer: Class Name & Action */}
                    {(() => {
                      const academicClass = course.academicClass ?? course.clazz;
                      return (
                        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between mt-auto bg-card">
                          <span className="text-xs font-bold text-foreground">Lớp {academicClass?.name || "Chưa phân lớp"}</span>
                          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-sm">
                            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
