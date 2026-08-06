"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEarlyWarnings } from "@/features/lecturer/hooks/useAnalytics";

interface EarlyWarningAlertsProps {
  courseId: string;
  teamId: string;
}

export function EarlyWarningAlerts({ courseId, teamId }: EarlyWarningAlertsProps) {
  const { data: warnings, isLoading } = useEarlyWarnings(courseId);
  const teamWarnings = warnings?.filter(w => w.teamId === teamId) || [];
  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} />
          Radar Cảnh báo sớm từ AI (Early Warning)
        </CardTitle>
        <CardDescription className="font-medium mt-1 text-destructive/80">
          Dữ liệu đối chiếu tự động Real-time giữa Jira (Story Points) và GitHub (Commits/PRs)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8 text-muted-foreground">Đang tải cảnh báo...</div>
        ) : (
          <>
            {teamWarnings.map((alert, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-destructive/20 bg-destructive/5 items-start">
                <div className="p-2 bg-destructive/10 rounded-full text-destructive shrink-0 mt-1">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-foreground text-sm">{alert.message}</h4>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border/50 text-xs font-bold">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{alert.studentId.charAt(0)}</AvatarFallback>
                      </Avatar>
                      SV {alert.studentId.substring(0, 8)}
                    </div>
                    {alert.signalType === "OVERDUE_TASK" && (
                      <Button variant="outline" size="sm" className="h-7 text-xs font-bold border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
                        Thực thi: Xử lý Task quá hạn
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {teamWarnings.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-success">
                <CheckCircle2 size={40} className="mb-2 opacity-50" />
                <p className="font-bold">Nhóm hoạt động hoàn hảo, không phát hiện rủi ro!</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
