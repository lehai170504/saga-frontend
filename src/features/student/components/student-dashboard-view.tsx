"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCourse, useMyTeam } from "@/features/courses/hooks/useCourses";

interface StudentDashboardViewProps {
  courseId?: string;
}

export function StudentDashboardView({ courseId }: StudentDashboardViewProps) {
  const [mounted, setMounted] = useState(false);
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");
  const { data: teamData, isLoading: isLoadingTeam } = useMyTeam(courseId || "");

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = isLoadingCourse || isLoadingTeam || !mounted;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <PageHeader
        title="Tổng quan Khóa học"
        description={
          courseData
            ? `${courseData.semester?.name || ""} · Khóa học ${courseData.courseCode || ""} · ${courseData.subject?.subjectCode || ""}`
            : "Đang tải dữ liệu khóa học..."
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : (
            <>
              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  {courseData?.subject?.name || "Môn học"}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Môn học
                </p>
              </Card>

              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-success">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  {(courseData?.instructor as unknown as Record<string, unknown>)?.fullName as string || "Giảng viên"}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Giảng viên hướng dẫn
                </p>
              </Card>

              <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-muted text-warning">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  Đang hoạt động
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Trạng thái
                </p>
              </Card>
            </>
          )}
      </div>

      {/* Team Details Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-black tracking-tight mb-6 text-foreground">Thông tin Đội nhóm</h2>
        {isLoading ? (
          <Skeleton className="h-48 rounded-3xl w-full" />
        ) : teamData ? (
          <Card className="border-border shadow-sm rounded-3xl bg-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/50 pb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-foreground mb-2">{teamData.teamName}</h3>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold uppercase tracking-wider">
                    {teamData.roleInTeam === "LEADER" ? "Trưởng nhóm" : "Thành viên"}
                  </span>
                  • {teamData.project ? `Dự án: ${teamData.project.name}` : "Chưa có dự án"}
                </p>
              </div>
            </div>

            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Thành viên ({teamData.members?.content?.length || 0})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamData.members?.content?.map((member) => (
                <div key={member.studentId} className="flex items-center p-4 border border-border/50 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm mr-4">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.studentId}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {member.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.studentCode}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ml-2 whitespace-nowrap ${member.roleInTeam === "LEADER"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                    }`}>
                    {member.roleInTeam === "LEADER" ? "Trưởng nhóm" : "Thành viên"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="border-border shadow-sm rounded-3xl bg-card p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Chưa tham gia nhóm</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Bạn chưa được phân công vào nhóm nào trong lớp học này. Vui lòng liên hệ giảng viên hoặc tự tạo nhóm mới (nếu được phép).
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
