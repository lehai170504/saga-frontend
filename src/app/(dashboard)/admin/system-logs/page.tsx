"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">SUCCESS</span>;
      case "warning": return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold">WARNING</span>;
      case "error": return <span className="px-2 py-1 rounded bg-destructive/10 text-destructive dark:bg-destructive/20 text-xs font-bold">ERROR</span>;
      default: return null;
    }
  };

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
            <div className="rounded-2xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Thời gian</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Hành động</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Người thực hiện</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-border hover:bg-muted/40 transition-colors">
                      <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="py-3 font-semibold text-foreground whitespace-nowrap">
                        {log.action}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{log.user}</span>
                          <span className="text-[11px] text-muted-foreground">IP: {log.ip}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground max-w-xs truncate" title={log.details}>
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
