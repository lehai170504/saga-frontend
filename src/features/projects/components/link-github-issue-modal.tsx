"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, GitPullRequest, CircleDot, ExternalLink, Loader2 } from "lucide-react";
import { useGithubIssues } from "../hooks/useGithubIssues";
import { useLinkTaskIssue } from "../hooks/useTraceability";
import { GithubIssue } from "../types/githubIssue";

interface LinkGithubIssueModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  taskId: string;
  linkedIssueIds: string[];
}

export function LinkGithubIssueModal({
  isOpen,
  onOpenChange,
  projectId,
  taskId,
  linkedIssueIds,
}: LinkGithubIssueModalProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedState, setSelectedState] = useState<"OPEN" | "CLOSED" | undefined>(undefined);
  const [linkingIssueId, setLinkingIssueId] = useState<string | null>(null);

  const { data: issuesPage, isLoading } = useGithubIssues(projectId, {
    keyword: keyword.trim() || undefined,
    state: selectedState,
    size: 50,
  });

  const { mutate: linkIssue } = useLinkTaskIssue(projectId, taskId);

  const issuesList: GithubIssue[] = Array.isArray(issuesPage?.content)
    ? issuesPage.content
    : (issuesPage as unknown as GithubIssue[]) || [];

  const handleLink = (issue: GithubIssue) => {
    setLinkingIssueId(issue.issueId);
    const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `link-${issue.issueId}`;
    linkIssue(
      { issueId: issue.issueId, idempotencyKey },
      {
        onSettled: () => setLinkingIssueId(null),
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-primary" /> Liên kết GitHub Issue
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Chọn GitHub Issue để tạo mối liên kết ma trận (Traceability) với công việc này.
          </DialogDescription>
        </DialogHeader>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 my-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm Issue theo tên hoặc số hiệu..."
              className="pl-9 h-10 rounded-xl bg-card border-border/60 text-xs"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <Button
              variant={selectedState === undefined ? "default" : "outline"}
              size="sm"
              className="rounded-xl text-xs h-9 font-bold"
              onClick={() => setSelectedState(undefined)}
            >
              Tất cả
            </Button>
            <Button
              variant={selectedState === "OPEN" ? "default" : "outline"}
              size="sm"
              className="rounded-xl text-xs h-9 font-bold"
              onClick={() => setSelectedState("OPEN")}
            >
              Đang mở
            </Button>
            <Button
              variant={selectedState === "CLOSED" ? "default" : "outline"}
              size="sm"
              className="rounded-xl text-xs h-9 font-bold"
              onClick={() => setSelectedState("CLOSED")}
            >
              Đã đóng
            </Button>
          </div>
        </div>

        {/* Issues List */}
        <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 my-2 min-h-[160px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-primary" /> Đang tải danh sách GitHub Issues...
            </div>
          ) : issuesList.length === 0 ? (
            <div className="text-center p-8 text-xs text-muted-foreground">
              Không tìm thấy GitHub Issue nào phù hợp.
            </div>
          ) : (
            issuesList.map((issue) => {
              const isAlreadyLinked = linkedIssueIds.includes(issue.issueId);
              const isLinking = linkingIssueId === issue.issueId;

              return (
                <div
                  key={issue.issueId}
                  className="p-3.5 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/80 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`rounded-lg text-[10px] py-0 px-2 font-bold ${
                          issue.state === "OPEN"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                            : "border-muted text-muted-foreground bg-muted/20"
                        }`}
                      >
                        <CircleDot className="size-3 mr-1 inline" /> #{issue.githubIssueNumber} {issue.state}
                      </Badge>
                      <span className="text-[11px] font-semibold text-muted-foreground/80 truncate max-w-[200px]">
                        {issue.repositoryName}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-foreground truncate">{issue.title}</h4>

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
                    size="sm"
                    disabled={isAlreadyLinked || isLinking}
                    onClick={() => handleLink(issue)}
                    className="rounded-xl font-bold text-xs h-8 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLinking ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : isAlreadyLinked ? (
                      "Đã liên kết"
                    ) : (
                      "Liên kết"
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-xl font-bold text-xs h-9 px-4"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
