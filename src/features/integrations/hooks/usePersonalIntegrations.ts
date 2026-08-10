import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personalIntegrationApi } from "../api/personalIntegrationApi";
import { toast } from "sonner";
import { INTEGRATION_MESSAGES } from "../constants/messages";

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
      toast.success(INTEGRATION_MESSAGES.JIRA.DELETE.SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || INTEGRATION_MESSAGES.JIRA.DELETE.ERROR);
    },
  });
};

export const useDeleteGithubIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => personalIntegrationApi.deleteGithubIntegration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-integrations"] });
      toast.success(INTEGRATION_MESSAGES.GITHUB.DELETE.SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || INTEGRATION_MESSAGES.GITHUB.DELETE.ERROR);
    },
  });
};
