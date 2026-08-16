"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { JiraTask } from "@/features/projects/types";
import { useAttachTaskEvidence } from "@/features/projects/hooks/useProjectTasks";
import { Paperclip, Link as LinkIcon, Upload, X, FileText, Loader2, CheckCircle2, Globe } from "lucide-react";

interface TaskAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task: JiraTask | null;
}

const ALLOWED_EXTENSIONS = [
  "png", "jpg", "jpeg", "gif", "webp", "bmp",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "txt", "md", "csv", "zip"
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export function TaskAttachmentModal({
  isOpen,
  onClose,
  projectId,
  task,
}: TaskAttachmentModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: attachEvidence, isPending } = useAttachTaskEvidence(projectId);

  if (!task) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (selectedFiles.length + newFiles.length > MAX_FILES) {
      toast.error(`Bạn chỉ được đính kèm tối đa ${MAX_FILES} tệp trong một lần gửi.`);
      return;
    }

    const validFiles: File[] = [];
    for (const f of newFiles) {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error(`Tệp "${f.name}" có định dạng không được hỗ trợ.`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`Tệp "${f.name}" vượt quá dung lượng cho phép (tối đa 10MB).`);
        continue;
      }
      validFiles.push(f);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLink = linkInput.trim();
    if (selectedFiles.length === 0 && !trimmedLink) {
      toast.error("Vui lòng đính kèm ít nhất 1 tệp hoặc 1 đường dẫn link bằng chứng.");
      return;
    }

    if (trimmedLink) {
      if (!/^https?:\/\//i.test(trimmedLink)) {
        toast.error("Đường dẫn link phải bắt đầu bằng http:// hoặc https://");
        return;
      }
      if (trimmedLink.length > 2048) {
        toast.error("Đường dẫn link vượt quá 2048 ký tự.");
        return;
      }
    }

    const idempotencyKey = crypto.randomUUID();

    try {
      await attachEvidence({
        taskId: task.id,
        data: {
          files: selectedFiles.length > 0 ? selectedFiles : undefined,
          link: trimmedLink || undefined,
        },
        idempotencyKey,
      });

      setSelectedFiles([]);
      setLinkInput("");
      onClose();
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-border/40 space-y-2">
          <DialogTitle className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-primary" />
            Đính kèm bằng chứng vào Task
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Task: <strong className="text-foreground">{task.title}</strong> ({task.type || task.issueType || "TASK"})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* File Upload Drop Area */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>1. Tải tệp bằng chứng (Tối đa 5 tệp, mỗi tệp ≤ 10MB)</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {selectedFiles.length}/{MAX_FILES} tệp
              </span>
            </Label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/70 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="w-8 h-8 text-primary opacity-80" />
              <div className="text-xs font-semibold text-foreground">
                Bấm vào đây để chọn tệp từ máy tính
              </div>
              <p className="text-[11px] text-muted-foreground">
                Hỗ trợ: PDF, Word, Excel, PowerPoint, Ảnh, Text, CSV, ZIP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.zip"
              />
            </div>

            {/* Selected File List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/50 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={15} className="text-primary shrink-0" />
                      <span className="truncate font-semibold">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link Input Section */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <Label htmlFor="evidence-link" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <LinkIcon size={14} className="text-primary" />
              2. Hoặc dán đường dẫn link bằng chứng (Google Drive, Figma, Docs...)
            </Label>
            <Input
              id="evidence-link"
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="rounded-xl border-border/50 bg-background text-xs"
            />
          </div>

          {/* Notice Banner */}
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
            <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý:</strong> Bằng chứng sẽ được tự động đồng bộ sang Jira Issue của dự án để ghi nhận điểm số đóng góp.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl font-bold text-xs px-4"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || (selectedFiles.length === 0 && !linkInput.trim())}
              className="rounded-xl font-bold text-xs px-5 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang đồng bộ Jira...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Gửi bằng chứng
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
