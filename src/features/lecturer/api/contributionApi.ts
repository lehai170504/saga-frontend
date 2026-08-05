import axiosInstance from "@/lib/axios";
import { ContributionEvaluationResponse, ContributionOverrideRequest } from "../types/contribution";

export const contributionApi = {
  getContributionEvaluation: async (teamId: string) => {
    return axiosInstance.get<never, ContributionEvaluationResponse>(
      `/api/v1/teams/${teamId}/contribution-evaluation`
    );
  },

  overrideContribution: async (teamId: string, data: ContributionOverrideRequest) => {
    return axiosInstance.post<never, any>(
      `/api/v1/teams/${teamId}/contribution-override`,
      data
    );
  },
};
