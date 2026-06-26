"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, GitCommit, GitPullRequest, MessageSquare, AlertTriangle, CheckCircle2, ChevronRight, Edit3, Send, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const STUDENT = {
  id: "SV-001",
  name: "Minh Nguyễn",
  email: "minhn@university.edu",
  group: "PBL-07",
  avatar: "M",
  riskLevel: "low",
  status: "Active"
};

const RADAR_DATA = [
  { subject: 'Commits', A: 120, fullMark: 150 },
  { subject: 'PR Reviews', A: 98, fullMark: 150 },
  { subject: 'Issues Done', A: 86, fullMark: 150 },
  { subject: 'Comments', A: 99, fullMark: 150 },
  { subject: 'Consistency', A: 85, fullMark: 150 },
];

const TIMELINE = [
  { type: "commit", text: "fix: update authentication logic in login flow", time: "Hôm nay, 10:23 AM", link: "#" },
  { type: "review", text: "Approved PR #42 - Feature/Dashboard UI", time: "Hôm qua, 15:45 PM", link: "#" },
  { type: "issue", text: "Resolved Task SAGA-102 (Create backend APIs)", time: "2 ngày trước", link: "#" },
  { type: "comment", text: "Commented on Issue SAGA-98: 'I think we should use Redis here'", time: "3 ngày trước", link: "#" },
  { type: "commit", text: "feat: add user profile endpoints", time: "5 ngày trước", link: "#" },
];

export default function StudentProfilePage({ params }: { params: Promise<{ classId: string, studentId: string }> }) {
  const { classId, studentId } = React.use(params);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([
    { id: 1, text: "Thuyết trình giữa kỳ tốt, nắm rõ kiến trúc hệ thống.", time: "10/05/2026", author: "Dr. Trần" }
  ]);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    setSavedNotes([
      { id: Date.now(), text: note, time: new Date().toLocaleDateString('vi-VN'), author: "You" },
      ...savedNotes
    ]);
    setNote("");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background overflow-hidden">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/lecturer/${classId}`} className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight size={14} />
          <Link href={`/lecturer/${classId}/students`} className="hover:text-foreground transition-colors">Sinh viên</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-semibold">{STUDENT.name}</span>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-3xl font-black shadow-lg">
              {STUDENT.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-foreground">{STUDENT.name}</h1>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                  {STUDENT.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
                <span>ID: {studentId}</span>
                <span>•</span>
                <span>{STUDENT.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/50">
                  <User size={12} />
                  Nhóm {STUDENT.group}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-xl border-border/50 font-bold w-full md:w-auto">
              <MessageSquare size={16} className="mr-2" />
              Gửi tin nhắn
            </Button>
            <Button className="rounded-xl font-bold w-full md:w-auto">
              Nhập Điểm Kéo Theo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Left Column: Stats & Radar Chart */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-border/50 bg-card shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Năng lực Đa chiều</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={STUDENT.name} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <GitCommit size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">COMMITS</p>
                    <p className="text-2xl font-black text-foreground">142</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">TASKS DONE</p>
                    <p className="text-2xl font-black text-foreground">38</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Risk Indicator */}
            {STUDENT.riskLevel === 'low' ? (
              <Card className="rounded-2xl border-border/50 bg-emerald-500/5 shadow-sm border-dashed">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-600">Tình trạng Tốt</p>
                    <p className="text-xs text-muted-foreground font-medium">Không phát hiện rủi ro nào đáng kể.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
               <Card className="rounded-2xl border-border/50 bg-red-500/5 shadow-sm border-dashed">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-red-600">Phát hiện Rủi ro</p>
                    <p className="text-xs text-muted-foreground font-medium">Có 1 cảnh báo High-risk đang chờ xử lý.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Column: Timeline */}
          <Card className="lg:col-span-1 rounded-[2rem] border-border/50 bg-card shadow-sm overflow-hidden flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Dấu vết Hoạt động (Evidence)</h3>
              
              <div className="relative flex-1 pl-4 border-l-2 border-muted/50 space-y-8">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary ring-4 ring-background" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.type === 'commit' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-500 border-indigo-500/20"><GitCommit size={10} className="mr-1"/> Commit</Badge>}
                        {item.type === 'review' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-teal-500/10 text-teal-500 border-teal-500/20"><GitPullRequest size={10} className="mr-1"/> Review</Badge>}
                        {item.type === 'issue' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-500 border-amber-500/20"><CheckCircle2 size={10} className="mr-1"/> Task</Badge>}
                        {item.type === 'comment' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-pink-500/10 text-pink-500 border-pink-500/20"><MessageSquare size={10} className="mr-1"/> Comment</Badge>}
                        
                        <span className="text-xs text-muted-foreground font-medium">{item.time}</span>
                      </div>
                      
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.text}
                      </p>
                      
                      <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary" asChild>
                        <a href={item.link}>Xem bằng chứng <ArrowUpRight size={12} className="ml-1" /></a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6 rounded-xl border-dashed">
                Xem toàn bộ lịch sử
              </Button>
            </CardContent>
          </Card>

          {/* Right Column: Instructor Notes */}
          <Card className="lg:col-span-1 rounded-[2rem] border-border/50 bg-card shadow-sm overflow-hidden flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Edit3 size={16} /> Ghi chú Giảng viên (Thủ công)
              </h3>
              
              <div className="flex-1 flex flex-col justify-end space-y-6">
                
                {/* Note Feed */}
                <div className="space-y-4 flex-1 max-h-[300px] overflow-y-auto pr-2">
                  {savedNotes.map((n) => (
                    <div key={n.id} className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2">
                      <p className="text-sm text-foreground font-medium">{n.text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-bold">{n.author}</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <Textarea 
                    placeholder="Nhập ghi chú cho sinh viên này (vd: Bạn này thuyết trình tốt, điểm mềm cao...)" 
                    className="min-h-[100px] rounded-xl bg-background border-border/50 resize-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Button className="w-full rounded-xl font-bold" onClick={handleSaveNote}>
                    <Send size={16} className="mr-2" /> Lưu Ghi Chú
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Ghi chú này chỉ hiển thị với Giảng viên và trợ giảng.</p>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
