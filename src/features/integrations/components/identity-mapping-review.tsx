"use client";

import { useIdentityMappings, useReviewIdentityMapping } from "../hooks/useIdentityMappings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, { bg: string, text: string, border: string, label: string }> = {
  ACTIVE: { bg: "bg-success/10", text: "text-success", border: "border-success/20", label: "Đã liên kết" },
  DISCONNECTED: { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted-foreground/20", label: "Ngắt kết nối" },
  PENDING_REVIEW: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", label: "Chờ duyệt" },
  REJECTED: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", label: "Từ chối" },
};

export function IdentityMappingReview({ studentId }: { studentId: string }) {
  const { data: mappings, isLoading, error } = useIdentityMappings(studentId);
  const { mutate: reviewMapping, isPending } = useReviewIdentityMapping(studentId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 bg-background/50 backdrop-blur-md rounded-[1.5rem] border border-border/50">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-xs text-destructive p-4 bg-destructive/5 rounded-[1.5rem] border border-destructive/20">
        Lỗi tải tài khoản liên kết.
      </div>
    );
  }

  const handleApprove = (mappingId: string) => {
    reviewMapping({ mappingId, data: { action: "APPROVE" } });
  };

  const handleReject = (mappingId: string) => {
    reviewMapping({ mappingId, data: { action: "REJECT" } });
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-3 flex items-center gap-1.5 shrink-0">
        <LinkIcon size={12} /> Tài khoản Liên kết
      </h3>
      
      <div className="space-y-2.5 flex-1">
        {mappings && mappings.length > 0 ? (
          mappings.map((mapping, idx) => {
            const statusStyle = statusColors[mapping.status] || statusColors.DISCONNECTED;
            const isPendingStatus = mapping.status === "PENDING_REVIEW";

            return (
              <div key={idx} className={cn("group flex flex-col gap-2 p-3 rounded-2xl border transition-all duration-300", isPendingStatus ? "bg-warning/10 border-warning/30 shadow-sm" : "bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:border-primary/30")}>
                
                {/* Account Info Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <LinkIcon size={14} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-foreground truncate leading-none mb-1">{mapping.displayName}</p>
                      <p className="text-[10px] text-muted-foreground truncate leading-none">{mapping.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0 px-1.5 py-0", statusStyle.bg, statusStyle.text, statusStyle.border)}>
                    {statusStyle.label}
                  </Badge>
                </div>

                {/* Actions Row (Only visible if pending) */}
                {isPendingStatus && (
                  <div className="flex items-center gap-2 pt-1 border-t border-warning/10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-[10px] rounded-lg border-success/30 text-success bg-success/5 hover:bg-success hover:text-white transition-colors"
                      onClick={() => handleApprove((mapping as { id?: string }).id || "unknown")}
                      disabled={isPending}
                    >
                      <CheckCircle2 className="mr-1.5 h-3 w-3" /> Duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-[10px] rounded-lg border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white transition-colors"
                      onClick={() => handleReject((mapping as { id?: string }).id || "unknown")}
                      disabled={isPending}
                    >
                      <XCircle className="mr-1.5 h-3 w-3" /> Chặn
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2 border border-border/50">
              <LinkIcon size={14} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground italic">Chưa có tài khoản liên kết</p>
          </div>
        )}
      </div>
    </div>
  );
}
