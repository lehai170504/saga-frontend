"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { notificationApi } from "@/features/notifications/api/notificationApi";
import { v4 as uuidv4 } from "uuid";

interface BroadcastDialogProps {
  courseIds: string[];
  triggerClassName?: string;
}

export function BroadcastDialog({ courseIds, triggerClassName }: BroadcastDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    if (actionUrl.trim() && !actionUrl.trim().startsWith("https://")) {
      toast.error("Liên kết đính kèm phải là đường dẫn HTTPS tuyệt đối (ví dụ: https://example.com/document).");
      return;
    }

    if (courseIds.length === 0) {
      toast.error("Không có lớp học nào để gửi thông báo.");
      return;
    }

    try {
      setIsSending(true);
      const idempotencyKey = uuidv4();
      await notificationApi.courseBroadcast(
        { 
          courseIds, 
          title: title.trim(), 
          message: message.trim(),
          ...(actionUrl.trim() ? { actionUrl: actionUrl.trim() } : {})
        },
        idempotencyKey
      );
      toast.success("Đã gửi thông báo lớp học thành công!");
      setIsOpen(false);
      setTitle("");
      setMessage("");
      setActionUrl("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi thông báo.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName || "gap-2 bg-primary hover:bg-primary/90 h-10 px-5 rounded-xl font-bold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto"}>
          <Megaphone size={16} />
          Gửi thông báo lớp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Megaphone className="text-primary" /> Phát thông báo
          </DialogTitle>
          <DialogDescription>
            Gửi thông báo (push notification) cho toàn bộ sinh viên trong {courseIds.length} lớp học của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-bold">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Nhắc nhở nộp báo cáo Sprint 1"
              maxLength={160}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="font-bold">Nội dung</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung thông báo (tối đa 1000 ký tự)..."
              className="min-h-[100px]"
              maxLength={1000}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="actionUrl" className="font-bold text-xs flex justify-between">
              <span>Đường dẫn đính kèm (tùy chọn)</span>
              <span className="text-muted-foreground font-normal">Chỉ nhận HTTPS</span>
            </Label>
            <Input
              id="actionUrl"
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="https://docs.google.com/... hoặc https://github.com/..."
              maxLength={500}
              className="text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button onClick={handleBroadcast} disabled={isSending || courseIds.length === 0} className="gap-2">
            {isSending && <Loader2 size={16} className="animate-spin" />}
            Gửi thông báo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
