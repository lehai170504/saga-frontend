import { GithubIssue } from "./githubIssue";

export interface TaskTraceability {
  taskId: string;
  taskTitle: string;
  jiraKey?: string;
  githubIssues: GithubIssue[];
  linkedPullRequests?: { items: unknown[] };
  linkedCommits?: { items: unknown[] };
}

export interface TraceabilityTimelineEvent {
  sourceType: string;
  resourceId: string;
  displayKey: string;
  title: string;
  timestamp: string;
}

export interface ProjectTraceability {
  projectId: string;
  limit: number;
  truncated: boolean;
  timeline: TraceabilityTimelineEvent[];
}
