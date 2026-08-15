"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useAnomalies } from "../../hooks/useAdminReports";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMemo } from "react";

const SIGNAL_MAP: Record<string, { name: string, color: string, gradient: string }> = {
  OVERDUE_TASK: { name: "Quá hạn Task", color: "hsl(var(--destructive))", gradient: "url(#grad-destructive)" },
  MSR: { name: "Task Ảo (MSR)", color: "hsl(var(--warning, 38 92% 50%))", gradient: "url(#grad-warning)" },
  DEADLINE_PROCESS: { name: "Cày Deadline", color: "hsl(var(--primary))", gradient: "url(#grad-primary)" },
  SNA_ISOLATION: { name: "Cô Lập (SNA)", color: "hsl(var(--success, 142 71% 45%))", gradient: "url(#grad-success)" },
};

export function SystemAnomalyChart() {
  const { data: anomalies, isLoading } = useAnomalies();

  const { chartData, tbdSignals, totalCount } = useMemo(() => {
    if (!anomalies) return { chartData: [], tbdSignals: [] };

    const dataArray = anomalies.signals || [];

    const chartData: { name: string, value: number, color: string }[] = [];
    const tbdSignals: { name: string, color: string, signal: string }[] = [];

    dataArray.forEach((anomaly: unknown) => {
      const typedAnomaly = anomaly as { type: string, supportStatus: string, count: number | null };
      const config = SIGNAL_MAP[typedAnomaly.type] || { name: typedAnomaly.type, color: "hsl(var(--muted-foreground))" };

      if (typedAnomaly.supportStatus === "TBD") {
        tbdSignals.push({ name: config.name, color: config.color, signal: typedAnomaly.type });
      } else if (typedAnomaly.count !== null && typedAnomaly.count > 0) {
        chartData.push({
          name: config.name,
          value: typedAnomaly.count,
          color: config.color
        });
      }
    });

    const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);

    return { chartData, tbdSignals, totalCount };
  }, [anomalies]);

  return (
    <Card className="rounded-[2rem] shadow-sm border-border bg-card/40 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          Tín hiệu Cảnh báo (Hệ thống)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="grad-destructive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="grad-warning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--warning, 38 92% 50%))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--warning, 38 92% 50%))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="grad-success" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success, 142 71% 45%))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--success, 142 71% 45%))" stopOpacity={0.6} />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={6}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                  cornerRadius={8}
                >
                  {chartData.map((entry, index) => {
                    const gradientId = SIGNAL_MAP[Object.keys(SIGNAL_MAP).find(k => SIGNAL_MAP[k].name === entry.name) || ""]?.gradient || entry.color;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={gradientId}
                        style={{ filter: "url(#glow)", transformOrigin: "center" }}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    );
                  })}
                </Pie>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black fill-foreground">
                  {totalCount}
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium fill-muted-foreground uppercase tracking-widest">
                  Cảnh báo
                </text>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <p className="text-sm text-muted-foreground font-medium">Chưa có dữ liệu cảnh báo</p>
          </div>
        )}

        {tbdSignals.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border/40">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse" />
              Tính năng đang phát triển (TBD)
            </p>
            <div className="flex flex-wrap gap-2">
              {tbdSignals.map((sig, idx) => (
                <div
                  key={sig.signal || `tbd-${idx}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-border/50 rounded-xl shadow-sm hover:border-border transition-colors"
                >
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: sig.color }} />
                  <span className="text-xs font-semibold text-foreground/80">
                    {sig.name}
                    <span className="ml-1.5 text-[10px] font-medium text-muted-foreground italic opacity-70">Chưa hỗ trợ</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
