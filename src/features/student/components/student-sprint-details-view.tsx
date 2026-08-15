"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { ArrowLeft, Users, UserCheck, ShieldAlert, Lock } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import {
  useTeamSprintCandidates,
  useTeamRubric,
  useTeamSprintReviews,
  useTeamSprints,
} from "@/features/projects/hooks/useTeamSprints";
import { RubricCriterion, PeerReviewItem } from "@/features/projects/types";

// Subcomponents & Custom Hook
import { PeerReviewCandidateCard } from "./sprint-details/peer-review-candidate-card";
import { PeerReviewModal } from "./sprint-details/peer-review-modal";
import { usePeerReviewState } from "./sprint-details/hooks/usePeerReviewState";

interface StudentSprintDetailsViewProps {
  courseId?: string;
  sprintId?: string;
}

export function StudentSprintDetailsView({ courseId, sprintId }: StudentSprintDetailsViewProps) {
  const [mounted, setMounted] = useState(false);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const { data: sprintsData } = useTeamSprints(activeTeamId);
  const { data: candidatesData, isLoading: isLoadingCandidates } = useTeamSprintCandidates(
    activeTeamId,
    sprintId || ""
  );
  const { data: teamRubricData, isLoading: isLoadingTeamRubric } = useTeamRubric(activeTeamId);
  const { data: sprintReviewsData } = useTeamSprintReviews(activeTeamId, sprintId || "");

  const isLoading = isLoadingTeam || isLoadingCourse || (!!activeTeamId && isLoadingCandidates);

  const currentSprint = (sprintsData?.sprints || []).find(
    (s) =>
      (s.sprintId || (s as unknown as { id?: string }).id || (s as unknown as { sprint_id?: string }).sprint_id) === sprintId
  );

  const isReviewWindowOpen = () => {
    if (!currentSprint) return true;
    if (!currentSprint.endDate) return false;
    const isClosed = currentSprint.state === "CLOSED" || currentSprint.state === "closed";
    if (isClosed) return true;
    const openD = new Date(new Date(currentSprint.endDate).getTime() - 7 * 24 * 60 * 60 * 1000);
    return new Date() >= openD;
  };

  const canAccessReview = isReviewWindowOpen();

  // Determine criteria with fallbacks (Team -> Default -> Hardcoded standard)
  const getRubricCriteria = (): RubricCriterion[] => {
    if (teamRubricData?.criteria && teamRubricData.criteria.length > 0) {
      return teamRubricData.criteria;
    }
    return [
      {
        rubricId: "11111111-1111-1111-1111-111111111111",
        criteriaName: "Hoàn thành & Chất lượng",
        weight: 25,
        description: "Làm đúng, đủ task được giao; code/chức năng chạy ổn định, ít lỗi.",
      },
      {
        rubricId: "22222222-2222-2222-2222-222222222222",
        criteriaName: "Tiến độ & Quy trình",
        weight: 25,
        description: "Đáp ứng đúng deadline; đẩy/merge code kịp thời, không làm kẹt tiến độ chung.",
      },
      {
        rubricId: "33333333-3333-3333-3333-333333333333",
        criteriaName: "Giao tiếp & Hỗ trợ",
        weight: 25,
        description: "Dễ liên lạc; chủ động phối hợp và sẵn sàng giúp đỡ đồng đội.",
      },
      {
        rubricId: "44444444-4444-4444-4444-444444444444",
        criteriaName: "Thái độ & Xử lý sự cố",
        weight: 25,
        description:
          "Chịu trách nhiệm với công việc được giao; xử lý sự cố kịp thời và hiệu quả, cởi mở tiếp thu góp ý.",
      },
    ];
  };

  const criteria = getRubricCriteria();
  const peerReviewState = usePeerReviewState(activeTeamId, sprintId || "", criteria);

  const candidates = candidatesData?.candidates || [];

  // Build a map: revieweeId -> PeerReviewItem
  const reviewsMap = (sprintReviewsData?.reviews || []).reduce((acc, review) => {
    if (review.revieweeId) acc[review.revieweeId] = review;
    return acc;
  }, {} as Record<string, PeerReviewItem>);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
 <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 "> 
        {/* Navigation / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/student/${courseId}/projects?tab=peer-review`}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-muted/30 hover:bg-muted/50 px-4 py-2.5 rounded-xl border border-border/40 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={16} />
            Quay lại Đánh giá chéo
          </Link>
        </div>

        <PageHeader
          title="Đánh giá chéo thành viên"
          description={
            courseData
              ? `Thực hiện tự đánh giá và đánh giá các thành viên trong nhóm cho Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] p-6 space-y-4">
            <Skeleton className="h-20 w-full rounded-[2rem] bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
            </div>
          </div>
        ) : !canAccessReview ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed border-amber-500/30 max-w-lg mx-auto space-y-4">
            <Lock size={48} className="mx-auto text-amber-500" />
            <h3 className="text-xl font-bold text-foreground">Đánh giá chéo chưa được mở</h3>
            <p className="text-sm text-muted-foreground">
              {currentSprint && currentSprint.endDate
                ? `Đợt đánh giá chéo cho ${currentSprint.sprintName} sẽ tự động mở từ ngày ${(() => {
                    const openD = new Date(new Date(currentSprint.endDate).getTime() - 7 * 24 * 60 * 60 * 1000);
                    return `${String(openD.getDate()).padStart(2, '0')}-${String(openD.getMonth() + 1).padStart(2, '0')}-${openD.getFullYear()}`;
                  })()} (trước hạn kết thúc Sprint 7 ngày).`
                : "Sprint này chưa được thiết lập lịch thời gian trên Jira để mở đợt Đánh giá chéo."}
            </p>
            <div className="pt-2">
              <Link
                href={`/student/${courseId}/projects?tab=peer-review`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all"
              >
                <ArrowLeft size={16} /> Quay lại danh sách Đánh giá chéo
              </Link>
            </div>
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Bạn chưa tham gia vào nhóm nào trong khóa học này.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Project / Team Info Hero Bar */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-transparent border border-border/50 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Nhóm đang đánh giá
                </p>
                <h3 className="text-xl font-bold text-foreground">{myTeamData.teamName}</h3>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Dự án / Đề tài
                </p>
                <h3 className="text-sm font-semibold text-foreground">
                  {myTeamData.project?.name || "Chưa có đề tài"}
                </h3>
              </div>
            </div>

            {/* Candidates Section */}
            <div className="space-y-5">
              {candidates.length > 0 && candidates.every((c) => c.alreadyReviewed) && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                  <UserCheck size={20} className="shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide">
                      Đã hoàn thành đánh giá chéo
                    </p>
                    <p className="text-xs opacity-90 mt-0.5">
                      Bạn đã thực hiện tự đánh giá và đánh giá đầy đủ tất cả các thành viên trong nhóm cho Sprint này.
                    </p>
                  </div>
                </div>
              )}

              <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
                <Users size={16} />
                Thành viên cần đánh giá ({candidates.length})
              </h3>

              {candidates.length === 0 ? (
                <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
                  <ShieldAlert size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h4 className="text-lg font-bold text-foreground">Không có thành viên nào</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Không tìm thấy thành viên nào khác trong nhóm của bạn để thực hiện đánh giá.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidates.map((candidate) => (
                    <PeerReviewCandidateCard
                      key={candidate.studentId}
                      candidate={candidate}
                      reviewsMap={reviewsMap}
                      onStartReview={(cand) => peerReviewState.setEvaluatingCandidate(cand)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Peer Review Form Dialog */}
            <PeerReviewModal
              evaluatingCandidate={peerReviewState.evaluatingCandidate}
              onClose={peerReviewState.handleCloseModal}
              criteria={criteria}
              isLoadingTeamRubric={isLoadingTeamRubric}
              ratings={peerReviewState.ratings}
              onRate={peerReviewState.handleRate}
              comment={peerReviewState.comment}
              onCommentChange={peerReviewState.setComment}
              onSubmit={peerReviewState.handleSubmitReview}
              isPending={peerReviewState.submitReviewMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  );
}
