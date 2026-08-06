import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../api/subjectApi";
import { SubjectRequest } from "../types";

export const useSubjects = (params?: { keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["subjects", params],
    queryFn: () => subjectApi.getSubjects(params),
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: () => subjectApi.getSubject(id),
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubjectRequest) => subjectApi.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubjectRequest }) =>
      subjectApi.updateSubject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", id] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectApi.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
