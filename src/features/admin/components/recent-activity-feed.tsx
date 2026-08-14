"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { Clock, Activity } from "lucide-react";
import { useAuditLogs } from "@/features/admin/hooks/useAuditLogs";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function RecentActivityFeed() {
  const { data: logsData, isLoading } = useAuditLogs({ page: 0, size: 5 });

  return (
    <Card className="rounded-2xl shadow-sm border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Nhật ký Hệ thống gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 w-full mt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 pl-2">
            {logsData?.content?.length ? (
              logsData.content.map((log) => (
                <div key={log.id} className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-primary">{log.targetEntity}</span> {log.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium capitalize">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Không có nhật ký nào gần đây.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
