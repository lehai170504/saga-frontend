import { useQuery } from "@tanstack/react-query";
import { courseDashboardApi } from "../api/courseDashboardApi";

export const useTeamsProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["course-dashboard", courseId, "teams-progress"],
    queryFn: () => courseDashboardApi.getTeamsProgress(courseId),
    enabled: !!courseId,
  });
};

export const useContributionSummary = (courseId: string) => {
  return useQuery({
    queryKey: ["course-dashboard", courseId, "contribution-summary"],
    queryFn: () => courseDashboardApi.getContributionSummary(courseId),
    enabled: !!courseId,
  });
};

export const useTrends = (courseId: string) => {
  return useQuery({
    queryKey: ["course-dashboard", courseId, "trends"],
    queryFn: () => courseDashboardApi.getTrends(courseId),
    enabled: !!courseId,
  });
};

export const useAtRiskSummary = (courseId: string) => {
  return useQuery({
    queryKey: ["course-dashboard", courseId, "at-risk-summary"],
    queryFn: () => courseDashboardApi.getAtRiskSummary(courseId),
    enabled: !!courseId,
  });
};
