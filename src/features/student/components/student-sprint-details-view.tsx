"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { ArrowLeft, Users, UserCheck, ShieldAlert, Star, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useTeamSprintCandidates, useTeamRubric, useSubmitPeerReview } from "@/features/projects/hooks/useTeamSprints";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StudentSprintDetailsViewProps {
  courseId?: string;
  sprintId?: string;
}

interface EvaluatingCandidate {
  studentId: string;
  fullName: string;
  studentCode: string;
  alreadyReviewed?: boolean;
  existingTotalStarRating?: number | null;
  existingComment?: string | null;
  [key: string]: unknown;
}

export function StudentSprintDetailsView({ courseId, sprintId }: StudentSprintDetailsViewProps) {
  const [mounted, setMounted] = useState(false);

  // Form states for peer review dialog
  const [evaluatingCandidate, setEvaluatingCandidate] = useState<EvaluatingCandidate | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const { data: candidatesData, isLoading: isLoadingCandidates } = useTeamSprintCandidates(activeTeamId, sprintId || "");
  const { data: teamRubricData, isLoading: isLoadingTeamRubric } = useTeamRubric(activeTeamId);
  const submitReviewMutation = useSubmitPeerReview(activeTeamId, sprintId || "");

  const isLoading = isLoadingTeam || isLoadingCourse || (!!activeTeamId && isLoadingCandidates);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const candidates = candidatesData?.candidates || [];

  // Determine criteria with fallbacks (Team -> Default -> Hardcoded standard)
  const getRubricCriteria = () => {
    if (teamRubricData?.criteria && teamRubricData.criteria.length > 0) {
      return teamRubricData.criteria;
    return [
      {
        rubricId: "11111111-1111-1111-1111-111111111111",
        criteriaName: "Hoàn thành & Chất lượng",
        weight: 25,
        description: "Làm đúng, đủ task được giao; code/chức năng chạy ổn định, ít lỗi."
      },
      {
        rubricId: "22222222-2222-2222-2222-222222222222",
        criteriaName: "Tiến độ & Quy trình",
        weight: 25,
        description: "Đáp ứng đúng deadline; đẩy/merge code kịp thời, không làm kẹt tiến độ chung."
      },
      {
        rubricId: "33333333-3333-3333-3333-333333333333",
        criteriaName: "Giao tiếp & Hỗ trợ",
        weight: 25,
        description: "Dễ liên lạc; chủ động phối hợp và sẵn sàng giúp đỡ đồng đội."
      },
      {
        rubricId: "44444444-4444-4444-4444-444444444444",
        criteriaName: "Thái độ & Xử lý sự cố",
        weight: 25,
        description: "Chịu trách nhiệm với công việc được giao; xử lý sự cố kịp thời và hiệu quả, cởi mở tiếp thu góp ý."
      }
    ];
  };

  const criteria = getRubricCriteria();

  const handleRate = (rubricId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [rubricId]: value
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingCandidate) return;

    // Validate that all criteria are rated
    const unrated = criteria.filter(c => !ratings[c.rubricId]);
    if (unrated.length > 0) {
      toast.error(`Vui lòng đánh giá điểm sao cho tiêu chí: "${unrated[0].criteriaName}"`);
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét/đánh giá chung của bạn.");
      return;
    }

    const criteriaRatings = criteria.map(c => ({
      rubricId: c.rubricId,
      starRating: ratings[c.rubricId]
    }));
    const totalStarRating = criteriaRatings.reduce((sum, item) => sum + item.starRating, 0);

    const payload = {
      revieweeId: evaluatingCandidate.studentId,
      starRating: totalStarRating,
      criteriaRatings,
      comment: comment.trim()
    };

    submitReviewMutation.mutate(payload, {
      onSuccess: () => {
        setEvaluatingCandidate(null);
        setRatings({});
        setComment("");
      }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">

        {/* Navigation / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/student/${courseId}/sprints`}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-muted/30 hover:bg-muted/50 px-4 py-2.5 rounded-xl border border-border/40 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={16} />
            Quay lại Sprints
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
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Project / Team Info Hero Bar */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-transparent border border-border/50 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Nhóm đang đánh giá</p>
                <h3 className="text-xl font-bold text-foreground">{myTeamData.teamName}</h3>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Dự án / Đề tài</p>
                <h3 className="text-sm font-semibold text-foreground">{myTeamData.project?.name || "Chưa có đề tài"}</h3>
              </div>
            </div>

            {/* Candidates Section */}
            <div className="space-y-5">
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
                  {candidates.map((candidate) => {
                    const isReviewed = candidate.alreadyReviewed;
                    return (
                      <Card
                        key={candidate.studentId}
                        className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isReviewed
                          ? 'border-emerald-500/20 bg-emerald-500/[0.02] hover:shadow-lg'
                          : 'border-border/50 bg-card/60 backdrop-blur-md hover:shadow-xl hover:border-border'
                          }`}
                      >
                        <CardContent className="p-6 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <Avatar className={`h-14 w-14 border-2 shrink-0 ${isReviewed ? 'border-emerald-500/30' : 'border-background shadow-md'
                              }`}>
                              <AvatarFallback className={`font-bold text-base ${isReviewed
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary'
                                }`}>
                                {candidate.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 space-y-1">
                              <h4 className="text-base font-bold text-foreground truncate">
                                {candidate.fullName}
                              </h4>
                              <p className="text-xs text-muted-foreground font-semibold">
                                MSSV: {candidate.studentCode}
                              </p>
                              {isReviewed && candidate.existingTotalStarRating !== null && (
                                <div className="flex items-center gap-1 text-amber-500 mt-1">
                                  <Star size={12} className="fill-amber-500" />
                                  <span className="text-xs font-bold">{candidate.existingTotalStarRating} sao</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isReviewed ? (
                              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 font-bold px-3 py-1.5 rounded-full shadow-none text-xs flex items-center">
                                <UserCheck size={14} className="mr-1.5 shrink-0" />
                                Đã đánh giá
                              </Badge>
                            ) : (
                              <Button
                                onClick={() => setEvaluatingCandidate(candidate)}
                                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg px-4 h-10 transition-all cursor-pointer"
                              >
                                Đánh giá
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Peer Review Form Dialog */}
            <Dialog
              open={!!evaluatingCandidate}
              onOpenChange={(open) => {
                if (!open) {
                  setEvaluatingCandidate(null);
                  setRatings({});
                  setComment("");
                }
              }}
            >
              <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarFallback className="font-bold text-sm bg-gradient-to-br from-primary to-orange-600 text-white">
                        {evaluatingCandidate?.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-lg font-bold text-foreground">
                        Đánh giá: {evaluatingCandidate?.fullName}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                        Mã sinh viên: {evaluatingCandidate?.studentCode}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <form onSubmit={handleSubmitReview} className="space-y-6 pt-4">
                  {/* Rubric Criteria star ratings */}
                  <div className="space-y-4">
                    {isLoadingTeamRubric || isLoadingDefaultRubric ? (
                      <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <Loader2 className="animate-spin text-primary h-6 w-6" />
                        <span className="text-xs text-muted-foreground">Đang tải các tiêu chí đánh giá...</span>
                      </div>
                    ) : (
                      criteria.map((criterion) => (
                        <div key={criterion.rubricId} className="space-y-2 p-3.5 rounded-2xl bg-muted/30 border border-border/20">
                          <div className="flex justify-between items-start gap-2">
                            <Label className="text-sm font-bold text-foreground">
                              {criterion.criteriaName}
                            </Label>
                            <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                              TRỌNG SỐ: {criterion.weight}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {criterion.description}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRate(criterion.rubricId, star)}
                                className="text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  size={24}
                                  className={
                                    star <= (ratings[criterion.rubricId] || 0)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground/30"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* General Comment Textarea */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-foreground">
                      Nhận xét / Góp ý chung
                    </Label>
                    <Textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Nhập nhận xét cụ thể về đóng góp, thái độ làm việc của thành viên này..."
                      className="min-h-[100px] rounded-2xl resize-none border-border/50 bg-background/80"
                    />
                  </div>

                  {/* Dialog Actions */}
                  <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl font-bold cursor-pointer h-11 px-5"
                      onClick={() => {
                        setEvaluatingCandidate(null);
                        setRatings({});
                        setComment("");
                      }}
                      disabled={submitReviewMutation.isPending}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        "Gửi đánh giá"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        )}
      </div>
    </div>
  );
}
