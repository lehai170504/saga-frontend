"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Check, CircleDot, GitPullRequest, GitCommit, Plus } from "lucide-react";
import { useTaskTraceability } from "@/features/projects/hooks/useTraceability";
import { LinkGithubIssueModal } from "@/features/projects/components/link-github-issue-modal";
import { recordGithubPopoverClosed } from "../utils/popoverCloseGuard";
import { useGithubTraceabilityData } from "./use-github-traceability-data";
import { GithubBadgeTriggerButton } from "./github-badge-trigger-button";

export interface GithubDevelopmentPopoverProps {
  projectId: string;
  taskId: string;
  children?: React.ReactNode;
}

export function GithubDevelopmentPopover({
  projectId,
  taskId,
  children,
}: GithubDevelopmentPopoverProps) {
  const [open, setOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const { data: traceability, isLoading } = useTaskTraceability(projectId, open ? taskId : "");

  const {
    linkedIssuesList,
    linkedPRsList,
    linkedCommitsList,
    primaryIssue,
    hasNoItems,
  } = useGithubTraceabilityData(traceability);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="inline-block"
      >
        {children || <GithubBadgeTriggerButton projectId={projectId} taskId={taskId} />}
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            recordGithubPopoverClosed();
          }
          setOpen(nextOpen);
        }}
      >
        <DialogContent
          showCloseButton={false}
          onClick={(e) => e.stopPropagation()}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="sm:max-w-[440px] rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-5 space-y-4"
        >
          <DialogHeader className="pb-3 border-b border-border/40 text-left">
            <DialogTitle asChild>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-foreground text-sm">
                  <span className="text-pink-500 font-bold text-base">🐙</span>
                  <span>GitHub Development</span>
                </div>
                {!isLoading && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      setIsLinkModalOpen(true);
                    }}
                    className="h-7 px-2.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-xl gap-1"
                  >
                    <Plus size={12} /> Liên kết
                  </Button>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Chi tiết các Issue, Commit và Pull Request liên quan đến công việc.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground text-xs gap-2">
              <Loader2 className="size-4 animate-spin text-primary" /> Đang tải ma trận GitHub...
            </div>
          ) : hasNoItems ? (
            <div className="p-4 bg-muted/20 border border-border/30 rounded-2xl text-center space-y-3">
              <p className="text-xs text-muted-foreground italic">
                Chưa có GitHub Issue nào được liên kết với công việc này.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  setIsLinkModalOpen(true);
                }}
                className="rounded-xl text-xs font-bold h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-md"
              >
                <Plus size={14} /> Liên kết Issue ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Primary Issue info */}
              {primaryIssue ? (
                <div className="space-y-1.5 bg-muted/20 border border-border/30 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <CircleDot size={13} />
                    <span>Issue #{primaryIssue.issueNumber}</span>
                  </div>
                  <p className="font-extrabold text-foreground leading-snug text-xs">
                    {primaryIssue.title}
                  </p>
                  {primaryIssue.repositoryName && (
                    <p className="text-[10px] font-semibold text-muted-foreground">
                      Repository: <span className="font-bold text-foreground/80">{primaryIssue.repositoryName}</span>
                    </p>
                  )}
                  {primaryIssue.htmlUrl && primaryIssue.htmlUrl !== "#" && (
                    <a
                      href={primaryIssue.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline pt-1"
                    >
                      Xem trên GitHub <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ) : null}

              {/* Commits List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitCommit size={13} className="text-blue-500" /> Commits ({linkedCommitsList.length})
                  </span>
                </div>
                {linkedCommitsList.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground/60 italic pl-1">Chưa có commit nào</p>
                ) : (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {linkedCommitsList.map((cm) => (
                      <div
                        key={cm.id}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/90 py-0.5"
                      >
                        <Check size={12} className="text-emerald-500 shrink-0" />
                        <a
                          href={cm.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
                        >
                          {cm.sha}
                        </a>
                        <span className="truncate text-muted-foreground">{cm.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pull Requests List */}
              <div className="border-t border-border/30 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitPullRequest size={13} className="text-purple-500" /> Pull Request ({linkedPRsList.length})
                  </span>
                </div>
                {linkedPRsList.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground/60 italic pl-1">Chưa có Pull Request nào</p>
                ) : (
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {linkedPRsList.map((pr) => (
                      <div key={pr.id} className="flex items-center justify-between gap-1.5 py-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`size-2 rounded-full shrink-0 ${
                              pr.isMerged ? "bg-purple-500" : "bg-emerald-500 animate-pulse"
                            }`}
                          />
                          <a
                            href={pr.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-[11px] text-foreground hover:text-primary truncate"
                          >
                            #{pr.pullNumber} {pr.title}
                          </a>
                        </div>
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[9px] py-0 px-1.5 font-extrabold uppercase shrink-0 ${
                            pr.isMerged
                              ? "border-purple-500/30 text-purple-600 bg-purple-500/10"
                              : "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                          }`}
                        >
                          {pr.isMerged ? "✓ Merged" : "Open"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Close Button */}
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                recordGithubPopoverClosed();
                setOpen(false);
              }}
              className="rounded-xl font-bold h-8 px-4 text-xs cursor-pointer"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LinkGithubIssueModal
        isOpen={isLinkModalOpen}
        onOpenChange={setIsLinkModalOpen}
        projectId={projectId}
        taskId={taskId}
        linkedIssueIds={linkedIssuesList.map((i) => i.issueId).filter(Boolean)}
      />
    </>
  );
}
