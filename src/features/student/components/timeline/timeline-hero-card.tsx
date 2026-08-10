"use client";

import React from "react";
import { FolderKanban } from "lucide-react";

interface TimelineHeroCardProps {
  teamName: string;
  projectName?: string;
}

export function TimelineHeroCard({ teamName, projectName }: TimelineHeroCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
            Nhóm của bạn
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            {teamName}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium mt-1">
            <FolderKanban size={14} className="text-primary" />
            Dự án: <span className="font-bold text-foreground">{projectName || "Chưa có đề tài"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
