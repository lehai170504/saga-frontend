import { z } from "zod";

export const rubricSchema = z.object({
  criteriaName: z.string().min(1, "Vui lòng nhập tên tiêu chí"),
  weight: z.coerce.number().min(0, "Trọng số phải lớn hơn hoặc bằng 0").max(10, "Trọng số không được vượt quá 10"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
});

export type RubricFormValues = z.infer<typeof rubricSchema>;
