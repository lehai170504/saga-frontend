import axiosInstance from "@/lib/axios";
import { PageResponse } from "./userApi";

export interface AuditLogResponse {
  id: string;
  action: string;
  targetEntity: string;
  timestamp: string;
}

export interface AuditLogFilterParams {
  page?: number;
  size?: number;
}

export const auditLogApi = {
  getAuditLogs: (params?: AuditLogFilterParams) => {
    return axiosInstance.get<never, PageResponse<AuditLogResponse>>("/api/admin/audit-logs", { params });
  }
};
