import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Course, CourseRequest, TeamMemberResponse, CourseStudentsResponse, MyTeamMembersResponse } from "../types";

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

  importStudents: async (courseId: string, formData: FormData) => {
    return axiosInstance.post<never, string>(`/api/v1/courses/${courseId}/import-students`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getTeamMembers: async (courseId: string, teamId: string, params?: { page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<TeamMemberResponse>>(`/api/v1/courses/${courseId}/teams/${teamId}/members`, { params });
  },

  getCourseStudents: async (
    courseId: string,
    params?: { keyword?: string; hasTeam?: string; page?: number; size?: number; sortBy?: string; sortDirection?: string }
  ) => {
    return axiosInstance.get<never, CourseStudentsResponse>(`/api/v1/courses/${courseId}/students`, { params });
  },

  getMyTeamMembers: async (courseId: string) => {
    return axiosInstance.get<never, MyTeamMembersResponse>(`/api/me/courses/${courseId}/team/members`);
  }
};
