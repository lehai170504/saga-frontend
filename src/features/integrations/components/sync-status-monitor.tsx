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
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground border-muted-foreground/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PARTIAL_FAILURE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function SyncStatusMonitor({ projectId }: { projectId: string }) {
  // Poll every 5 seconds
  const { data: syncData, isLoading, error, refetch, isFetching } = useSyncStatus(projectId, { refetchInterval: 5000 });

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
            {jobs.length > 0 ? (
              jobs.map((job) => (
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
                    {job.completedAt ? new Date(job.completedAt).toLocaleString("vi-VN") : (job.startedAt ? new Date(job.startedAt).toLocaleString("vi-VN") : "N/A")}
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
    </div>
  );
}
