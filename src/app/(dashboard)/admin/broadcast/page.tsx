"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdminBroadcast } from "@/features/notifications/hooks/useNotifications";
import { Loader2, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { broadcastSchema, BroadcastFormValues } from "@/features/admin/schemas/broadcastSchema";

export default function AdminBroadcastPage() {
  const { mutateAsync: sendBroadcast, isPending } = useAdminBroadcast();

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "ALL_USERS",
    },
  });

  const onSubmit = async (values: BroadcastFormValues) => {
    try {
      await sendBroadcast({
        title: values.title,
        message: values.message,
        audience: values.audience,
      });
      form.reset({
        title: "",
        message: "",
        audience: values.audience,
      });
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Gửi thông báo (Broadcast)</h1>
        <p className="text-muted-foreground mt-2">Gửi thông báo toàn hệ thống đến các nhóm người dùng cụ thể.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề thông báo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề..." className="rounded-xl" {...field} />
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
                  <FormLabel>Nội dung chi tiết</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập nội dung thông báo..." className="rounded-xl min-h-[100px]" {...field} />
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
                  <FormLabel>Đối tượng nhận (Audience)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Chọn nhóm người dùng..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {audienceList.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="rounded-xl w-full sm:w-auto mt-4 px-8">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Gửi Thông Báo
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
