"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";

import { addStudentManualSchema, AddStudentManualFormValues } from "../schemas/studentSchema";
import { useAddStudentManual } from "../hooks/useCourseStudents";

interface AddStudentManualDialogProps {
  courseId: string;
  onSuccess?: () => void;
}

export function AddStudentManualDialog({ courseId, onSuccess }: AddStudentManualDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addStudent, isPending } = useAddStudentManual();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddStudentManualFormValues>({
    resolver: zodResolver(addStudentManualSchema),
    defaultValues: {
      studentCode: "",
      email: "",
      fullName: "",
      group: "",
      leader: false,
    },
  });

  const onSubmit = async (data: AddStudentManualFormValues) => {
    try {
      await addStudent({ courseId, data });
      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Failed to add student manually", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-4 font-semibold shadow-sm transition-all hover:shadow-md bg-primary">
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm thủ công
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm sinh viên thủ công</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="studentCode" className="font-semibold text-foreground/80">
              Mã số sinh viên *
            </Label>
            <Input
              id="studentCode"
              placeholder="VD: SE123456"
              className={`rounded-xl h-11 ${errors.studentCode ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("studentCode")}
            />
            {errors.studentCode && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.studentCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-semibold text-foreground/80">
              Họ và tên *
            </Label>
            <Input
              id="fullName"
              placeholder="VD: Nguyễn Văn A"
              className={`rounded-xl h-11 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-foreground/80">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="VD: anvse123456@fpt.edu.vn"
              className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="group" className="font-semibold text-foreground/80">
              Nhóm (Tùy chọn)
            </Label>
            <Input
              id="group"
              placeholder="VD: Group 1"
              className={`rounded-xl h-11 ${errors.group ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              {...register("group")}
            />
            {errors.group && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.group.message}</p>
            )}
          </div>

          <div className="flex flex-row items-center justify-between rounded-xl border border-border/50 p-4 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Trưởng nhóm</Label>
              <p className="text-xs text-muted-foreground">Đánh dấu nếu sinh viên này là trưởng nhóm</p>
            </div>
            <Controller
              name="leader"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
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
