"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSprintVelocity, useSprintBurndown } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, Activity, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export function ProjectBurndownChart({ courseId, teamId }: { courseId: string; teamId: string }) {
  const { data: velocityData, isLoading: isLoadingSprints } = useSprintVelocity(courseId, teamId);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  const activeSprintId = selectedSprintId || (velocityData?.sprints?.[0]?.sprintId ?? "");

  const { data: burndownData, isLoading: isLoadingBurndown } = useSprintBurndown(courseId, teamId, activeSprintId);

  const isLoading = isLoadingSprints || isLoadingBurndown;

  const chartData = React.useMemo(() => {
    if (!burndownData?.points) return [];
    return burndownData.points.map((p: { date: string; idealRemaining: number; actualRemaining: number; doneCount: number }) => ({
      date: format(parseISO(p.date), 'dd/MM', { locale: vi }),
      ideal: p.idealRemaining,
      actual: p.actualRemaining,
      done: p.doneCount,
    }));
  }, [burndownData]);

  const currentPoint = React.useMemo(() => {
    if (!burndownData?.points?.length) return null;
    const today = new Date().toISOString().split('T')[0];
    const pastOrToday = burndownData.points.filter((p: { date: string; idealRemaining: number; actualRemaining: number; doneCount: number }) => p.date <= today);
    return pastOrToday.length > 0 ? pastOrToday[pastOrToday.length - 1] : burndownData.points[0];
  }, [burndownData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <TrendingDown size={14} />
            Agile Analytics
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Sprint Burndown</h2>
          <p className="text-muted-foreground font-medium">
            Theo dõi tiến độ hoàn thành công việc thực tế so với kế hoạch lý tưởng của từng Sprint.
          </p>
        </div>

        {velocityData?.sprints && velocityData.sprints.length > 0 && (
          <Select value={activeSprintId} onValueChange={setSelectedSprintId} disabled={isLoading}>
            <SelectTrigger className="w-[250px] bg-card border-border/50 h-12 rounded-xl font-medium">
              <SelectValue placeholder="Chọn Sprint..." />
            </SelectTrigger>
            <SelectContent>
              {velocityData.sprints.map((s: { sprintId: string; sprintName: string }) => (
                <SelectItem key={s.sprintId} value={s.sprintId}>
                  {s.sprintName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Tổng quan Sprint</h3>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : burndownData ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-background border border-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">TỔNG SCOPE</p>
                      <p className="text-2xl font-bold text-foreground">{burndownData.totalScope} <span className="text-sm font-medium text-muted-foreground">tasks</span></p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={20} />
                    </div>
                  </div>

                  {currentPoint && (
                    <div className="p-4 rounded-2xl bg-background border border-border/50 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">ĐÃ HOÀN THÀNH</p>
                        <p className="text-2xl font-bold text-success">
                          {currentPoint.doneCount}
                          <span className="text-sm font-medium text-muted-foreground ml-1">tasks</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                        <TrendingDown size={20} />
                      </div>
                    </div>
                  )}

                  {currentPoint && currentPoint.actualRemaining > currentPoint.idealRemaining && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex gap-3">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold">Cảnh báo tiến độ</p>
                        <p className="text-xs font-medium mt-1 opacity-90">Team đang hoàn thành task chậm hơn dự kiến.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">Không có dữ liệu tổng quan.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Panel */}
        <Card className="lg:col-span-3 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
          <CardContent className="p-6 h-[450px]">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-xl" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
                    dx={-10}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '8px' }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
                  />
                  <Line
                    name="Đường lý tưởng"
                    type="monotone"
                    dataKey="ideal"
                    stroke="var(--muted-foreground)"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, fill: "var(--muted-foreground)" }}
                  />
                  <Line
                    name="Thực tế"
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--primary)"
                    strokeWidth={4}
                    dot={{ strokeWidth: 3, r: 4, fill: "var(--background)" }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-lg">Không có dữ liệu Burndown</p>
                <p className="text-sm opacity-70 mt-1">Sprint này có thể chưa bắt đầu hoặc chưa có task nào được lên kế hoạch.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
