import axiosInstance, { API_BASE_URL } from "@/lib/axios";
import { PersonalIntegrationsResponse } from "../types";

type CsrfTokenResponse = {
  token: string;
  headerName: string;
  parameterName: string;
};

export async function consumeIntegrationCallback(resultId: string) {
  const csrfResponse = await fetch(
    `${API_BASE_URL}/api/auth/csrf`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!csrfResponse.ok) {
    throw new Error(`Không lấy được token bảo mật CSRF: ${csrfResponse.status}`);
  }

  const csrf = (await csrfResponse.json()) as CsrfTokenResponse;

  const response = await fetch(
    `${API_BASE_URL}/api/integrations/callback-results/${encodeURIComponent(resultId)}/consume`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token
      }
    }
  );

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw {
      status: response.status,
      body
    };
  }

  return body;
}

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
