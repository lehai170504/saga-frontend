"use client";

import React, { createContext, useContext } from "react";
import { useParams } from "next/navigation";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { Course } from "@/features/courses/types";
import { Loader2 } from "lucide-react";

interface LecturerClassContextType {
  classId: string;
  course: Course | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const LecturerClassContext = createContext<LecturerClassContextType | undefined>(undefined);

export function LecturerClassProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const classId = (params?.classId as string) || "";

  // Fetch dữ liệu của lớp học từ Backend
  const { data: course, isLoading, error, refetch } = useCourse(classId);

  // Hiển thị Loading toàn màn hình nếu đang tải dữ liệu lớp học
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
        <h2 className="text-2xl font-bold text-foreground">Không thể truy cập lớp học</h2>
        <p className="text-muted-foreground max-w-md">Lớp học không tồn tại hoặc bạn không có quyền giảng dạy trong không gian này.</p>
      </div>
    );
  }

  return (
    <LecturerClassContext.Provider value={{ classId, course, isLoading, error, refetch }}>
      {children}
    </LecturerClassContext.Provider>
  );
}

export function useLecturerClass() {
  const context = useContext(LecturerClassContext);
  if (context === undefined) {
    throw new Error("useLecturerClass must be used within a LecturerClassProvider");
  }
  return context;
}
