"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles } from "lucide-react";

const slicingData = [
  { name: "Nguyễn Văn A", value: 35, color: "#6366f1" }, // indigo-500
  { name: "Trần Thị B", value: 25, color: "#f59e0b" }, // amber-500
  { name: "Lê Văn C", value: 40, color: "#10b981" }, // emerald-500
];

export function SlicingPieChart() {
  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary" size={20} />
          Biểu đồ Slicing Pie (Phân bổ Cổ phần)
        </CardTitle>
        <CardDescription className="font-medium mt-1">
          Tỷ lệ % Slices cuối cùng sau khi nhân Hệ số Công việc & Retrospective
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slicingData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={8}
              >
                {slicingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                formatter={(value: unknown) => [`${value}% Slices`, 'Đóng góp']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng Slices</span>
            <span className="text-4xl font-bold text-foreground">100%</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {slicingData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-background border border-border/50 px-3 py-1.5 rounded-xl">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-bold">{item.name}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
