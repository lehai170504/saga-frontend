"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logs, BookOpen, ShieldAlert } from "lucide-react";
import { ClientGuard } from "@/features/auth/components/client-guard";

import { AiWarningRules } from "@/features/admin/components/evaluation-config/ai-warning-rules";
import { SystemLogsView } from "@/features/admin/components/settings/system-logs-view";
import { AdminGuideView } from "@/features/admin/components/settings/admin-guide-view";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("evaluation");

  return (
    <ClientGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <PageHeader
          title="Cài đặt & Hệ thống"
          description="Quản lý cấu hình toàn hệ thống, theo dõi nhật ký hoạt động và xem hướng dẫn vận hành SAGA."
        />

        <div className="bg-gradient-to-br from-destructive/5 via-background to-transparent border border-destructive/20 rounded-[2rem] p-6 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-destructive">System Administration</p>
            <h3 className="text-xl font-bold text-foreground">Cấu hình Hệ thống Quan trọng</h3>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-card border border-border/50 rounded-[2rem] w-full p-2 grid grid-cols-1 lg:grid-cols-3 gap-2 h-auto lg:h-14">
            <TabsTrigger value="evaluation" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Cảnh báo AI
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Logs className="w-4 h-4 mr-2" />
              Nhật ký Hệ thống
            </TabsTrigger>
            <TabsTrigger value="guide" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <BookOpen className="w-4 h-4 mr-2" />
              Hướng dẫn Vận hành
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <AiWarningRules />
            </div>
          </TabsContent>

          <TabsContent value="logs" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <SystemLogsView />
            </div>
          </TabsContent>

          <TabsContent value="guide" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <AdminGuideView />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientGuard>
  );
}
