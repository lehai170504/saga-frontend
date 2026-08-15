"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Link2 } from "lucide-react";

interface ProjectInfoSidebarProps {
  teamName: string;
  myRole?: string;
}

export function ProjectInfoSidebar({ teamName, myRole }: ProjectInfoSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 space-y-6">
        <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 border-b border-border/40 pb-4">
          <ShieldCheck className="text-primary" size={16} />
          <span>Thông tin Nhóm</span>
        </h3>

        <div className="space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-start gap-4">
            <span className="text-muted-foreground">Nhóm dự án:</span>
            <span className="text-primary text-right font-extrabold">{teamName}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-muted-foreground">Vai trò của bạn:</span>
            <span className="text-foreground text-right font-extrabold">{myRole || "-"}</span>
          </div>
        </div>
      </Card>

      <Card className="border border-primary/20 bg-primary/10 rounded-3xl p-5 flex gap-3.5 items-start shadow-sm text-left">
        <Link2 className="text-primary shrink-0" size={16} />
        <div className="space-y-1">
          <h4 className="font-extrabold text-foreground text-[11px] uppercase tracking-wide">
            Quản lý tích hợp
          </h4>
          <p className="text-muted-foreground text-[10px] font-medium leading-relaxed">
            Chỉ nhóm trưởng (Leader) mới có quyền sửa đổi cấu hình tích hợp GitHub và Jira. Các thành viên khác chỉ có thể xem trạng thái.
          </p>
        </div>
      </Card>
    </div>
  );
}
