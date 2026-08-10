import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";
import { CourseRequest } from "../types";
import { toast } from "sonner";
import { COURSE_MESSAGES } from "../constants/messages";

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
      toast.success(COURSE_MESSAGES.CREATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.CREATE.ERROR;
      toast.error(errorMessage);
    }
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CourseRequest }) => courseApi.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      toast.success(COURSE_MESSAGES.UPDATE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.UPDATE.ERROR;
      toast.error(errorMessage);
    }
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: () => {
      toast.success(COURSE_MESSAGES.DELETE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.DELETE.ERROR;
      toast.error(errorMessage);
    }
  });
};

export const useExportCourseReport = () => {
  return useMutation({
    mutationFn: ({ courseId, courseClassName }: { courseId: string; courseClassName?: string }) =>
      courseApi.exportCourseReport(courseId).then((response) => ({ response, courseClassName, courseId })),
    onSuccess: ({ response, courseClassName, courseId }) => {
      const blob = new Blob([response.data as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Course_Report_${courseClassName || courseId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(COURSE_MESSAGES.EXPORT.SUCCESS);
    },
    onError: (error: unknown) => {
      console.error("Export failed:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || COURSE_MESSAGES.EXPORT.ERROR;
      toast.error(errorMessage);
    }
  });
};

