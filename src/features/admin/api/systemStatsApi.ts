import axiosInstance from "@/lib/axios";

export interface SystemStatsResponse {
  totalProfiles: number;
  totalCourses: number;
  totalTeams: number;
  totalProjects: number;
  activeJiraBoards: number;
  activeGitRepositories: number;
  generatedAt: string;
}

export const systemStatsApi = {
  getSystemStats: () => {
    return axiosInstance.get<never, SystemStatsResponse>("/api/admin/system-stats");
  }
};
