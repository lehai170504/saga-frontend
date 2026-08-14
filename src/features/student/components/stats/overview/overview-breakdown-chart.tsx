"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface OverviewBreakdownChartProps {
  chartData: any[];
  totalActivities: number;
}

export function OverviewBreakdownChart({ chartData, totalActivities }: OverviewBreakdownChartProps) {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">Phân bổ Chi tiết Hoạt động</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Số lượng Commits, Tasks, Reviews & Comments theo ngày</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-xl text-[10px] font-bold py-1 px-3 border-primary/30 text-primary bg-primary/5">
          {totalActivities} Hoạt động
        </Badge>
      </div>

      <div className="h-[300px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
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
              labelFormatter={(label: any) => `Ngày: ${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(val: string) => (
                <span className="text-[11px] font-bold text-foreground">
                  {val === "commits"
                    ? "Commits"
                    : val === "tasks"
                    ? "Tasks"
                    : val === "peerReviews"
                    ? "Peer Reviews"
                    : val === "comments"
                    ? "Comments"
                    : "Docs"}
                </span>
              )}
            />
            <Bar dataKey="commits" name="commits" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="tasks" name="tasks" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="peerReviews" name="peerReviews" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} />
            <Bar dataKey="comments" name="comments" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
