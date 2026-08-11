"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/shared/Skeleton";
import { useContributionEvaluation } from "@/features/lecturer/hooks/useContribution";
import { useEarlyWarnings } from "@/features/lecturer/hooks/useAnalytics";
import { PieChart, AlertTriangle, User, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamEvaluationModalProps {
  courseId: string | null;
  teamId: string | null;
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
}

export const TeamEvaluationModal = ({ courseId, teamId, isOpen, onClose, teamName }: TeamEvaluationModalProps) => {
  // Only fetch when teamId exists and modal is open
  const { data: evaluation, isLoading } = useContributionEvaluation(teamId || "", isOpen);
  const { data: earlyWarningsData, isLoading: isWarningsLoading } = useEarlyWarnings(courseId || "", isOpen);

  const teamWarnings = earlyWarningsData?.warnings?.filter(w => w.teamId === teamId) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl rounded-[2rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" />
            Đánh giá Đóng góp Nhóm: {teamName || "Đang tải..."}
          </DialogTitle>
          <DialogDescription>
            Báo cáo chi tiết về điểm số và phần trăm đóng góp của các thành viên qua các Sprints.
          </DialogDescription>
        </DialogHeader>

        {isLoading || isWarningsLoading || (!teamId && isOpen) ? (
          <div className="space-y-6 mt-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : !evaluation ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <p>Không có dữ liệu đánh giá cho nhóm này.</p>
          </div>
        ) : (
          <div className="space-y-8 mt-4">
            {/* Thành viên */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-indigo-500" />
                Chi tiết Thành viên
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {evaluation.members.map((member) => (
                  <Card key={member.studentId} className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-card/40">
                    <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-foreground">{member.fullName}</CardTitle>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{member.studentCode}</p>
                        </div>
                      </div>
                      <Badge variant={member.finalContributionPercentage < 50 ? "destructive" : "default"} className="rounded-xl px-3 py-1 text-sm font-bold">
                        {member.finalContributionPercentage.toFixed(1)}% Tổng
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">Code</p>
                        <p className="text-sm font-bold text-blue-500">{member.codeContributionPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">Document</p>
                        <p className="text-sm font-bold text-amber-500">{member.documentContributionPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">Design</p>
                        <p className="text-sm font-bold text-purple-500">{member.designContributionPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">Testing/Task</p>
                        <p className="text-sm font-bold text-emerald-500">{member.taskContributionPercentage.toFixed(1)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cảnh báo */}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
