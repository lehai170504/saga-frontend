"use client";

import { useCourses } from "../hooks/useCourses";
import { CreateCourseDialog } from "./create-course-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, GraduationCap, BookOpen, Network, Calendar, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CourseCards() {
  const { data: page, isLoading, error } = useCourses();
  const { user } = useAuth();
  const router = useRouter();

  const isAdmin = user?.applicationRole === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
        Đã có lỗi xảy ra khi tải danh sách khóa học.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Danh mục Khóa học"
        description="Quản lý danh sách khóa học và danh sách sinh viên."
        workspace="Master Data"
      >
        {isAdmin && <CreateCourseDialog />}
      </PageHeader>

      {page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.content.map((course) => (
            <Card key={course.id} className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-border transition-all duration-300 group overflow-hidden relative flex flex-col h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap size={64} className="text-primary transform rotate-12" />
              </div>
              <CardContent className="p-6 relative z-10 flex-grow flex flex-col gap-0">
                <div className="min-h-[4.5rem] flex flex-col justify-start mb-4 border-b border-border/50 pb-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary/80 mb-1">Mã khóa học</p>
                  <h3 className="text-2xl font-black tracking-tight text-foreground leading-tight">{course.courseCode}</h3>
                </div>

                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="line-clamp-1 text-foreground">{course.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded-xl">
                      <BookOpen size={14} className="shrink-0 text-primary/70" />
                      <span className="truncate" title={course.subject?.name}>{course.subject?.subjectCode || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded-xl">
                      <Network size={14} className="shrink-0 text-primary/70" />
                      <span className="truncate">{course.clazz?.classCode || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded-xl col-span-2">
                      <Calendar size={14} className="shrink-0 text-primary/70" />
                      <span className="truncate">{course.semester?.name || course.semester?.code || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-4 border-t border-border/50 mt-auto">
                    <Button
                      variant="default"
                      className="w-full rounded-xl gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all group-hover:shadow-md"
                      onClick={() => router.push(`/admin/classes/${course.id}`)}
                    >
                      <Network size={16} />
                      <span>Workspace Quản trị</span>
                      <ArrowRight size={16} className="ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </div>
                )}
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
