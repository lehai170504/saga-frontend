import { z } from "zod";

export const broadcastSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề quá dài"),
  message: z.string().min(1, "Nội dung không được để trống").max(1000, "Nội dung quá dài"),
  actionUrl: z.string().optional(),
  type: z.string().optional(),
  audience: z.enum(["STUDENT", "LECTURER", "ALL"], {
    required_error: "Vui lòng chọn đối tượng nhận thông báo",
  }),
});

export type BroadcastFormValues = z.infer<typeof broadcastSchema>;
