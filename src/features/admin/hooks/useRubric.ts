import { useQuery } from "@tanstack/react-query";
import { rubricApi } from "../api/rubricApi";

export const useDefaultRubric = () => {
  return useQuery({
    queryKey: ["admin", "defaultRubric"],
    queryFn: () => rubricApi.getDefaultRubric(),
    // Keep stale time relatively high since this is a global config
    staleTime: 5 * 60 * 1000,
  });
};
