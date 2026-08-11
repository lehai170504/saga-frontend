"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { semesterSchema, SemesterFormValues } from "../schemas/semesterSchema";
import { useUpdateSemester } from "../hooks/useSemesters";
import { Semester } from "../types";

interface UpdateSemesterDialogProps {
  semester: Semester;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateSemesterDialog({ semester, open, onOpenChange }: UpdateSemesterDialogProps) {
  const { mutateAsync: updateSemester, isPending } = useUpdateSemester();

  // Handle format datetime for default values to fit input type="datetime-local"
  const formatForDatetimeLocal = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Convert to local time string that fits datetime-local (YYYY-MM-DDThh:mm:ss)
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 19);
    return localISOTime;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      code: semester.code,
      name: semester.name,
      startDate: formatForDatetimeLocal(semester.startDate),
      endDate: formatForDatetimeLocal(semester.endDate),
    },
  });

  const onSubmit = async (data: SemesterFormValues) => {
    const payload = {
      ...data,
      startDate: data.startDate.length === 16 ? `${data.startDate}:00` : data.startDate,
      endDate: data.endDate.length === 16 ? `${data.endDate}:00` : data.endDate,
    };

    updateSemester({ id: semester.id, data: payload }, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) reset({
        code: semester.code,
        name: semester.name,
        startDate: formatForDatetimeLocal(semester.startDate),
        endDate: formatForDatetimeLocal(semester.endDate),
      });
    }}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sửa Học kỳ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`edit-code-${semester.id}`} className="font-semibold text-foreground/80">
              Mã học kỳ
            </Label>
            <Input
              id={`edit-code-${semester.id}`}
              placeholder="VD: SP25"
              className={`rounded-xl h-11 ${errors.code ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("code")}
            />
            {errors.code && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-name-${semester.id}`} className="font-semibold text-foreground/80">
              Tên học kỳ
            </Label>
            <Input
              id={`edit-name-${semester.id}`}
              placeholder="VD: Spring 2025"
              className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-startDate-${semester.id}`} className="font-semibold text-foreground/80">
                Ngày bắt đầu
              </Label>
              <Input
                id={`edit-startDate-${semester.id}`}
                type="datetime-local"
                step="1"
                className={`rounded-xl h-11 ${errors.startDate ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-endDate-${semester.id}`} className="font-semibold text-foreground/80">
                Ngày kết thúc
              </Label>
              <Input
                id={`edit-endDate-${semester.id}`}
                type="datetime-local"
                step="1"
                className={`rounded-xl h-11 ${errors.endDate ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 px-6 font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl h-11 px-6 font-bold shadow-sm"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
