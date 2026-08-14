"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { ArrowLeft, Network, Activity, BarChart3, PieChart, Users, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TeamOverviewView } from "@/features/admin/components/team-analytics/team-overview-view";
import { TeamHeatmapView } from "@/features/admin/components/team-analytics/team-heatmap-view";
import { InteractionGraphView } from "@/features/admin/components/team-analytics/interaction-graph-view";
import { SprintVelocityView } from "@/features/admin/components/team-analytics/sprint-velocity-view";
import { PeerReviewView } from "@/features/admin/components/team-analytics/peer-review-view";

export default function TeamAnalyticsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const teamId = params.id as string;
  const courseId = searchParams.get("courseId") || "";

  return (
    <div className="space-y-6">
      {/* Navigation / Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/teams"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-muted/30 hover:bg-muted/50 px-4 py-2.5 rounded-xl border border-border/40 cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách Nhóm
        </Link>
      </div>

      <PageHeader
        title="Trung tâm Phân tích Nhóm"
        description="Theo dõi đánh giá đóng góp, biểu đồ nhiệt, vận tốc Sprint và mạng tương tác của nhóm."
      />

      <div className="bg-gradient-to-br from-primary/5 via-background to-transparent border border-border/50 rounded-[2rem] p-6 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Network className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Team Analytics</p>
          <h3 className="text-xl font-bold text-foreground">Phân tích chuyên sâu</h3>
        </div>
      </div>

      {!courseId ? (
        <div className="p-12 text-center border border-dashed border-border/50 rounded-[2rem] bg-card text-muted-foreground">
          <p className="font-bold text-lg">Thiếu Course ID</p>
          <p className="text-sm mt-1">Vui lòng truy cập trang này từ bảng quản lý nhóm.</p>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="bg-card border border-border/50 rounded-2xl h-14 w-full p-2 grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto lg:h-14">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <PieChart className="w-4 h-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Activity className="w-4 h-4 mr-2" />
              Biểu đồ nhiệt
            </TabsTrigger>
            <TabsTrigger value="interaction" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Users className="w-4 h-4 mr-2" />
              Mạng tương tác
            </TabsTrigger>
            <TabsTrigger value="velocity" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <BarChart3 className="w-4 h-4 mr-2" />
              Vận tốc
            </TabsTrigger>
            <TabsTrigger value="peer-review" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Star className="w-4 h-4 mr-2" />
              Đánh giá chéo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="focus-visible:outline-none">
            <TeamOverviewView courseId={courseId} teamId={teamId} />
          </TabsContent>

          <TabsContent value="heatmap" className="focus-visible:outline-none">
            <TeamHeatmapView courseId={courseId} teamId={teamId} />
          </TabsContent>

          <TabsContent value="interaction" className="focus-visible:outline-none">
            <InteractionGraphView courseId={courseId} teamId={teamId} />
          </TabsContent>

          <TabsContent value="velocity" className="focus-visible:outline-none">
            <SprintVelocityView courseId={courseId} teamId={teamId} />
          </TabsContent>

          <TabsContent value="peer-review" className="focus-visible:outline-none">
            <PeerReviewView teamId={teamId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
