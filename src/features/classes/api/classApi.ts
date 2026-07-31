import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { Class, ClassRequest } from "../types";

export const classApi = {
  getClasses: async (params?: { keyword?: string; page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<Class>>("/api/v1/classes", { params });
  },

  getClass: async (id: string) => {
    return axiosInstance.get<never, Class>(`/api/v1/classes/${id}`);
  },

  createClass: async (data: ClassRequest) => {
    return axiosInstance.post<never, Class>("/api/v1/classes", data);
  },
};
