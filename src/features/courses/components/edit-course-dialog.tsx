"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { courseSchema, CourseFormValues } from "../schemas/courseSchema";
import { useUpdateCourse, useCourse } from "../hooks/useCourses";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { useClasses } from "@/features/classes/hooks/useClasses";
import { useSemesters } from "@/features/semesters/hooks/useSemesters";
import { useLecturers } from "@/features/user/hooks/useUsers";

interface EditCourseDialogProps {
  courseId: string;
}

export function EditCourseDialog({ courseId }: EditCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: course, isLoading: loadingCourse } = useCourse(open ? courseId : "");
  const { mutateAsync: updateCourse, isPending } = useUpdateCourse();

  // Load dropdown data
  const { data: subjectsPage, isLoading: loadingSubjects } = useSubjects({ size: 100 });
  const { data: classesPage, isLoading: loadingClasses } = useClasses({ size: 100 });
  const { data: semestersPage, isLoading: loadingSemesters } = useSemesters({ size: 100 });
  const { data: lecturers, isLoading: loadingLecturers } = useLecturers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: "",
      name: "",
      subjectId: "",
      classId: "",
      semesterId: "",
      instructorId: "",
    },
  });

  useEffect(() => {
    if (course && open) {
      reset({
        courseCode: course.courseCode,
        name: course.name,
        subjectId: course.subject.id,
        classId: course.clazz.id,
        semesterId: course.semester.id,
        instructorId: course.instructor.id,
      });
    }
  }, [course, open, reset]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      await updateCourse({ id: courseId, data });
      toast.success("Cập nhật khóa học thành công!");
      setOpen(false);
    } catch (error: unknown) {
      toast.error("Cập nhật khóa học thất bại!");
      console.error("Failed to update course", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl px-4 font-semibold shadow-sm transition-all">
          <Edit2 className="mr-2 h-4 w-4" />
          Sửa thông tin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cập nhật Khóa học</DialogTitle>
        </DialogHeader>

        {loadingCourse ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode" className="font-semibold text-foreground/80">
                Mã khóa học
              </Label>
              <Input
                id="courseCode"
                placeholder="VD: SE1701-PRJ301"
                className={`rounded-xl h-11 ${errors.courseCode ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("courseCode")}
              />
              {errors.courseCode && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.courseCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-foreground/80">
                Tên khóa học
              </Label>
              <Input
                id="name"
                placeholder="VD: Khóa PRJ301 lớp SE1701"
                className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground/80">Môn học</Label>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder={loadingSubjects ? "Đang tải..." : "Chọn môn học"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {subjectsPage?.content?.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.subjectCode} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subjectId && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.subjectId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground/80">Lớp học</Label>
              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder={loadingClasses ? "Đang tải..." : "Chọn lớp học"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {classesPage?.content?.map((clazz) => (
                        <SelectItem key={clazz.id} value={clazz.id}>
                          {clazz.classCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.classId && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.classId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground/80">Học kỳ</Label>
              <Controller
                name="semesterId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder={loadingSemesters ? "Đang tải..." : "Chọn học kỳ"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {semestersPage?.content?.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.code} - {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.semesterId && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.semesterId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground/80">Giảng viên</Label>
              <Controller
                name="instructorId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`rounded-xl h-11 ${errors.instructorId ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                      <SelectValue placeholder={loadingLecturers ? "Đang tải..." : "Chọn giảng viên phụ trách"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {loadingLecturers ? (
                        <SelectItem value="loading" disabled>Đang tải danh sách...</SelectItem>
                      ) : lecturers?.content && lecturers.content.length > 0 ? (
                        lecturers.content.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.id}>
                            {lecturer.fullName} ({lecturer.email})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>Không có giảng viên nào</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.instructorId && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.instructorId.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl h-11 px-6 font-semibold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl h-11 px-6 font-bold shadow-sm"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Đang lưu..." : "Lưu lại"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
