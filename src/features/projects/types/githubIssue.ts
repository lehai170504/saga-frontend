export interface GithubIssue {
  issueId: string; // local UUID
  githubIssueNumber: number;
  title: string;
  state: "OPEN" | "CLOSED";
  htmlUrl: string;
  repositoryId: number;
  repositoryName: string;
  authorName?: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface GithubIssuesParams {
  state?: "OPEN" | "CLOSED";
  repositoryId?: number;
  keyword?: string;
  page?: number;
  size?: number;
  assignedToMe?: boolean;
}
