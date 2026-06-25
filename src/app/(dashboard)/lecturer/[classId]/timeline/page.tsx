"use client";

import { useLecturerClass } from "@/context/LecturerClassContext";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { 
  GitCommit, 
  GitPullRequest, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for the timeline
const timelineData = [
  {
    id: 1,
    time: "10:45",
    date: "Hôm nay",
    student: "Minh Nguyễn",
    action: "tạo Issue mới",
    target: "SE102-45: Thiết kế API đăng nhập",
    type: "issue",
    icon: AlertCircle,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    linkText: "View in Jira"
  },
  {
    id: 2,
    time: "11:30",
    date: "Hôm nay",
    student: "Linh Trần",
    action: "đã push 3 commits",
    target: "refactor: cleanup auth module",
    type: "commit",
    icon: GitCommit,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    linkText: "View in GitHub"
  },
  {
    id: 3,
    time: "13:10",
    date: "Hôm nay",
    student: "Tuấn Lê",
    action: "tạo Pull Request",
    target: "#28: feat: add OAuth integration",
    type: "pr",
    icon: GitPullRequest,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    linkText: "View PR"
  },
  {
    id: 4,
    time: "14:25",
    date: "Hôm nay",
    student: "Huy Hoàng",
    action: "đã review Pull Request",
    target: "#28: Looks good, minor suggestions",
    type: "review",
    icon: CheckCircle2,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    linkText: "Show comments"
  },
  {
    id: 5,
    time: "15:40",
    date: "Hôm qua",
    student: "Mại Xuân",
    action: "comment trong Issue",
    target: "SE102-45: We can use Socket.io for real-time",
    type: "comment",
    icon: MessageSquare,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    linkText: "View in Jira"
  },
  {
    id: 6,
    time: "09:15",
    date: "Hôm qua",
    student: "Việt Hùng",
    action: "đã push 1 commit",
    target: "fix: resolve merge conflicts",
    type: "commit",
    icon: GitCommit,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    linkText: "View in GitHub"
  }
];

export default function ActivityTimelinePage() {
  const { classId } = useLecturerClass();
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTimeline = timelineData.filter(item => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (searchQuery && !item.student.toLowerCase().includes(searchQuery.toLowerCase()) && !item.target.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <Clock size={14} className="text-primary" />
              Real-time Logs
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Nhật ký hoạt động chi tiết
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi mọi tương tác của sinh viên lớp {classId} theo thời gian thực</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Tìm sinh viên, từ khóa..." 
                className="pl-9 h-10 bg-card/50 backdrop-blur-md border-border/50 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-muted-foreground" />
                  <SelectValue placeholder="Loại hoạt động" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
                <SelectItem value="all">Tất cả hoạt động</SelectItem>
                <SelectItem value="commit">Commits</SelectItem>
                <SelectItem value="pr">Pull Requests</SelectItem>
                <SelectItem value="issue">Issues</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timeline Content */}
        <Card className="rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-xl shadow-lg overflow-hidden relative">
          <div className="absolute left-[39px] md:left-[199px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
          
          <CardContent className="p-6 md:p-8 space-y-8 relative z-10">
            {filteredTimeline.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Clock size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-medium">Không tìm thấy hoạt động nào</p>
                <p className="text-sm">Vui lòng thử bộ lọc khác.</p>
              </div>
            ) : (
              filteredTimeline.map((item, index) => (
                <div key={item.id} className="relative flex gap-6 md:gap-8 group">
                  {/* Time & Date Column (Hidden on very small screens, integrated into card) */}
                  <div className="hidden md:flex flex-col items-end w-[140px] pt-2 shrink-0">
                    <span className="text-sm font-bold text-foreground">{item.time}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{item.date}</span>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative shrink-0 mt-1.5 md:mt-1">
                    <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className={`w-8 h-8 rounded-full ${item.bg} ${item.color} flex items-center justify-center`}>
                        <item.icon size={14} />
                      </div>
                    </div>
                    {/* Glowing effect on hover */}
                    <div className={`absolute inset-0 rounded-full ${item.bg} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 rounded-2xl border ${item.border} bg-card/50 backdrop-blur-md p-4 md:p-5 transition-all duration-300 hover:shadow-md hover:bg-card/80 group-hover:-translate-y-0.5`}>
                    <div className="md:hidden flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-foreground">{item.time}</span>
                      <span className="text-xs font-semibold text-muted-foreground">{item.date}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 text-sm md:text-base">
                      <span className="font-bold text-foreground cursor-pointer hover:underline decoration-primary underline-offset-2">{item.student}</span>
                      <span className="text-muted-foreground">{item.action}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${item.border} ${item.bg} ${item.color}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/50 text-sm font-medium text-foreground/80 break-words line-clamp-2">
                      {item.target}
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:bg-muted/50 hover:text-primary p-0 px-2 transition-colors">
                        {item.linkText}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:bg-muted/50 text-muted-foreground p-0 px-2 transition-colors">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {filteredTimeline.length > 0 && (
              <div className="pt-6 flex justify-center">
                <Button variant="outline" className="rounded-full bg-card/50 backdrop-blur-md border-border/50 font-semibold hover:bg-muted">
                  Tải thêm hoạt động...
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
