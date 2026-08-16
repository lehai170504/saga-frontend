import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseWeightApi, UpdateCourseWeightPayload } from "../api/courseWeightApi";
import { toast } from "sonner";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

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
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Cập nhật trọng số khóa học thất bại"));
    },
  });
};
