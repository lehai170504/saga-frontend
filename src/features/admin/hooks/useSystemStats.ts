import { useQuery } from "@tanstack/react-query";
import { systemStatsApi } from "../api/systemStatsApi";

export const useSystemStats = () => {
  return useQuery({
    queryKey: ["admin", "system-stats"],
    queryFn: () => systemStatsApi.getSystemStats(),
  });
};
