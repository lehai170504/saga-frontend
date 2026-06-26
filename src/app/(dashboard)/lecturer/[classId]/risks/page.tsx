"use client";

import { useLecturerClass } from "@/context/LecturerClassContext";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle2, MessageSquare, Filter, ShieldAlert, ArrowUpRight, Search, Activity, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MOCK_RISKS = [
  {
    id: "RSK-001",
    student: "Minh Nguyễn",
    group: "PBL-07",
    severity: "high", // high, medium, low
    type: "Free-riding",
    reason: "Chỉ có 1 commit trong 14 ngày qua, không tham gia review code.",
    detectedAt: "2 giờ trước",
    status: "new", // new, reviewed, resolved
    metrics: { participation: "15%", expected: "> 40%" }
  },
  {
    id: "RSK-002",
    student: "Huy Hoàng",
    group: "PBL-02",
    severity: "high",
    type: "Burnout",
    reason: "Hoạt động liên tục >12 giờ/ngày trong 4 ngày liên tiếp, chủ yếu sau 12h đêm.",
    detectedAt: "5 giờ trước",
    status: "new",
    metrics: { activity: "Very High", consistency: "Poor" }
  },
  {
    id: "RSK-003",
    student: "Linh Trần",
    group: "PBL-07",
    severity: "medium",
    type: "Skill gap",
    reason: "3 Task Jira đánh dấu Done nhưng không có PR/Commit nào liên kết.",
    detectedAt: "1 ngày trước",
    status: "reviewed",
    metrics: { taskDone: 3, commitsLinked: 0 }
  },
  {
    id: "RSK-004",
    student: "An Lê",
    group: "PBL-05",
    severity: "low",
    type: "Isolation",
    reason: "Không có tương tác (comment/review) với thành viên khác trong 3 tuần.",
    detectedAt: "2 ngày trước",
    status: "resolved",
    metrics: { collabScore: "5/100" }
  }
];

export default function RiskDashboardPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);
  const [filter, setFilter] = useState("all"); // all, high, medium, low

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "low": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <ShieldAlert className="text-red-500" size={24} />;
      case "medium": return <AlertTriangle className="text-amber-500" size={24} />;
      case "low": return <Activity className="text-yellow-500" size={24} />;
      default: return <Activity className="text-gray-500" size={24} />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high": return "Nguy hiểm";
      case "medium": return "Cảnh báo";
      case "low": return "Lưu ý";
      default: return "Unknown";
    }
  };

  const filteredRisks = MOCK_RISKS.filter(r => filter === "all" || r.severity === filter);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background overflow-hidden">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold">
              <ShieldAlert size={14} className="animate-pulse" />
              Risk Detection Engine
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Cảnh báo Rủi ro
            </h1>
            <p className="text-muted-foreground font-medium">Hệ thống phát hiện sớm các bất thường trong tiến trình làm việc của lớp {classId}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Tìm sinh viên..." 
                className="pl-9 bg-background border-border/50 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-border/50 h-10 font-bold">
              <Filter size={16} className="mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng cảnh báo</p>
                  <p className="text-3xl font-black text-foreground">24</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                  <Activity className="text-muted-foreground" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`rounded-2xl border-border/50 shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${filter === 'high' ? 'ring-2 ring-red-500 bg-red-50/50 dark:bg-red-950/20' : 'bg-card'}`}
            onClick={() => setFilter(filter === 'high' ? 'all' : 'high')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Nguy hiểm (High)</p>
                  <p className="text-3xl font-black text-foreground">8</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ShieldAlert className="text-red-500" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`rounded-2xl border-border/50 shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${filter === 'medium' ? 'ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : 'bg-card'}`}
            onClick={() => setFilter(filter === 'medium' ? 'all' : 'medium')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-500 uppercase tracking-wider">Cảnh báo (Medium)</p>
                  <p className="text-3xl font-black text-foreground">11</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="text-amber-500" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`rounded-2xl border-border/50 shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${filter === 'low' ? 'ring-2 ring-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' : 'bg-card'}`}
            onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-yellow-500 uppercase tracking-wider">Lưu ý (Low)</p>
                  <p className="text-3xl font-black text-foreground">5</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Activity className="text-yellow-500" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Danh sách cần xử lý</h2>
            <p className="text-sm text-muted-foreground font-medium">Hiển thị {filteredRisks.length} cảnh báo</p>
          </div>

          <div className="grid gap-4">
            {filteredRisks.map((risk, idx) => (
              <Card key={idx} className="rounded-2xl border-border/50 bg-card hover:bg-muted/30 transition-colors shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    
                    {/* Left Icon Area */}
                    <div className="p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50 bg-muted/20">
                      <div className="text-center space-y-2">
                        {getSeverityIcon(risk.severity)}
                        <Badge variant="outline" className={`font-bold border uppercase text-[10px] ${getSeverityStyle(risk.severity)}`}>
                          {getSeverityLabel(risk.severity)}
                        </Badge>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-foreground">{risk.type}</h3>
                            {risk.status === 'new' && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            )}
                          </div>
                          <p className="text-foreground font-medium text-base mb-3">{risk.reason}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-1 rounded-md">
                              <span className="font-semibold text-foreground">{risk.student}</span>
                              <span className="text-xs text-muted-foreground">({risk.group})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} />
                              <span>Phát hiện: {risk.detectedAt}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <MoreVertical size={18} />
                        </Button>
                      </div>

                      {/* Evidence Metrics */}
                      <div className="bg-background rounded-xl border border-border/50 p-3 flex gap-6">
                        {Object.entries(risk.metrics).map(([key, val], i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-xs text-muted-foreground font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm font-bold text-foreground">{val as string}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="p-6 border-t md:border-t-0 md:border-l border-border/50 flex flex-col justify-center gap-3 bg-muted/10 min-w-[200px]">
                      <Button className="w-full font-bold rounded-xl" variant={risk.severity === 'high' ? 'default' : 'secondary'}>
                        Xem Profile
                        <ArrowUpRight size={16} className="ml-2" />
                      </Button>
                      <Button className="w-full font-bold rounded-xl border-border/50" variant="outline">
                        <MessageSquare size={16} className="mr-2" />
                        Gửi nhắc nhở
                      </Button>
                      {risk.status !== 'resolved' && (
                        <Button className="w-full font-bold rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" variant="ghost">
                          <CheckCircle2 size={16} className="mr-2" />
                          Đánh dấu Đã xử lý
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
