"use client";

import React, { useState } from "react";
import { StudentBoardView } from "@/features/student/components/student-board-view";
import { StudentBacklogView } from "@/features/student/components/student-backlog-view";
import { StudentTimelineView } from "@/features/student/components/student-timeline-view";
import { StudentBurndownTab } from "@/features/student/components/stats/student-burndown-tab";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Milestone, Layers, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";

export default function StudentJiraPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [activeTab, setActiveTab] = useState("burndown");

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const teamId = myTeamData?.teamId || "";

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Tab Switcher Panel */}
      <div className="px-6 pt-6 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5 gap-2">
            <TabsTrigger
              value="burndown"
              className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2"
            >
              <TrendingDown size={14} />
              Biểu đồ Burndown
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2"
            >
              <Kanban size={14} />
              Board công việc
            </TabsTrigger>
            <TabsTrigger
              value="backlog"
              className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2"
            >
              <Layers size={14} />
              Backlog (Tasks)
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2"
            >
              <Milestone size={14} />
              Roadmap & Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="burndown" className="mt-4 focus-visible:outline-none">
            {isLoadingTeam ? (
              <Skeleton className="h-96 rounded-[2.5rem]" />
            ) : (
              <StudentBurndownTab courseId={courseId} teamId={teamId} />
            )}
          </TabsContent>

          <TabsContent value="board" className="mt-4 focus-visible:outline-none">
            <StudentBoardView courseId={courseId} />
          </TabsContent>

          <TabsContent value="backlog" className="mt-4 focus-visible:outline-none">
            <StudentBacklogView courseId={courseId} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4 focus-visible:outline-none">
            <StudentTimelineView courseId={courseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
