import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectTypeApi, CreateProjectTypePayload, UpdateProjectTypePayload } from "../api/projectTypeApi";
import { toast } from "sonner";
import { ADMIN_MESSAGES } from "../constants/messages";

export const useProjectTypes = () => {
  return useQuery({
    queryKey: ["admin_project_types"],
    queryFn: () => projectTypeApi.getProjectTypes(),
  });
};

export const useCreateProjectType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectTypePayload) => projectTypeApi.createProjectType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_project_types"] });
      toast.success(ADMIN_MESSAGES.PROJECT_TYPE.CREATE_SUCCESS);
    },
    onError: () => {
      toast.error(ADMIN_MESSAGES.PROJECT_TYPE.CREATE_ERROR);
    },
  });
};

export const useUpdateProjectType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectTypePayload) => projectTypeApi.updateProjectType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_project_types"] });
      toast.success(ADMIN_MESSAGES.PROJECT_TYPE.UPDATE_SUCCESS);
    },
    onError: () => {
      toast.error(ADMIN_MESSAGES.PROJECT_TYPE.UPDATE_ERROR);
    },
  });
};

export const useDeleteProjectType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectTypeId: string) => projectTypeApi.deleteProjectType(projectTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_project_types"] });
      toast.success(ADMIN_MESSAGES.PROJECT_TYPE.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(ADMIN_MESSAGES.PROJECT_TYPE.DELETE_ERROR);
    },
  });
};
