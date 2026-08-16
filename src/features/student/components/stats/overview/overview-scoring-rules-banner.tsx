"use client";

import React from "react";

import { Info } from "lucide-react";

export function OverviewScoringRulesBanner() {
  return (
    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground font-medium flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Info size={16} className="text-primary shrink-0" />
        <span>
          <strong>Quy tắc tính điểm hoạt động (Activity Score):</strong> Commit = <strong>3đ</strong> | Task Jira = <strong>2đ</strong> | Peer Review = <strong>2đ</strong> | Comment = <strong>1đ</strong> | Document = <strong>1đ</strong>.
        </span>
      </div>
    </div>
  );
}
