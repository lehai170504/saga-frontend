"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UploadCloud, DownloadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useImportStudents, useDownloadGroupingTemplate } from "@/features/courses/hooks/useCourseStudents";

interface ImportGroupingDialogProps {
  courseId: string;
  courseClassName?: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function ImportGroupingDialog({ courseId, courseClassName = courseId, onSuccess, disabled }: ImportGroupingDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportStudents();
  const downloadTemplateMutation = useDownloadGroupingTemplate(courseClassName);

  const handleImport = () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file Excel để tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    importMutation.mutate({ courseId, formData }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
      }
    });
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate(courseId);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2 shadow-sm bg-primary hover:bg-primary/90">
          <Users size={16} />
          Phân nhóm (Excel)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tạo Nhóm hàng loạt bằng Excel</DialogTitle>
          <DialogDescription>
            Quy trình tạo nhóm: <br />
            1. Tải Template danh sách sinh viên hiện có trong lớp.<br />
            2. Mở file Excel, điền tên nhóm vào cột <strong>Group</strong>.<br />
            3. Đánh dấu <strong>x</strong> vào cột <strong>Leader</strong> cho sinh viên làm nhóm trưởng.<br />
            4. Tải file đã điền lên hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <div className="flex justify-center mb-4 border-b border-border/50 pb-4">
            <Button
              variant="outline"
              className="gap-2 text-primary border-primary/20 hover:bg-primary/10 w-full"
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isPending}
            >
              {downloadTemplateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
              {downloadTemplateMutation.isPending ? "Đang tải..." : "1. Tải Template có sẵn sinh viên"}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <div
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer mb-2 ${selectedFile ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={40} className={selectedFile ? "text-primary mb-4" : "text-muted-foreground mb-4"} />
            <p className="text-sm font-medium mb-1">
              {selectedFile ? selectedFile.name : "2. Kéo thả file Excel phân nhóm vào đây"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "Hỗ trợ file template 7 cột"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleImport} disabled={importMutation.isPending || !selectedFile} className="w-full gap-2">
            {importMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {importMutation.isPending ? "Đang xử lý..." : "3. Bắt đầu Import Phân nhóm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
