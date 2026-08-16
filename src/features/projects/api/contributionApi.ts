import axiosInstance from "@/lib/axios";
import { ContributionEvaluationResponse, ContributionGraphResponse } from "../types/contribution";

export const contributionApi = {
  getContributionEvaluation: async (teamId: string) => {
    return axiosInstance.get<never, ContributionEvaluationResponse>(`/api/v1/teams/${teamId}/contribution-evaluation`);
  },
  getContributionGraph: async (teamId: string) => {
    return axiosInstance.get<never, ContributionGraphResponse>(`/api/v1/teams/${teamId}/contribution-graph`);
  }
};
