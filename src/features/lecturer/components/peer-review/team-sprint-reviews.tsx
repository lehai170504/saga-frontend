"use client";

import React, { useMemo } from "react";
import { useSprintPeerReviews } from "../../hooks/usePeerReview";
import { useTeamDetail } from "../../hooks/useAnalytics";
import { PeerReviewItem } from "@/features/projects/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Star, Timer, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamSprintReviewsProps {
  courseId: string;
  teamId: string;
  sprintId: string;
}

export function TeamSprintReviews({ courseId, teamId, sprintId }: TeamSprintReviewsProps) {
  const { data: reviewsData, isLoading: isLoadingReviews } = useSprintPeerReviews(teamId, sprintId);
  const { data: teamData, isLoading: isLoadingTeam } = useTeamDetail(courseId, teamId);

  const reviews = useMemo(() => reviewsData?.reviews || [], [reviewsData?.reviews]);
  const members = useMemo(() => teamData?.members?.content || [], [teamData?.members?.content]);

  const getMemberName = React.useCallback((memberId: string) => {
    const member = members.find((m: { studentId?: string }) => m.studentId === memberId);
    return member?.fullName || member?.studentCode || memberId;
  }, [members]);

  const groupedReviews = useMemo(() => {
    const groups: Record<string, PeerReviewItem[]> = {};
    reviews.forEach((review) => {
      const key = review.revieweeId || "unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(review);
    });
    return Object.entries(groups).map(([revieweeId, userReviews]) => ({
      revieweeId,
      revieweeName: getMemberName(revieweeId),
      reviews: userReviews
    })).sort((a, b) => a.revieweeName.localeCompare(b.revieweeName));
  }, [reviews, getMemberName]);

  if (!teamId) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-bold text-foreground">Chưa chọn nhóm</p>
          <p className="text-sm mt-1">Vui lòng chọn một nhóm để xem dữ liệu đánh giá chéo.</p>
        </CardContent>
      </Card>
    );
  }

  if (!sprintId) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <Timer className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-bold text-foreground">Chưa có Sprint nào</p>
          <p className="text-sm mt-1">Nhóm này hiện tại chưa có Sprint nào được tạo trên Jira. Không thể xem đánh giá chéo.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingReviews || isLoadingTeam) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <AlertTriangle className="h-10 w-10 mb-4 opacity-50" />
          <p className="text-lg font-medium">Chưa có đánh giá nào</p>
          <p className="text-sm">Chưa có sinh viên nào nộp đánh giá chéo cho Sprint này.</p>
        </CardContent>
      </Card>
    );
  }



  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold tracking-tight">Kết quả Đánh giá chéo (Peer Review)</h3>
      
      {groupedReviews.map((group) => (
        <div key={group.revieweeId} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <Users size={16} />
            </div>
            <h4 className="font-bold text-foreground">Người được đánh giá: <span className="text-primary">{group.revieweeName}</span></h4>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[30%]">Người đánh giá (Reviewer)</TableHead>
                  <TableHead className="w-[15%]">Tổng điểm</TableHead>
                  <TableHead className="w-[35%]">Nhận xét</TableHead>
                  <TableHead className="w-[20%]">Thời gian nộp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.reviews.map((review: PeerReviewItem & { totalStarRating?: number; submittedAt?: string }) => {
                  const rating = review.starRating ?? review.totalStarRating;
                  const dateStr = review.submittedAt || review.createdAt;
                  
                  return (
                    <TableRow key={review.id || Math.random().toString()} className="group/row">
                      <TableCell className="font-medium text-foreground">
                        {getMemberName(review.reviewerId || "")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <span>{rating != null ? Number(rating).toFixed(1) : "-"}</span>
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2" title={review.comment}>
                          {review.comment || <span className="italic opacity-50">Không có nhận xét</span>}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
