"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, History } from "lucide-react";
import { useGraphProcessing } from "../../hooks/useAdminReports";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMemo } from "react";

export function GraphProcessingChart() {
  const { data, isLoading } = useGraphProcessing();

  const chartData = useMemo(() => {
    if (!data?.points) return [];
    return data.points.map((p) => {
      const dateParts = p.date.split("-");
      const name = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : p.date;
      return {
        name,
        nodes: (p.nodesCreated || 0) + (p.nodesUpdated || 0),
        edges: (p.edgesCreated || 0) + (p.edgesUpdated || 0),
        ...p,
      };
    });
  }, [data]);

  return (
    <Card className="rounded-[2rem] shadow-sm border-border bg-card/40 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Mật độ Xử lý Đồ thị ({data?.periodDays || 7} ngày qua)
        </CardTitle>
        <div className="text-[11px] font-medium text-muted-foreground mt-2 space-y-1.5 p-2.5 bg-background/50 rounded-xl border border-border/40">
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary shadow-sm" /> <span className="font-semibold text-primary">Đỉnh (Nodes):</span> Các thực thể (Student, Git Issues, Commit, Comment...)</p>
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success shadow-sm" /> <span className="font-semibold text-success">Cạnh (Edges):</span> Các hành động thực thi, luồng tương tác (Authored, Reviewed...)</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 min-h-[280px]">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        ) : data?.historySupported === false ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] bg-gradient-to-b from-muted/10 to-muted/30 rounded-[1.5rem] border border-dashed border-border/60 relative overflow-hidden group mt-4">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="p-4 bg-background/80 backdrop-blur-sm rounded-full mb-4 shadow-sm border border-border/50 relative">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-extrabold text-foreground tracking-tight">Lịch sử xử lý đồ thị chưa được lưu trữ</p>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs font-medium">
              Tính năng theo dõi và lưu trữ lịch sử xử lý SNA/Graph đang trong quá trình phát triển <span className="inline-block px-1.5 py-0.5 ml-1 rounded-md bg-muted text-[10px] uppercase font-bold tracking-widest text-primary">TBD</span>
            </p>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEdges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--border))", strokeWidth: 2, strokeDasharray: "4 4" }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                />
                <Area type="monotone" dataKey="edges" name="Cạnh (Hành động)" stroke="hsl(var(--success))" strokeWidth={3} fillOpacity={1} fill="url(#colorEdges)" />
                <Area type="monotone" dataKey="nodes" name="Đỉnh (Thực thể)" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorNodes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[280px] bg-muted/20 rounded-2xl border border-dashed border-border/60">
            <p className="text-sm font-medium text-muted-foreground">Không có dữ liệu trong khoảng thời gian này</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
