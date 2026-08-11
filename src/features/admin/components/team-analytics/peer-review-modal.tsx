"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTeamPeerReviews } from "@/features/admin/hooks/useTeamPeerReviews";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle } from "lucide-react";

interface PeerReviewModalProps {
  teamId: string | null;
  sprintId: string | null;
  sprintName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PeerReviewModal({ teamId, sprintId, sprintName, isOpen, onClose }: PeerReviewModalProps) {
  const { data, isLoading, error } = useTeamPeerReviews(teamId || "", sprintId || "");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col rounded-[2rem] p-0 overflow-hidden bg-card border-border/50">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
          <DialogTitle className="text-xl font-black tracking-tight">Dữ liệu Peer Review</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            {sprintName ? `Chi tiết đánh giá của ${sprintName}` : "Chi tiết đánh giá giữa các thành viên."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-[300px]">
          <div className="h-full p-6 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-destructive">
                <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
                <p className="font-bold text-lg">Không thể lấy dữ liệu</p>
                <p className="text-sm font-medium opacity-80 mt-1">API chưa hoàn thiện hoặc có lỗi kết nối.</p>
              </div>
            ) : !data?.reviews || data.reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-border/50">
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-lg">Chưa có đánh giá</p>
                <p className="text-[13px] font-medium opacity-80 mt-1">Sprint này chưa có dữ liệu Peer Review nào được ghi nhận.</p>
              </div>
            ) : (
              <div className="bg-muted/10 rounded-2xl border border-border/50 overflow-hidden">
                <div className="p-3 bg-muted/30 border-b border-border/50">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Raw Data (Tạm thời)</span>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-auto max-h-[400px]">
                  {JSON.stringify(data.reviews, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
