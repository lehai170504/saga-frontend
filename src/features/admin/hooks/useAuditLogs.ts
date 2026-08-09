import { useQuery } from "@tanstack/react-query";
import { auditLogApi, AuditLogFilterParams } from "../api/auditLogApi";

export const useAuditLogs = (params: AuditLogFilterParams) => {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => auditLogApi.getAuditLogs(params),
  });
};
