"use client";

import { useCourses } from "../hooks/useCourses";
import { CreateCourseDialog } from "./create-course-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { GraduationCap, BookOpen, Network, Calendar, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/shared/Skeleton";

export function CourseCards() {
  const { data: page, isLoading, error } = useCourses();
  const { user } = useAuth();
  const router = useRouter();

  const isAdmin = user?.applicationRole === "ADMIN";

  return (
 <div className="space-y-8 "> 
      <PageHeader
        title="Danh mục Khóa học"
        description="Quản lý danh sách khóa học và danh sách sinh viên."
        workspace="Master Data"
      >
        {isAdmin && <CreateCourseDialog />}
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
          Đã có lỗi xảy ra khi tải danh sách khóa học.
        </div>
      ) : page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.content.map((course) => (
            <Card key={course.id} className="rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col h-full group relative">
              <CardContent className="p-5 flex-grow flex flex-col gap-4">
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1" title={course.courseCode}>
                      {course.courseCode}
                    </h3>
                    <span className="inline-flex items-center justify-center text-[10px] font-bold px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-full uppercase tracking-wider shrink-0">
                      PBL
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-1" title={course.name}>
                    {course.name}
                  </p>
                </div>

                {/* Info List */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-1 text-xs text-muted-foreground flex-grow">
                  <span className="font-medium flex items-center gap-1.5" title="Môn học">
                    <BookOpen size={13} className="opacity-70" /> {course.subject?.subjectCode || "N/A"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                  <span className="font-medium flex items-center gap-1.5" title="Lớp">
                    <Network size={13} className="opacity-70" /> {(course.academicClass?.classCode ?? course.clazz?.classCode) || "N/A"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                  <span className="font-medium flex items-center gap-1.5" title="Học kỳ">
                    <Calendar size={13} className="opacity-70" /> {course.semester?.name || course.semester?.code || "N/A"}
                  </span>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {course.instructor ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold border border-primary/20">
                          {course.instructor.fullName?.charAt(0) || "G"}
                        </div>
                        <span className="text-[13px] font-semibold text-foreground truncate" title={course.instructor.fullName}>
                          {course.instructor.fullName}
                        </span>
                      </>
                    ) : (
                      <span className="text-[13px] text-muted-foreground italic font-medium">Chưa phân công</span>
                    )}
                  </div>

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-8 w-8 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all shrink-0"
                      onClick={() => router.push(`/admin/courses/${course.id}`)}
                    >
                      <ArrowRight size={15} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/20 rounded-[2rem] border border-border/50 border-dashed">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground mt-1">Hiện chưa có khóa học nào được tạo.</p>
        </div>
      )}
    </div>
  );
}

