"use client";

import React from "react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useContributionEvaluation } from "@/features/lecturer/hooks/useContribution";
import { useEarlyWarnings } from "@/features/lecturer/hooks/useAnalytics";
import { AlertTriangle, User, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamOverviewViewProps {
  courseId: string;
  teamId: string;
}

export function TeamOverviewView({ courseId, teamId }: TeamOverviewViewProps) {
  const { data: evaluation, isLoading } = useContributionEvaluation(teamId, true);
  const { data: earlyWarningsData, isLoading: isWarningsLoading } = useEarlyWarnings(courseId, true);

  const teamWarnings = earlyWarningsData?.warnings?.filter(w => w.teamId === teamId) || [];

  if (isLoading || isWarningsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card border border-border/50 rounded-2xl">
        <Activity className="w-12 h-12 mb-4 text-muted-foreground/50" />
        <p>Không có dữ liệu đánh giá tổng quan cho nhóm này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cảnh báo (Hiển thị đầu tiên nếu có) */}
      {teamWarnings && teamWarnings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Cảnh báo Sớm (Early Warnings)
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {teamWarnings.map((warning, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-destructive text-sm">{warning.warningType}</p>
                  <p className="text-destructive/90 text-sm">{warning.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thành viên */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-indigo-500" />
          Tổng quan Đóng góp
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {evaluation.members.map((member) => (
            <Card key={member.studentId} className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-card/40">
              <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {member.fullName.charAt(0)}
                  </div>
                  <div className="break-all sm:break-normal">
                    <CardTitle className="text-base font-bold text-foreground line-clamp-1">{member.fullName}</CardTitle>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{member.studentCode}</p>
                  </div>
                </div>
                <Badge variant={(member.finalContributionPercentage || 0) < 50 ? "destructive" : "default"} className="rounded-xl px-3 py-1 text-sm font-bold self-start sm:self-auto">
                  {(member.finalContributionPercentage || 0).toFixed(1)}% Tổng
                </Badge>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Code</p>
                  <p className="text-sm font-bold text-blue-500">{(member.codeContributionPercentage || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Test</p>
                  <p className="text-sm font-bold text-emerald-500">{(member.testContributionPercentage || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Docs</p>
                  <p className="text-sm font-bold text-amber-500">{(member.documentContributionPercentage || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Research</p>
                  <p className="text-sm font-bold text-purple-500">{(member.researchContributionPercentage || 0).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Task</p>
                  <p className="text-sm font-bold text-emerald-500">{(member.taskContributionPercentage || 0).toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
