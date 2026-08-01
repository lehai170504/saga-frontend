"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

const radarData = [
  { skill: "Code (x2.0)", A: 90, B: 40, C: 85, fullMark: 100 },
  { skill: "Design (x1.5)", A: 30, B: 90, C: 20, fullMark: 100 },
  { skill: "Docs (x1.0)", A: 60, B: 50, C: 95, fullMark: 100 },
  { skill: "Hỗ trợ Đồng đội", A: 85, B: 40, C: 50, fullMark: 100 },
  { skill: "Kỷ luật (PIP)", A: 70, B: 85, C: 60, fullMark: 100 },
];

export function RetroSkillRadar() {
  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-success" size={20} />
          Đánh giá Retrospective & Hiệu suất
        </CardTitle>
        <CardDescription className="font-medium mt-1">
          Dữ liệu phân bổ Khối lượng công việc và Thái độ làm việc nhóm tại buổi Retro
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Nguyễn Văn A" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Radar name="Trần Thị B" dataKey="B" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.3} />
              <Radar name="Lê Văn C" dataKey="C" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
