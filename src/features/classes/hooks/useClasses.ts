import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../api/classApi";
import { ClassRequest } from "../types";

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
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
