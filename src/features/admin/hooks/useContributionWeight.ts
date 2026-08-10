import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contributionWeightApi, DecideWeightRequestPayload, RequestCourseWeightPayload } from "../api/contributionWeightApi";

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
      queryClient.invalidateQueries({ queryKey: ["weight-requests"] });
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
      queryClient.invalidateQueries({ queryKey: ["weight-requests"] });
      queryClient.invalidateQueries({ queryKey: ["course-weights", variables.courseId] });
    },
  });
};
