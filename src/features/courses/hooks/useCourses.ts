import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";
import { CourseRequest } from "../types";

export const useCourses = (params?: { subjectId?: string; semesterId?: string; instructorId?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getCourses(params),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseApi.getCourse(id),
    enabled: !!id,
  });
};

export const useMyTeam = (courseId: string) => {
  return useQuery({
    queryKey: ["myTeam", courseId],
    queryFn: () => courseApi.getMyTeamMembers(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseRequest) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
