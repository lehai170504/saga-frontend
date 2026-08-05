import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useTeamDetail = (courseId: string, teamId: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["teamDetail", courseId, teamId, page, size],
    queryFn: () => analyticsApi.getTeamDetail(courseId, teamId, page, size),
    enabled: !!courseId && !!teamId,
  });
};

export const useStudentProgress = (courseId: string, studentId: string) => {
  return useQuery({
    queryKey: ["studentProgress", courseId, studentId],
    queryFn: () => analyticsApi.getStudentProgress(courseId, studentId),
    enabled: !!courseId && !!studentId,
  });
};

export const useStudentActivities = (courseId: string, studentId: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["studentActivities", courseId, studentId, page, size],
    queryFn: () => analyticsApi.getStudentActivities(courseId, studentId, page, size),
    enabled: !!courseId && !!studentId,
  });
};

export const useStudentContributionDetail = (courseId: string, studentId: string) => {
  return useQuery({
    queryKey: ["studentContributionDetail", courseId, studentId],
    queryFn: () => analyticsApi.getStudentContributionDetail(courseId, studentId),
    enabled: !!courseId && !!studentId,
  });
};

export const useEarlyWarnings = (courseId: string) => {
  return useQuery({
    queryKey: ["earlyWarnings", courseId],
    queryFn: () => analyticsApi.getEarlyWarnings(courseId),
    enabled: !!courseId,
  });
};

export const useTeamInteractions = (courseId: string, teamId: string) => {
  return useQuery({
    queryKey: ["teamInteractions", courseId, teamId],
    queryFn: () => analyticsApi.getTeamInteractions(courseId, teamId),
    enabled: !!courseId && !!teamId,
  });
};

export const useTeamHeatmap = (courseId: string, teamId: string, startDate: string, endDate: string, studentId?: string) => {
  return useQuery({
    queryKey: ["teamHeatmap", courseId, teamId, startDate, endDate, studentId],
    queryFn: () => analyticsApi.getTeamHeatmap(courseId, teamId, startDate, endDate, studentId),
    enabled: !!courseId && !!teamId && !!startDate && !!endDate,
  });
};

export const useSprintVelocity = (courseId: string, teamId: string) => {
  return useQuery({
    queryKey: ["sprintVelocity", courseId, teamId],
    queryFn: () => analyticsApi.getSprintVelocity(courseId, teamId),
    enabled: !!courseId && !!teamId,
  });
};
