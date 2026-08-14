"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function InteractionLegendBanner() {
  return (
    <div className="p-4 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2 font-bold text-foreground">
        <Sparkles size={16} className="text-primary" />
        <span>Chú giải Loại Tương tác (Interaction Types):</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 font-semibold text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block shadow-sm" />
          <span className="text-purple-600 dark:text-purple-400 font-bold">Review (Đánh giá chéo)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-sm" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Comment (Thảo luận)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block shadow-sm" />
          <span className="text-blue-600 dark:text-blue-400 font-bold">Assigned (Gán Task Jira)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Collaborated (Phối hợp Code)</span>
        </div>
      </div>
    </div>
  );
}
