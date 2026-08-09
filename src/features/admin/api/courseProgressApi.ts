import axiosInstance from "@/lib/axios";
import { PageResponse } from "./userApi";

export interface AdminCourseProgressResponse {
  courseId: string;
  courseCode: string;
  courseName: string;
  lecturer: {
    lecturerId: string;
    fullName: string;
  };
  teamCount: number;
  studentCount: number;
  projectCount: number;
  sprintCount: number;
  activeSprintCount: number;
  closedSprintCount: number;
  peerReviewCount: number;
}

export interface CourseProgressFilterParams {
  keyword?: string;
  semesterId?: string;
  lecturerId?: string;
  page?: number;
  size?: number;
}

export const courseProgressApi = {
  getCourseProgressOverview: (params?: CourseProgressFilterParams) => {
    return axiosInstance.get<never, PageResponse<AdminCourseProgressResponse>>("/api/admin/course-progress-overview", { params });
  }
};
