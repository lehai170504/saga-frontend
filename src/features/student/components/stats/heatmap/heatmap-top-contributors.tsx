"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeatmapStudentRow } from "@/features/projects/types";

interface HeatmapTopContributorsProps {
  students: HeatmapStudentRow[];
}

export function HeatmapTopContributors({ students }: HeatmapTopContributorsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {students.slice(0, 3).map((student, idx) => (
        <Card
          key={student.studentId}
          className="rounded-2xl p-5 border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                #{idx + 1}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-foreground">{student.fullName}</h4>
                <p className="text-[10px] text-muted-foreground font-bold">{student.studentCode}</p>
              </div>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black text-xs px-2.5 py-0.5">
              {student.totalScore} điểm
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="font-black text-emerald-600 dark:text-emerald-400">{student.commits}</div>
              <div className="text-[9px] font-bold text-muted-foreground uppercase">Commits</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="font-black text-blue-600 dark:text-blue-400">{student.tasks}</div>
              <div className="text-[9px] font-bold text-muted-foreground uppercase">Tasks</div>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="font-black text-purple-600 dark:text-purple-400">{student.peerReviews}</div>
              <div className="text-[9px] font-bold text-muted-foreground uppercase">Reviews</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
