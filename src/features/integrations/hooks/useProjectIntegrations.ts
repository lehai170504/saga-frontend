import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";
import { JiraProjectLinkRequest, GitHubRepositoriesLinkRequest, ProjectIntegrationsResponse } from "../types";
import { toast } from "sonner";

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
      queryClient.invalidateQueries({ queryKey: ["project-integrations", projectId] });
      toast.success("Ngắt kết nối Jira thành công!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Có lỗi xảy ra khi ngắt kết nối Jira.");
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
      toast.success("Ngắt kết nối Repository thành công!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Có lỗi xảy ra khi ngắt kết nối Repository.");
    },
  });
};
