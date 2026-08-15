import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { projectApi } from "../api/projectApi";
import { CreateTeamProjectRequest, UpdateProjectGroupWeightsRequest } from "../types";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "../constants/messages";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

export const useCreateTeamProject = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeamProjectRequest) => projectApi.createTeamProject(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-projects", teamId] });
      queryClient.invalidateQueries({ queryKey: ["my-team-members"] });
      toast.success(PROJECT_MESSAGES.CREATE.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, PROJECT_MESSAGES.CREATE.ERROR));
    },
  });
};

export const useProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: () => projectApi.getProjectDetail(projectId),
    enabled: !!projectId,
  });
};

export const useUpdateProjectDetail = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string | null }) =>
      projectApi.updateProjectDetail(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] });
      toast.success(PROJECT_MESSAGES.UPDATE.SUCCESS);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, PROJECT_MESSAGES.UPDATE.ERROR));
    }
  });
};

export const useProjectTypes = () => {
  return useQuery({
    queryKey: ["project-types"],
    queryFn: () => projectApi.getProjectTypes(),
  });
};

export const useCreateProjectType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<import("../types").ProjectType, 'projectTypeId'>) => projectApi.createProjectType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-types"] });
      toast.success("Tạo Project Type thành công");
    },
    onError: (err: Error | Record<string, unknown>) => {
      toast.error((err as Error).message || "Lỗi khi tạo Project Type");
    }
  });
};

export const useUpdateProjectGroupWeights = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProjectGroupWeightsRequest) =>
      projectApi.updateProjectGroupWeights(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] });
      toast.success("Cập nhật trọng số nhóm thành công");
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Có lỗi xảy ra khi cập nhật trọng số nhóm. Vui lòng thử lại."));
    }
  });
};

export const useGithubBranches = (projectId: string, repositoryId: string, page = 0, size = 100) => {
  return useQuery({
    queryKey: ["project-github-branches", projectId, repositoryId, page, size],
    queryFn: () => projectApi.getGithubBranches(projectId, repositoryId, page, size),
    enabled: !!projectId && !!repositoryId,
  });
};

export const useGithubCommits = (projectId: string, repositoryId: string, branch: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["project-github-commits", projectId, repositoryId, branch, page, size],
    queryFn: () => projectApi.getGithubCommits(projectId, repositoryId, branch, page, size),
    enabled: !!projectId && !!repositoryId && !!branch,
  });
};

export const useGithubIssues = (projectId: string, repositoryId?: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["project-github-issues", projectId, repositoryId, page, size],
    queryFn: () => projectApi.getGithubIssues(projectId, repositoryId, page, size),
    enabled: !!projectId,
  });
};

export const useProjectDashboardStats = (projectId: string) => {
  return useQuery({
    queryKey: ["project-dashboard-stats", projectId],
    queryFn: () => projectApi.getProjectDashboardStats(projectId),
    enabled: !!projectId,
  });
};
