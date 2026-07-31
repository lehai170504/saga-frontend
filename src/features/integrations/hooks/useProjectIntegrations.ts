import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectIntegrationApi } from "../api/projectIntegrationApi";
import { JiraProjectLinkRequest, GitHubRepositoriesLinkRequest } from "../types";

export const useProjectIntegrations = (projectId: string) => {
  return useQuery({
    queryKey: ["project-integrations", projectId],
    queryFn: () => projectIntegrationApi.getProjectIntegrations(projectId),
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
    },
  });
};
