import { useState } from "react";
import { toast } from "sonner";
import { RubricCriterion } from "@/features/projects/types";
import { useSubmitPeerReview } from "@/features/projects/hooks/useTeamSprints";

export interface EvaluatingCandidate {
  studentId: string;
  fullName: string;
  studentCode: string;
  alreadyReviewed?: boolean;
  existingTotalStarRating?: number | null;
  existingComment?: string | null;
  existingCreatedAt?: string | null;
  [key: string]: unknown;
}

export function usePeerReviewState(activeTeamId: string, sprintId: string, criteria: RubricCriterion[]) {
  const [evaluatingCandidate, setEvaluatingCandidate] = useState<EvaluatingCandidate | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const submitReviewMutation = useSubmitPeerReview(activeTeamId, sprintId);

  const handleRate = (rubricId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [rubricId]: value,
    }));
  };

  const handleCloseModal = () => {
    setEvaluatingCandidate(null);
    setRatings({});
    setComment("");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingCandidate) return;

    // Validate that all criteria are rated
    const unrated = criteria.filter((c: RubricCriterion) => !ratings[c.rubricId]);
    if (unrated.length > 0) {
      toast.error(`Vui lòng đánh giá điểm sao cho tiêu chí: "${unrated[0].criteriaName}"`);
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét/đánh giá chung của bạn.");
      return;
    }

    const criteriaRatings = criteria.map((c: RubricCriterion) => ({
      rubricId: c.rubricId,
      starRating: ratings[c.rubricId] || 0,
    }));
    const sumStarRating = criteriaRatings.reduce(
      (sum: number, item: { rubricId: string; starRating: number }) => sum + item.starRating,
      0
    );
    const overallStarRating =
      criteriaRatings.length > 0 ? Math.round(sumStarRating / criteriaRatings.length) : 0;

    const payload = {
      revieweeId: evaluatingCandidate.studentId,
      starRating: overallStarRating,
      criteriaRatings,
      comment: comment.trim(),
    };

    submitReviewMutation.mutate(payload, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  return {
    evaluatingCandidate,
    setEvaluatingCandidate,
    ratings,
    comment,
    setComment,
    handleRate,
    handleCloseModal,
    handleSubmitReview,
    submitReviewMutation,
  };
}
