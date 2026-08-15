"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function NoTeamBanner() {
  return (
    <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
        <ShieldCheck size={32} />
      </div>
      <h2 className="text-xl font-bold text-destructive">Bạn chưa được phân nhóm</h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        Hiện tại bạn chưa thuộc nhóm nào trong khóa học này. Vui lòng liên hệ giảng viên để được sắp xếp nhóm trước khi thực hiện chức năng này.
      </p>
    </Card>
  );
}
