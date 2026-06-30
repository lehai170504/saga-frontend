"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Star, Save, AlertTriangle, ClipboardCheck, Database, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PeerReviewRules } from "@/features/admin/components/evaluation-config/peer-review-rules";
import { AiWarningRules } from "@/features/admin/components/evaluation-config/ai-warning-rules";
import { TaskMultiplierTemplates } from "@/features/admin/components/evaluation-config/task-multiplier-templates";
import { DataIntegrationRules } from "@/features/admin/components/evaluation-config/data-integration-rules";
import { OverrideRequests } from "@/features/admin/components/evaluation-config/override-requests";
import { KnowledgeGraphRules } from "@/features/admin/components/evaluation-config/knowledge-graph-rules";

export default function EvaluationConfigPage() {
  const [activeTab, setActiveTab] = useState("peer-review");
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
        description="Thiết lập luật Peer Review mặc định, các ngưỡng cảnh báo của AI và cấu hình Bộ khung hệ số chuẩn cho khối ngành SE."
        workspace="Workspace Quản trị"
      >
        <div className="flex justify-end w-full md:w-auto">
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[160px]"
          >
            <Save className={`w-4 h-4 mr-2 ${isSaving ? "animate-pulse" : ""}`} />
            {isSaving ? "Đang lưu..." : "Lưu tất cả Chính sách"}
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="peer-review" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col lg:flex-row w-full lg:w-auto h-auto lg:h-12 rounded-xl bg-muted/50 p-1 mb-8 gap-1">
          <TabsTrigger value="peer-review" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Star className="w-4 h-4 mr-2" /> Luật Peer Review Hệ thống
          </TabsTrigger>
          <TabsTrigger value="ai-warnings" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <AlertTriangle className="w-4 h-4 mr-2" /> Ngưỡng Cảnh báo AI
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Database className="w-4 h-4 mr-2" /> Tích hợp Dữ liệu
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Settings2 className="w-4 h-4 mr-2" /> Bộ Khung Hệ số (SE)
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6 relative">
            <ClipboardCheck className="w-4 h-4 mr-2" /> Yêu cầu Kiểm duyệt
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-graph" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Network className="w-4 h-4 mr-2" /> Đồ thị Lý thuyết
          </TabsTrigger>
        </TabsList>

        <TabsContent value="peer-review" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PeerReviewRules />
        </TabsContent>

        <TabsContent value="ai-warnings" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AiWarningRules />
        </TabsContent>

        <TabsContent value="templates" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TaskMultiplierTemplates />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DataIntegrationRules />
        </TabsContent>

        <TabsContent value="requests" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OverrideRequests />
        </TabsContent>

        <TabsContent value="knowledge-graph" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <KnowledgeGraphRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
