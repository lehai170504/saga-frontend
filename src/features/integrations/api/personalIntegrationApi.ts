import axiosInstance from "@/lib/axios";
import { PersonalIntegrationsResponse } from "../types";

export const personalIntegrationApi = {
  getIntegrations: async () => {
    return axiosInstance.get<never, PersonalIntegrationsResponse>("/api/me/integrations");
  },

  deleteJiraIntegration: async () => {
    return axiosInstance.delete("/api/me/integrations/jira");
  },

  deleteGithubIntegration: async () => {
    return axiosInstance.delete("/api/me/integrations/github");
  },
};
