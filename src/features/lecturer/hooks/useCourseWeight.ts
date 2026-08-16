import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseWeightApi, UpdateCourseWeightPayload } from "../api/courseWeightApi";
import { toast } from "sonner";

export const useCourseWeights = (courseId: string) => {
  return useQuery({
    queryKey: ["course-weights", courseId],
    queryFn: () => courseWeightApi.getCourseWeights(courseId),
    enabled: !!courseId,
  });
};

export const useTeamWeightsList = (courseId: string) => {
  return useQuery({
    queryKey: ["team-weights-list", courseId],
    queryFn: () => courseWeightApi.getTeamWeightsList(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourseWeights = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCourseWeightPayload) => courseWeightApi.updateCourseWeights(courseId, payload),
    onSuccess: () => {
      toast.success("Cập nhật trọng số môn học thành công!");
      queryClient.invalidateQueries({ queryKey: ["course-weights", courseId] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Lỗi khi cập nhật trọng số môn học");
    }
  });
};

export const useUpdateConfigMode = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mode: "COURSE" | "TEAM") => courseWeightApi.updateConfigMode(courseId, mode),
    onSuccess: (_, mode) => {
      toast.success(`Đã chuyển sang chế độ ${mode === "COURSE" ? "Toàn khóa" : "Từng nhóm"}`);
      queryClient.invalidateQueries({ queryKey: ["course-weights", courseId] });
      queryClient.invalidateQueries({ queryKey: ["team-weights-list", courseId] });
    },
    onError: (err: Error & { status?: number }) => {
      if (err.status === 409) {
        toast.error("Một hoặc nhiều nhóm chưa được cấu hình trọng số. Vui lòng kiểm tra lại danh sách Team.");
      } else {
        toast.error(err.message || "Lỗi khi đổi chế độ cấu hình");
      }
    }
  });
};
