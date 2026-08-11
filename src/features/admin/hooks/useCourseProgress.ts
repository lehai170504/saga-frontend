import { useQuery } from "@tanstack/react-query";
import { courseProgressApi, CourseProgressFilterParams } from "../api/courseProgressApi";

export const useAdminCourseProgress = (params: CourseProgressFilterParams) => {
  return useQuery({
    queryKey: ["admin", "course-progress", params],
    queryFn: () => courseProgressApi.getCourseProgressOverview(params),
  });
};
