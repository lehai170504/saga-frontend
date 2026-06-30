"use client";

import React, { useState, useEffect } from "react";
import { Download, Search, Filter, Activity, Terminal, GitCommit, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/shared/MetricCard";

type StudentAuditLog = {
  id: string;
  timestamp: string;
  action: string;
  category: "github" | "jira" | "academic" | "system";
  status: "success" | "warning" | "error";
  details: string;
};

const mockStudentLogs: StudentAuditLog[] = [
  { id: "1", timestamp: "2026-06-28 15:45:10", action: "SYNC_JIRA_TASKS", category: "jira", status: "success", details: "Đồng bộ hóa thành công 8 tasks từ Jira Board của Nhóm." },
  { id: "2", timestamp: "2026-06-28 10:20:15", action: "REPORT_ABSENCE", category: "academic", status: "success", details: "Gửi đơn xin báo cáo vắng mặt thành công cho Slot 3 ngày 2026-06-28." },
  { id: "3", timestamp: "2026-06-27 19:30:45", action: "SUBMIT_ASSIGNMENT", category: "academic", status: "success", details: "Đã nộp báo cáo tiến độ Sprint 4 lên hệ thống." },
  { id: "4", timestamp: "2026-06-27 14:15:00", action: "CROSS_EVALUATE", category: "academic", status: "success", details: "Hoàn thành đánh giá chéo cho thành viên Trần Thị Bình." },
  { id: "5", timestamp: "2026-06-26 23:10:02", action: "PUSH_COMMIT", category: "github", status: "success", details: "Commit [feat: student layout updates] được đồng bộ từ GitHub repo." },
  { id: "6", timestamp: "2026-06-26 09:05:40", action: "UPDATE_GITHUB_LINK", category: "system", status: "warning", details: "Thay đổi liên kết tài khoản cá nhân GitHub (lehai170504)." },
  { id: "7", timestamp: "2026-06-25 11:00:15", action: "JIRA_AUTH_EXPIRED", category: "jira", status: "error", details: "Token kết nối Atlassian Jira hết hạn. Yêu cầu kết nối lại trong phần Cài đặt." },
  { id: "8", timestamp: "2026-06-25 08:30:00", action: "RECEIVE_FEEDBACK", category: "academic", status: "success", details: "Giảng viên Dr. Nguyen Van A đã gửi nhận xét mới về Sprint 3." },
];

export function StudentAuditLogs() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const subjectsData = [
    { code: "WDP301", name: "Dự án phát triển web", classId: "wdp301-pbl", className: "SE1801", project: "Nhóm PBL-01" },
    { code: "PRN211", name: "Lập trình C# nâng cao", classId: "prn211-pbl", className: "SE1802", project: "Nhóm PBL-02" },
    { code: "CS101", name: "Nhập môn Lập trình", classId: "cs101-pbl", className: "SE1803", project: "Nhóm PBL-03" },
    { code: "SWT301", name: "Kiểm thử phần mềm", classId: "swt301-pbl", className: "SE1804", project: "Nhóm PBL-04" },
    { code: "DBI202", name: "Hệ cơ sở dữ liệu", classId: "dbi202-pbl", className: "SE1805", project: "Nhóm PBL-05" },
  ];

  const getClassName = (classId: string) => {
    if (!classId) return "";
    const match = subjectsData.find((c) => c.classId === classId);
    if (match) return `${match.code} - Lớp ${match.className}`;
    return classId.toUpperCase();
  };

  const getStudentGroup = (classId: string) => {
    const match = subjectsData.find((c) => c.classId === classId);
    return match ? match.project : "Nhóm PBL-01";
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    
    setSelectedSemester(sem);
    setSelectedClass(cls);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = mockStudentLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <PageHeader
            title="Nhật ký hoạt động (Audit Logs)"
            description={`Danh sách lịch sử thao tác, nộp bài, đồng bộ hóa của bạn tại ${getStudentGroup(selectedClass)} (Lớp ${getClassName(selectedClass)})`}
          />
          <Button variant="outline" className="rounded-xl h-11 shadow-sm text-foreground bg-card/40 backdrop-blur-xl border-border/50 hover:bg-card/70 font-bold text-xs uppercase tracking-wider">
            <Download className="mr-2 h-4 w-4" /> Xuất Log (CSV)
          </Button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Tổng sự kiện cá nhân"
            value={isLoading ? "-" : "48 lần"}
            icon={<Activity className="w-4 h-4 text-blue-500" />}
          />
          <MetricCard
            title="Đồng bộ GitHub gần nhất"
            value={isLoading ? "-" : "15 phút trước"}
            icon={<GitCommit className="w-4 h-4 text-purple-500" />}
          />
          <MetricCard
            title="Bài tập đã nộp"
            value={isLoading ? "-" : "8 bài"}
            icon={<FileText className="w-4 h-4 text-emerald-500" />}
          />
          <MetricCard
            title="Đánh giá chéo"
            value={isLoading ? "-" : "Đã hoàn thành"}
            icon={<CheckCircle2 className="w-4 h-4 text-amber-500" />}
          />
        </div>

        {/* Terminal/Log Window Card */}
        <Card className="rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl bg-muted/40" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl bg-muted/30" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo hành động hoặc chi tiết..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-xl focus-visible:ring-primary bg-background border-border h-10 font-medium text-xs placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] rounded-xl bg-background border-border h-10 font-bold text-xs">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Lọc phân loại" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="all" className="text-xs font-semibold">Tất cả danh mục</SelectItem>
                        <SelectItem value="github" className="text-xs font-semibold">GitHub Commits</SelectItem>
                        <SelectItem value="jira" className="text-xs font-semibold">Jira Tasks</SelectItem>
                        <SelectItem value="academic" className="text-xs font-semibold">Học vụ & Bài tập</SelectItem>
                        <SelectItem value="system" className="text-xs font-semibold">Cài đặt hệ thống</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 overflow-hidden bg-[#0a0a0c] shadow-inner">
                  {/* Console Header */}
                  <div className="bg-[#141416] px-4 py-2.5 flex items-center gap-2 border-b border-border/40">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono ml-2 flex-1 text-center font-bold tracking-wider flex items-center justify-center gap-1.5">
                      <Terminal size={12} className="text-zinc-500" />
                      STUDENT CONSOLE — SAGA-AUDIT.LOG
                    </span>
                  </div>
                  
                  {/* Console Body */}
                  <div className="p-4 md:p-6 h-[480px] overflow-y-auto font-mono text-[12.5px] leading-relaxed custom-scrollbar">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => {
                        const isError = log.status === "error";
                        const isWarning = log.status === "warning";
                        
                        let categoryColor = "text-sky-400";
                        if (log.category === "github") categoryColor = "text-purple-400";
                        if (log.category === "jira") categoryColor = "text-indigo-400";
                        if (log.category === "academic") categoryColor = "text-emerald-400";

                        return (
                          <div key={log.id} className="flex gap-3 hover:bg-white/5 px-2.5 py-1.5 -mx-2.5 rounded transition-colors group">
                            <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                            
                            <span className={`shrink-0 font-black ${
                              isError ? "text-red-400" : isWarning ? "text-yellow-400" : "text-emerald-400"
                            }`}>
                              [{log.status.toUpperCase()}]
                            </span>
                            
                            <span className={`shrink-0 font-bold ${categoryColor}`}>
                              [{log.category.toUpperCase()}]
                            </span>
                            
                            <span className="text-zinc-400 shrink-0 font-medium">{log.action}:</span>
                            
                            <span className={isError ? "text-red-200" : "text-zinc-300"}>
                              {log.details}
                            </span>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-zinc-600 italic flex items-center justify-center h-full text-xs font-bold uppercase tracking-wider">
                        Không tìm thấy sự kiện nào khớp điều kiện lọc.
                      </div>
                    )}
                    
                    <div className="flex gap-3 px-2.5 py-1.5 mt-2 border-t border-white/5">
                      <span className="text-zinc-600 shrink-0">[{new Date().toISOString().replace('T', ' ').substring(0, 19)}]</span>
                      <span className="text-primary shrink-0 font-black">[CONSOLE]</span>
                      <span className="text-zinc-400">Đang lắng nghe sự kiện mới từ các webhooks liên kết... <span className="inline-block w-1.5 h-3 bg-zinc-400 animate-pulse align-middle ml-1"></span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
