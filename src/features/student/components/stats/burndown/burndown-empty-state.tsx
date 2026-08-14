"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function BurndownEmptyState() {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 p-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
        <Calendar size={32} />
      </div>
      <h3 className="text-xl font-bold text-foreground">Chưa có Sprint nào trong nhóm</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Nhóm của bạn chưa khởi tạo Sprint nào trên Jira. Vui lòng tạo Sprint tại mục &quot;Kế hoạch (Backlog)&quot; để xem biểu đồ tiến độ Burndown Chart.
      </p>
    </Card>
  );
}
