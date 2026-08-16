"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamsTable } from "@/features/admin/components/teams/teams-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminTeams } from "@/features/admin/hooks/useTeams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Layers } from "lucide-react";
import { ProjectTypesTable } from "@/features/admin/components/project-types/project-types-table";
import { useProjectTypes } from "@/features/admin/hooks/useProjectTypes";

export default function TeamsManagementPage() {
  const [teamPage, setTeamPage] = useState(0);

  const { data: teamsData, isLoading: isLoadingTeams } = useAdminTeams({
    page: teamPage,
    size: 20,
  });

  const { data: projectTypes, isLoading: isLoadingTypes } = useProjectTypes();

  return (
    <div className="space-y-8 ">
      <PageHeader
        title="Quản lý Nhóm & Dự án"
        description="Xem danh sách toàn bộ các nhóm và dự án đang thực hiện trên hệ thống SAGA."
        workspace="Workspace Quản trị"
      />

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="bg-card border border-border/50 rounded-[2rem] w-full p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 h-auto lg:h-14">
          <TabsTrigger value="teams" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
            <Network className="w-4 h-4 mr-2" />
            Nhóm (Teams)
          </TabsTrigger>
          <TabsTrigger value="project-types" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
            <Layers className="w-4 h-4 mr-2" />
            Loại Dự án
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

        <TabsContent value="project-types" className="mt-0 outline-none">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {isLoadingTypes ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-end mb-4">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                  </div>
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                    ))}
                  </div>
                </div>
              ) : (
                <ProjectTypesTable data={projectTypes || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
