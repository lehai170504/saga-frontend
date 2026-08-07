"use client";

import React from "react";
import { useSprintPeerReviews } from "../../hooks/usePeerReview";
import { useTeamDetail } from "../../hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const reviews = reviewsData?.reviews || [];
  const members = teamData?.members?.content || [];

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.studentId === memberId);
    return member?.fullName || member?.studentCode || memberId;
  };

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
    <div className="space-y-4">
      <h3 className="text-lg font-bold tracking-tight">Kết quả Đánh giá chéo (Peer Review)</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Người đánh giá (Reviewer)</TableHead>
              <TableHead>Người được đánh giá (Reviewee)</TableHead>
              <TableHead>Tổng điểm (Star)</TableHead>
              <TableHead>Thời gian nộp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id} className="group">
                <TableCell className="font-medium text-foreground">
                  {getMemberName(review.reviewerId)}
                </TableCell>
                <TableCell>
                  {getMemberName(review.revieweeId)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>{review.totalStarRating.toFixed(1)}</span>
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(review.submittedAt).toLocaleString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
