"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdminBroadcast } from "@/features/notifications/hooks/useNotifications";
import { Loader2, Send, Radio } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { broadcastSchema, BroadcastFormValues } from "../../schemas/broadcastSchema";



interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const { mutateAsync: sendBroadcast, isPending } = useAdminBroadcast();

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      actionUrl: "",
      type: "SYSTEM",
      audience: "ALL_USERS",
    },
  });

  const onSubmit = async (values: BroadcastFormValues) => {
    try {
      await sendBroadcast({
        title: values.title,
        message: values.message,
        actionUrl: values.actionUrl,
        type: values.type,
        audience: values.audience,
      });
      form.reset({
        title: "",
        message: "",
        actionUrl: "",
        type: "SYSTEM",
        audience: values.audience,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const audienceList = [
    { id: "ALL_USERS", label: "Tất cả mọi người (ALL_USERS)" },
    { id: "STUDENTS", label: "Sinh viên (STUDENTS)" },
    { id: "LECTURERS", label: "Giảng viên (LECTURERS)" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Gửi thông báo toàn trường</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Gửi thông báo (Broadcast) đến các nhóm người dùng cụ thể.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">Tiêu đề thông báo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề..." className="rounded-xl bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">Nội dung chi tiết</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập nội dung thông báo..." className="rounded-xl min-h-[100px] bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">Đường dẫn đính kèm (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: /student/123/projects" className="rounded-xl bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">Đối tượng nhận (Audience)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-background">
                        <SelectValue placeholder="Chọn nhóm người dùng..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {audienceList.map((item) => (
                        <SelectItem key={item.id} value={item.id} className="rounded-lg">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl px-6 font-medium">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl px-6 font-bold shadow-sm group">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                )}
                Gửi Thông Báo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
