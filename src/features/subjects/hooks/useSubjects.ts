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
