"use client";

import React, { useState } from "react";
import { TeamEvaluation } from "./team-evaluation";
import { TeamContributionGraph } from "./team-contribution-graph";
import { BarChart2, Network } from "lucide-react";

interface ProjectContributionTabProps {
  courseId: string;
  teamId: string;
  isEnded?: boolean;
}

export function ProjectContributionTab({ courseId, teamId, isEnded }: ProjectContributionTabProps) {
  const [viewMode, setViewMode] = useState<"evaluation" | "graph">("evaluation");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[2rem] bg-card/60 border border-border/50 backdrop-blur-xl shadow-sm">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight">
            Điểm Đóng góp (Slices)
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-1 max-w-xl">
            Phân tích tỷ lệ đóng góp của từng thành viên dựa trên khối lượng công việc (Story Points) đã hoàn thành và hệ số đánh giá chéo (Peer Review).
          </p>
        </div>

        {/* Segmented Control Toggle */}
        <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border/40 w-fit shrink-0">
          <button
            onClick={() => setViewMode("evaluation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${viewMode === "evaluation"
              ? "bg-background text-primary shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <BarChart2 size={16} />
            Phân tích (Radar/Bar)
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${viewMode === "graph"
              ? "bg-background text-primary shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Network size={16} />
            Mạng lưới (Graph)
          </button>
        </div>
      </div>

      <div className="mt-6">
        {viewMode === "evaluation" ? (
          <TeamEvaluation courseId={courseId} teamId={teamId} isEnded={isEnded} />
        ) : (
          <TeamContributionGraph teamId={teamId} isEnded={isEnded} />
        )}
      </div>
    </div>
  );
}
