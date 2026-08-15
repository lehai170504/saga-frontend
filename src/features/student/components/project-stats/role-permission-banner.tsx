"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, UserCheck } from "lucide-react";

interface RolePermissionBannerProps {
  isLeader: boolean;
}

export function RolePermissionBanner({ isLeader }: RolePermissionBannerProps) {
  return (
    <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2.5">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isLeader
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              : "bg-primary/10 text-primary border border-primary/20"
          }`}
        >
          {isLeader ? <Crown size={16} /> : <UserCheck size={16} />}
        </div>
        <div>
          <span className="font-extrabold text-foreground">
            {isLeader ? "Chế độ Trưởng nhóm (Leader View)" : "Chế độ Thành viên (Member Personal View)"}
          </span>
          <p className="text-[11px] font-medium text-muted-foreground leading-snug">
            {isLeader
              ? "Bạn có quyền LEADER — Hệ thống đang tổng hợp và hiển thị biểu đồ chỉ số hoạt động của toàn bộ nhóm."
              : "Bạn đang ở vai trò Thành viên — Hệ thống tự động phân quyền hiển thị thông số và biểu đồ hoạt động cá nhân của bạn."}
          </p>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`shrink-0 font-extrabold text-[10px] px-3 py-1 rounded-xl border ${
          isLeader
            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
            : "bg-primary/10 text-primary border-primary/30"
        }`}
      >
        {isLeader ? "Dữ liệu Toàn nhóm" : "Dữ liệu Cá nhân"}
      </Badge>
    </div>
  );
}
