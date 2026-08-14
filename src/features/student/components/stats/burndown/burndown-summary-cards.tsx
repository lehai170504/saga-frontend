"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, TrendingDown, CheckCircle2, Clock } from "lucide-react";

interface BurndownSummaryCardsProps {
  totalScope: number;
  sprintName?: string;
  currentActual: number;
  currentIdeal: number;
  currentDone: number;
  isBehind: boolean;
  isAhead: boolean;
}

export function BurndownSummaryCards({
  totalScope,
  sprintName,
  currentActual,
  currentIdeal,
  currentDone,
  isBehind,
  isAhead,
}: BurndownSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Scope */}
      <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Tổng Scope (Tasks)
          </span>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-foreground">
            {totalScope}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Công việc trong Sprint {sprintName}
          </p>
        </div>
      </Card>

      {/* Card 2: Actual Remaining */}
      <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Thực tế còn lại
          </span>
          <div
            className={`p-2.5 rounded-xl ${
              isBehind
                ? "bg-rose-500/10 text-rose-500"
                : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            <TrendingDown size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div
            className={`text-3xl font-black tracking-tight ${
              isBehind
                ? "text-rose-500"
                : isAhead
                ? "text-emerald-500"
                : "text-foreground"
            }`}
          >
            {currentActual}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Mục tiêu lý tưởng: <strong className="text-foreground">{currentIdeal}</strong>
          </p>
        </div>
      </Card>

      {/* Card 3: Completed Tasks */}
      <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Đã Hoàn thành (Done)
          </span>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {currentDone}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Đạt {totalScope > 0 ? ((currentDone / totalScope) * 100).toFixed(1) : 0}% tổng Scope
          </p>
        </div>
      </Card>

      {/* Card 4: Sprint Status Banner */}
      <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Trạng thái Tiến độ
          </span>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Clock size={18} />
          </div>
        </div>
        <div className="mt-4">
          {isBehind ? (
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs font-extrabold py-1 px-3 rounded-xl">
              ⚠️ Bị chậm tiến độ
            </Badge>
          ) : isAhead ? (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-extrabold py-1 px-3 rounded-xl">
              🚀 Vượt tiến độ
            </Badge>
          ) : (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-extrabold py-1 px-3 rounded-xl">
              ✅ Đúng kế hoạch
            </Badge>
          )}
          <p className="text-xs text-muted-foreground font-medium mt-2 leading-tight">
            {isBehind
              ? "Nhóm cần tập trung hoàn thành các task còn tồn đọng."
              : "Nhóm đang duy trì tốc độ làm việc rất tốt."}
          </p>
        </div>
      </Card>
    </div>
  );
}
