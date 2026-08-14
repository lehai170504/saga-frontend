import * as z from "zod";

export const projectTypeSchema = z.object({
  code: z.string().min(1, "Mã loại dự án là bắt buộc"),
  name: z.string().min(1, "Tên loại dự án là bắt buộc"),
  description: z.string(),
  criteriaConfig: z.string().min(1, "Cấu hình JSON là bắt buộc").refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Cấu hình phải là một chuỗi JSON hợp lệ",
  }),
});

export type ProjectTypeFormValues = z.infer<typeof projectTypeSchema>;
