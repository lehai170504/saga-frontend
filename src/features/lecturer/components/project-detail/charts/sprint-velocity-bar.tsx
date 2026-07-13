"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";

const sprintBreakdownData = [
  { name: "Sprint 1", "Nguyễn Văn A": 15, "Trần Thị B": 10, "Lê Văn C": 20 },
  { name: "Sprint 2", "Nguyễn Văn A": 20, "Trần Thị B": 15, "Lê Văn C": 20 },
];

export function SprintVelocityBar() {
  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BarChartIcon className="text-blue-500" size={20} />
          Tiến độ Đóng góp theo Sprints
        </CardTitle>
        <CardDescription className="font-medium mt-1">
          Chi tiết Slices tích lũy qua từng Sprint (đã áp dụng Hệ số Retro)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sprintBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                cursor={{ fill: 'var(--muted)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Bar dataKey="Nguyễn Văn A" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Trần Thị B" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Lê Văn C" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
