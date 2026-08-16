import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Course, CourseRequest, TeamMemberResponse, CourseStudentsResponse, MyTeamMembersResponse, CourseStudentDetail, ImportStudentsResponse, ManualAddStudentRequest, ManualAddStudentResponse, RemoveStudentResponse } from "../types";

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

  updateCourse: async (id: string, data: CourseRequest) => {
    return axiosInstance.put<never, Course>(`/api/v1/courses/${id}`, data);
  },

  deleteCourse: async (id: string) => {
    return axiosInstance.delete<never, void>(`/api/v1/courses/${id}`);
  },

  adminImportStudentsTemplate: async (courseId: string, formData: FormData) => {
    return axiosInstance.post<never, ImportStudentsResponse>(`/api/v1/courses/${courseId}/admin-import-students-template`, formData);
  },

  importStudents: async (courseId: string, formData: FormData) => {
    return axiosInstance.post<never, ImportStudentsResponse>(`/api/v1/courses/${courseId}/import-students`, formData);
  },

  downloadGroupingTemplate: async (courseId: string) => {
    return axiosInstance.get(`/api/v1/courses/${courseId}/students-grouping-template`, {
      responseType: 'blob',
    });
  },

  addStudentManual: async (courseId: string, data: ManualAddStudentRequest) => {
    return axiosInstance.post<never, ManualAddStudentResponse>(`/api/v1/courses/${courseId}/students/manual`, data);
  },

  removeStudent: async (courseId: string, studentId: string) => {
    return axiosInstance.delete<never, RemoveStudentResponse>(`/api/v1/courses/${courseId}/students/${studentId}`);
  },

  updateStudentGroup: async (courseId: string, studentId: string, data: { group: string; leader: boolean }) => {
    return axiosInstance.patch(`/api/v1/courses/${courseId}/students/${studentId}`, data);
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

  getCourseStudent: async (courseId: string, studentId: string) => {
    return axiosInstance.get<never, CourseStudentDetail>(`/api/v1/courses/${courseId}/students/${studentId}`);
  },

  getMyTeamMembers: async (courseId: string) => {
    return axiosInstance.get<never, MyTeamMembersResponse>(`/api/me/courses/${courseId}/team/members`);
  },

  exportCourseReport: async (courseId: string) => {
    return axiosInstance.get<never, Blob>(`/api/admin/reports/courses/${courseId}/export`, {
      responseType: "blob",
    });
  },

  downloadAdminStudentsTemplate: async (courseId: string) => {
    return axiosInstance.get<never, Blob>(`/api/v1/courses/${courseId}/admin-students-template`, {
      responseType: "blob",
    });
  },

  downloadStudentsGroupingTemplate: async (courseId: string) => {
    return axiosInstance.get<never, Blob>(`/api/v1/courses/${courseId}/students-grouping-template`, {
      responseType: "blob",
    });
  }
};
