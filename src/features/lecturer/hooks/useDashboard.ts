import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";

export const useDashboardTeamsProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["dashboard-teams-progress", courseId],
    queryFn: () => dashboardApi.getTeamsProgress(courseId),
    enabled: !!courseId,
  });
};

export const useDashboardContributionSummary = (courseId: string) => {
  return useQuery({
    queryKey: ["dashboard-contribution-summary", courseId],
    queryFn: () => dashboardApi.getContributionSummary(courseId),
    enabled: !!courseId,
  });
};

export const useDashboardTrends = (courseId: string) => {
  return useQuery({
    queryKey: ["dashboard-trends", courseId],
    queryFn: () => dashboardApi.getTrends(courseId),
    enabled: !!courseId,
  });
};

export const useDashboardAtRiskSummary = (courseId: string) => {
  return useQuery({
    queryKey: ["dashboard-at-risk-summary", courseId],
    queryFn: () => dashboardApi.getAtRiskSummary(courseId),
    enabled: !!courseId,
  });
};
