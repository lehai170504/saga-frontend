"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIntegrationHealth } from "../../hooks/useSystemStats";
import { Skeleton } from "@/components/shared/Skeleton";
import { GitBranch, KanbanSquare, CheckCircle2, RefreshCw, Box } from "lucide-react";
import { format } from "date-fns";

export function IntegrationHealthCards() {
  const { data: health, isLoading } = useIntegrationHealth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-[280px] w-full rounded-2xl" />
        <Skeleton className="h-[280px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Jira Health Card */}
      <Card className="rounded-2xl shadow-sm border-border bg-card/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <KanbanSquare className="w-32 h-32" />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${health.jira.enabled ? "bg-[#0052CC]/10 text-[#0052CC]" : "bg-muted text-muted-foreground"}`}>
                <KanbanSquare className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold">Jira Software</CardTitle>
            </div>
            {health.jira.enabled ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Enabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Disabled
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Box className="w-3 h-3" /> Linked Projects
              </p>
              <p className="text-2xl font-bold">{health.jira.linkedProjectCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Connection Status
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {health.jira.connectionStatuses.length > 0 ? (
                  health.jira.connectionStatuses.map((cs: { status: string; count: number }, idx: number) => (
                    <span key={idx} className={`text-xs px-2 py-0.5 rounded-md font-medium ${cs.status === 'ACTIVE' || cs.status === 'CONNECTED' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                      {cs.count} {cs.status}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold">0</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground font-medium">Webhooks:</p>
              <div className="flex flex-wrap gap-1.5">
                {health.jira.webhookReceiptStatuses.length > 0 ? (
                  health.jira.webhookReceiptStatuses.map((ws: { status: string; count: number }, idx: number) => (
                    <span key={idx} className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${ws.status === 'RECEIVED' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {ws.count} {ws.status}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">None</span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-right">
              Sync: {health.jira.latestLastSyncedAt ? format(new Date(health.jira.latestLastSyncedAt), "HH:mm dd/MM/yyyy") : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Health Card */}
      <Card className="rounded-2xl shadow-sm border-border bg-card/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <GitBranch className="w-32 h-32" />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${health.gitHub.enabled ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"}`}>
                <GitBranch className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold">GitHub</CardTitle>
            </div>
            {health.gitHub.enabled ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Enabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Disabled
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Box className="w-3 h-3" /> Linked Repos
              </p>
              <p className="text-2xl font-bold">{health.gitHub.linkedProjectCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Installations
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {health.gitHub.installationStatuses.length > 0 ? (
                  health.gitHub.installationStatuses.map((is: { status: string; count: number }, idx: number) => (
                    <span key={idx} className={`text-xs px-2 py-0.5 rounded-md font-medium ${is.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                      {is.count} {is.status}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold">0</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground font-medium">Webhooks:</p>
              <div className="flex flex-wrap gap-1.5">
                {health.gitHub.webhookReceiptStatuses.length > 0 ? (
                  health.gitHub.webhookReceiptStatuses.map((ws, idx) => (
                    <span key={idx} className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${ws.status === 'RECEIVED' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {ws.count} {ws.status}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">None</span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-right">
              Sync: {health.gitHub.latestLastSyncedAt ? format(new Date(health.gitHub.latestLastSyncedAt), "HH:mm dd/MM/yyyy") : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
