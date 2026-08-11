import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../api/subjectApi";
import { SubjectRequest } from "../types";
import { toast } from "sonner";
import { SUBJECT_MESSAGES } from "../constants/messages";

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
      toast.success(SUBJECT_MESSAGES.CREATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SUBJECT_MESSAGES.CREATE.ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubjectRequest }) =>
      subjectApi.updateSubject(id, data),
    onSuccess: (_, { id }) => {
      toast.success(SUBJECT_MESSAGES.UPDATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", id] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SUBJECT_MESSAGES.UPDATE.ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectApi.deleteSubject(id),
    onSuccess: () => {
      toast.success(SUBJECT_MESSAGES.DELETE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SUBJECT_MESSAGES.DELETE.ERROR;
      toast.error(errorMessage);
    },
  });
};
