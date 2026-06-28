"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const data = [
  { name: "Task Ảo (MSR)", value: 342, color: "#ef4444" }, // red-500
  { name: "Cày Deadline (Process)", value: 520, color: "#f59e0b" }, // amber-500
  { name: "Cô Lập (SNA)", value: 145, color: "#8b5cf6" }, // purple-500
];

export function SystemAnomalyChart() {
  return (
    <Card className="rounded-[2rem] shadow-sm border-border bg-card/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Tín hiệu Cảnh báo (Toàn hệ thống)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
