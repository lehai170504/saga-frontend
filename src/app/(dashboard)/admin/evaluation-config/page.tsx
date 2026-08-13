"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { AiWarningRules } from "@/features/admin/components/evaluation-config/ai-warning-rules";
import { OverrideRequests } from "@/features/admin/components/evaluation-config/override-requests";

export default function EvaluationConfigPage() {
  const [activeTab, setActiveTab] = useState("ai-warnings");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    toast.loading("Đang lưu chính sách đánh giá toàn hệ thống...", { id: "save-config" });
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu thành công chính sách hệ thống!", { id: "save-config" });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Chính sách Đánh giá Toàn hệ thống"
        description="Thiết lập các ngưỡng cảnh báo của AI, cấu hình Bộ khung hệ số chuẩn (SE) và quản lý yêu cầu kiểm duyệt toàn hệ thống."
        workspace="Workspace Quản trị"
      >

      </PageHeader>

      <Tabs defaultValue="ai-warnings" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col lg:flex-row w-full lg:w-auto h-auto lg:h-12 rounded-xl bg-muted/50 p-1 mb-8 gap-1">
          <TabsTrigger value="ai-warnings" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <AlertTriangle className="w-4 h-4 mr-2" /> Ngưỡng Cảnh báo AI
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6 relative">
            <ClipboardCheck className="w-4 h-4 mr-2" /> Yêu cầu Kiểm duyệt
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
          </TabsTrigger>
        </TabsList>


        <TabsContent value="ai-warnings" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AiWarningRules />
        </TabsContent>

        <TabsContent value="requests" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OverrideRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
