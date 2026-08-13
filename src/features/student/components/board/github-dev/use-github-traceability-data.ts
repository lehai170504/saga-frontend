import React from "react";
import { TaskTraceability } from "@/features/projects/types";

export interface LinkedIssueItem {
  issueId: string;
  issueNumber: number;
  title: string;
  state: string;
  htmlUrl: string;
  repositoryName: string;
}

export interface LinkedPRItem {
  id: string;
  pullNumber: number;
  title: string;
  status: string;
  isMerged: boolean;
  htmlUrl: string;
  repositoryName: string;
}

export interface LinkedCommitItem {
  id: string;
  sha: string;
  message: string;
  htmlUrl: string;
  repositoryName: string;
}

export function useGithubTraceabilityData(traceability: TaskTraceability | undefined) {
  // Extract linked issues
  const linkedIssuesList = React.useMemo<LinkedIssueItem[]>(() => {
    if (!traceability) return [];

    const rawLinkedIssues = (
      traceability as unknown as {
        linkedIssues?: { items?: Array<{ issue: Record<string, unknown> }> } | Array<Record<string, unknown>>;
        githubIssues?: Array<Record<string, unknown>>;
      }
    ).linkedIssues;

    if (rawLinkedIssues && typeof rawLinkedIssues === "object" && "items" in rawLinkedIssues && Array.isArray(rawLinkedIssues.items)) {
      return rawLinkedIssues.items.map((item) => {
        const iss = item.issue || {};
        const repoObj = (iss.repository as { fullName?: string }) || {};
        const repoFullName = repoObj.fullName || "";
        const num = (iss.issueNumber as number) ?? (iss.number as number) ?? 0;
        const rawUrl = (iss.htmlUrl as string) || (repoFullName ? `https://github.com/${repoFullName}/issues/${num}` : "#");

        return {
          issueId: (iss.id as string) || "",
          issueNumber: num,
          title: (iss.title as string) || "Chưa có tiêu đề",
          state: (iss.state as string) || "OPEN",
          htmlUrl: rawUrl,
          repositoryName: repoFullName,
        };
      });
    }

    if (Array.isArray(traceability.githubIssues)) {
      return (traceability.githubIssues as unknown as Array<Record<string, unknown>>).map((iss) => ({
        issueId: (iss.issueId as string) || "",
        issueNumber: (iss.githubIssueNumber as number) || 0,
        title: (iss.title as string) || "Chưa có tiêu đề",
        state: (iss.state as string) || "OPEN",
        htmlUrl: (iss.htmlUrl as string) || "#",
        repositoryName: (iss.repositoryName as string) || "",
      }));
    }

    return [];
  }, [traceability]);

  // Extract PRs
  const linkedPRsList = React.useMemo<LinkedPRItem[]>(() => {
    if (!traceability?.linkedPullRequests?.items) return [];
    return (traceability.linkedPullRequests.items as Array<Record<string, unknown>>).map((p) => {
      const repoObj = (p.repository as { fullName?: string }) || {};
      const repoFullName = repoObj.fullName || "";
      const num = (p.pullNumber as number) ?? (p.number as number) ?? 0;
      const url = (p.htmlUrl as string) || (repoFullName ? `https://github.com/${repoFullName}/pull/${num}` : "#");
      const status = (p.status as string) || "OPEN";
      const isMerged = status.toUpperCase() === "MERGED";

      return {
        id: (p.id as string) || String(num),
        pullNumber: num,
        title: (p.title as string) || `PR #${num}`,
        status,
        isMerged,
        htmlUrl: url,
        repositoryName: repoFullName,
      };
    });
  }, [traceability]);

  // Extract Commits
  const linkedCommitsList = React.useMemo<LinkedCommitItem[]>(() => {
    if (!traceability?.linkedCommits?.items) return [];
    return (traceability.linkedCommits.items as Array<Record<string, unknown>>).map((c) => {
      const repoObj = (c.repository as { fullName?: string }) || {};
      const repoFullName = repoObj.fullName || "";
      const shaStr = (c.sha as string) || "";
      const shortSha = shaStr.substring(0, 7) || "commit";
      const url = (c.htmlUrl as string) || (repoFullName && shaStr ? `https://github.com/${repoFullName}/commit/${shaStr}` : "#");

      return {
        id: (c.id as string) || shaStr,
        sha: shortSha,
        message: (c.message as string) || "Commit",
        htmlUrl: url,
        repositoryName: repoFullName,
      };
    });
  }, [traceability]);

  const primaryIssue = linkedIssuesList[0];
  const hasNoItems = linkedIssuesList.length === 0 && linkedPRsList.length === 0 && linkedCommitsList.length === 0;

  return {
    linkedIssuesList,
    linkedPRsList,
    linkedCommitsList,
    primaryIssue,
    hasNoItems,
  };
}
