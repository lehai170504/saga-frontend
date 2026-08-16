import { useMutation, useQuery } from "@tanstack/react-query";
import { ManualAddStudentRequest } from "../types";
import { courseApi } from "../api/courseApi";
import { toast } from "sonner";
import { COURSE_MESSAGES } from "../constants/messages";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

export const useAdminImportStudentsTemplate = () => {
  return useMutation({
    mutationFn: ({ courseId, formData }: { courseId: string; formData: FormData }) =>
      courseApi.adminImportStudentsTemplate(courseId, formData),
    onSuccess: (response) => {
      toast.success(COURSE_MESSAGES.IMPORT.SUCCESS_DETAILS(response.createdStudents, response.reusedStudents));
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, COURSE_MESSAGES.IMPORT.ERROR_GENERIC));
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
      toast.error(getVietnameseErrorMessage(error, COURSE_MESSAGES.IMPORT.ERROR_GENERIC));
    }
  });
};

export const useDownloadAdminStudentsTemplate = () => {
  return useMutation({
    mutationFn: (courseId: string) => courseApi.downloadAdminStudentsTemplate(courseId),
    onSuccess: (data: Blob, courseId: string) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `course-admin-student-template-${courseId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error(COURSE_MESSAGES.IMPORT.DOWNLOAD_TEMPLATE_ERROR);
    }
  });
};

export const useDownloadGroupingTemplate = (courseClassName?: string) => {
  return useMutation({
    mutationFn: (courseId: string) => courseApi.downloadGroupingTemplate(courseId),
    onMutate: () => {
      toast.loading("Đang tạo file template phân nhóm...", { id: "download-template" });
    },
    onSuccess: (response: unknown, courseId: string) => {
      const res = response as { data?: Blob } | Blob;
      const data = 'data' in res && res.data ? res.data : res;
      const url = window.URL.createObjectURL(new Blob([data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `course-student-grouping-${courseClassName || courseId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Tải template thành công! Hãy mở file, điền cột Group và Leader (x) rồi upload lại.", { id: "download-template" });
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, "Có lỗi xảy ra khi tải template."), { id: "download-template" });
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

export const useAddStudentManual = () => {
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: ManualAddStudentRequest }) =>
      courseApi.addStudentManual(courseId, data),
    onSuccess: () => {
      toast.success("Thêm sinh viên thành công");
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, "Có lỗi xảy ra khi thêm sinh viên. Vui lòng thử lại."));
    }
  });
};

export const useRemoveStudent = () => {
  return useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: string; studentId: string }) =>
      courseApi.removeStudent(courseId, studentId),
    onSuccess: () => {
      toast.success("Xóa sinh viên thành công");
    },
    onError: (error: unknown) => {
      toast.error(getVietnameseErrorMessage(error, "Có lỗi xảy ra khi xóa sinh viên. Vui lòng thử lại."));
    }
  });
};

export const useUpdateStudentGroup = () => {
  return useMutation({
    mutationFn: ({ courseId, studentId, data }: { courseId: string; studentId: string; data: { group: string; leader: boolean } }) =>
      courseApi.updateStudentGroup(courseId, studentId, data),
    onSuccess: () => {
      toast.success("Cập nhật nhóm thành công");
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cập nhật nhóm thất bại";
      toast.error(errorMessage);
    }
  });
};
