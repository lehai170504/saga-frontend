import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Course, CourseRequest } from "../types";

export const courseApi = {
  getCourses: async (params?: { subjectId?: string; semesterId?: string; instructorId?: string; page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<Course>>("/api/v1/courses", { params });
  },

  getCourse: async (id: string) => {
    return axiosInstance.get<never, Course>(`/api/v1/courses/${id}`);
  },

  createCourse: async (data: CourseRequest) => {
    return axiosInstance.post<never, Course>("/api/v1/courses", data);
  },
};
