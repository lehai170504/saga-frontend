import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export const useLecturers = (params?: { keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["users", "instructors", params],
    queryFn: () => userApi.getInstructors(params)
  });
};
