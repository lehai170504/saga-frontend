"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Settings2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRequestCourseWeightChange } from "../../hooks/useContributionWeight";

const formSchema = z.object({
  codeWeight: z.coerce.number().min(0).max(100),
  documentWeight: z.coerce.number().min(0).max(100),
  designWeight: z.coerce.number().min(0).max(100),
  reason: z.string().min(5, "Lý do phải có ít nhất 5 ký tự"),
}).refine((data) => data.codeWeight + data.documentWeight + data.designWeight === 100, {
  message: "Tổng trọng số phải bằng 100%",
  path: ["codeWeight"],
});

type FormValues = z.infer<typeof formSchema>;

interface RequestWeightDialogProps {
  courseId: string;
  lecturerId: string;
  currentCodeWeight: number;
  currentDocumentWeight: number;
  currentDesignWeight: number;
}

export function RequestWeightDialog({
  courseId,
  lecturerId,
  currentCodeWeight,
  currentDocumentWeight,
  currentDesignWeight,
}: RequestWeightDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: requestWeightChange, isPending } = useRequestCourseWeightChange();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeWeight: currentCodeWeight,
      documentWeight: currentDocumentWeight,
      designWeight: currentDesignWeight,
      reason: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    requestWeightChange({
      courseId,
      data: {
        codeWeight: values.codeWeight / 100,
        documentWeight: values.documentWeight / 100,
        designWeight: values.designWeight / 100,
        reason: values.reason,
        lecturerId,
      },
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 transition-colors">
          <Settings2 className="w-4 h-4 mr-2" />
          Yêu cầu thay đổi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Yêu cầu thay đổi trọng số</DialogTitle>
          <DialogDescription>
            Nhập trọng số mới (tổng 100%) và lý do thay đổi. Yêu cầu sẽ được phê duyệt bởi quản trị viên.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Code (%)</Label>
              <Input type="number" className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...form.register("codeWeight")} />
              {form.formState.errors.codeWeight && form.formState.errors.codeWeight.type !== "custom" && (
                <p className="text-[10px] font-medium text-destructive">{form.formState.errors.codeWeight.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Document (%)</Label>
              <Input type="number" className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...form.register("documentWeight")} />
              {form.formState.errors.documentWeight && (
                <p className="text-[10px] font-medium text-destructive">{form.formState.errors.documentWeight.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Design (%)</Label>
              <Input type="number" className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...form.register("designWeight")} />
              {form.formState.errors.designWeight && (
                <p className="text-[10px] font-medium text-destructive">{form.formState.errors.designWeight.message}</p>
              )}
            </div>
          </div>
          {form.formState.errors.codeWeight?.type === "custom" && (
            <p className="text-[12px] font-medium text-destructive mt-1">
              {form.formState.errors.codeWeight.message}
            </p>
          )}

          <div className="space-y-2 pt-2">
            <Label className="text-sm font-bold">Lý do thay đổi</Label>
            <Textarea
              placeholder="Nhập lý do thay đổi trọng số..."
              className="resize-none rounded-xl min-h-[100px] bg-muted/50 border-border/50 focus-visible:ring-primary/20"
              {...form.register("reason")}
            />
            {form.formState.errors.reason && (
              <p className="text-[12px] font-medium text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-medium">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gửi Yêu cầu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
