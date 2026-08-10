"use client";

import { useSyncStatus } from "../hooks/useSyncStatus";
import { useProjectIntegrations, useTriggerProjectSync } from "../hooks/useProjectIntegrations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCcw, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";




const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground border-muted-foreground/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PARTIAL_FAILURE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function formatSyncTimestamp(value: string | null | undefined): string {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

export function SyncStatusMonitor({ projectId }: { projectId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: projectIntegration } = useProjectIntegrations(projectId);
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerProjectSync(projectId);

  const isJiraConnected = !!projectIntegration?.jira && projectIntegration.jira.status !== "DISCONNECTED";
  const hasGithubRepos = (projectIntegration?.githubRepositories?.length || 0) > 0;
  const isConfigured = isJiraConnected || hasGithubRepos;

  const { data: syncData, isLoading, error, refetch, isFetching } = useSyncStatus(projectId, {
    refetchInterval: (query: unknown) => {
      const data = (query as { state?: { data?: unknown } })?.state?.data as { recentJobs?: { status?: string }[] } | undefined;
      const jobs = data?.recentJobs || [];
      const hasInProgress = jobs.some((job) => job.status === "IN_PROGRESS" || job.status === "PENDING");
      return hasInProgress ? 5000 : false;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Đã có lỗi xảy ra khi tải trạng thái đồng bộ.
      </div>
    );
  }

  const jobs = syncData?.recentJobs || [];
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="rounded-[2rem] border border-border/50 bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-foreground">Tiến trình Đồng bộ hóa</h3>
          <p className="text-xs text-muted-foreground font-medium">Theo dõi các tiến trình đang chạy và trạng thái đồng bộ dữ liệu mới nhất</p>
        </div>
        <div className="flex items-center gap-2">
          {isConfigured && (
            <Button
              onClick={() => triggerSync(undefined)}
              disabled={isSyncing}
              className="rounded-xl h-9 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm gap-2 text-xs cursor-pointer"
            >
              {isSyncing ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              Đồng bộ ngay
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="rounded-xl h-9 text-xs cursor-pointer border-border/40 hover:bg-muted/50">
            <RefreshCcw className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>



      <div className="border border-border/40 rounded-2xl overflow-hidden bg-background/50 shadow-sm overflow-x-auto">
        <Table className="min-w-[850px]">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/30">
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Loại đồng bộ</TableHead>
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Hệ thống</TableHead>
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Trạng thái</TableHead>
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Thành công / Lỗi</TableHead>
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Thời gian bắt đầu</TableHead>
              <TableHead className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Thời gian hoàn thành</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/30 border-border/20 transition-colors">
                  <TableCell className="font-bold text-xs text-foreground">{job.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-semibold">{job.targetSystem}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[job.status] || "bg-muted text-muted-foreground"} font-bold text-[10px] rounded-full px-2.5 py-0.5`}>
                      {job.status === "IN_PROGRESS" && <Loader2 className="mr-1.5 h-3 w-3 animate-spin inline-block" />}
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.itemsProcessed !== null ? (
                      <span className="font-mono text-xs font-bold">
                        <span className="text-emerald-500">{job.itemsProcessed}</span> / <span className="text-destructive">{job.itemsFailed || 0}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                    {job.errorCategory && (
                      <p className="text-[10px] text-destructive mt-0.5 max-w-[200px] truncate font-medium" title={job.failureStage || job.errorCategory}>
                        Lỗi: {job.errorCategory}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {formatSyncTimestamp(job.startedAt)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {formatSyncTimestamp(job.completedAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  <p className="text-xs font-semibold">Chưa có tiến trình đồng bộ nào.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 pb-1 px-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Trang {activePage} / {totalPages} (Tổng số {jobs.length} tiến trình)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 w-8 p-0 border-border/40 cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 w-8 p-0 border-border/40 cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

}
