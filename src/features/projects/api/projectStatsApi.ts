import axiosInstance from "@/lib/axios";
import {
  ProjectDashboardStatsResponse,
  OverviewActivityResponse,
  HeatmapChartResponse,
  StudentInteractionResponse,
} from "../types";

export const projectStatsApi = {
  getDashboardStats: async (projectId: string): Promise<ProjectDashboardStatsResponse> => {
    return axiosInstance.get(`/api/projects/${projectId}/dashboard-stats`);
  },

  getTeamOverviewActivity: async (
    courseId: string,
    teamId: string,
    startDate: string,
    endDate: string
  ): Promise<OverviewActivityResponse> => {
    return axiosInstance.get(
      `/api/v1/courses/${courseId}/teams/${teamId}/overview`,
      {
        params: { startDate, endDate },
      }
    );
  },

  getTeamHeatmap: async (
    courseId: string,
    teamId: string,
    startDate: string,
    endDate: string,
    studentId?: string
  ): Promise<HeatmapChartResponse> => {
    return axiosInstance.get(
      `/api/v1/courses/${courseId}/teams/${teamId}/heatmap`,
      {
        params: { startDate, endDate, studentId },
      }
    );
  },

  getStudentInteractions: async (
    courseId: string,
    teamId: string,
    studentId: string
  ): Promise<StudentInteractionResponse> => {
    return axiosInstance.get(
      `/api/v1/courses/${courseId}/teams/${teamId}/students/${studentId}/interactions`
    );
  },
};
