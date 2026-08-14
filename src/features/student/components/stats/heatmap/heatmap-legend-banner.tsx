"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function HeatmapLegendBanner() {
  return (
    <div className="p-4 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2 font-bold text-foreground">
        <Sparkles size={16} className="text-amber-500" />
        <span>Chú giải Thang điểm Nhiệt (Score Levels):</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 font-semibold text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-muted/40 border border-border/50 inline-block" />
          <span className="text-muted-foreground">0đ (Không hoạt động)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-emerald-500/25 border border-emerald-500/40 inline-block" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">1–5đ (Hoạt động Nhẹ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-amber-500/35 border border-amber-500/50 inline-block" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">6–15đ (Hoạt động Vừa)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-rose-500/40 border border-rose-500/60 inline-block" />
          <span className="text-rose-600 dark:text-rose-400 font-bold">&gt;15đ (Hoạt động Cao)</span>
        </div>
      </div>
    </div>
  );
}
