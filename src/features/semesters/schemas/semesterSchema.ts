import { z } from "zod";

export const semesterSchema = z
  .object({
    code: z.string().min(1, "Mã học kỳ không được để trống").max(255, "Mã học kỳ quá dài"),
    name: z.string().min(1, "Tên học kỳ không được để trống").max(255, "Tên học kỳ quá dài"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  })
  .refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  }, {
    message: "Ngày kết thúc phải diễn ra sau ngày bắt đầu",
    path: ["endDate"],
  });

export type SemesterFormValues = z.infer<typeof semesterSchema>;
