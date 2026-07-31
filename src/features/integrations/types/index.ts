export type IdentityConnectionResponse = {
  provider: "JIRA" | "GITHUB";
  status: "ACTIVE" | "DISCONNECTED" | "PENDING_REVIEW" | "REJECTED";
  displayName: string;
  email: string;
  verifiedAt: string | null;
  disconnectedAt: string | null;
};

export type PersonalIntegrationsResponse = {
  connections: IdentityConnectionResponse[];
};

export type JiraSiteResponse = {
  cloudId: string;
  name: string;
  siteUrl: string;
};

export type JiraAuthorizationResponse = {
  projectId: string;
  sites: JiraSiteResponse[];
};

export type GitHubRepositoryResponse = {
  repositoryId: number;
  fullName: string;
  defaultBranch: string;
  status: "CONNECTING" | "BACKFILLING" | "ACTIVE" | "DEGRADED" | "DISCONNECTED";
  lastSyncedAt: string | null;
};

export type GitHubInstallationResponse = {
  projectId: string;
  installationId: number;
  accountLogin: string;
  accountType: string;
  repositories: GitHubRepositoryResponse[];
};

export type ProjectIntegrationsResponse = {
  projectId: string;
  jira: {
    siteUrl: string;
    projectKey: string;
    status: "CONNECTING" | "BACKFILLING" | "ACTIVE" | "DEGRADED" | "DISCONNECTED";
    webhookExpiresAt: string | null;
    lastSyncedAt: string | null;
  } | null;
  githubRepositories: GitHubRepositoryResponse[];
};

export type SyncStatusResponse = {
  projectId: string;
  recentJobs: Array<{
    id: string;
    targetSystem: string;
    type: "JIRA_SYNC" | "GIT_SYNC" | "INITIAL_BACKFILL" | "RECONCILIATION" | "WEBHOOK_PROCESSING" | "OTHER";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PARTIAL_FAILURE" | "FAILED";
    startedAt: string | null;
    completedAt: string | null;
    itemsProcessed: number | null;
    itemsFailed: number | null;
    errorCategory: string | null;
    failureStage: string | null;
  }>;
};

export type IdentityMappingReviewRequest = {
  action: "APPROVE" | "REJECT" | "CORRECT";
  correctedStudentId?: string;
};

export type JiraProjectLinkRequest = {
  cloudId: string;
  jiraProjectId: string;
};

export type GitHubRepositoriesLinkRequest = {
  installationId: number;
  repositoryIds: number[];
};
