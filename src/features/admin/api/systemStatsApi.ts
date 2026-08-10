import axiosInstance from "@/lib/axios";

export interface SystemStatsResponse {
  totalProfiles: number;
  totalCourses: number;
  totalTeams: number;
  totalProjects: number;
  activeJiraBoards: number;
  activeGitRepositories: number;
  generatedAt: string;
}

export interface IntegrationHealthResponse {
  jira: {
    enabled: boolean;
    linkedProjectCount: number;
    connectionStatuses: Array<{ status: string; count: number }>;
    storedWebhookIdCount: number;
    latestLastSyncedAt: string;
    webhookReceiptStatuses: Array<{ status: string; count: number }>;
  };
  gitHub: {
    enabled: boolean;
    linkedProjectCount: number;
    connectionStatuses: Array<{ status: string; count: number }>;
    installationStatuses: Array<{ status: string; count: number }>;
    latestLastSyncedAt: string;
    webhookReceiptStatuses: Array<{ status: string; count: number }>;
  };
}

export const systemStatsApi = {
  getSystemStats: () => {
    return axiosInstance.get<never, SystemStatsResponse>("/api/admin/system-stats");
  },
  getIntegrationHealth: () => {
    return axiosInstance.get<never, IntegrationHealthResponse>("/api/admin/integrations/health");
  }
};
