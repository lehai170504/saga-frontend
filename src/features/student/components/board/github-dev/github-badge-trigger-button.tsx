"use client";

import React from "react";
import { useTaskTraceability } from "@/features/projects/hooks/useTraceability";

export function GithubBadgeTriggerButton({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { data: traceability } = useTaskTraceability(projectId, taskId);

  const badgeText = React.useMemo(() => {
    if (!traceability) return "Git";

    // 1. Check Pull Requests
    if (traceability.linkedPullRequests?.items && traceability.linkedPullRequests.items.length > 0) {
      const pr = (traceability.linkedPullRequests.items[0] as unknown) as { status?: string; pullNumber?: number; number?: number };
      const status = pr.status || "OPEN";
      const isMerged = status.toUpperCase() === "MERGED";
      const num = pr.pullNumber ?? pr.number ?? 0;
      return isMerged ? `✓ PR #${num}` : `PR #${num}`;
    }

    // 2. Check Commits
    if (traceability.linkedCommits?.items && traceability.linkedCommits.items.length > 0) {
      const count = traceability.linkedCommits.items.length;
      return `${count} commit${count > 1 ? "s" : ""}`;
    }

    // 3. Check Issues
    const rawLinked = (traceability as unknown as { linkedIssues?: { items?: Array<{ issue?: { issueNumber?: number; number?: number } }> } }).linkedIssues;
    if (rawLinked?.items && rawLinked.items.length > 0) {
      const num = rawLinked.items[0]?.issue?.issueNumber ?? rawLinked.items[0]?.issue?.number ?? 0;
      return `#${num}`;
    }

    if (Array.isArray(traceability.githubIssues) && traceability.githubIssues.length > 0) {
      return `#${traceability.githubIssues[0].githubIssueNumber || 0}`;
    }

    return "Git";
  }, [traceability]);

  const isMergedPR = badgeText.includes("✓ PR");
  const isUnlinked = badgeText === "Git";

  return (
    <button
      type="button"
      className={`px-2 py-0.5 rounded-lg border text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm hover:scale-105 ${
        isUnlinked
          ? "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 text-muted-foreground"
          : isMergedPR
          ? "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : "border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300"
      }`}
      title="Bấm để xem chi tiết GitHub Development"
    >
      <span className="text-[10px]">🐙</span>
      <span>{badgeText}</span>
    </button>
  );
}
