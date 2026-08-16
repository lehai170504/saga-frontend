import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";
import { JiraProjectLinkRequest, GitHubRepositoriesLinkRequest, ProjectIntegrationsResponse } from "../types";
import { toast } from "sonner";
import { INTEGRATION_MESSAGES } from "../constants/messages";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

export const useProjectIntegrations = (projectId: string) => {
  return useQuery({
    queryKey: ["project-integrations", projectId],
    queryFn: async () => {
      if (projectId === "project-123") {
        return {
          projectId: "project-123",
          jira: {
            siteUrl: "https://saga-fpt.atlassian.net",
            projectKey: "SAGA",
            status: "ACTIVE",
            webhookExpiresAt: new Date(Date.now() + 86400000).toISOString(),
            lastSyncedAt: new Date().toISOString(),
          },
          githubRepositories: [
            {
              repositoryId: 999111,
              fullName: "fpt-saga/saga-frontend",
              defaultBranch: "main",
              status: "ACTIVE",
              lastSyncedAt: new Date().toISOString(),
            },
            {
              repositoryId: 999222,
              fullName: "fpt-saga/saga-backend",
              defaultBranch: "main",
              status: "BACKFILLING",
              lastSyncedAt: null,
            }
          ]
        } as ProjectIntegrationsResponse;
      }
      return projectIntegrationApi.getProjectIntegrations(projectId);
    },
    enabled: !!projectId,
  });
};

export const useLinkJiraProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: JiraProjectLinkRequest) => projectIntegrationApi.linkJiraProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
    },
  });
};

export const useDeleteProjectJiraIntegration = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => projectIntegrationApi.deleteJiraIntegration(projectId),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("integration_callback_result");
        sessionStorage.removeItem("integration_redirect_back");
      }
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
      toast.success(INTEGRATION_MESSAGES.JIRA.DELETE.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, INTEGRATION_MESSAGES.JIRA.DELETE.ERROR));
    },
  });
};

export const useLinkGithubRepositories = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GitHubRepositoriesLinkRequest) => projectIntegrationApi.linkGithubRepositories(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
    },
  });
};

export const useDeleteGithubRepository = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repositoryId: number) => projectIntegrationApi.deleteGithubRepository(projectId, repositoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
      toast.success(INTEGRATION_MESSAGES.GITHUB.DELETE_REPO.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, INTEGRATION_MESSAGES.GITHUB.DELETE_REPO.ERROR));
    },
  });
};

export const useReconnectGithubRepository = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repositoryId: number) => projectIntegrationApi.reconnectGithubRepository(projectId, repositoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
      toast.success(INTEGRATION_MESSAGES.GITHUB.RECONNECT_REPO.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, INTEGRATION_MESSAGES.GITHUB.RECONNECT_REPO.ERROR));
    },
  });
};

export const useTriggerProjectSync = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (provider?: string) => projectIntegrationApi.triggerSync(projectId, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-status", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success(INTEGRATION_MESSAGES.SYNC.TRIGGER.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, INTEGRATION_MESSAGES.SYNC.TRIGGER.ERROR));
    },
  });
};
