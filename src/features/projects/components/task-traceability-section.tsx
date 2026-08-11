"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink, CircleDot, Link2, Loader2 } from "lucide-react";
import { useTaskTraceability, useUnlinkTaskIssue } from "../hooks/useTraceability";
import { LinkGithubIssueModal } from "./link-github-issue-modal";

interface TaskTraceabilitySectionProps {
  projectId: string;
  taskId: string;
}

export function TaskTraceabilitySection({ projectId, taskId }: TaskTraceabilitySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unlinkingIssueId, setUnlinkingIssueId] = useState<string | null>(null);

  const { data: traceability, isLoading } = useTaskTraceability(projectId, taskId);
  const { mutate: unlinkIssue } = useUnlinkTaskIssue(projectId, taskId);

  const linkedIssues = traceability?.githubIssues || [];
  const linkedIssueIds = linkedIssues.map((i) => i.issueId);

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
          className="rounded-xl text-xs font-bold h-8 px-3 border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
        >
          <Plus size={14} /> Liên kết Issue
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin text-primary" /> Đang tải ma trận liên kết...
        </div>
      ) : linkedIssues.length === 0 ? (
        <div className="p-3 bg-muted/20 border border-border/30 rounded-xl text-center">
          <p className="text-xs text-muted-foreground italic">
            Chưa có GitHub Issue nào được liên kết với công việc này.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {linkedIssues.map((issue) => {
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
                      className={`rounded-md text-[9px] py-0 px-1.5 font-bold ${
                        issue.state === "OPEN"
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                          : "border-muted text-muted-foreground bg-muted/20"
                      }`}
                    >
                      <CircleDot className="size-2.5 mr-1 inline" /> #{issue.githubIssueNumber}
                    </Badge>
                    <span className="text-[10px] font-semibold text-muted-foreground truncate">
                      {issue.repositoryName}
                    </span>
                  </div>

                  <p className="font-bold text-foreground truncate">{issue.title}</p>

                  {issue.htmlUrl && (
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
                  disabled={isUnlinking}
                  onClick={() => handleUnlink(issue.issueId)}
                  className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 shrink-0"
                  title="Hủy liên kết"
                >
                  {isUnlinking ? <Loader2 className="size-3 animate-spin" /> : <Trash2 size={14} />}
                </Button>
              </div>
            );
          })}
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
