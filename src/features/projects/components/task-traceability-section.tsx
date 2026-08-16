"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink, CircleDot, Link2, Loader2, GitPullRequest, GitCommit } from "lucide-react";
import { useTaskTraceability, useUnlinkTaskIssue } from "../hooks/useTraceability";
import { LinkGithubIssueModal } from "./link-github-issue-modal";

interface TaskTraceabilitySectionProps {
  projectId: string;
  taskId: string;
  isEnded?: boolean;
}

export function TaskTraceabilitySection({ projectId, taskId, isEnded }: TaskTraceabilitySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unlinkingIssueId, setUnlinkingIssueId] = useState<string | null>(null);

  const { data: traceability, isLoading } = useTaskTraceability(projectId, taskId);
  const { mutate: unlinkIssue } = useUnlinkTaskIssue(projectId, taskId);

  // Normalize linked issues list safely supporting new & old response structure
  const linkedIssuesList = React.useMemo(() => {
    if (!traceability) return [];

    // New API format: linkedIssues.items
    const rawLinkedIssues = (traceability as unknown as { linkedIssues?: { items?: Array<{ issue: Record<string, unknown> }> } | Array<Record<string, unknown>> }).linkedIssues;
    if (rawLinkedIssues && typeof rawLinkedIssues === "object" && "items" in rawLinkedIssues && Array.isArray(rawLinkedIssues.items)) {
      return rawLinkedIssues.items.map((item) => {
        const iss = item.issue || {};
        const repoObj = (iss.repository as { fullName?: string }) || {};
        const repoFullName = repoObj.fullName || "";
        const num = (iss.issueNumber as number) ?? (iss.number as number) ?? 0;
        const rawUrl = (iss.htmlUrl as string) || (repoFullName ? `https://github.com/${repoFullName}/issues/${num}` : "#");

        return {
          issueId: (iss.id as string) || (iss.issueId as string) || "",
          issueNumber: num,
          title: (iss.title as string) || "Chưa có tiêu đề",
          state: (iss.state as string) || "OPEN",
          htmlUrl: rawUrl,
          repositoryName: repoFullName,
        };
      });
    }

    // Old API format: githubIssues
    if (Array.isArray(traceability.githubIssues)) {
      return traceability.githubIssues.map((iss) => ({
        issueId: iss.issueId || "",
        issueNumber: iss.githubIssueNumber || 0,
        title: iss.title || "Chưa có tiêu đề",
        state: iss.state || "OPEN",
        htmlUrl: iss.htmlUrl || "#",
        repositoryName: iss.repositoryName || "",
      }));
    }

    return [];
  }, [traceability]);

  const linkedPRsList = React.useMemo(() => {
    if (!traceability?.linkedPullRequests?.items) return [];
    return (traceability.linkedPullRequests.items as Array<Record<string, unknown>>).map((p) => {
      const repoObj = (p.repository as { fullName?: string }) || {};
      const repoFullName = repoObj.fullName || "";
      const num = (p.pullNumber as number) ?? (p.number as number) ?? 0;
      const url = (p.htmlUrl as string) || (repoFullName ? `https://github.com/${repoFullName}/pull/${num}` : "#");
      return {
        id: (p.id as string) || String(num),
        pullNumber: num,
        title: (p.title as string) || `PR #${num}`,
        status: (p.status as string) || "OPEN",
        htmlUrl: url,
        repositoryName: repoFullName,
      };
    });
  }, [traceability]);

  const linkedCommitsList = React.useMemo(() => {
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

  const linkedIssueIds = linkedIssuesList.map((i) => i.issueId).filter(Boolean);

  const handleUnlink = (issueId: string) => {
    setUnlinkingIssueId(issueId);
    const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `unlink-${issueId}`;
    unlinkIssue(
      { issueId, idempotencyKey },
      {
        onSettled: () => setUnlinkingIssueId(null),
      }
    );
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-primary/20 bg-primary/[0.02] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-primary" />
          <h4 className="text-xs font-extrabold text-foreground tracking-wide uppercase">
            Ma trận liên kết GitHub (Traceability)
          </h4>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          disabled={isEnded}
          className="rounded-xl text-xs font-bold h-8 px-3 border-primary/30 text-primary hover:bg-primary/10 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> Liên kết Issue
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin text-primary" /> Đang tải ma trận liên kết...
        </div>
      ) : linkedIssuesList.length === 0 && linkedPRsList.length === 0 && linkedCommitsList.length === 0 ? (
        <div className="p-3 bg-muted/20 border border-border/30 rounded-xl text-center">
          <p className="text-xs text-muted-foreground italic">
            Chưa có GitHub Issue, PR hoặc Commit nào được liên kết với công việc này.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* GitHub Issues List */}
          {linkedIssuesList.map((issue) => {
            const isUnlinking = unlinkingIssueId === issue.issueId;

            return (
              <div
                key={issue.issueId}
                className="p-3 rounded-xl border border-border/40 bg-card/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`rounded-md text-[9px] py-0 px-1.5 font-bold ${issue.state === "OPEN"
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                          : "border-muted text-muted-foreground bg-muted/20"
                        }`}
                    >
                      <CircleDot className="size-2.5 mr-1 inline" /> Issue #{issue.issueNumber}
                    </Badge>
                    {issue.repositoryName && (
                      <span className="text-[10px] font-semibold text-muted-foreground truncate">
                        {issue.repositoryName}
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-foreground truncate">{issue.title}</p>

                  {issue.htmlUrl && issue.htmlUrl !== "#" && (
                    <a
                      href={issue.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      Xem trên GitHub <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={isUnlinking || isEnded}
                  onClick={() => handleUnlink(issue.issueId)}
                  className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Hủy liên kết"
                >
                  {isUnlinking ? <Loader2 className="size-3 animate-spin" /> : <Trash2 size={14} />}
                </Button>
              </div>
            );
          })}

          {/* Linked Pull Requests */}
          {linkedPRsList.map((pr) => (
            <div
              key={pr.id}
              className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="rounded-md text-[9px] py-0 px-1.5 font-bold border-purple-500/30 text-purple-600 bg-purple-500/10">
                    <GitPullRequest className="size-2.5 mr-1 inline" /> PR #{pr.pullNumber} {pr.status}
                  </Badge>
                  {pr.repositoryName && (
                    <span className="text-[10px] font-semibold text-muted-foreground truncate">
                      {pr.repositoryName}
                    </span>
                  )}
                </div>
                <p className="font-bold text-foreground truncate">{pr.title}</p>
                {pr.htmlUrl && pr.htmlUrl !== "#" && (
                  <a href={pr.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:underline">
                    Xem PR trên GitHub <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Linked Commits */}
          {linkedCommitsList.map((cm) => (
            <div
              key={cm.id}
              className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="rounded-md text-[9px] py-0 px-1.5 font-bold border-blue-500/30 text-blue-600 bg-blue-500/10 font-mono">
                    <GitCommit className="size-2.5 mr-1 inline" /> {cm.sha}
                  </Badge>
                  {cm.repositoryName && (
                    <span className="text-[10px] font-semibold text-muted-foreground truncate">
                      {cm.repositoryName}
                    </span>
                  )}
                </div>
                <p className="font-bold text-foreground truncate">{cm.message}</p>
                {cm.htmlUrl && cm.htmlUrl !== "#" && (
                  <a href={cm.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline">
                    Xem Commit trên GitHub <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chọn Issue */}
      <LinkGithubIssueModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectId={projectId}
        taskId={taskId}
        linkedIssueIds={linkedIssueIds}
      />
    </div>
  );
}
