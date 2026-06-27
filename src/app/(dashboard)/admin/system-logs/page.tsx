"use client";

import React, { useState, useEffect } from "react";
import { Download, Search, Filter, Activity, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/shared/MetricCard";

type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: "success" | "warning" | "error";
  details: string;
};

const mockLogs: AuditLog[] = [
  { id: "1", timestamp: "2026-06-25 14:30:21", action: "SYNC_FAP_DATA", user: "System Cron", ip: "127.0.0.1", status: "success", details: "Đồng bộ 32 lớp học và 1248 sinh viên thành công." },
  { id: "2", timestamp: "2026-06-25 13:15:05", action: "UPDATE_API_TOKEN", user: "Admin (admin@fpt.edu.vn)", ip: "192.168.1.45", status: "success", details: "Cập nhật GitHub Personal Access Token." },
  { id: "3", timestamp: "2026-06-25 10:05:12", action: "DISABLE_USER", user: "Admin (admin@fpt.edu.vn)", ip: "192.168.1.45", status: "warning", details: "Vô hiệu hóa tài khoản sinh viên SE150123." },
  { id: "4", timestamp: "2026-06-24 23:59:59", action: "SYNC_GITHUB_PR", user: "Webhook Worker", ip: "10.0.0.5", status: "error", details: "Lỗi rate limit API từ GitHub. Sẽ thử lại sau 15 phút." },
  { id: "5", timestamp: "2026-06-24 22:10:00", action: "LOGIN_FAILED", user: "Unknown", ip: "113.160.200.12", status: "error", details: "Sai mật khẩu 5 lần liên tiếp đối với tài khoản admin@fpt.edu.vn." },
];

export default function SystemLogsPage() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Nhật ký Hệ thống (Audit Logs)"
        description="Theo dõi tất cả các thay đổi về cấu hình, tích hợp API và hoạt động của Admin."
        workspace="Workspace Quản trị"
      >
        <Button variant="outline" className="rounded-xl h-12 shadow-sm text-foreground bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80">
          <Download className="mr-2 h-4 w-4" /> Xuất Log (CSV)
        </Button>
      </PageHeader>

      {/* Stats cards to make the page look more like a Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng sự kiện (24h)"
          value={isLoading ? "-" : "1,248"}
          icon={<Activity className="w-4 h-4 text-blue-500" />}
        />
        <MetricCard
          title="Cảnh báo / Lỗi"
          value={isLoading ? "-" : "12"}
          icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Tình trạng Server"
          value={isLoading ? "-" : "Bình thường"}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
        />
        <MetricCard
          title="Đồng bộ FAP gần nhất"
          value={isLoading ? "-" : "4h trước"}
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
      </div>

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-none border-b border-border" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo hành động, người dùng, chi tiết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl focus-visible:ring-primary bg-background border-border"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px] rounded-xl bg-background border-border">
                      <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="success">Thành công</SelectItem>
                      <SelectItem value="warning">Cảnh báo</SelectItem>
                      <SelectItem value="error">Lỗi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-xl border border-border/20 overflow-hidden bg-[#0c0c0c] shadow-inner">
                {/* Terminal Header */}
                <div className="bg-[#18181b] px-4 py-2 flex items-center gap-2 border-b border-border/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono ml-2 flex-1 text-center">root@saga-server:~# tail -f /var/log/saga.log</span>
                </div>
                
                {/* Terminal Body */}
                <div className="p-4 h-[500px] overflow-y-auto font-mono text-[13px] leading-relaxed">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const isError = log.status === "error";
                      const isWarning = log.status === "warning";
                      
                      return (
                        <div key={log.id} className="flex gap-3 hover:bg-white/5 px-2 py-1 -mx-2 rounded transition-colors group">
                          <span className="text-zinc-500 shrink-0">[{log.timestamp}]</span>
                          <span className={`shrink-0 font-bold ${
                            isError ? "text-red-400" : isWarning ? "text-yellow-400" : "text-green-400"
                          }`}>
                            [{log.status.toUpperCase()}]
                          </span>
                          <span className="text-sky-400 shrink-0">[{log.user}]</span>
                          <span className="text-purple-400 shrink-0">{log.action}:</span>
                          <span className={isError ? "text-red-200" : "text-zinc-300"}>
                            {log.details}
                            <span className="text-zinc-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">(IP: {log.ip})</span>
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-zinc-500 italic flex items-center justify-center h-full">
                      No logs found matching your criteria.
                    </div>
                  )}
                  <div className="flex gap-3 px-2 py-1 mt-2">
                    <span className="text-zinc-500 shrink-0">[{new Date().toISOString().replace('T', ' ').substring(0, 19)}]</span>
                    <span className="text-blue-400 shrink-0 font-bold">[SYSTEM]</span>
                    <span className="text-zinc-300">Listening for new events... <span className="inline-block w-2 h-4 bg-zinc-400 animate-pulse align-middle ml-1"></span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
