import { useQuery } from "@tanstack/react-query";
import { systemStatsApi } from "../api/systemStatsApi";

export const useSystemStats = () => {
  return useQuery({
    queryKey: ["admin", "system-stats"],
    queryFn: () => systemStatsApi.getSystemStats(),
  });
};

export const useIntegrationHealth = () => {
  return useQuery({
    queryKey: ["admin", "integrations", "health"],
    queryFn: () => systemStatsApi.getIntegrationHealth(),
  });
};
