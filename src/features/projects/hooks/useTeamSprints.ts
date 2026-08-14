import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sprintApi } from "../api/sprintApi";
import { toast } from "sonner";
import { PeerReviewItem } from "../types";
import { AxiosError } from "axios";
import { SPRINT_MESSAGES } from "../constants/messages";

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
      toast.success(SPRINT_MESSAGES.PEER_REVIEW.SUCCESS);
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.message || SPRINT_MESSAGES.PEER_REVIEW.ERROR;
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

export const useBurndown = (courseId: string, teamId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["burndown", courseId, teamId, sprintId],
    queryFn: () => sprintApi.getBurndown(courseId, teamId, sprintId),
    enabled: !!courseId && !!teamId && !!sprintId,
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
      toast.success(SPRINT_MESSAGES.CREATE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg: string = SPRINT_MESSAGES.CREATE.ERROR;
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_NOT_ACTIVE;
      } else if (errCode === "JIRA_IDENTIFIER_INVALID") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_INVALID;
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
      toast.success(SPRINT_MESSAGES.START.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg: string = SPRINT_MESSAGES.START.ERROR;
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_NOT_ACTIVE;
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_REVOKED;
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
      toast.success(SPRINT_MESSAGES.CLOSE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg: string = SPRINT_MESSAGES.CLOSE.ERROR;
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_NOT_ACTIVE;
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_REVOKED;
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
      toast.success(SPRINT_MESSAGES.UPDATE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg: string = SPRINT_MESSAGES.UPDATE.ERROR;
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_NOT_ACTIVE;
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_REVOKED;
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
      toast.success(SPRINT_MESSAGES.DELETE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errCode = axiosErr?.response?.data?.error;
      const originalMsg = axiosErr?.response?.data?.message;

      let errMsg: string = SPRINT_MESSAGES.DELETE.ERROR;
      if (errCode === "JIRA_INTEGRATION_NOT_ACTIVE") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_NOT_ACTIVE;
      } else if (errCode === "JIRA_ACCESS_REVOKED") {
        errMsg = SPRINT_MESSAGES.ERRORS.JIRA_REVOKED;
      } else if (originalMsg) {
        errMsg = originalMsg;
      }
      toast.error(errMsg);
    }
  });
};
