import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Subject, SubjectRequest } from "../types";

export const subjectApi = {
  getSubjects: async (params?: { keyword?: string; page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<Subject>>("/api/v1/subjects", { params });
  },

  getSubject: async (id: string) => {
    return axiosInstance.get<never, Subject>(`/api/v1/subjects/${id}`);
  },

  createSubject: async (data: SubjectRequest) => {
    return axiosInstance.post<never, Subject>("/api/v1/subjects", data);
  },

  updateSubject: async (id: string, data: SubjectRequest) => {
    return axiosInstance.put<never, Subject>(`/api/v1/subjects/${id}`, data);
  },

  deleteSubject: async (id: string) => {
    return axiosInstance.delete(`/api/v1/subjects/${id}`);
  },
};
