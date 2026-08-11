"use client";

import React, { useState } from "react";
import { Download, Activity, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { MetricCard } from "@/components/shared/MetricCard";
import { useAuditLogs } from "@/features/admin/hooks/useAuditLogs";
import { AuditLogsTable } from "@/features/admin/components/audit-logs-table";

export default function SystemLogsPage() {
  const [page, setPage] = useState(0);

  const { data: logsData, isLoading } = useAuditLogs({
    page,
    size: 20, // Standard size for table
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Nhật ký Hệ thống (Audit Logs)"
        description="Theo dõi tất cả các thay đổi về cấu hình, tích hợp API và hoạt động của Admin."
        workspace="Workspace Quản trị"
      >
        <Button variant="outline" className="rounded-xl h-12 shadow-sm text-foreground bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80">
          <Download className="mr-2 h-4 w-4" /> Xuất Log (CSV)
        </Button>
      </PageHeader>

      {/* Stats cards to make the page look more like a Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng sự kiện (Hệ thống)"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : (logsData?.totalElements?.toString() || "0")}
          icon={<Activity className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="Cảnh báo / Lỗi"
          value={isLoading ? <Skeleton className="h-8 w-12" /> : "0"}
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <MetricCard
          title="Tình trạng Server"
          value={isLoading ? <Skeleton className="h-8 w-24" /> : "Bình thường"}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
        />
        <MetricCard
          title="Kết nối DB"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : "Ổn định"}
          icon={<Clock className="w-4 h-4 text-primary" />}
        />
      </div>

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                ))}
              </div>
            </div>
          ) : (
            <AuditLogsTable
              data={logsData?.content || []}
              pageIndex={logsData?.number || 0}
              totalPages={logsData?.totalPages || 0}
              totalElements={logsData?.totalElements || 0}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
