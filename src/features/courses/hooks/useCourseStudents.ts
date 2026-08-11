import { useMutation, useQuery } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";
import { toast } from "sonner";
import { COURSE_MESSAGES } from "../constants/messages";

export const useAdminImportStudentsTemplate = () => {
  return useMutation({
    mutationFn: ({ courseId, formData }: { courseId: string; formData: FormData }) =>
      courseApi.adminImportStudentsTemplate(courseId, formData),
    onSuccess: (response) => {
      toast.success(COURSE_MESSAGES.IMPORT.SUCCESS_DETAILS(response.createdStudents, response.reusedStudents));
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.IMPORT.ERROR_GENERIC;
      toast.error(errorMessage);
    }
  });
};

export const useImportStudents = () => {
  return useMutation({
    mutationFn: ({ courseId, formData }: { courseId: string; formData: FormData }) =>
      courseApi.importStudents(courseId, formData),
    onSuccess: () => {
      toast.success(COURSE_MESSAGES.IMPORT.SUCCESS);
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.IMPORT.ERROR_GENERIC;
      toast.error(errorMessage);
    }
  });
};

export const useTeamMembers = (courseId: string, teamId: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["courses", courseId, "teams", teamId, "members", page, size],
    queryFn: () => courseApi.getTeamMembers(courseId, teamId, { page, size }),
    enabled: !!courseId && !!teamId,
  });
};

export const useCourseStudents = (
  courseId: string,
  params?: { keyword?: string; hasTeam?: string; page?: number; size?: number; sortBy?: string; sortDirection?: string },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["courses", courseId, "students", params],
    queryFn: () => courseApi.getCourseStudents(courseId, params),
    enabled: options?.enabled !== undefined ? options.enabled : !!courseId,
  });
};

export const useMyTeamMembers = (courseId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["courses", courseId, "my-team"],
    queryFn: () => courseApi.getMyTeamMembers(courseId),
    enabled: options?.enabled !== undefined ? options.enabled : !!courseId,
  });
};

export const useCourseStudent = (courseId: string, studentId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["courses", courseId, "students", studentId],
    queryFn: () => courseApi.getCourseStudent(courseId, studentId),
    enabled: options?.enabled !== undefined ? options.enabled : (!!courseId && !!studentId),
  });
};
