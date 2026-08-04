import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contributionApi } from "../api/contributionApi";
import { ContributionOverrideRequest, ContributionEvaluationResponse } from "../types/contribution";

export const useContributionEvaluation = (teamId: string) => {
  return useQuery<ContributionEvaluationResponse, Error>({
    queryKey: ["contribution", teamId],
    queryFn: () => contributionApi.getContributionEvaluation(teamId),
    enabled: !!teamId,
    retry: 1,
  });
};

export const useOverrideContribution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: ContributionOverrideRequest }) =>
      contributionApi.overrideContribution(teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contribution", variables.teamId],
      });
    },
  });
};
