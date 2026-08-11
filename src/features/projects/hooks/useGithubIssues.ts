import { useQuery } from "@tanstack/react-query";
import { githubIssueApi } from "../api/githubIssueApi";
import { GithubIssuesParams } from "../types/githubIssue";

export const useGithubIssues = (
  projectId: string,
  params?: GithubIssuesParams
) => {
  return useQuery({
    queryKey: ["github-issues", projectId, params],
    queryFn: () => githubIssueApi.getIssues(projectId, params),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
};

export const useGithubIssueDetail = (
  projectId: string,
  issueId: string
) => {
  return useQuery({
    queryKey: ["github-issue-detail", projectId, issueId],
    queryFn: () => githubIssueApi.getIssueDetail(projectId, issueId),
    enabled: !!projectId && !!issueId,
    staleTime: 60 * 1000,
  });
};
