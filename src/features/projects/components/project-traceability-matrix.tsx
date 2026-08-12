"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, CircleDot, ExternalLink, Info, CheckSquare } from "lucide-react";
import { useProjectTraceability } from "../hooks/useTraceability";

interface ProjectTraceabilityMatrixProps {
  projectId: string;
}

export function ProjectTraceabilityMatrix({ projectId }: ProjectTraceabilityMatrixProps) {
  const { data: matrix, isLoading } = useProjectTraceability(projectId);

  if (isLoading) {
    return <Skeleton className="w-full h-80 rounded-2xl" />;
  }

  const tasks = matrix?.tasks || [];

  return (
    <Card className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" /> Ma trận Traceability (Jira Task ↔ GitHub Issue)
            </CardTitle>
            <CardDescription className="text-xs">
              Theo dõi đối chiếu vết 1-1 giữa các công việc trên Jira và các Issues/Commits trên GitHub.
            </CardDescription>
          </div>
          <Badge variant="outline" className="rounded-xl px-3 py-1 text-xs font-extrabold border-primary/20 bg-primary/5 text-primary">
            {tasks.length} Công việc
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-2xl">
            <Info className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
            <p className="font-bold">Chưa có dữ liệu Ma trận Traceability.</p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              Hãy liên kết các GitHub Issue vào Jira Task trong bảng công việc.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((t) => (
              <div
                key={t.taskId}
                className="p-4 rounded-2xl border border-border/40 bg-card/60 hover:border-border transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="size-4 text-primary shrink-0" />
                    {t.jiraKey && (
                      <Badge variant="secondary" className="rounded-lg text-[10px] font-bold px-2 py-0.5">
                        {t.jiraKey}
                      </Badge>
                    )}
                    <h4 className="text-sm font-bold text-foreground leading-snug">{t.taskTitle}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-semibold">GitHub Issues:</span>
                    <Badge variant="outline" className="rounded-full font-extrabold text-[10px] bg-primary/10 text-primary border-primary/20">
                      {t.githubIssues?.length || 0} Issues
                    </Badge>
                  </div>
                </div>

                {/* Linked Issues */}
                {t.githubIssues && t.githubIssues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    {t.githubIssues.map((issue) => (
                      <div
                        key={issue.issueId}
                        className="p-2.5 rounded-xl border border-border/30 bg-muted/20 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
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
                            <span className="text-[10px] font-medium text-muted-foreground truncate">
                              {issue.repositoryName}
                            </span>
                          </div>
                          <p className="font-bold text-foreground truncate text-[11px]">{issue.title}</p>
                        </div>

                        {issue.htmlUrl && (
                          <a
                            href={issue.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 shrink-0"
                            title="Xem trên GitHub"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 italic pt-1">
                    Chưa liên kết với GitHub Issue nào.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
