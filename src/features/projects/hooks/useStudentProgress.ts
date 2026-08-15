import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/features/lecturer/api/analyticsApi";
import { StudentProgress } from "@/features/lecturer/types/analytics";

export function useStudentProgress(courseId: string, studentId: string) {
  return useQuery<StudentProgress>({
    queryKey: ["student-progress", courseId, studentId],
    queryFn: () => analyticsApi.getStudentProgress(courseId, studentId),
    enabled: !!courseId && !!studentId,
    staleTime: 60 * 1000,
  });
}
