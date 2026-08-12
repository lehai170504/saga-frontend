"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectTraceability } from "@/features/projects/hooks/useTraceability";
import { Activity, GitCommit, GitPullRequest, CircleDot, ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectTraceabilityView({ projectId }: { projectId: string }) {
  const { data: traceability, isLoading } = useProjectTraceability(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-[1.5rem]" />
        ))}
      </div>
    );
  }

  const timeline = traceability?.timeline || [];

  if (timeline.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-border/50 bg-card/25 backdrop-blur-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto">
          <Activity size={32} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Chưa có sự kiện nào</h2>
        <p className="text-muted-foreground text-xs max-w-sm mx-auto">
          Dự án chưa có hoạt động công việc nào (Task, Issue, Commit) để hiển thị dòng thời gian.
        </p>
      </Card>
    );
  }

  const getEventIcon = (sourceType: string) => {
    switch (sourceType) {
      case "JIRA_TASK": return <ListTodo size={16} className="text-blue-500" />;
      case "GITHUB_ISSUE": return <CircleDot size={16} className="text-emerald-500" />;
      case "GITHUB_COMMIT": return <GitCommit size={16} className="text-amber-500" />;
      case "GITHUB_PULL_REQUEST": return <GitPullRequest size={16} className="text-purple-500" />;
      default: return <Activity size={16} className="text-primary" />;
    }
  };

  const getEventBg = (sourceType: string) => {
    switch (sourceType) {
      case "JIRA_TASK": return "bg-blue-500/10";
      case "GITHUB_ISSUE": return "bg-emerald-500/10";
      case "GITHUB_COMMIT": return "bg-amber-500/10";
      case "GITHUB_PULL_REQUEST": return "bg-purple-500/10";
      default: return "bg-primary/10";
    }
  };

  const getEventName = (sourceType: string) => {
    switch (sourceType) {
      case "JIRA_TASK": return "Jira Task";
      case "GITHUB_ISSUE": return "GitHub Issue";
      case "GITHUB_COMMIT": return "GitHub Commit";
      case "GITHUB_PULL_REQUEST": return "Pull Request";
      default: return "Activity";
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary" size={20} />
            Dòng thời gian Dự án
          </div>
          {traceability?.truncated && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
              Chỉ hiển thị {traceability.limit} sự kiện gần nhất
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative border-l-2 border-muted/50 ml-4 space-y-8 pb-4">
          {timeline.map((event, idx) => (
            <div key={`${event.resourceId}-${idx}`} className="relative pl-6 sm:pl-8 group">
              {/* Timeline dot */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-background flex items-center justify-center ${getEventBg(event.sourceType)} z-10 transition-transform group-hover:scale-125 duration-300`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
              </div>

              {/* Content card */}
              <Card className="p-4 rounded-2xl bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className={`mt-0.5 p-2 rounded-xl shrink-0 h-fit ${getEventBg(event.sourceType)}`}>
                      {getEventIcon(event.sourceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {getEventName(event.sourceType)}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground/60">•</span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground leading-snug">
                        <span className="text-primary mr-1.5">[{event.displayKey}]</span>
                        {event.title}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
