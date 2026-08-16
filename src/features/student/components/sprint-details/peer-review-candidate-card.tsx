"use client";

import React from "react";
import { UserCheck } from "lucide-react";
import { PeerReviewItem } from "@/features/projects/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EvaluatingCandidate } from "./hooks/usePeerReviewState";

interface PeerReviewCandidateCardProps {
  candidate: EvaluatingCandidate;
  reviewsMap: Record<string, PeerReviewItem>;
  onStartReview: (candidate: EvaluatingCandidate) => void;
}

export function PeerReviewCandidateCard({
  candidate,
  reviewsMap,
  onStartReview,
}: PeerReviewCandidateCardProps) {
  const isReviewed = candidate.alreadyReviewed;

  return (
    <Card
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isReviewed
          ? "border-emerald-500/20 bg-emerald-500/[0.02] hover:shadow-lg"
          : "border-border/50 bg-card/60 backdrop-blur-md hover:shadow-xl hover:border-border"
        }`}
    >
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar
            className={`h-14 w-14 border-2 shrink-0 ${isReviewed ? "border-emerald-500/30" : "border-background shadow-md"
              }`}
          >
            <AvatarImage src={(candidate.avatarUrl as string) || ((candidate as Record<string, unknown>)?.avatar as string) || ""} alt={candidate.fullName} />
            <AvatarFallback
              className={`font-bold text-base ${isReviewed
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
                }`}
            >
              {candidate.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <h4 className="text-base font-bold text-foreground truncate">
              {candidate.fullName}
            </h4>
            <p className="text-xs text-muted-foreground font-semibold">
              MSSV: {candidate.studentCode}
            </p>
            {isReviewed &&
              (() => {
                const reviewCreatedAt =
                  reviewsMap[candidate.studentId]?.createdAt || candidate.existingCreatedAt;
                if (!reviewCreatedAt) return null;
                const d = new Date(reviewCreatedAt as string);
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const yyyy = d.getFullYear();
                return (
                  <p className="text-[10px] font-semibold text-muted-foreground/70 mt-0.5">
                    Đánh giá lúc: {`${dd}-${mm}-${yyyy}`}
                  </p>
                );
              })()}
          </div>
        </div>

        <div className="shrink-0">
          {isReviewed ? (
            <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 font-bold px-3 py-1.5 rounded-full shadow-none text-xs flex items-center">
              <UserCheck size={14} className="mr-1.5 shrink-0" />
              Đã đánh giá
            </Badge>
          ) : (
            <Button
              onClick={() => onStartReview(candidate)}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg px-4 h-10 transition-all cursor-pointer"
            >
              Đánh giá
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
