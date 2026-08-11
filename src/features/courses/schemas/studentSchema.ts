import { z } from "zod";

export const addStudentManualSchema = z.object({
  studentCode: z.string().min(1, "Mã số sinh viên không được để trống").max(50, "Mã số sinh viên quá dài"),
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  fullName: z.string().min(1, "Họ và tên không được để trống").max(255, "Họ và tên quá dài"),
  group: z.string().optional(),
  leader: z.boolean().optional(),
});

export type AddStudentManualFormValues = z.infer<typeof addStudentManualSchema>;
