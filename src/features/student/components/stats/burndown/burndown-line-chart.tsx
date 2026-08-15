"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface BurndownLineChartProps {
  startDate?: string;
  endDate?: string;
  chartData: { date: string, idealRemaining: number, actualRemaining: number }[];
  isBehind: boolean;
}

export function BurndownLineChart({
  startDate,
  endDate,
  chartData,
  isBehind,
}: BurndownLineChartProps) {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
            Đường Tiêu thụ Công việc (Burn Rate)
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            Thời gian: {startDate || "N/A"} đến {endDate || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <span className="w-3 h-0.5 bg-primary rounded-full" />
            <span>Lý tưởng (Ideal)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-3 h-1 bg-emerald-500 rounded-full" />
            <span>Thực tế (Actual)</span>
          </div>
        </div>
      </div>

      {/* Chart Graphic */}
      <div className="h-[380px] w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
            <Info size={32} />
            <p className="text-sm font-semibold">Sprint chưa có mốc dữ liệu ngày</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
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
                formatter={(val: number | string | readonly (string | number)[] | undefined, name: string | number | undefined) => [
                  `${val ?? 0} task`,
                  name === "idealRemaining"
                    ? "Lý tưởng còn lại"
                    : name === "actualRemaining"
                      ? "Thực tế còn lại"
                      : "Đã hoàn thành",
                ]}
                labelFormatter={(label: React.ReactNode) => `Ngày: ${label}`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs font-bold text-foreground">
                    {value === "idealRemaining" ? "Lý tưởng" : "Thực tế"}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="idealRemaining"
                name="idealRemaining"
                stroke="var(--primary, #3b82f6)"
                strokeDasharray="6 6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--primary, #3b82f6)" }}
              />
              <Line
                type="monotone"
                dataKey="actualRemaining"
                name="actualRemaining"
                stroke={isBehind ? "#f43f5e" : "#10b981"}
                strokeWidth={3.5}
                dot={{ r: 6, fill: isBehind ? "#f43f5e" : "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
