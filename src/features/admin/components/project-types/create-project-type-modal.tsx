import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProjectType } from "../../hooks/useProjectTypes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Layers } from "lucide-react";
import { projectTypeSchema, ProjectTypeFormValues } from "../../schemas/projectTypeSchema";

interface CreateProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectTypeModal({ isOpen, onClose }: CreateProjectTypeModalProps) {
  const { mutateAsync: createProjectType, isPending } = useCreateProjectType();

  const form = useForm<ProjectTypeFormValues>({
    resolver: zodResolver(projectTypeSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      criteriaConfig: "[\n  {\n    \"code\": \"example\",\n    \"name\": \"Example\",\n    \"required\": true\n  }\n]",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        code: "",
        name: "",
        description: "",
        criteriaConfig: "[\n  {\n    \"code\": \"example\",\n    \"name\": \"Example\",\n    \"required\": true\n  }\n]",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (values: ProjectTypeFormValues) => {
    try {
      await createProjectType(values);
      onClose();
    } catch (error) {
      console.error("Failed to save project type", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isPending && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-2xl">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Thêm mới Loại Dự án
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-base">
              Thêm một loại dự án mới cùng với cấu hình tiêu chí (criteria config) bằng JSON.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Mã loại dự án (Code)</FormLabel>
                      <FormControl>
                        <Input placeholder="vd: design, research" className="rounded-xl bg-muted/50 border-border/50 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Tên hiển thị (Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="vd: Design & Architecture" className="rounded-xl bg-muted/50 border-border/50 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả về loại dự án này..."
                        className="rounded-xl bg-muted/50 border-border/50 resize-none min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criteriaConfig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center justify-between">
                      <span>Cấu hình Tiêu chí (JSON Schema)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập chuỗi JSON cấu hình..."
                        className="rounded-xl bg-muted/50 border-border/50 font-mono text-sm min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-2">
                      Chuỗi JSON này sẽ được dùng để tự động tạo form nhập điểm linh hoạt cho giảng viên.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-8 gap-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl h-11 font-semibold border-border/50 hover:bg-muted"
                  disabled={isPending}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-11 font-semibold px-8"
                  disabled={isPending}
                >
                  {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
