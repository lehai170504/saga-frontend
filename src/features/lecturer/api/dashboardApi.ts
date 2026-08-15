import axiosInstance from "@/lib/axios";
import {
  DashboardTeamsProgress,
  DashboardContributionSummary,
  DashboardTrends,
  DashboardAtRiskSummary
} from "../types/dashboard";

/**
 * Lecturer Dashboard APIs
 * AUTH: uses Spring Security session (credentials: "include" configured in axiosInstance)
 * NO Bearer token.
 * 4 GET APIs, no request body, no CSRF needed for GET.
 * Frontend does not send lecturerId/adminId to identify actor.
 */
export const dashboardApi = {
  // A. Teams Progress
  getTeamsProgress: async (courseId: string) => {
    return axiosInstance.get<never, DashboardTeamsProgress>(
      `/api/v1/courses/${courseId}/dashboard/teams-progress`
    );
  },

  // B. Contribution Summary
  getContributionSummary: async (courseId: string) => {
    return axiosInstance.get<never, DashboardContributionSummary>(
      `/api/v1/courses/${courseId}/dashboard/contribution-summary`
    );
  },

  // C. Trends
  getTrends: async (courseId: string) => {
    return axiosInstance.get<never, DashboardTrends>(
      `/api/v1/courses/${courseId}/dashboard/trends`
    );
  },

  // D. At-Risk Summary
  getAtRiskSummary: async (courseId: string) => {
    return axiosInstance.get<never, DashboardAtRiskSummary>(
      `/api/v1/courses/${courseId}/dashboard/at-risk-summary`
    );
  }
};
