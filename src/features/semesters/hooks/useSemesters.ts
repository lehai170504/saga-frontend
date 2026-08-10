import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { semesterApi } from "../api/semesterApi";
import { SemesterRequest } from "../types";

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
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemesterRequest }) => semesterApi.updateSemester(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      queryClient.invalidateQueries({ queryKey: ["semesters", variables.id] });
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => semesterApi.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
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
      queryClient.invalidateQueries({ queryKey: ["semesters", "active"] });
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
};
