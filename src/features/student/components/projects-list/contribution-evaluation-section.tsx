"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Activity, Clock, AlertCircle } from "lucide-react";
import { MemberContributionCard } from "./member-contribution-card";
import { ContributionEvaluationResponse, ContributionMember } from "@/features/lecturer/types/contribution";

interface ContributionEvaluationSectionProps {
  isLoadingEvaluation: boolean;
  evaluationData?: ContributionEvaluationResponse | null;
  expandedSprints: Record<string, boolean>;
  onToggleExpand: (studentId: string) => void;
}

export function ContributionEvaluationSection({
  isLoadingEvaluation,
  evaluationData,
  expandedSprints,
  onToggleExpand,
}: ContributionEvaluationSectionProps) {
  const members = (evaluationData?.members || []) as ContributionMember[];

  return (
    <div className="space-y-5 pt-6 border-t border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">Bảng điểm & % Đóng góp dự án</h3>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">
              Điểm số và tỷ lệ đóng góp được hệ thống đánh giá tự động dựa trên hoạt động Jira, Commit và Peer Review.
            </p>
          </div>
        </div>

        {evaluationData && (
          <Badge
            variant="outline"
            className="rounded-xl px-3 py-1 font-semibold text-xs text-muted-foreground bg-muted/20 border-border/50 shrink-0 self-start sm:self-auto flex items-center"
          >
            <Clock size={12} className="mr-1.5 text-muted-foreground/80" />
            Đánh giá lúc: {new Date(evaluationData.evaluatedAt).toLocaleTimeString("vi-VN")}{" "}
            {new Date(evaluationData.evaluatedAt).toLocaleDateString("vi-VN")}
          </Badge>
        )}
      </div>

      {isLoadingEvaluation ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      ) : !members || members.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
          <AlertCircle size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <h4 className="text-base font-bold text-foreground">Chưa có kết quả đánh giá</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Dữ liệu tính toán đóng góp cho nhóm này hiện tại chưa khả dụng hoặc chưa được đồng bộ từ hệ thống.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {members.map((member) => (
            <MemberContributionCard
              key={member.studentId}
              member={member}
              isExpanded={!!expandedSprints[member.studentId]}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
