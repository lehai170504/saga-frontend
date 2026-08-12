import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { GithubIssue, GithubIssuesParams, GithubIssueDetailResponse } from "../types/githubIssue";

export const githubIssueApi = {
  getIssues: async (
    projectId: string,
    params?: GithubIssuesParams
  ): Promise<Page<GithubIssue>> => {
    return axiosInstance.get(`/api/projects/${projectId}/github/issues`, {
      params,
    });
  },

  getIssueDetail: async (
    projectId: string,
    issueId: string
  ): Promise<GithubIssueDetailResponse> => {
    return axiosInstance.get(`/api/projects/${projectId}/github/issues/${issueId}`);
  },
};
