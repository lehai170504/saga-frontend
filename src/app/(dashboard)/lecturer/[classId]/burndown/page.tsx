"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
import { Calendar, Users, TrendingDown, Target, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for burndown
const generateBurndownData = () => {
  const totalTasks = 86;
  const days = 21; // 3 weeks sprint
  const idealPace = totalTasks / (days - 1);
  
  let currentTasks = totalTasks;
  return Array.from({ length: days }, (_, i) => {
    // Expected line drops linearly
    const expected = Math.max(0, Math.round(totalTasks - (i * idealPace)));
    
    // Actual drops a bit randomly, only for past days (say we are on day 15)
    let actual: number | null = null;
    if (i <= 15) {
      if (i === 0) {
        actual = totalTasks;
      } else {
        // Drop 0 to 8 tasks a day
        const drop = Math.floor(Math.random() * 8);
        currentTasks = Math.max(0, currentTasks - drop);
        actual = currentTasks;
      }
    }

    return {
      day: `Day ${i + 1}`,
      date: `0${(i % 9) + 1}/05`, // Mock dates
      expected,
      actual
    };
  });
};

const burndownData = generateBurndownData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
        <p className="font-bold mb-2 text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BurndownChartPage({ params }: { params: { classId: string } }) {
  const [selectedGroup, setSelectedGroup] = useState("Team Alpha");
  const [selectedSprint, setSelectedSprint] = useState("Sprint 2");

  // Calculate current stats based on mock data day 15
  const currentActual = 32; // from mock spec
  const totalTasks = 86;
  const completed = totalTasks - currentActual;
  const completionRate = Math.round((completed / totalTasks) * 100);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <TrendingDown size={14} className="text-orange-500" />
              Sprint Tracking
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Tiến độ Sprint (Burndown)
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi tốc độ hoàn thành công việc của từng nhóm</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <SelectValue placeholder="Nhóm" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
                <SelectItem value="Team Alpha">Team Alpha</SelectItem>
                <SelectItem value="Team Beta">Team Beta</SelectItem>
                <SelectItem value="Team Gamma">Team Gamma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-full sm:w-[200px] h-10 bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <SelectValue placeholder="Sprint" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
                <SelectItem value="Sprint 1">Sprint 1 (Hoàn thành)</SelectItem>
                <SelectItem value="Sprint 2">Sprint 2 (Đang chạy)</SelectItem>
                <SelectItem value="Sprint 3">Sprint 3 (Kế hoạch)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[1.5rem] border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden relative group">
            <div className="absolute right-0 top-0 opacity-5 w-32 h-32 -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform">
              <Target size={128} />
            </div>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Tổng số Task</p>
              <p className="text-4xl font-black text-foreground">{totalTasks}</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-[1.5rem] border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm overflow-hidden relative group">
            <div className="absolute right-0 top-0 text-emerald-500 opacity-10 w-32 h-32 -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={128} />
            </div>
            <CardContent className="p-6 flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Đã Hoàn Thành</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{completed}</p>
                  <span className="text-lg font-bold text-emerald-600/60 dark:text-emerald-400/60">({completionRate}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-rose-500/20 bg-rose-500/5 backdrop-blur-md shadow-sm overflow-hidden relative group">
            <div className="absolute right-0 top-0 text-rose-500 opacity-10 w-32 h-32 -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform">
              <AlertCircle size={128} />
            </div>
            <CardContent className="p-6 flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">Còn Lại</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-rose-600 dark:text-rose-400">{currentActual}</p>
                  <span className="text-lg font-bold text-rose-600/60 dark:text-rose-400/60">({100 - completionRate}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Card */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingDown className="text-orange-500" size={20} />
                Biểu đồ Burndown
              </CardTitle>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-500 rounded-full" />
                  <span className="text-foreground">Thực tế (Actual)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 border-b-2 border-dashed border-muted-foreground" />
                  <span className="text-muted-foreground">Kế hoạch (Expected)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData} margin={{ top: 20, right: 30, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                    domain={[0, 'dataMax + 10']}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  
                  {/* Expected Line - Dashed */}
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    name="Kế hoạch" 
                    stroke="var(--muted-foreground)" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false}
                    activeDot={false}
                  />
                  
                  {/* Actual Line - Solid */}
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Thực tế" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                  />
                  
                  {/* Current Day Marker */}
                  <ReferenceLine x="15/05" stroke="var(--primary)" strokeDasharray="3 3" opacity={0.5}>
                    <Label position="top" fill="var(--primary)" fontSize={12} fontWeight="bold">Hôm nay</Label>
                  </ReferenceLine>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
