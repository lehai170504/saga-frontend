import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personalIntegrationApi } from "../api/personalIntegrationApi";

export const usePersonalIntegrations = () => {
  return useQuery({
    queryKey: ["personal-integrations"],
    queryFn: () => personalIntegrationApi.getIntegrations(),
  });
};

export const useDeleteJiraIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => personalIntegrationApi.deleteJiraIntegration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-integrations"] });
    },
  });
};

export const useDeleteGithubIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => personalIntegrationApi.deleteGithubIntegration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-integrations"] });
    },
  });
};
