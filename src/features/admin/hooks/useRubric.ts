import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rubricApi, RubricCriteriaRequest } from "../api/rubricApi";

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
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
  });
};

export const useUpdateRubric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RubricCriteriaRequest }) => rubricApi.updateRubricCriteria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
  });
};

export const useDeleteRubric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rubricApi.deleteRubricCriteria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "defaultRubric"] });
    },
  });
};
