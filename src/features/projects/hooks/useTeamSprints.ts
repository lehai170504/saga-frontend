import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sprintApi } from "../api/sprintApi";
import { toast } from "sonner";
import { PeerReviewItem } from "../types";
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

export const useSubmitPeerReview = (teamId: string, sprintId: string) => {

  const queryClient = useQueryClient();
  return useMutation<PeerReviewItem, AxiosError<{ message: string }>, { revieweeId: string; starRating?: number; criteriaRatings?: { rubricId: string; starRating: number }[]; comment: string }>({
    mutationFn: (data) =>
      sprintApi.submitPeerReview(teamId, sprintId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-sprint-candidates", teamId, sprintId] });
      toast.success("Đăng tải đánh giá chéo thành công!");
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá chéo.";
      toast.error(errMsg);
    }
  });
};

export const useTeamSprintReviews = (teamId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["team-sprint-reviews", teamId, sprintId],
    queryFn: () => sprintApi.getTeamSprintReviews(teamId, sprintId),
    enabled: !!teamId && !!sprintId,
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

export const useStartSprint = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sprintId: string; idempotencyKey: string }) =>
      sprintApi.startSprint(projectId, data.sprintId, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
      toast.success("Bắt đầu Sprint thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg = "Có lỗi xảy ra khi bắt đầu Sprint.";
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.";
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = "Quyền truy cập Jira của bạn đã hết hạn hoặc bị hủy bỏ. Vui lòng kết nối lại Jira.";
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};

export const useCloseSprint = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sprintId: string; idempotencyKey: string }) =>
      sprintApi.closeSprint(projectId, data.sprintId, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
      toast.success("Đóng Sprint thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg = "Có lỗi xảy ra khi đóng Sprint.";
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.";
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = "Quyền truy cập Jira của bạn đã hết hạn hoặc bị hủy bỏ. Vui lòng kết nối lại Jira.";
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};

export const useUpdateSprint = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sprintId: string; name: string; goal: string; startDate: string | null; endDate: string | null; idempotencyKey: string }) => {
      const { sprintId, idempotencyKey, ...body } = data;
      return sprintApi.updateSprint(projectId, sprintId, body, idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
      toast.success("Cập nhật Sprint thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg = "Có lỗi xảy ra khi cập nhật Sprint.";
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.";
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = "Quyền truy cập Jira của bạn đã hết hạn hoặc bị hủy bỏ. Vui lòng kết nối lại Jira.";
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};

export const useDeleteSprint = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sprintId: string; idempotencyKey: string }) =>
      sprintApi.deleteSprint(projectId, data.sprintId, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
      toast.success("Xóa Sprint thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg = "Có lỗi xảy ra khi xóa Sprint.";
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.";
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = "Quyền truy cập Jira của bạn đã hết hạn hoặc bị hủy bỏ. Vui lòng kết nối lại Jira.";
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};
