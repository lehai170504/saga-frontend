"use client";

import { useSyncStatus } from "../hooks/useSyncStatus";
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
import { Loader2, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const { data: syncData, isLoading, error, refetch, isFetching } = useSyncStatus(projectId, {
    refetchInterval: (query) => {
      const jobs = (query.state.data as any)?.recentJobs || [];
      const hasInProgress = jobs.some((job: any) => job.status === "IN_PROGRESS" || job.status === "PENDING");
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Tiến trình Đồng bộ hóa</h3>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="rounded-xl h-9">
          <RefreshCcw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      <div className="border border-border/50 rounded-2xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Loại đồng bộ</TableHead>
              <TableHead className="font-bold">Hệ thống</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold">Tiến độ (Thành công / Lỗi)</TableHead>
              <TableHead className="font-bold">Cập nhật lúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{job.type}</TableCell>
                  <TableCell>{job.targetSystem}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[job.status] || "bg-muted text-muted-foreground"} font-bold`}>
                      {job.status === "IN_PROGRESS" && <Loader2 className="mr-1.5 h-3 w-3 animate-spin inline-block" />}
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.itemsProcessed !== null ? (
                      <span className="font-mono text-sm">
                        <span className="text-emerald-500">{job.itemsProcessed}</span> / <span className="text-destructive">{job.itemsFailed || 0}</span>
                      </span>
                    ) : "-"}
                    {job.errorCategory && (
                      <p className="text-[10px] text-destructive mt-1 max-w-[200px] truncate" title={job.failureStage || job.errorCategory}>
                        Lỗi: {job.errorCategory}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatSyncTimestamp(job.completedAt || job.startedAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Chưa có tiến trình đồng bộ nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 pb-2 px-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Trang {activePage} / {totalPages} (Tổng số {jobs.length} tiến trình)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 w-8 p-0"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 w-8 p-0"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
