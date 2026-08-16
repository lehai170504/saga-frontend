import axiosInstance from "@/lib/axios";

export interface CourseWeightResponse {
  courseId: string;
  mode?: "COURSE" | "TEAM";
  codeWeight: number;
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
  lastUpdatedAt?: string;
}

export interface UpdateCourseWeightPayload {
  codeWeight: number;
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
}

export interface TeamWeightConfig {
  groupId: string;
  groupName: string;
  projectName?: string;
  codeWeight: number | null;
  testWeight: number | null;
  documentWeight: number | null;
  researchWeight: number | null;
  configured: boolean;
}

export const courseWeightApi = {
  getCourseWeights: async (courseId: string) => {
    return axiosInstance.get<never, CourseWeightResponse>(`/api/v1/courses/${courseId}/contribution-slice-weights`);
  },
  updateCourseWeights: async (courseId: string, payload: UpdateCourseWeightPayload) => {
    return axiosInstance.put<never, CourseWeightResponse>(`/api/v1/courses/${courseId}/contribution-slice-weights`, payload);
  },
  getTeamWeightsList: async (courseId: string) => {
    return axiosInstance.get<never, TeamWeightConfig[]>(`/api/v1/courses/${courseId}/contribution-team-weights`);
  },
  updateConfigMode: async (courseId: string, mode: "COURSE" | "TEAM") => {
    return axiosInstance.put<never, void>(`/api/v1/courses/${courseId}/contribution-config-mode`, { mode });
  }
};
