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

export const useUpdateCourseWeights = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCourseWeightPayload) => courseWeightApi.updateCourseWeights(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-weights", courseId] });
      toast.success("Cập nhật trọng số khóa học thành công");
    },
    onError: () => {
      toast.error("Cập nhật trọng số khóa học thất bại");
    },
  });
};
