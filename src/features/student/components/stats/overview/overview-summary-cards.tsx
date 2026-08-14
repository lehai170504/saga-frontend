"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Award, Activity, GitCommit, CheckSquare, UserCheck } from "lucide-react";
import { OverviewTotals } from "@/features/projects/types";

interface OverviewSummaryCardsProps {
  totals: OverviewTotals;
}

export function OverviewSummaryCards({ totals }: OverviewSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Card 1: Total Activity Score */}
      <Card className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Tổng Điểm Hoạt động
          </span>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Award size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {totals.totalScore}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Quy đổi từ Commit, Task, PR & Docs
          </p>
        </div>
      </Card>

      {/* Card 2: Total Activities */}
      <Card className="rounded-2xl p-5 border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Tổng Số Hoạt động
          </span>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Activity size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-primary">
            {totals.totalActivities}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Tương tác phát sinh trong khoảng thời gian
          </p>
        </div>
      </Card>

      {/* Card 3: Commits */}
      <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            GitHub Commits
          </span>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <GitCommit size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {totals.commits}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            +3 điểm / 1 Commit
          </p>
        </div>
      </Card>

      {/* Card 4: Tasks Jira */}
      <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Task Jira (Done)
          </span>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <CheckSquare size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-foreground">
            {totals.tasks}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            +2 điểm / 1 Task
          </p>
        </div>
      </Card>

      {/* Card 5: Peer Reviews & Comments */}
      <Card className="rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Đánh giá & Thảo luận
          </span>
          <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {totals.peerReviews}
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Peer Reviews</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground">
              {totals.comments}
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Comments</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
