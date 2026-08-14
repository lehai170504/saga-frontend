"use client";

import React, { useState } from "react";
import { useTeamPeerReviews } from "@/features/admin/hooks/useTeamPeerReviews";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamSprints } from "@/features/admin/hooks/useTeamSprints";
import { Sprint } from "@/features/projects/types";

interface PeerReviewViewProps {
  teamId: string;
}

export function PeerReviewView({ teamId }: PeerReviewViewProps) {
  const { data: sprintsData, isLoading: isSprintsLoading } = useTeamSprints(teamId);
  const sprints = sprintsData?.sprints || [];

  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  const { data, isLoading, error } = useTeamPeerReviews(
    teamId,
    selectedSprintId
  );

  return (
    <div className="flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Kết quả Peer Review</h3>
          <p className="text-sm text-muted-foreground mt-1">Tra cứu đánh giá chéo của các thành viên theo từng Sprint.</p>
        </div>

        {/* Sprint Selector */}
        <div className="w-full sm:w-[250px]">
          {isSprintsLoading ? (
            <Skeleton className="h-10 w-full rounded-xl" />
          ) : (
            <Select
              value={selectedSprintId}
              onValueChange={setSelectedSprintId}
            >
              <SelectTrigger className="w-full rounded-xl h-10">
                <SelectValue placeholder="Chọn Sprint để xem" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sprints.map((sprint: Sprint & { sprintId?: string; sprintName?: string }) => (
                  <SelectItem key={sprint.sprintId} value={sprint.sprintId} className="rounded-lg">
                    {sprint.sprintName}
                  </SelectItem>
                ))}
                {sprints.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">Không có Sprint nào</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 bg-muted/10">
        {!selectedSprintId ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-lg">Chưa chọn Sprint</p>
            <p className="text-[13px] font-medium opacity-80 mt-1">Vui lòng chọn một Sprint ở phía trên để xem dữ liệu đánh giá chéo.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-destructive bg-destructive/5 rounded-2xl border border-destructive/20">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <p className="font-bold text-lg">Không thể lấy dữ liệu</p>
            <p className="text-sm font-medium opacity-80 mt-1">API chưa hoàn thiện hoặc có lỗi kết nối.</p>
          </div>
        ) : !data?.reviews || data.reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/50">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-lg">Chưa có đánh giá</p>
            <p className="text-[13px] font-medium opacity-80 mt-1">Sprint này chưa có dữ liệu Peer Review nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
            <div className="p-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Dữ liệu thô (Raw Data)</span>
            </div>
            <pre className="p-4 text-xs font-mono text-muted-foreground overflow-auto max-h-[500px]">
              {JSON.stringify(data.reviews, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
