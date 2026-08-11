import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contributionWeightApi, DecideWeightRequestPayload, RequestCourseWeightPayload } from "../api/contributionWeightApi";
import { toast } from "sonner";
import { ADMIN_MESSAGES } from "../constants/messages";

export const useGetWeightRequests = (status?: string) => {
  return useQuery({
    queryKey: ["weight-requests", status],
    queryFn: () => contributionWeightApi.getWeightRequests(status),
  });
};

export const useDecideWeightRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string | number; data: DecideWeightRequestPayload }) =>
      contributionWeightApi.decideWeightRequest(requestId, data),
    onSuccess: () => {
      toast.success(ADMIN_MESSAGES.WEIGHT_REQUEST.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["weight-requests"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.WEIGHT_REQUEST.ERROR;
      toast.error(errorMessage);
    },
  });
};

export const useGetCourseWeights = (courseId: string) => {
  return useQuery({
    queryKey: ["course-weights", courseId],
    queryFn: () => contributionWeightApi.getCourseWeights(courseId),
    enabled: !!courseId,
  });
};

export const useRequestCourseWeightChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: RequestCourseWeightPayload }) =>
      contributionWeightApi.requestCourseWeightChange(courseId, data),
    onSuccess: (_, variables) => {
      toast.success(ADMIN_MESSAGES.WEIGHT_REQUEST.REQUEST_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["weight-requests"] });
      queryClient.invalidateQueries({ queryKey: ["course-weights", variables.courseId] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || ADMIN_MESSAGES.WEIGHT_REQUEST.REQUEST_ERROR;
      toast.error(errorMessage);
    },
  });
};
