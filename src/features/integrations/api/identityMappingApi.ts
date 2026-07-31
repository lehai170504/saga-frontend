import axiosInstance from "@/lib/axios";
import { IdentityConnectionResponse, IdentityMappingReviewRequest } from "../types";

export const identityMappingApi = {
  getIdentityMappings: async (studentId: string) => {
    return axiosInstance.get<never, IdentityConnectionResponse[]>(`/api/integrations/identity-mappings`, {
      params: { studentId },
    });
  },

  reviewIdentityMapping: async (mappingId: string, data: IdentityMappingReviewRequest) => {
    return axiosInstance.patch<never, IdentityConnectionResponse>(`/api/integrations/identity-mappings/${mappingId}`, data);
  },
};
