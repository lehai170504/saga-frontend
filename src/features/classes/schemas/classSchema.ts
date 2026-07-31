import { z } from "zod";

export const classSchema = z.object({
  classCode: z.string().min(1, "Mã lớp không được để trống").max(255, "Mã lớp quá dài"),
  name: z.string().min(1, "Tên lớp không được để trống").max(255, "Tên lớp quá dài"),
});

export type ClassFormValues = z.infer<typeof classSchema>;
