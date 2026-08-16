"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BookOpen, Users, Calendar, GraduationCap, Percent,
  Layout, User, ShieldCheck, Clock, Trash2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCourse, useDeleteCourse } from "@/features/courses/hooks/useCourses";
import { Skeleton } from "@/components/shared/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseDialog } from "@/features/courses/components/edit-course-dialog";
import { CourseStudentsTable } from "@/features/courses/components/course-students-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course, isLoading, isError } = useCourse(courseId);
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId);
      toast.success("Đã xóa khóa học thành công!");
      setOpenDelete(false);
      router.push("/admin/education");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa khóa học");
      console.error(error);
    }
  };

  if (isError) {
    return (
      <div className="space-y-8 -50 max-w-5xl mx-auto w-full pb-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-border/50 hover:bg-muted shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Lỗi tải dữ liệu"
            description={`Không thể tải thông tin khóa học ID: ${courseId}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-border/50 hover:bg-muted shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-48 rounded-xl" />
              </div>
            ) : (
              <PageHeader
                title={course?.name || "Chi tiết Khóa học"}
                description={`Mã KH: ${course?.courseCode}`}
              />
            )}
          </div>
        </div>

        {course && (
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="outline" className={`rounded-xl px-3 py-1.5 font-black uppercase tracking-widest ${course.courseStatus === 'OPEN' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 'text-muted-foreground border-border/50 bg-muted/30'}`}>
              Trạng thái: {course.courseStatus}
            </Badge>
            <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

            <EditCourseDialog courseId={courseId} />

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl px-4 font-semibold border-destructive/20 text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Khóa học
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Khóa học <strong className="text-foreground">{course.courseCode}</strong> và toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl font-semibold">Hủy</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    className="rounded-xl font-bold"
                    onClick={(e) => { e.preventDefault(); handleDelete(); }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Xác nhận Xóa
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
          <Skeleton className="h-48 w-full rounded-[2rem] md:col-span-2" />
        </div>
      ) : course ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5 gap-2">
            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Danh sách Sinh viên
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Thông tin Môn học & Lớp */}
              <div className="p-6 rounded-[2rem] bg-card/40 border border-border/50 shadow-sm space-y-6 flex flex-col">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Thông tin Môn học & Lớp
                </h3>

                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Môn học</div>
                      <div className="font-semibold">{course.subject.name}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Mã môn: {course.subject.subjectCode}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-background/50 border border-border/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Lớp học</div>
                      <div className="font-semibold">{(course.academicClass ?? course.clazz)?.name || "Chưa phân lớp"}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Mã lớp: {(course.academicClass ?? course.clazz)?.classCode || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Học kỳ & Giảng viên */}
              <div className="p-6 rounded-[2rem] bg-card/40 border border-border/50 shadow-sm space-y-6 flex flex-col">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Học kỳ & Phân công
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Học kỳ</div>
                      <div className="font-semibold">{course.semester?.name || course.semester?.code || "N/A"}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Giảng viên phụ trách</div>
                      <div className="font-semibold">{((course as unknown as Record<string, unknown>).lecturer as { fullName?: string; email?: string } || course.instructor)?.fullName || "Chưa phân công"}</div>
                      {((course as unknown as Record<string, unknown>).lecturer as { fullName?: string; email?: string } || course.instructor)?.email && (
                        <div className="text-sm text-muted-foreground mt-0.5">{((course as unknown as Record<string, unknown>).lecturer as { fullName?: string; email?: string } || course.instructor)?.email}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin Hệ thống */}
              <div className="p-6 rounded-[2rem] bg-card/40 border border-border/50 shadow-sm space-y-6 flex flex-col md:col-span-2 xl:col-span-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                  Thông tin Hệ thống
                </h3>

                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="w-full">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Ngày tạo</div>
                      <div className="font-semibold text-sm">{course.createdAt ? new Date(course.createdAt).toLocaleString("vi-VN") : "Chưa cập nhật"}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-background/50 border border-border/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="w-full">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cập nhật lần cuối</div>
                      <div className="font-semibold text-sm">{course.updatedAt ? new Date(course.updatedAt).toLocaleString("vi-VN") : "Chưa cập nhật"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trọng số Đánh giá */}
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-border/50 shadow-sm space-y-6 md:col-span-2 xl:col-span-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Percent className="w-5 h-5 text-primary" />
                    Trọng số Đánh giá
                  </h3>
                  <Badge variant="outline" className="rounded-xl font-bold bg-background text-foreground border-border/50">
                    Phạm vi: {course.contributionConfigMode === 'COURSE' ? 'Cấp Khóa học' : (course.contributionConfigMode || 'Chưa xác định')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-background/60 border border-border/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Test</span>
                    <span className="text-3xl font-black text-emerald-500">
                      {((course.testContributionWeight || 0)).toFixed(2)}%
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-background/60 border border-border/50 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-3">
                      <Layout className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Research</span>
                    <span className="text-3xl font-black text-purple-500">
                      {((course.researchContributionWeight || 0)).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          <TabsContent value="students" className="mt-0">
            <CourseStudentsTable courseId={courseId} courseClassName={(course.academicClass ?? course.clazz)?.name || "Chưa phân lớp"} />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
