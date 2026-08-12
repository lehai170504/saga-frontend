"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, UploadCloud, DownloadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAdminImportStudentsTemplate,
  useDownloadAdminStudentsTemplate
} from "@/features/courses/hooks/useCourseStudents";
import { COURSE_MESSAGES } from "../constants/messages";

interface ImportStudentsDialogProps {
  courseId: string;
  courseClassName?: string;
  onSuccess?: () => void;
}

export function ImportStudentsDialog({ courseId, courseClassName = courseId, onSuccess }: ImportStudentsDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useAdminImportStudentsTemplate();
  const downloadMutation = useDownloadAdminStudentsTemplate();

  const handleImport = () => {
    if (!selectedFile) {
      toast.error(COURSE_MESSAGES.IMPORT.REQUIRE_FILE);
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
    downloadMutation.mutate(courseId);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-success border-success/20 bg-success/10 shadow-sm">
          <FileSpreadsheet size={16} />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import danh sách sinh viên</DialogTitle>
          <DialogDescription>
            Tải lên file Excel template <b>(5 cột: Class, StudentCode, Email, MemberCode, FullName)</b> chứa danh sách sinh viên của lớp {courseClassName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
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
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer mb-2 ${selectedFile ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={40} className={selectedFile ? "text-primary mb-4" : "text-muted-foreground mb-4"} />
            <p className="text-sm font-medium mb-1">
              {selectedFile ? selectedFile.name : "Kéo thả file vào đây hoặc click để chọn file"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "Hỗ trợ .xlsx, .xls, .csv"}
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-primary gap-2 hover:bg-primary/10" onClick={handleDownloadTemplate} disabled={downloadMutation.isPending}>
              {downloadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
              {downloadMutation.isPending ? "Đang tải..." : "Tải file mẫu (Template)"}
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleImport} disabled={importMutation.isPending} className="w-full gap-2 rounded-xl">
            {importMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {importMutation.isPending ? "Đang xử lý..." : "Xác nhận Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
