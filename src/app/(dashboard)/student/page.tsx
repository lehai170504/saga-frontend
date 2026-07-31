"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useCourses } from "@/features/courses/hooks/useCourses";

export default function StudentSelectionPage() {
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [globalClassSelect, setGlobalClassSelect] = useState("all");

  const { data: semestersPage, isLoading: isLoadingSemesters } = useSemesters({ size: 50 });
  const semesters = semestersPage?.content || [];

  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0].id);
    }
  }, [semesters, selectedSemester]);

  const { data: coursesPage, isLoading: isLoadingCourses } = useCourses({
    semesterId: selectedSemester,
    size: 100
  });
  const courses = coursesPage?.content || [];

  const handleConfirmCardSelection = (classId: string) => {
    const handleConfirmCardSelection = (courseId: string) => {
      if (!selectedSemester || !courseId) return;
      router.push(`/student/${courseId}`);
    };

    const getSemesterStatus = (semId: string): "active" | "upcoming" | "completed" => {
      // Logic thực tế cần dựa vào startDate và endDate của semester, tạm mock rule:
      // Nếu chưa tới startDate -> upcoming
      // Nếu qua endDate -> completed
      // Giữa startDate và endDate -> active
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
      setGlobalClassSelect("all");
    };

    const filteredCourses = globalClassSelect === "all"
      ? courses
      : courses.filter((c) => c.clazz.id === globalClassSelect);

    // Group unique classes for the dropdown
    const uniqueClassesMap = new Map();
    courses.forEach(c => {
      if (!uniqueClassesMap.has(c.clazz.id)) {
        uniqueClassesMap.set(c.clazz.id, { id: c.clazz.id, name: c.clazz.name, subjectCode: c.subject.subjectCode });
      }
    });
    const dropdownClasses = Array.from(uniqueClassesMap.values());

    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
        @keyframes border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-border-rotate {
          animation: border-rotate 4s linear infinite;
        }
      `}} />
        <div className="flex flex-col justify-start min-h-[calc(100vh-72px)] p-6 md:p-12 bg-background animate-in fade-in slide-in-from-bottom-6 duration-600 space-y-8">
          {/* Header Title Section */}
          <div className="flex flex-col items-center text-center space-y-3 max-w-xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Lựa chọn Môn học
            </h1>
          </div>

          {/* Semester Categories Tab Menu - Left Aligned */}
          <div className="flex flex-wrap items-center justify-start gap-2 p-1.5 bg-muted/30 border border-border/30 rounded-2xl max-w-2xl ml-8 mr-auto shadow-sm backdrop-blur-sm min-h-[56px]">
            {isLoadingSemesters ? (
              <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground font-medium">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải học kỳ...
              </div>
            ) : semesters.length === 0 ? (
              <div className="px-4 text-sm text-muted-foreground font-medium">Không có học kỳ nào</div>
            ) : (
              semesters.map((sem) => (
                <button
                  key={sem.id}
                  onClick={() => handleSemesterChange(sem.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 ${selectedSemester === sem.id
                    ? "bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(234,88,12,0.25)] scale-[1.03]"
                    : "hover:bg-muted text-muted-foreground font-bold hover:text-foreground"
                    }`}
                >
                  {sem.name}
                </button>
              ))
            )}
          </div>

          {/* Global Class Dropdown Filter */}
          <div className="w-full flex justify-end px-8 animate-in fade-in duration-300 items-center gap-2">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground shrink-0 hidden sm:inline">
              Bộ lọc lớp:
            </Label>
            <Select
              value={globalClassSelect}
              onValueChange={setGlobalClassSelect}
            >
              <SelectTrigger className="w-48 h-10 bg-background/50 border-border/60 rounded-xl font-bold shadow-sm focus:ring-primary/20 text-xs">
                <SelectValue placeholder="-- Tất cả lớp học --" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4} className="rounded-xl border-border/60 bg-card">
                <SelectItem value="all" className="text-xs font-semibold rounded-lg">
                  -- Tất cả lớp học --
                </SelectItem>
                {dropdownClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id} className="text-xs font-semibold rounded-lg">
                    {cls.subjectCode} - {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Cards Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-8 mt-2 min-h-[400px]">
            {isLoadingCourses ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-h-[365px] aspect-[3/4] max-w-[340px] mx-0 w-full rounded-[2rem] bg-muted animate-pulse" />
              ))
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground font-semibold">
                Không có lớp học nào khớp với bộ lọc này.
              </div>
            ) : (
              filteredCourses.map((course) => {
                return (
                  <div
                    key={course.id}
                    className="relative p-[1.5px] overflow-hidden rounded-[2rem] group/card transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_0_40px_rgba(234,88,12,0.25)] flex flex-col items-start justify-between min-h-[365px] aspect-[3/4] max-w-[340px] mx-0 w-full"
                  >
                    {/* Rotating Gradient Running Border on Hover */}
                    <div className="absolute inset-[-500%] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                      <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_35%,#ea580c_50%,transparent_65%)] animate-border-rotate" />
                    </div>

                    {/* Card Inner Content */}
                    <Card
                      className="relative overflow-hidden w-full h-full bg-background/80 bg-card border border-white/10 dark:border-white/5 backdrop-blur-3xl rounded-[calc(2rem-1.5px)] p-8 flex flex-col items-start justify-between text-left z-10"
                    >
                      {/* Dreamy radial neon glow spots (behind content) */}
                      <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/25 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
                      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-primary/5 rounded-full blur-[35px] group-hover:bg-primary/15 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                      {/* Top Section: Left-Aligned Subject Info */}
                      <div className="flex flex-col items-start space-y-5 relative z-10 w-full mt-1">

                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg w-fit shadow-[0_2px_10px_rgba(234,88,12,0.08)]">
                            {course.subject.subjectCode}
                          </span>
                          {getSemesterStatus(selectedSemester) === "active" ? (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20 backdrop-blur-md">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                              </span>
                              ĐANG DIỄN RA
                            </div>
                          ) : getSemesterStatus(selectedSemester) === "upcoming" ? (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 backdrop-blur-md">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                              </span>
                              SẮP DIỄN RA
                            </div>
                          ) : (
                            <div className="text-[9px] font-bold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border backdrop-blur-md uppercase tracking-wider">
                              ĐÃ KẾT THÚC
                            </div>
                          )}
                        </div>

                        {/* Details wrapper */}
                        <div className="flex flex-col items-start space-y-2.5 w-full">
                          <h3 className="text-xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2 pr-2 text-left tracking-tight">
                            {course.subject.name}
                          </h3>

                          <p className="text-xs font-bold text-muted-foreground mt-1 bg-background/5 px-3 py-1 rounded-xl border border-white/10 dark:border-white/5 w-fit shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                            Lớp: {course.clazz.name}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Button - Arrow Style with Text */}
                      <div className="w-full relative z-10 mt-6 mb-1 flex justify-end">
                        <Button
                          onClick={() => handleConfirmCardSelection(course.id)}
                          className="h-11 rounded-full px-5 flex items-center gap-2 shadow-[0_4px_14px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.55)] bg-primary text-primary-foreground hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 group/btn"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
                          <ArrowRight className="w-4.5 h-4.5 group-hover/btn:translate-x-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </>
    );
  }
}
