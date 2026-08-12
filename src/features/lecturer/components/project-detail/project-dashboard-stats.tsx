"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectDashboardStats } from "@/features/projects/hooks/useProjects";
import { ListTodo, GitPullRequest, GitCommit, CheckCircle2, CircleDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProjectDashboardStats({ projectId }: { projectId: string }) {
  const { data: stats, isLoading } = useProjectDashboardStats(projectId);

  if (isLoading) {
    return <Skeleton className="h-[140px] w-full rounded-[2rem]" />;
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Tasks Stats */}
      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
            <ListTodo size={16} className="text-primary" /> Tiến độ Công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div className="text-3xl font-extrabold">{stats.tasks.completionPercentage}%</div>
            <div className="text-xs text-muted-foreground font-medium mb-1.5">Hoàn thành</div>
          </div>
          <Progress value={stats.tasks.completionPercentage} className="h-2 mb-4" />
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm font-bold">{stats.tasks.completed}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Đã xong</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDashed size={16} className="text-amber-500" />
              <span className="text-sm font-bold">{stats.tasks.incomplete}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Đang làm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Github Stats */}
      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm flex flex-col justify-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
            <GitPullRequest size={16} className="text-primary" /> Hoạt động GitHub
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <GitCommit size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Commits</span>
                <span className="text-xl font-black">{stats.github.commitCount}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-border/50"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                <GitPullRequest size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Pull Requests</span>
                <span className="text-xl font-black">{stats.github.pullRequestCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
