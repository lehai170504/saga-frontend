import { z } from "zod";

export const courseSchema = z.object({
  courseCode: z.string().min(1, "Mã khóa học không được để trống").max(255, "Mã khóa học quá dài"),
  name: z.string().min(1, "Tên khóa học không được để trống").max(255, "Tên khóa học quá dài"),
  subjectId: z.string().uuid("Vui lòng chọn môn học hợp lệ"),
  classId: z.string().uuid("Vui lòng chọn lớp học hợp lệ"),
  semesterId: z.string().uuid("Vui lòng chọn học kỳ hợp lệ"),
  instructorId: z.string().uuid("ID Giảng viên phải là định dạng UUID hợp lệ"), // Fallback to UUID string since we don't have instructor list API
});

export type CourseFormValues = z.infer<typeof courseSchema>;
