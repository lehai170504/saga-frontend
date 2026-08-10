"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { rubricSchema, RubricFormValues } from "../../schemas/rubricSchema";
import { useUpdateRubric } from "../../hooks/useRubric";
import { RubricCriteria } from "../../api/rubricApi";

interface UpdateRubricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rubric: RubricCriteria | null;
}

export function UpdateRubricDialog({ open, onOpenChange, rubric }: UpdateRubricDialogProps) {
  const { mutateAsync: updateRubric, isPending } = useUpdateRubric();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RubricFormValues>({
    resolver: zodResolver(rubricSchema),
    defaultValues: {
      criteriaName: "",
      weight: 1,
      description: "",
    },
  });

  useEffect(() => {
    if (rubric && open) {
      reset({
        criteriaName: rubric.criteriaName,
        weight: rubric.weight,
        description: rubric.description,
      });
    }
  }, [rubric, open, reset]);

  const onSubmit = async (data: RubricFormValues) => {
    if (!rubric) return;
    updateRubric({ id: rubric.rubricId, data }, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cập nhật Tiêu chí</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="update-criteriaName" className="font-semibold text-foreground/80">
              Tên tiêu chí
            </Label>
            <Input
              id="update-criteriaName"
              placeholder="VD: 5 Sao (Xuất sắc)"
              className={`rounded-xl h-11 ${errors.criteriaName ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("criteriaName")}
            />
            {errors.criteriaName && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.criteriaName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-weight" className="font-semibold text-foreground/80">
              Hệ số (Weight)
            </Label>
            <Input
              id="update-weight"
              type="number"
              step="0.01"
              placeholder="VD: 1.10"
              className={`rounded-xl h-11 ${errors.weight ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("weight")}
            />
            {errors.weight && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-description" className="font-semibold text-foreground/80">
              Mô tả chi tiết
            </Label>
            <Textarea
              id="update-description"
              placeholder="Nhập mô tả cho tiêu chí này..."
              className={`rounded-xl min-h-[100px] resize-none ${errors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.description.message}</p>
            )}
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
