import { GithubIssue } from "./githubIssue";

export interface TaskTraceability {
  taskId: string;
  taskTitle: string;
  jiraKey?: string;
  githubIssues: GithubIssue[];
  linkedPullRequests?: { items: unknown[] };
  linkedCommits?: { items: unknown[] };
}

export interface ProjectTraceability {
  projectId: string;
  projectName: string;
  tasks: TaskTraceability[];
}
