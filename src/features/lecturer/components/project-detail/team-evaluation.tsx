"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SlicingPieChart = dynamic(
  () => import("./charts/slicing-pie-chart").then(m => m.SlicingPieChart),
  { ssr: false, loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" /> }
);
const RetroSkillRadar = dynamic(
  () => import("./charts/retro-skill-radar").then(m => m.RetroSkillRadar),
  { ssr: false, loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" /> }
);

interface TeamEvaluationProps {
  courseId: string;
  teamId: string;
  isEnded?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TeamEvaluation({ courseId, teamId, isEnded }: TeamEvaluationProps) {

  const handleApprove = () => {
    toast.success("Đã phê duyệt kết quả Đóng góp (Slices) cho Sprint này!");
  };

  return (
    <div className="space-y-6">
      {/* Layer 2 & 3: Retro Evaluation & Final Slices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlicingPieChart teamId={teamId} />
        <RetroSkillRadar teamId={teamId} />
      </div>

      {/* Final Action */}
      <div className="flex justify-end pt-4">
        <Button disabled={isEnded} onClick={handleApprove} className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Phê duyệt Kết quả Đánh giá Sprint này
        </Button>
      </div>
    </div>
  );
}
