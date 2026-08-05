"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

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

import { classSchema, ClassFormValues } from "../schemas/classSchema";
import { useCreateClass } from "../hooks/useClasses";

export function CreateClassDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createClass, isPending } = useCreateClass();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      classCode: "",
      name: "",
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      await createClass(data);
      reset();
      setOpen(false);
    } catch (error: unknown) {

      console.error("Failed to create class", error);
      toast.error((error as { message?: string })?.message || "Có lỗi xảy ra khi tạo lớp học.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-4 font-semibold shadow-sm transition-all hover:shadow-md bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Tạo Lớp học
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Lớp học Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="classCode" className="font-semibold text-foreground/80">
              Mã lớp
            </Label>
            <Input
              id="classCode"
              placeholder="VD: SE1701"
              className={`rounded-xl h-11 ${errors.classCode ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("classCode")}
            />
            {errors.classCode && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.classCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold text-foreground/80">
              Tên lớp
            </Label>
            <Input
              id="name"
              placeholder="VD: Software Engineering 1701"
              className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
            )}
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
