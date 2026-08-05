import { useQuery } from "@tanstack/react-query";
import { adminPeerReviewApi } from "../api/adminPeerReviewApi";

export const useTeamPeerReviews = (teamId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["admin-team-peer-reviews", teamId, sprintId],
    queryFn: () => adminPeerReviewApi.getSprintPeerReviews(teamId, sprintId),
    enabled: !!teamId && !!sprintId,
  });
};
