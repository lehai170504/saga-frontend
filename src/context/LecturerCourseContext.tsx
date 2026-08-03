"use client";

import React, { createContext, useContext } from "react";
import { useParams } from "next/navigation";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { Course } from "@/features/courses/types";
import { Loader2 } from "lucide-react";

interface LecturerCourseContextType {
  courseId: string;
  course: Course | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const LecturerCourseContext = createContext<LecturerCourseContextType | undefined>(undefined);

export function LecturerCourseProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = (params?.courseId as string) || "";

  // Fetch dữ liệu của khóa học từ Backend
  const { data: course, isLoading, error, refetch } = useCourse(courseId);

  // Hiển thị Loading toàn màn hình nếu đang tải dữ liệu khóa học
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Đang tải không gian giảng dạy...</p>
      </div>
    );
  }

  // Bắt lỗi 403 / 404 nếu không có quyền hoặc không tìm thấy
  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] space-y-4 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
          <span className="text-2xl font-black">!</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Không thể truy cập khóa học</h2>
        <p className="text-muted-foreground max-w-md">Khóa học không tồn tại hoặc bạn không có quyền giảng dạy trong không gian này.</p>
      </div>
    );
  }

  return (
    <LecturerCourseContext.Provider value={{ courseId, course, isLoading, error, refetch }}>
      {children}
    </LecturerCourseContext.Provider>
  );
}

export function useLecturerCourse() {
  const context = useContext(LecturerCourseContext);
  if (context === undefined) {
    throw new Error("useLecturerCourse must be used within a LecturerCourseProvider");
  }
  return context;
}
