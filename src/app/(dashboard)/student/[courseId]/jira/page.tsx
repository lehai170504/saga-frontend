"use client";

import React, { useState } from "react";
import { StudentBoardView } from "@/features/student/components/student-board-view";
import { StudentTimelineView } from "@/features/student/components/student-timeline-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Milestone } from "lucide-react";

export default function StudentJiraPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [activeTab, setActiveTab] = useState("board");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Tab Switcher Panel */}
      <div className="px-6 pt-6 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-2xl bg-muted/40 p-1 border border-border/10 h-10">
            <TabsTrigger 
              value="board" 
              className="rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary cursor-pointer h-full"
            >
              <Kanban size={14} />
              Board công việc
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary cursor-pointer h-full"
            >
              <Milestone size={14} />
              Timeline / Sprints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-4 focus-visible:outline-none">
            <StudentBoardView courseId={courseId} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4 focus-visible:outline-none">
            <StudentTimelineView courseId={courseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
