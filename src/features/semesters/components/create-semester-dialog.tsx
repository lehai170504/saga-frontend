"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { semesterSchema, SemesterFormValues } from "../schemas/semesterSchema";
import { useCreateSemester } from "../hooks/useSemesters";

export function CreateSemesterDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createSemester, isPending } = useCreateSemester();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      code: "",
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: SemesterFormValues) => {
    try {
      // Append seconds if user didn't select them (datetime-local sometimes omits seconds)
      const payload = {
        ...data,
        startDate: data.startDate.length === 16 ? `${data.startDate}:00` : data.startDate,
        endDate: data.endDate.length === 16 ? `${data.endDate}:00` : data.endDate,
      };

      await createSemester(payload);
      reset();
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to create semester", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-4 font-semibold shadow-sm transition-all hover:shadow-md bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Tạo Học kỳ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Học kỳ Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="font-semibold text-foreground/80">
              Mã học kỳ
            </Label>
            <Input
              id="code"
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
            <Label htmlFor="name" className="font-semibold text-foreground/80">
              Tên học kỳ
            </Label>
            <Input
              id="name"
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
              <Label htmlFor="startDate" className="font-semibold text-foreground/80">
                Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
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
              <Label htmlFor="endDate" className="font-semibold text-foreground/80">
                Ngày kết thúc
              </Label>
              <Input
                id="endDate"
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
              onClick={() => setOpen(false)}
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
