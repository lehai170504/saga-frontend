"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Key, RefreshCw, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";

export default function IntegrationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [githubToken, setGithubToken] = useState("ghp_****************************");
  const [jiraToken, setJiraToken] = useState("");
  const [isGithubEnabled, setIsGithubEnabled] = useState(true);
  const [isJiraEnabled, setIsJiraEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    toast.loading("Đang lưu cấu hình và kiểm tra kết nối...", { id: "save-integrations" });

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu và mã hóa API Token thành công!", { id: "save-integrations" });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Tích hợp Hệ thống (Integrations)"
        description="Quản lý API Tokens (GitHub, Jira) và cấu hình đồng bộ (REQ-029). Tokens được mã hóa an toàn."
        workspace="Workspace Quản trị"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[140px]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSaving ? "animate-spin" : ""}`} />
          {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub Integration */}
        <Card className={`rounded-[2rem] border overflow-hidden transition-all duration-300 ${isGithubEnabled ? 'border-primary/50 shadow-md shadow-primary/5' : 'border-border/50'}`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isGithubEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-xl">GitHub</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Đồng bộ Commit, Pull Request, Review</p>
                </div>
              </div>
              <Switch checked={isGithubEnabled} onCheckedChange={setIsGithubEnabled} />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className={`space-y-4 transition-all duration-300 ${!isGithubEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="github-token" className="font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" /> Personal Access Token
                  </Label>
                  <Input
                    id="github-token"
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_..."
                    className="rounded-xl border-border bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Token cần quyền `repo`, `read:org`, và `read:user`.
                  </p>
                </div>
                {isGithubEnabled && (
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                    <CheckCircle2 className="w-4 h-4" /> Kết nối đang hoạt động
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Jira Integration */}
        <Card className={`rounded-[2rem] border overflow-hidden transition-all duration-300 ${isJiraEnabled ? 'border-primary/50 shadow-md shadow-primary/5' : 'border-border/50'}`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isJiraEnabled ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                    <path d="M11.53 2c0 2.4-1.97 4.35-4.35 4.35h-5C1 6.35 0 7.35 0 8.53v5c0 1.18 1 2.15 2.18 2.15h5c2.38 0 4.35 1.95 4.35 4.35v2.82c0 1.18 1 2.15 2.18 2.15h5c1.18 0 2.18-1 2.18-2.15v-5c0-2.4 1.95-4.35 4.35-4.35h2.82c1.18 0 2.15-1 2.15-2.18v-5c0-1.18-1-2.15-2.15-2.15h-5c-2.4 0-4.35-1.95-4.35-4.35V1C13.71 0 12.71 0 11.53 0v2zm-4.35 12.53c-2.4 0-4.35 1.95-4.35 4.35v2.82c0 1.18 1 2.15 2.18 2.15h5c1.18 0 2.18-1 2.18-2.15v-5c0-2.4-1.97-4.35-4.35-4.35h-.66z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-xl">Jira Software</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Đồng bộ Issue, Sprint, Story Points</p>
                </div>
              </div>
              <Switch checked={isJiraEnabled} onCheckedChange={setIsJiraEnabled} />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className={`space-y-4 transition-all duration-300 ${!isJiraEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-2">
                  <Label htmlFor="jira-url" className="font-semibold">Jira Workspace URL</Label>
                  <Input
                    id="jira-url"
                    placeholder="https://your-domain.atlassian.net"
                    className="rounded-xl border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jira-token" className="font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" /> API Token
                  </Label>
                  <Input
                    id="jira-token"
                    type="password"
                    value={jiraToken}
                    onChange={(e) => setJiraToken(e.target.value)}
                    placeholder="Nhập API Token..."
                    className="rounded-xl border-border bg-background"
                  />
                </div>
                {!isJiraEnabled && (
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                    <XCircle className="w-4 h-4" /> Chưa cấu hình kết nối
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
