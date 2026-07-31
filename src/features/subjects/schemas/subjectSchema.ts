import { z } from "zod";

export const subjectSchema = z.object({
  subjectCode: z.string().min(1, "Mã môn học không được để trống").max(255, "Mã môn học quá dài"),
  name: z.string().min(1, "Tên môn học không được để trống").max(255, "Tên môn học quá dài"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
