"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { UserCheck, MessageSquare, CheckSquare, GitCommit } from "lucide-react";

interface InteractionSummaryCardsProps {
  totalReviews: number;
  totalComments: number;
  totalAssignments: number;
  totalCollabs: number;
}

export function InteractionSummaryCards({
  totalReviews,
  totalComments,
  totalAssignments,
  totalCollabs,
}: InteractionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Lượt Peer Review
          </span>
          <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {totalReviews}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">Đánh giá gửi & nhận</p>
        </div>
      </Card>

      <Card className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Lượt Comment / Thảo luận
          </span>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <MessageSquare size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {totalComments}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">Trao đổi trên Task & Review</p>
        </div>
      </Card>

      <Card className="rounded-2xl p-5 border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Lượt Gán Task Jira
          </span>
          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
            <CheckSquare size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {totalAssignments}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">Phân công nhiệm vụ</p>
        </div>
      </Card>

      <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Phối hợp Code / PR
          </span>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <GitCommit size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {totalCollabs}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">Commit & PR liên quan</p>
        </div>
      </Card>
    </div>
  );
}
