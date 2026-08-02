import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { identityMappingApi } from "../api/identityMappingApi";
import { IdentityConnectionResponse, IdentityMappingReviewRequest } from "../types";

export const useIdentityMappings = (studentId: string) => {
  return useQuery({
    queryKey: ["identity-mappings", studentId],
    queryFn: async () => {
      // Mock data for any student in development
      if (studentId) {
        return [
          {
            mappingId: "mapping-1",
            provider: "GITHUB",
            status: "PENDING_REVIEW",
            displayName: "Minh B. P. Nguyen",
            email: "minhbpnse171184@fpt.edu.vn",
            verifiedAt: null,
            disconnectedAt: null,
          },
          {
            mappingId: "mapping-2",
            provider: "JIRA",
            status: "ACTIVE",
            displayName: "Minh BPN",
            email: "minhn@university.edu",
            verifiedAt: new Date(Date.now() - 86400000).toISOString(),
            disconnectedAt: null,
          }
        ] as any[]; // Note: mappingId might need to be added to IdentityConnectionResponse if needed
      }
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
