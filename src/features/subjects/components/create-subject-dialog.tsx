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

import { subjectSchema, SubjectFormValues } from "../schemas/subjectSchema";
import { useCreateSubject } from "../hooks/useSubjects";

export function CreateSubjectDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createSubject, isPending } = useCreateSubject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectCode: "",
      name: "",
    },
  });

  const onSubmit = async (data: SubjectFormValues) => {
    createSubject(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-4 font-semibold shadow-sm transition-all hover:shadow-md bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Tạo Môn học
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Môn học Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subjectCode" className="font-semibold text-foreground/80">
              Mã môn học
            </Label>
            <Input
              id="subjectCode"
              placeholder="VD: PRJ301"
              className={`rounded-xl h-11 ${errors.subjectCode ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("subjectCode")}
            />
            {errors.subjectCode && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.subjectCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold text-foreground/80">
              Tên môn học
            </Label>
            <Input
              id="name"
              placeholder="VD: Java Web Application Development"
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
