"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieChart } from "lucide-react";
import { TeamEvaluationModal } from "./team-evaluation-modal";

interface TeamEvaluationActionProps {
  courseId: string;
  teamId: string;
  teamName: string;
}

export const TeamEvaluationAction = ({ courseId, teamId, teamName }: TeamEvaluationActionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl h-8 w-8 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600"
        onClick={() => setIsOpen(true)}
        title="Xem đánh giá đóng góp"
      >
        <PieChart className="w-4 h-4" />
      </Button>

      <TeamEvaluationModal
        courseId={courseId}
        teamId={teamId}
        teamName={teamName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
