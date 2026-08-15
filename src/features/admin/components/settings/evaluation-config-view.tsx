"use client";

import React from "react";
import { AiWarningRules } from "@/features/admin/components/evaluation-config/ai-warning-rules";

export function EvaluationConfigView() {
  return (
    <div className="space-y-6">
      <div className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AiWarningRules />
      </div>
    </div>
  );
}
