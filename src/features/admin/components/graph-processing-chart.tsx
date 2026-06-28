"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

const data = [
  { name: "T2", nodes: 1200, edges: 2400 },
  { name: "T3", nodes: 1400, edges: 3139 },
  { name: "T4", nodes: 1350, edges: 2920 },
  { name: "T5", nodes: 2520, edges: 5390 }, // Burst activity
  { name: "T6", nodes: 1410, edges: 3480 },
  { name: "T7", nodes: 390, edges: 880 },
  { name: "CN", nodes: 490, edges: 930 },
];

export function GraphProcessingChart() {
  return (
    <Card className="rounded-[2rem] shadow-sm border-border bg-card/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Network className="h-5 w-5 text-indigo-500" />
          Mật độ Xử lý Đồ thị (7 ngày qua)
        </CardTitle>
        <div className="text-xs text-muted-foreground mt-1.5 space-y-1">
          <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">Đỉnh (Nodes):</span> Các thực thể như Student, Git Issues, Commit, Comment, Task Jira...</p>
          <p><span className="font-semibold text-emerald-600 dark:text-emerald-400">Cạnh (Edges):</span> Các hành động thực thi, luồng tác động (Authored, Assigned, Reviewed...)</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEdges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2, strokeDasharray: "4 4" }}
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="edges" name="Cạnh (Hành động)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEdges)" />
              <Area type="monotone" dataKey="nodes" name="Đỉnh (Thực thể)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNodes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
