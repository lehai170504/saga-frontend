import axiosInstance from "@/lib/axios";
import { ProjectDashboardStatsResponse } from "../types";

export const projectStatsApi = {
  getDashboardStats: async (projectId: string): Promise<ProjectDashboardStatsResponse> => {
    return axiosInstance.get(`/api/projects/${projectId}/dashboard-stats`);
  },
};
