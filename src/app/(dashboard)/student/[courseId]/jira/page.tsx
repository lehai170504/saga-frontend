"use client";

import React, { useState } from "react";
import { StudentBoardView } from "@/features/student/components/student-board-view";
import { StudentBacklogView } from "@/features/student/components/student-backlog-view";
import { StudentTimelineView } from "@/features/student/components/student-timeline-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Milestone, Layers } from "lucide-react";

export default function StudentJiraPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [activeTab, setActiveTab] = useState("board");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Tab Switcher Panel */}
      <div className="px-6 pt-6 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5 gap-2">
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
