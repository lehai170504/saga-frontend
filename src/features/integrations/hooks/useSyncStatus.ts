import { useQuery } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";

export const useSyncStatus = (projectId: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["sync-status", projectId],
    queryFn: () => projectIntegrationApi.getSyncStatus(projectId),
    enabled: !!projectId,
    refetchInterval: options?.refetchInterval ?? false,
  });
};
