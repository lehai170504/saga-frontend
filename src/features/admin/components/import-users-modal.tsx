"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2, FileUp } from "lucide-react";
import { toast } from "sonner";
import { useImportUsers } from "../hooks/useUsers";

export function ImportUsersModal() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "LECTURER">("STUDENT");
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: importUsers, isPending } = useImportUsers();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file trước khi import.");
      return;
    }

    importUsers({ role, file }, {
      onSuccess: () => {
        setOpen(false);
        setFile(null); // Reset after success
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          <FileUp className="w-4 h-4 mr-2" />
          Import Người dùng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-background/80 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import Người dùng</DialogTitle>
          <DialogDescription>
            Thêm hàng loạt tài khoản vào hệ thống. Chọn vai trò và tải lên file danh sách.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Vai trò (Role)</Label>
            <Select value={role} onValueChange={(val: "STUDENT" | "LECTURER") => setRole(val)}>
              <SelectTrigger id="role" className="w-full rounded-xl">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="STUDENT">Sinh viên (STUDENT)</SelectItem>
                <SelectItem value="LECTURER">Giảng viên (LECTURER)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File danh sách (.xlsx, .csv)</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-card/40 border-border hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  {file ? (
                    <p className="text-sm font-semibold text-primary">{file.name}</p>
                  ) : (
                    <>
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Nhấn để tải lên</span> hoặc kéo thả file vào đây
                      </p>
                      <p className="text-xs text-muted-foreground">Chấp nhận file Excel hoặc CSV</p>
                    </>
                  )}
                </div>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isPending}
            className="rounded-xl bg-primary text-primary-foreground"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Bắt đầu Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
