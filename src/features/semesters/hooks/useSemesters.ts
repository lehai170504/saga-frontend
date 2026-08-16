import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { semesterApi } from "../api/semesterApi";
import { SemesterRequest } from "../types";
import { toast } from "sonner";
import { SEMESTER_MESSAGES } from "../constants/messages";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

export const useSemesters = (params?: { keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["semesters", params],
    queryFn: () => semesterApi.getSemesters(params),
  });
};

export const useSemester = (id: string) => {
  return useQuery({
    queryKey: ["semesters", id],
    queryFn: () => semesterApi.getSemester(id),
    enabled: !!id,
  });
};

export const useCreateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SemesterRequest) => semesterApi.createSemester(data),
    onSuccess: () => {
      toast.success(SEMESTER_MESSAGES.CREATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, SEMESTER_MESSAGES.CREATE.ERROR));
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemesterRequest }) => semesterApi.updateSemester(id, data),
    onSuccess: (_, variables) => {
      toast.success(SEMESTER_MESSAGES.UPDATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      queryClient.invalidateQueries({ queryKey: ["semesters", variables.id] });
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, SEMESTER_MESSAGES.UPDATE.ERROR));
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => semesterApi.deleteSemester(id),
    onSuccess: () => {
      toast.success(SEMESTER_MESSAGES.DELETE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, SEMESTER_MESSAGES.DELETE.ERROR));
    },
  });
};

export const useActiveSemester = () => {
  return useQuery({
    queryKey: ["semesters", "active"],
    queryFn: () => semesterApi.getActiveSemester(),
  });
};

export const useSetActiveSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (semesterId: string) => semesterApi.setActiveSemester(semesterId),
    onSuccess: () => {
      toast.success(SEMESTER_MESSAGES.SET_ACTIVE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["semesters", "active"] });
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, SEMESTER_MESSAGES.SET_ACTIVE.ERROR));
    },
  });
};
