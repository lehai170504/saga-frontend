import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi, ProjectFilterParams } from "../api/projectApi";
import { toast } from "sonner";
import { ADMIN_MESSAGES } from "../constants/messages";

export const useAdminProjects = (params: ProjectFilterParams) => {
  return useQuery({
    queryKey: ["admin", "projects", params],
    queryFn: () => projectApi.getProjects(params),
  });
};

export const useProjectDetail = (projectId: string | null) => {
  return useQuery({
    queryKey: ["admin", "project", projectId],
    queryFn: () => projectApi.getProjectDetail(projectId!),
    enabled: !!projectId,
  });
};

export const useProjectStats = (projectId: string | null) => {
  return useQuery({
    queryKey: ["admin", "project", projectId, "stats"],
    queryFn: () => projectApi.getProjectStats(projectId!),
    enabled: !!projectId,
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: { name: string; description: string } }) =>
      projectApi.updateProject(projectId, data),
    onSuccess: (_, variables) => {
      toast.success(ADMIN_MESSAGES.PROJECT.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.PROJECT.UPDATE_ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: { name: string } }) =>
      projectApi.createProject(teamId, data),
    onSuccess: () => {
      toast.success(ADMIN_MESSAGES.PROJECT.CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.PROJECT.CREATE_ERROR;
      toast.error(errorMessage);
    },
  });
};
