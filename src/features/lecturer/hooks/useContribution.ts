import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contributionApi } from "../api/contributionApi";
import { ContributionOverrideRequest, ContributionEvaluationResponse } from "../types/contribution";

export const useContributionEvaluation = (teamId: string, enabled: boolean = true) => {
  return useQuery<ContributionEvaluationResponse, Error>({
    queryKey: ["contribution", teamId],
    queryFn: () => contributionApi.getContributionEvaluation(teamId),
    enabled: !!teamId && enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export const useCourseContributionWeights = (courseId: string) => {
  return useQuery({
    queryKey: ["course-contribution-weights", courseId],
    queryFn: () => contributionApi.getCourseContributionWeights(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourseContributionWeights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: import("../types/contribution").CourseContributionWeightRequest }) =>
      contributionApi.updateCourseContributionWeights(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-contribution-weights", variables.courseId],
      });
    },
  });
};

export const useCourseContributionTeamWeights = (courseId: string) => {
  return useQuery({
    queryKey: ["course-contribution-team-weights", courseId],
    queryFn: () => contributionApi.getCourseContributionTeamWeights(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourseContributionMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: import("../types/contribution").CourseContributionModeRequest }) =>
      contributionApi.updateCourseContributionMode(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-contribution-team-weights", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-contribution-weights", variables.courseId],
      });
    },
  });
};
