import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personalIntegrationApi } from "../api/personalIntegrationApi";
import { toast } from "sonner";

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
      toast.success("Ngắt kết nối Jira thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Có lỗi xảy ra khi ngắt kết nối Jira.");
    },
  });
};

export const useDeleteGithubIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => personalIntegrationApi.deleteGithubIntegration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-integrations"] });
      toast.success("Ngắt kết nối GitHub thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Có lỗi xảy ra khi ngắt kết nối GitHub.");
    },
  });
};
