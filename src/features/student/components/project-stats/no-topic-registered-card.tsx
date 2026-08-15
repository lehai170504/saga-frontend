"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function NoTopicRegisteredCard() {
  return (
    <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-bold text-destructive">Nhóm chưa đăng ký đề tài</h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        Dự án của nhóm bạn chưa được khởi tạo. Vui lòng đăng ký đề tài tại mục &quot;Thông tin Nhóm&quot; trước khi xem thống kê dự án.
      </p>
    </Card>
  );
}
