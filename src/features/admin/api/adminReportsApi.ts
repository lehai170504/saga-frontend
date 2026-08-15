import axiosInstance from "@/lib/axios";

export interface AnomalySignal {
  type: string; // e.g. OVERDUE_TASK, MSR, DEADLINE_PROCESS, SNA_ISOLATION
  supportStatus: "SUPPORTED" | "TBD";
  count: number | null;
}

export interface AnomaliesResponse {
  generatedAt: string;
  signals: AnomalySignal[];
}

export interface GraphProcessingPoint {
  date: string;
  nodesCreated: number;
  nodesUpdated: number;
  edgesCreated: number;
  edgesUpdated: number;
}

export interface GraphProcessingResponse {
  generatedAt: string;
  periodDays: number;
  historySupported: boolean;
  points: GraphProcessingPoint[];
}

export const adminReportsApi = {
  getAnomalies: async () => {
    return axiosInstance.get<never, AnomaliesResponse>("/api/admin/reports/anomalies");
  },
  getGraphProcessing: async () => {
    return axiosInstance.get<never, GraphProcessingResponse>("/api/admin/reports/graph-processing");
  }
};
