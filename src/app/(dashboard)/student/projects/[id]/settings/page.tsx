"use client";

import { ProjectIntegrationPanel } from "@/features/integrations/components/project-integration-panel";
import { SyncStatusMonitor } from "@/features/integrations/components/sync-status-monitor";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const projectId = params.id;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-16 bg-background text-foreground">
      <PageHeader
        title="Cài đặt Nhóm & Tích hợp"
        description="Quản lý việc liên kết tài khoản GitHub Repositories và Jira Project dành cho nhóm."
      />

      <div className="space-y-8">
        <ProjectIntegrationPanel projectId={projectId} />

        <div className="mt-8">
          <SyncStatusMonitor projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
