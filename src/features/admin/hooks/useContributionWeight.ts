import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contributionWeightApi, DecideWeightRequestPayload } from "../api/contributionWeightApi";

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
