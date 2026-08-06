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

export const useProjectSprints = (projectId: string) => {
  return useQuery({
    queryKey: ["project-sprints", projectId],
    queryFn: () => sprintApi.getProjectSprints(projectId),
    enabled: !!projectId,
  });
};

export const useCreateSprint = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; goal: string; startDate: string | null; endDate: string | null; idempotencyKey: string }) => {
      const { idempotencyKey, ...payload } = data;
      return sprintApi.createSprint(projectId, payload, idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-sprints", projectId] });
      toast.success("Tạo Sprint thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg = "Có lỗi xảy ra khi tạo Sprint.";
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.";
      } else if (errCode === "JIRA_IDENTIFIER_INVALID") {
        errMsg = "Mã định danh dự án Jira không hợp lệ.";
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};
