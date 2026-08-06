import axiosInstance from "@/lib/axios";
import {
  TeamDetail,
  StudentProgress,
  StudentActivitiesResponse,
  StudentContributionDetailResponse,
  StudentBasicInfo,
  EarlyWarning,
  TeamInteraction,
  HeatmapData,
  SprintVelocity,
  Page
} from "../types/analytics";

export const analyticsApi = {
  getTeamDetail: async (courseId: string, teamId: string, page = 0, size = 20) => {
    return axiosInstance.get<never, TeamDetail>(
      `/api/v1/courses/${courseId}/teams/${teamId}/detail`,
      { params: { page, size } }
    );
  },

  getStudentBasicInfo: async (courseId: string, studentId: string) => {
    return axiosInstance.get<never, StudentBasicInfo>(
      `/api/v1/courses/${courseId}/students/${studentId}`
    );
  },

  getStudentProgress: async (courseId: string, studentId: string) => {
    return axiosInstance.get<never, StudentProgress>(
      `/api/v1/courses/${courseId}/students/${studentId}/progress`
    );
  },

  getStudentActivities: async (courseId: string, studentId: string, page = 0, size = 10) => {
    return axiosInstance.get<never, StudentActivitiesResponse>(
      `/api/v1/courses/${courseId}/students/${studentId}/activities`,
      { params: { page, size } }
    );
  },

  getStudentContributionDetail: async (courseId: string, studentId: string) => {
    return axiosInstance.get<never, StudentContributionDetailResponse>(
      `/api/v1/courses/${courseId}/students/${studentId}/contribution-detail`
    );
  },

  getEarlyWarnings: async (courseId: string) => {
    return axiosInstance.get<never, EarlyWarning[]>(
      `/api/v1/courses/${courseId}/early-warnings`
    );
  },

  getTeamInteractions: async (courseId: string, teamId: string) => {
    return axiosInstance.get<never, TeamInteraction>(
      `/api/v1/courses/${courseId}/teams/${teamId}/interactions`
    );
  },

  getTeamHeatmap: async (courseId: string, teamId: string, startDate: string, endDate: string, studentId?: string) => {
    return axiosInstance.get<never, HeatmapData[]>(
      `/api/v1/courses/${courseId}/teams/${teamId}/heatmap`,
      { params: { startDate, endDate, studentId } }
    );
  },

  getSprintVelocity: async (courseId: string, teamId: string) => {
    return axiosInstance.get<never, SprintVelocity[]>(
      `/api/v1/courses/${courseId}/teams/${teamId}/sprints/velocity`
    );
  }
};
