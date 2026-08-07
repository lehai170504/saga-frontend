import { useQuery } from "@tanstack/react-query";
import { lecturerPeerReviewApi } from "../api/peerReviewApi";

export const useDefaultRubric = () => {
  return useQuery({
    queryKey: ["lecturer", "peer-review", "default-rubric"],
    queryFn: () => lecturerPeerReviewApi.getDefaultRubric(),
  });
};

export const useTeamRubric = (teamId: string) => {
  return useQuery({
    queryKey: ["lecturer", "peer-review", "team-rubric", teamId],
    queryFn: () => lecturerPeerReviewApi.getTeamRubric(teamId),
    enabled: !!teamId,
  });
};

export const useSprintPeerReviews = (teamId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["lecturer", "peer-review", "sprint-reviews", teamId, sprintId],
    queryFn: () => lecturerPeerReviewApi.getSprintPeerReviews(teamId, sprintId),
    enabled: !!teamId && !!sprintId,
  });
};
