import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";
import { InstructorResponse } from "../types";

export const userApi = {
  getInstructors: async (params?: { keyword?: string; sortBy?: string; sortDirection?: string; page?: number; size?: number }) => {
    return axiosInstance.get<never, Page<InstructorResponse>>("/api/v1/courses/instructors", { params });
  }
};
