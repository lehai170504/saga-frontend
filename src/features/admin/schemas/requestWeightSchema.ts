import * as z from "zod";

export const requestWeightSchema = z.object({
  codeWeight: z.coerce.number().min(0).max(100),
  testWeight: z.coerce.number().min(0).max(100),
  documentWeight: z.coerce.number().min(0).max(100),
  researchWeight: z.coerce.number().min(0).max(100),
  reason: z.string().min(5, "Lý do phải có ít nhất 5 ký tự"),
}).refine((data) => data.codeWeight + data.testWeight + data.documentWeight + data.researchWeight === 100, {
  message: "Tổng trọng số phải bằng 100%",
  path: ["codeWeight"],
});

export type RequestWeightFormValues = z.infer<typeof requestWeightSchema>;
