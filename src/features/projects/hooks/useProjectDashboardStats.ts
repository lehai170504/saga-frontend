import { useQuery } from "@tanstack/react-query";
import { projectStatsApi } from "../api/projectStatsApi";

export const useProjectDashboardStats = (projectId: string) => {
  return useQuery({
    queryKey: ["project-dashboard-stats", projectId],
    queryFn: () => projectStatsApi.getDashboardStats(projectId),
    enabled: !!projectId,
  });
};
