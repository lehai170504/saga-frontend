"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CommitReview } from "@/features/projects/types";
import { Loader2, CheckCircle2, AlertTriangle, HelpCircle, Info, XCircle, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommitReviewBadgeProps {
  review?: CommitReview | null;
  className?: string;
}

export function CommitReviewBadge({ review, className }: CommitReviewBadgeProps) {
  if (!review) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-muted/30 text-muted-foreground border-border/50 gap-1.5 shrink-0",
          className
        )}
      >
        <Sparkles size={11} className="opacity-60" />
        <span>Chưa có đánh giá AI</span>
      </Badge>
    );
  }

  const { intentStatus, result } = review;
  const upperIntent = (intentStatus || "").toUpperCase();
  const overallStatus = (result?.overallStatus || "").toUpperCase();
  const verdict = (result?.verdict || "").toUpperCase();

  // 1. Queueing / Starting
  if (upperIntent === "PENDING" || upperIntent === "STARTING") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 shrink-0",
          className
        )}
      >
        <Loader2 size={11} className="animate-spin text-amber-500" />
        <span>Đang xếp hàng</span>
      </Badge>
    );
  }

  // 2. Running
  if (upperIntent === "STARTED" || upperIntent === "RUNNING") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1.5 shrink-0",
          className
        )}
      >
        <Loader2 size={11} className="animate-spin text-blue-500" />
        <span>AI đang đánh giá</span>
      </Badge>
    );
  }

  // 3. Waiting Retry
  if (upperIntent === "WAITING_RETRY") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 gap-1.5 shrink-0",
          className
        )}
      >
        <RotateCw size={11} className="animate-spin text-orange-500" />
        <span>Đang thử lại</span>
      </Badge>
    );
  }

  // 4. Failed
  if (upperIntent === "FAILED") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-destructive/10 text-destructive border-destructive/30 gap-1.5 shrink-0",
          className
        )}
      >
        <XCircle size={11} />
        <span>Đánh giá thất bại</span>
      </Badge>
    );
  }

  // 5. Cancelled
  if (upperIntent === "CANCELLED") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-muted/50 text-muted-foreground border-border/50 gap-1.5 shrink-0",
          className
        )}
      >
        <XCircle size={11} className="opacity-60" />
        <span>Đã hủy</span>
      </Badge>
    );
  }

  // 6. Completed Results
  if (upperIntent === "COMPLETED") {
    if (overallStatus === "PASS") {
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 shrink-0",
            className
          )}
        >
          <CheckCircle2 size={11} className="text-emerald-500" />
          <span>Đạt</span>
        </Badge>
      );
    }

    if (overallStatus === "NEEDS_CHANGES") {
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 shrink-0",
            className
          )}
        >
          <AlertTriangle size={11} className="text-amber-500" />
          <span>Cần chỉnh sửa</span>
        </Badge>
      );
    }

    if (overallStatus === "INSUFFICIENT_CONTEXT") {
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 gap-1.5 shrink-0",
            className
          )}
        >
          <HelpCircle size={11} className="text-slate-500" />
          <span>Thiếu ngữ cảnh</span>
        </Badge>
      );
    }

    if (verdict === "ADVISORY_ONLY") {
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 gap-1.5 shrink-0",
            className
          )}
        >
          <Info size={11} className="text-sky-500" />
          <span>Khuyến nghị</span>
        </Badge>
      );
    }

    // Default completed fallback
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 shrink-0",
          className
        )}
      >
        <CheckCircle2 size={11} className="text-emerald-500" />
        <span>{overallStatus || "Đã xong"}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-xl text-[11px] font-bold px-2.5 py-1 bg-muted/40 text-muted-foreground border-border/50 gap-1.5 shrink-0",
        className
      )}
    >
      <Sparkles size={11} className="opacity-60" />
      <span>Chưa có đánh giá AI</span>
    </Badge>
  );
}
