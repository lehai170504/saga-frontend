"use client";

import React from "react";
import { Star, Loader2 } from "lucide-react";
import { RubricCriterion } from "@/features/projects/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EvaluatingCandidate } from "./hooks/usePeerReviewState";

interface PeerReviewModalProps {
  evaluatingCandidate: EvaluatingCandidate | null;
  onClose: () => void;
  criteria: RubricCriterion[];
  isLoadingTeamRubric: boolean;
  ratings: Record<string, number>;
  onRate: (rubricId: string, value: number) => void;
  comment: string;
  onCommentChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function PeerReviewModal({
  evaluatingCandidate,
  onClose,
  criteria,
  isLoadingTeamRubric,
  ratings,
  onRate,
  comment,
  onCommentChange,
  onSubmit,
  isPending,
}: PeerReviewModalProps) {
  return (
    <Dialog
      open={!!evaluatingCandidate}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={(evaluatingCandidate?.avatarUrl as string) || ((evaluatingCandidate as Record<string, unknown>)?.avatar as string) || ""} alt={evaluatingCandidate?.fullName ?? ""} />
              <AvatarFallback className="font-bold text-sm bg-gradient-to-br from-primary to-orange-600 text-white">
                {evaluatingCandidate?.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Đánh giá: {evaluatingCandidate?.fullName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Mã sinh viên: {evaluatingCandidate?.studentCode}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          {/* Rubric Criteria star ratings */}
          <div className="space-y-4">
            {isLoadingTeamRubric ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Loader2 className="animate-spin text-primary h-6 w-6" />
                <span className="text-xs text-muted-foreground">Đang tải các tiêu chí đánh giá...</span>
              </div>
            ) : (
              criteria.map((criterion) => (
                <div
                  key={criterion.rubricId}
                  className="space-y-2 p-3.5 rounded-2xl bg-muted/30 border border-border/20"
                >
                  <div className="flex justify-between items-start gap-2">
                    <Label className="text-sm font-bold text-foreground">
                      {criterion.criteriaName}
                    </Label>
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                      TRỌNG SỐ: {criterion.weight}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {criterion.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => onRate(criterion.rubricId, star)}
                        className="text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={
                            star <= (ratings[criterion.rubricId] || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* General Comment Textarea */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-foreground">
              Nhận xét / Góp ý chung
            </Label>
            <Textarea
              required
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Nhập nhận xét cụ thể về đóng góp, thái độ làm việc của thành viên này..."
              className="min-h-[100px] rounded-2xl resize-none border-border/50 bg-background/80"
            />
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl font-bold cursor-pointer h-11 px-5"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
