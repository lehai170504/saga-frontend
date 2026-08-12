export interface GithubIssueUser {
  id: string;
  fullName: string;
  studentCode: string;
}

export interface GithubIssueRepository {
  repositoryId: number;
  fullName: string;
}

export interface GithubIssueSummary {
  open: number;
  closed: number;
  assignedToMe: number;
  unassigned: number;
}

export interface GithubIssue {
  id: string;
  issueId?: string;
  issueNumber: number;
  githubIssueNumber?: number;
  title: string;
  state: "OPEN" | "CLOSED" | string;
  htmlUrl?: string;
  repository?: GithubIssueRepository;
  repositoryId?: number;
  repositoryName?: string;
  author?: GithubIssueUser | null;
  authorName?: string;
  assignee?: GithubIssueUser | null;
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
  externalUpdatedAt?: string;
  closedAt?: string | null;
}

export interface GithubIssuesParams {
  state?: "OPEN" | "CLOSED";
  repositoryId?: number;
  keyword?: string;
  page?: number;
  size?: number;
  assignedToMe?: boolean;
}

export interface GithubIssueLinkedTask {
  id: string;
  externalKey: string;
  title: string;
  status: string;
  assignee?: GithubIssueUser | null;
  externalUpdatedAt?: string;
}

export interface GithubIssueLinkedPullRequest {
  id: string;
  pullNumber: number;
  title: string;
  status: string;
  repository?: GithubIssueRepository;
  author?: GithubIssueUser | null;
  relationType?: string;
  externalUpdatedAt?: string;
  mergedAt?: string | null;
}

export interface GithubIssueLinkedCommit {
  id: string;
  sha: string;
  message: string;
  repository?: GithubIssueRepository;
  author?: GithubIssueUser | null;
  relationType?: string;
  committedAt?: string;
  additions?: number;
  deletions?: number;
  filesChanged?: number;
}

export interface GithubIssueDetailResponse {
  issue: GithubIssue;
  linkedTasks?: {
    items: GithubIssueLinkedTask[];
    truncated?: boolean;
  };
  linkedPullRequests?: {
    items: GithubIssueLinkedPullRequest[];
    truncated?: boolean;
  };
  linkedCommits?: {
    items: GithubIssueLinkedCommit[];
    truncated?: boolean;
  };
  timeline?: {
    sourceType: string;
    resourceId: string;
    displayKey: string;
    title: string;
    timestamp: string;
  }[];
}
