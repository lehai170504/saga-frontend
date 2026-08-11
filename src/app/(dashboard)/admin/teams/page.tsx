"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamsTable } from "@/features/admin/components/teams-table";
import { ProjectsTable } from "@/features/admin/components/projects-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminTeams } from "@/features/admin/hooks/useTeams";
import { useAdminProjects } from "@/features/admin/hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, FolderGit2 } from "lucide-react";

export default function TeamsManagementPage() {
  const [teamPage, setTeamPage] = useState(0);
  const [projectPage, setProjectPage] = useState(0);

  const { data: teamsData, isLoading: isLoadingTeams } = useAdminTeams({
    page: teamPage,
    size: 20,
  });

  const { data: projectsData, isLoading: isLoadingProjects } = useAdminProjects({
    page: projectPage,
    size: 20,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản lý Nhóm & Dự án"
        description="Xem danh sách toàn bộ các nhóm và dự án đang thực hiện trên hệ thống SAGA."
        workspace="Workspace Quản trị"
      />

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="mb-6 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5">
          <TabsTrigger value="teams" className="rounded-xl px-6 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Network className="w-4 h-4 mr-2" />
            Danh sách Nhóm (Teams)
          </TabsTrigger>
          <TabsTrigger value="projects" className="rounded-xl px-6 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FolderGit2 className="w-4 h-4 mr-2" />
            Danh sách Dự án (Projects)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-0 outline-none">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {isLoadingTeams ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                    ))}
                  </div>
                </div>
              ) : (
                <TeamsTable
                  data={teamsData?.content || []}
                  pageIndex={teamsData?.number || 0}
                  totalPages={teamsData?.totalPages || 0}
                  totalElements={teamsData?.totalElements || 0}
                  onPageChange={setTeamPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-0 outline-none">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {isLoadingProjects ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                    ))}
                  </div>
                </div>
              ) : (
                <ProjectsTable
                  data={projectsData?.content || []}
                  pageIndex={projectsData?.number || 0}
                  totalPages={projectsData?.totalPages || 0}
                  totalElements={projectsData?.totalElements || 0}
                  onPageChange={setProjectPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
