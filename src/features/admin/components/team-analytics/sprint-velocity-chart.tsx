"use client";

import React from "react";
import { SprintVelocity } from "@/features/lecturer/types/analytics";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface SprintVelocityChartProps {
  data?: SprintVelocity[];
  isLoading: boolean;
}

export function SprintVelocityChart({ data, isLoading }: SprintVelocityChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    );
  }

  const chartData = Array.isArray(data) ? data : ((data as unknown as Record<string, SprintVelocity[]>)?.content) || [];

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/20">
        <AlertCircle className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground font-medium">Chưa có dữ liệu vận tốc Sprint.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] bg-card p-4 rounded-2xl border border-border">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="sprintName"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
            dx={-10}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar
            dataKey="currentPlannedPoints"
            name="Điểm Kế hoạch"
            fill="hsl(var(--muted-foreground))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Bar
            dataKey="completedPoints"
            name="Điểm Hoàn thành"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
