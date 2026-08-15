import { useQuery } from "@tanstack/react-query";
import { adminReportsApi } from "../api/adminReportsApi";

export const useAnomalies = () => {
  return useQuery({
    queryKey: ["admin-reports", "anomalies"],
    queryFn: () => adminReportsApi.getAnomalies(),
  });
};

export const useGraphProcessing = () => {
  return useQuery({
    queryKey: ["admin-reports", "graph-processing"],
    queryFn: () => adminReportsApi.getGraphProcessing(),
  });
};
