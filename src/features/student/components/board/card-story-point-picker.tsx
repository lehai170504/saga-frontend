"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskEstimation } from "@/features/projects/hooks/useProjectTasks";
import { JiraTask } from "@/features/projects/types";

export function CardStoryPointPicker({
  projectId,
  task,
}: {
  projectId: string;
  task: JiraTask;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState<string>("");

  const updateEstimationMutation = useUpdateTaskEstimation(projectId);

  const hasPoint = task.storyPoint !== undefined && task.storyPoint !== null && Number(task.storyPoint) > 0;
  const initialVal = hasPoint ? String(task.storyPoint) : "";

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVal(initialVal);
    setIsEditing(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!projectId) {
      toast.error("Không tìm thấy ID dự án.");
      setIsEditing(false);
      return;
    }
    const point = val.trim() !== "" ? Number(val) : 0;
    setIsEditing(false);
    updateEstimationMutation.mutate({
      taskId: task.id,
      storyPoint: point,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setVal(initialVal);
  };

  const displayValue = hasPoint ? String(task.storyPoint) : "-";

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={handleStartEdit}
        title="Click để cập nhật Story Point (Điểm SP)"
        className="h-6 px-2 min-w-[24px] rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black text-[11px] flex items-center justify-center border border-border/50 transition-all cursor-pointer hover:border-primary/50 shrink-0 shadow-xs"
      >
        {displayValue}
      </button>
    );
  }

  return (
    <div
      className="relative shrink-0 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center">
        <Input
          type="number"
          min={0}
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="w-14 h-7 text-xs text-center font-extrabold rounded-md bg-background border-primary focus:ring-1 focus:ring-primary shadow-md px-1"
        />
        <div className="absolute top-8 right-0 flex items-center gap-1 p-1 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={updateEstimationMutation.isPending}
            className="h-6 w-6 rounded-md hover:bg-emerald-500/10 hover:text-emerald-500 text-foreground cursor-pointer"
            title="Lưu"
          >
            {updateEstimationMutation.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={updateEstimationMutation.isPending}
            className="h-6 w-6 rounded-md hover:bg-destructive/10 hover:text-destructive text-foreground cursor-pointer"
            title="Hủy"
          >
            <X size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
