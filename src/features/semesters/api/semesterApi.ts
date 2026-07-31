import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Semester, SemesterRequest } from "../types";

export const semesterApi = {
  getSemesters: async (params?: { keyword?: string; page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<Semester>>("/api/v1/semesters", { params });
  },

  getSemester: async (id: string) => {
    return axiosInstance.get<never, Semester>(`/api/v1/semesters/${id}`);
  },

  createSemester: async (data: SemesterRequest) => {
    return axiosInstance.post<never, Semester>("/api/v1/semesters", data);
  },
};
