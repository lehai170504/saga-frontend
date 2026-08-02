import { useQuery } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";

import { SyncStatusResponse } from "../types";

export const useSyncStatus = (projectId: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["sync-status", projectId],
    queryFn: async () => {
      if (projectId === "project-123") {
        return {
          projectId: "project-123",
          recentJobs: [
            {
              id: "job-1",
              targetSystem: "fpt-saga/saga-frontend",
              type: "GIT_SYNC",
              status: "COMPLETED",
              startedAt: new Date(Date.now() - 3600000).toISOString(),
              completedAt: new Date(Date.now() - 3500000).toISOString(),
              itemsProcessed: 45,
              itemsFailed: 0,
              errorCategory: null,
              failureStage: null,
            },
            {
              id: "job-2",
              targetSystem: "SAGA Jira Project",
              type: "JIRA_SYNC",
              status: "IN_PROGRESS",
              startedAt: new Date().toISOString(),
              completedAt: null,
              itemsProcessed: 12,
              itemsFailed: 1,
              errorCategory: "API_RATE_LIMIT",
              failureStage: "FETCH_ISSUES",
            }
          ]
        } as SyncStatusResponse;
      }
      return projectIntegrationApi.getSyncStatus(projectId);
    },
    enabled: !!projectId,
    refetchInterval: options?.refetchInterval ?? false,
  });
};
