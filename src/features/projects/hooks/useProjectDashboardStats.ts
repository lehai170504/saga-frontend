import { useQuery } from "@tanstack/react-query";
import { projectStatsApi } from "../api/projectStatsApi";

export const useProjectDashboardStats = (projectId: string) => {
  return useQuery({
    queryKey: ["project-dashboard-stats", projectId],
    queryFn: () => projectStatsApi.getDashboardStats(projectId),
    enabled: !!projectId,
  });
};

export const useTeamOverviewActivity = (
  courseId: string,
  teamId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ["team-overview-activity", courseId, teamId, startDate, endDate],
    queryFn: () => projectStatsApi.getTeamOverviewActivity(courseId, teamId, startDate, endDate),
    enabled: !!courseId && !!teamId && !!startDate && !!endDate,
  });
};

export const useTeamHeatmap = (
  courseId: string,
  teamId: string,
  startDate: string,
  endDate: string,
  studentId?: string
) => {
  return useQuery({
    queryKey: ["team-heatmap", courseId, teamId, startDate, endDate, studentId],
    queryFn: () => projectStatsApi.getTeamHeatmap(courseId, teamId, startDate, endDate, studentId),
    enabled: !!courseId && !!teamId && !!startDate && !!endDate,
  });
};

export const useStudentInteractions = (
  courseId: string,
  teamId: string,
  studentId: string
) => {
  return useQuery({
    queryKey: ["student-interactions", courseId, teamId, studentId],
    queryFn: () => projectStatsApi.getStudentInteractions(courseId, teamId, studentId),
    enabled: !!courseId && !!teamId && !!studentId,
  });
};
