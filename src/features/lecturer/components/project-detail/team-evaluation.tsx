"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { AlertTriangle, TrendingUp, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const slicingData = [
  { name: "Nguyễn Văn A", value: 35, color: "#6366f1" }, // indigo-500
  { name: "Trần Thị B", value: 25, color: "#f59e0b" }, // amber-500
  { name: "Lê Văn C", value: 40, color: "#10b981" }, // emerald-500
];

const radarData = [
  { skill: "Lập trình & Logic", A: 90, B: 40, C: 85, fullMark: 100 },
  { skill: "Thiết kế UI/UX", A: 30, B: 90, C: 20, fullMark: 100 },
  { skill: "Tài liệu & Test", A: 60, B: 50, C: 95, fullMark: 100 },
  { skill: "Quản lý Dự án", A: 85, B: 40, C: 50, fullMark: 100 },
  { skill: "Thuyết trình", A: 70, B: 85, C: 60, fullMark: 100 },
];

const aiAlerts = [
  { id: 1, type: "warning", message: "Trần Thị B không có commit nào trên GitHub khớp với 2 Task Jira đã 'Done'. Có dấu hiệu nhận vơ công việc.", student: "Trần Thị B", actionReq: "Giảm hệ số", date: "2 ngày trước" },
  { id: 2, type: "danger", message: "Mật độ Bug do Lê Văn C tạo ra ở Sprint 2 lên tới 35% (Vượt ngưỡng 30% cấu hình). Đề xuất trừ 10% Slices Phase này.", student: "Lê Văn C", actionReq: "Trừ Slices", date: "1 ngày trước" }
];

export function TeamEvaluation() {

  const handleApprove = () => {
    toast.success("Đã phê duyệt kết quả Đóng góp cho nhóm này!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart: Cổ phần công sức */}
        <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={20} />
              Cổ phần Đóng góp
            </CardTitle>
            <CardDescription className="font-medium mt-1">
              Phần trăm đóng góp đã nhân hệ số Multipliers & Peer Review
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
                <span className="text-4xl font-black text-foreground">100%</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {slicingData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-background border border-border/50 px-3 py-1.5 rounded-xl">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold">{item.name}</span>
                  <span className="text-sm font-black" style={{ color: item.color }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart: Phân bổ kỹ năng */}
        <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Ma trận Kỹ năng (Radar Chart)
            </CardTitle>
            <CardDescription className="font-medium mt-1">
              Điểm mạnh và khối lượng công việc theo từng mảng
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Nguyễn Văn A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  <Radar name="Trần Thị B" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Radar name="Lê Văn C" dataKey="C" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Warnings & Recommendations */}
      <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-destructive/5 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle size={20} />
            Radar Cảnh báo từ AI
          </CardTitle>
          <CardDescription className="font-medium mt-1 text-destructive/80">
            Dữ liệu được đối chiếu tự động giữa Jira và GitHub để phát hiện điểm bất thường
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {aiAlerts.map((alert) => (
            <div key={alert.id} className="flex gap-4 p-4 rounded-2xl border border-destructive/20 bg-destructive/5 items-start">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive shrink-0 mt-1">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-foreground text-sm">{alert.message}</h4>
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap ml-4">{alert.date}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border/50 text-xs font-bold">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{alert.student.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {alert.student}
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs font-bold border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
                    Thực thi: {alert.actionReq}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-muted-foreground hover:text-foreground">
                    Bỏ qua (Ghi đè)
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {aiAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-emerald-600">
              <CheckCircle2 size={40} className="mb-2 opacity-50" />
              <p className="font-bold">Nhóm hoạt động hoàn hảo, không phát hiện bất thường!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Action */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleApprove} className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Phê duyệt Kết quả Đánh giá Phase này
        </Button>
      </div>

    </div>
  );
}
