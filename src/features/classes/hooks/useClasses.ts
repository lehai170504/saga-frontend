import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../api/classApi";
import { ClassRequest } from "../types";
import { toast } from "sonner";
import { CLASS_MESSAGES } from "../constants/messages";

export const useClasses = (params?: { keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["classes", params],
    queryFn: () => classApi.getClasses(params),
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => classApi.getClass(id),
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClassRequest) => classApi.createClass(data),
    onSuccess: () => {
      toast.success(CLASS_MESSAGES.CREATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || CLASS_MESSAGES.CREATE.ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassRequest }) =>
      classApi.updateClass(id, data),
    onSuccess: (_, { id }) => {
      toast.success(CLASS_MESSAGES.UPDATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", id] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || CLASS_MESSAGES.UPDATE.ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classApi.deleteClass(id),
    onSuccess: () => {
      toast.success(CLASS_MESSAGES.DELETE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || CLASS_MESSAGES.DELETE.ERROR;
      toast.error(errorMessage);
    },
  });
};
