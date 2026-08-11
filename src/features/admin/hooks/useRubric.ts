import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rubricApi, RubricCriteriaRequest } from "../api/rubricApi";
import { toast } from "sonner";
import { ADMIN_MESSAGES } from "../constants/messages";

export const useDefaultRubric = () => {
  return useQuery({
    queryKey: ["admin", "defaultRubric"],
    queryFn: () => rubricApi.getDefaultRubric(),
    // Keep stale time relatively high since this is a global config
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRubric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RubricCriteriaRequest) => rubricApi.createRubricCriteria(data),
    onSuccess: () => {
      toast.success(ADMIN_MESSAGES.RUBRIC.CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.RUBRIC.CREATE_ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useUpdateRubric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RubricCriteriaRequest }) => rubricApi.updateRubricCriteria(id, data),
    onSuccess: () => {
      toast.success(ADMIN_MESSAGES.RUBRIC.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.RUBRIC.UPDATE_ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useDeleteRubric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rubricApi.deleteRubricCriteria(id),
    onSuccess: () => {
      toast.success(ADMIN_MESSAGES.RUBRIC.DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.RUBRIC.DELETE_ERROR;
      toast.error(errorMessage);
    },
  });
};
