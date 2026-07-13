"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClassNetworkGraph } from "@/features/lecturer/components/class-network-graph";
import { SlicingPieChart } from "./charts/slicing-pie-chart";
import { RetroSkillRadar } from "./charts/retro-skill-radar";

export function TeamEvaluation() {

  const handleApprove = () => {
    toast.success("Đã phê duyệt kết quả Đóng góp (Slices) cho Sprint này!");
  };

  return (
    <div className="space-y-6">
      {/* Network Graph for Slicing Pie Audit */}
      <ClassNetworkGraph />

      {/* Layer 2 & 3: Retro Evaluation & Final Slices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlicingPieChart />
        <RetroSkillRadar />
      </div>

      {/* Final Action */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleApprove} className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Phê duyệt Kết quả Đánh giá Sprint này
        </Button>
      </div>
    </div>
  );
}
