import { useQuery } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";

export const useSyncStatus = (projectId: string, options?: { refetchInterval?: number | false | ((query: any) => number | false) }) => {
  return useQuery({
    queryKey: ["sync-status", projectId],
    queryFn: async () => {
      return projectIntegrationApi.getSyncStatus(projectId);
    },
    enabled: !!projectId,
    refetchInterval: options?.refetchInterval ?? false,
  });
};
