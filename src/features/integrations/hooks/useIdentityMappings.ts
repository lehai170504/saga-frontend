import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { identityMappingApi } from "../api/identityMappingApi";
import { IdentityMappingReviewRequest } from "../types";

export const useIdentityMappings = (studentId: string) => {
  return useQuery({
    queryKey: ["identity-mappings", studentId],
    queryFn: async () => {
      return identityMappingApi.getIdentityMappings(studentId);
    },
    enabled: !!studentId,
  });
};

export const useReviewIdentityMapping = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mappingId, data }: { mappingId: string; data: IdentityMappingReviewRequest }) =>
      identityMappingApi.reviewIdentityMapping(mappingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identity-mappings", studentId] });
    },
  });
};
