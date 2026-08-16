import { useQuery } from "@tanstack/react-query";
import { contributionApi } from "../api/contributionApi";

export const useContributionEvaluation = (teamId?: string) => {
  return useQuery({
    queryKey: ["contribution-evaluation", teamId],
    queryFn: () => {
      if (!teamId) throw new Error("Team ID is required");
      return contributionApi.getContributionEvaluation(teamId);
    },
    enabled: !!teamId,
  });
};

export const useContributionGraph = (teamId?: string) => {
  return useQuery({
    queryKey: ["contribution-graph", teamId],
    queryFn: () => {
      if (!teamId) throw new Error("Team ID is required");
      return contributionApi.getContributionGraph(teamId);
    },
    enabled: !!teamId,
  });
};
