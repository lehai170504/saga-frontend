import axiosInstance from "@/lib/axios";
import {
  ContributionEvaluationResponse,
  ContributionOverrideRequest,
  CourseContributionWeightResponse,
  CourseContributionWeightRequest,
  CourseContributionTeamWeightResponse,
  CourseContributionModeRequest
} from "../types/contribution";

export const contributionApi = {
  getContributionEvaluation: async (teamId: string) => {
    return axiosInstance.get<never, ContributionEvaluationResponse>(
      `/api/v1/teams/${teamId}/contribution-evaluation`
    );
  },

  overrideContribution: async (teamId: string, data: ContributionOverrideRequest) => {
    return axiosInstance.post<never, void>(
      `/api/v1/teams/${teamId}/contribution-override`,
      data
    );
  },

  getCourseContributionWeights: async (courseId: string) => {
    return axiosInstance.get<never, CourseContributionWeightResponse>(
      `/api/v1/courses/${courseId}/contribution-slice-weights`
    );
  },

  updateCourseContributionWeights: async (courseId: string, data: CourseContributionWeightRequest) => {
    return axiosInstance.put<never, void>(
      `/api/v1/courses/${courseId}/contribution-slice-weights`,
      data
    );
  },

  getCourseContributionTeamWeights: async (courseId: string) => {
    return axiosInstance.get<never, CourseContributionTeamWeightResponse>(
      `/api/v1/courses/${courseId}/contribution-team-weights`
    );
  },

  updateCourseContributionMode: async (courseId: string, data: CourseContributionModeRequest) => {
    return axiosInstance.put<never, void>(
      `/api/v1/courses/${courseId}/contribution-config-mode`,
      data
    );
  }
};
