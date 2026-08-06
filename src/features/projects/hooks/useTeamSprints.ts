import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sprintApi } from "../api/sprintApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useTeamSprints = (teamId: string) => {
  return useQuery({
    queryKey: ["team-sprints", teamId],
    queryFn: () => sprintApi.getTeamSprints(teamId),
    enabled: !!teamId,
  });
};

export const useTeamSprintCandidates = (teamId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["team-sprint-candidates", teamId, sprintId],
    queryFn: () => sprintApi.getTeamSprintCandidates(teamId, sprintId),
    enabled: !!teamId && !!sprintId,
  });
};

export const useTeamRubric = (teamId: string) => {
  return useQuery({
    queryKey: ["team-rubric", teamId],
    queryFn: () => sprintApi.getTeamRubric(teamId),
    enabled: !!teamId,
  });
};

export const useDefaultRubric = () => {
  return useQuery({
    queryKey: ["default-rubric"],
    queryFn: () => sprintApi.getDefaultRubric(),
  });
};

export const useSubmitPeerReview = (teamId: string, sprintId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { revieweeId: string; starRating?: number; criteriaRatings?: { rubricId: string; starRating: number }[]; comment: string }) =>
      sprintApi.submitPeerReview(teamId, sprintId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-sprint-candidates", teamId, sprintId] });
      toast.success("Đăng tải đánh giá chéo thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá chéo.";
      toast.error(errMsg);
    }
  });
};
