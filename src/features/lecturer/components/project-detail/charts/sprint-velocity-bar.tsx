"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";
import { useSprintVelocity } from "@/features/lecturer/hooks/useAnalytics";

interface SprintVelocityBarProps {
  courseId: string;
  teamId: string;
}

export function SprintVelocityBar({ courseId, teamId }: SprintVelocityBarProps) {
  const { data: velocityData, isLoading } = useSprintVelocity(courseId, teamId);
  const chartData = velocityData?.sprints || [];

  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BarChartIcon className="text-primary" size={20} />
          Tiến độ Đóng góp theo Sprints
        </CardTitle>
        <CardDescription className="font-medium mt-1">
          So sánh Story Points Kế hoạch, Hoàn thành và Bugs phát sinh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">Đang tải vận tốc Sprint...</div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">Chưa có dữ liệu vận tốc</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="sprintName" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                  cursor={{ fill: 'var(--muted)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="currentPlannedPoints" name="Kế hoạch (Points)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedPoints" name="Hoàn thành (Points)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bugsCount" name="Bugs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
