"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";

interface OverviewTrendChartProps {
  chartData: any[];
  totalScore: number;
}

export function OverviewTrendChart({ chartData, totalScore }: OverviewTrendChartProps) {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">Xu hướng Điểm Hoạt động Nhóm</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Biểu đồ tổng điểm hoạt động theo từng ngày</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-xl text-[10px] font-bold py-1 px-3 border-amber-500/30 text-amber-500 bg-amber-500/5">
          {totalScore} Tổng điểm
        </Badge>
      </div>

      <div className="h-[300px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary, #3b82f6)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary, #3b82f6)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-[11px] font-bold text-muted-foreground"
              tickLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-[11px] font-bold text-muted-foreground"
              tickLine={false}
              allowDecimals={false}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "1rem",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              formatter={(val: any) => [`${val ?? 0} điểm`, "Điểm hoạt động"]}
              labelFormatter={(label: any) => `Ngày: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="totalScore"
              stroke="var(--primary, #3b82f6)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreAreaGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
