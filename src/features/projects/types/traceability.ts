import { GithubIssue } from "./githubIssue";

export interface LinkedIssueItem {
  issue: {
    id: string;
    issueId?: string;
    issueNumber?: number;
    number?: number;
    title: string;
    state: string;
    htmlUrl?: string;
    repository?: {
      repositoryId: number;
      fullName: string;
    };
    author?: {
      id: string;
      fullName: string;
      studentCode: string;
    };
    assignee?: {
      id: string;
      fullName: string;
      studentCode: string;
    };
    externalUpdatedAt?: string;
    closedAt?: string;
  };
  linkedPullRequests?: {
    items?: unknown[];
    truncated?: boolean;
  };
  linkedCommits?: {
    items?: unknown[];
    truncated?: boolean;
  };
}

export interface TaskTraceabilityTimelineItem {
  sourceType: string;
  resourceId: string;
  displayKey: string;
  title: string;
  timestamp: string;
}

export interface TaskTraceability {
  taskId?: string;
  taskTitle?: string;
  jiraKey?: string;
  task?: {
    id: string;
    externalKey: string;
    title: string;
    status: string;
    assignee?: {
      id: string;
      fullName: string;
      studentCode: string;
    };
    externalUpdatedAt?: string;
  };
  githubIssues?: GithubIssue[];
  linkedIssues?: {
    items?: LinkedIssueItem[];
    truncated?: boolean;
  } | GithubIssue[];
  linkedPullRequests?: { items: unknown[] };
  linkedCommits?: { items: unknown[] };
  timeline?: TaskTraceabilityTimelineItem[];
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
  projectName?: string;
  limit?: number;
  truncated?: boolean;
  tasks?: TaskTraceability[];
  timeline?: TaskTraceabilityTimelineItem[];
}

export interface LinkTaskIssueResponse {
  taskId: string;
  issueId: string;
  linked: boolean;
}
