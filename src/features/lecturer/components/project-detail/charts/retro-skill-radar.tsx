"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { useContributionEvaluation } from "@/features/projects/hooks/useContribution";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4"  // cyan-500
];

interface RetroSkillRadarProps {
  teamId: string;
}

export function RetroSkillRadar({ teamId }: RetroSkillRadarProps) {
  const { data: evaluationData, isLoading } = useContributionEvaluation(teamId);

  const { radarData, memberNames } = useMemo(() => {
    if (!evaluationData?.members || evaluationData.members.length === 0) {
      return { radarData: [], memberNames: [] };
    }

    const members = evaluationData.members;

    interface RadarDataRow {
      skill: string;
      fullMark: number;
      [key: string]: string | number;
    }

    const data: RadarDataRow[] = [
      { skill: "Code", fullMark: 100 },
      { skill: "Test", fullMark: 100 },
      { skill: "Document", fullMark: 100 },
      { skill: "Research", fullMark: 100 },
    ];

    data.forEach(row => {
      members.forEach(m => {
        if (row.skill === "Code") row[m.studentId] = Number((m.codeContributionPercentage || 0).toFixed(2));
        else if (row.skill === "Test") row[m.studentId] = Number((m.testContributionPercentage || 0).toFixed(2));
        else if (row.skill === "Document") row[m.studentId] = Number((m.documentContributionPercentage || 0).toFixed(2));
        else if (row.skill === "Research") row[m.studentId] = Number((m.researchContributionPercentage || 0).toFixed(2));
      });
    });

    return {
      radarData: data,
      memberNames: members.map(m => ({ id: m.studentId, name: m.fullName }))
    };
  }, [evaluationData]);

  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-success" size={20} />
          Biểu đồ Radar Năng lực
        </CardTitle>
        <CardDescription className="font-medium mt-1">
          Tỷ lệ phần trăm đóng góp của mỗi thành viên theo từng mảng công việc
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
          ) : radarData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Chưa có dữ liệu đánh giá đóng góp
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
                {memberNames.map((member, idx) => (
                  <Radar
                    key={member.id}
                    name={member.name}
                    dataKey={member.id}
                    stroke={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    fillOpacity={0.3}
                  />
                ))}
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                  formatter={(value: unknown) => [`${value}%`, 'Đóng góp']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
