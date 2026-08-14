"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { Info } from "lucide-react";
import { useStudentInteractions } from "@/features/projects/hooks/useProjectDashboardStats";
import { InteractionHeaderControls } from "./interaction/interaction-header-controls";
import { InteractionLegendBanner } from "./interaction/interaction-legend-banner";
import { InteractionSummaryCards } from "./interaction/interaction-summary-cards";
import { InteractionSvgGraph } from "./interaction/interaction-svg-graph";
import { InteractionDetailsPanel } from "./interaction/interaction-details-panel";

interface StudentInteractionTabProps {
  courseId: string;
  teamId: string;
  currentStudentId?: string;
  teamMembers?: { studentId: string; fullName: string; studentCode: string; roleInTeam: string }[];
}

export function StudentInteractionTab({
  courseId,
  teamId,
  currentStudentId,
  teamMembers = [],
}: StudentInteractionTabProps) {
  const defaultFocalId = currentStudentId || teamMembers[0]?.studentId || "";
  const [focalStudentId, setFocalStudentId] = useState<string>(defaultFocalId);

  useEffect(() => {
    if (!focalStudentId && (currentStudentId || teamMembers[0]?.studentId)) {
      setFocalStudentId(currentStudentId || teamMembers[0]?.studentId || "");
    }
  }, [currentStudentId, teamMembers, focalStudentId]);

  const { data: interactionData, isLoading, error } = useStudentInteractions(
    courseId,
    teamId,
    focalStudentId
  );

  const nodes = interactionData?.nodes || [];
  const edges = interactionData?.edges || [];

  // Find Central Node
  const centralNode = nodes.find((n) => n.studentId === focalStudentId) || nodes[0];
  const peripheralNodes = nodes.filter((n) => n.studentId !== centralNode?.studentId);

  // Group edges by interaction type
  const reviewEdges = edges.filter((e) => e.sourceType === "REVIEWED");
  const commentEdges = edges.filter((e) => e.sourceType === "COMMENTED_ON");
  const assignEdges = edges.filter((e) => e.sourceType === "ASSIGNED_TO");
  const collabEdges = edges.filter((e) => e.sourceType === "COLLABORATED_WITH");

  const totalReviews = reviewEdges.reduce((acc, e) => acc + e.sourceCount, 0);
  const totalComments = commentEdges.reduce((acc, e) => acc + e.sourceCount, 0);
  const totalAssignments = assignEdges.reduce((acc, e) => acc + e.sourceCount, 0);
  const totalCollabs = collabEdges.reduce((acc, e) => acc + e.sourceCount, 0);

  // Color mapping for edge types
  const getEdgeColor = (type: string) => {
    switch (type) {
      case "REVIEWED":
        return "#a855f7"; // Purple
      case "COMMENTED_ON":
        return "#f59e0b"; // Amber
      case "ASSIGNED_TO":
        return "#3b82f6"; // Blue
      case "COLLABORATED_WITH":
        return "#10b981"; // Emerald
      default:
        return "#64748b"; // Slate
    }
  };

  const getEdgeLabel = (type: string) => {
    switch (type) {
      case "REVIEWED":
        return "Đánh giá chéo";
      case "COMMENTED_ON":
        return "Bình luận";
      case "ASSIGNED_TO":
        return "Gán Task";
      case "COLLABORATED_WITH":
        return "Phối hợp Code";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Focal Student Selector */}
      <InteractionHeaderControls
        focalStudentId={focalStudentId}
        onSelectFocalStudent={setFocalStudentId}
        teamMembers={teamMembers}
      />

      {/* Legend & Scoring Rule Banner */}
      <InteractionLegendBanner />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-[2.5rem]" />
        </div>
      ) : error ? (
        <Card className="rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Info size={32} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không thể tải mạng tương tác</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Vui lòng thử chọn lại một sinh viên khác làm trung tâm để xem đồ thị liên kết.
          </p>
        </Card>
      ) : (
        <>
          {/* Top 4 Summary Cards for Central Node */}
          <InteractionSummaryCards
            totalReviews={totalReviews}
            totalComments={totalComments}
            totalAssignments={totalAssignments}
            totalCollabs={totalCollabs}
          />

          {/* Main Visualizer: SVG Graph + Details Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InteractionSvgGraph
              nodes={nodes}
              edges={edges}
              centralNode={centralNode}
              peripheralNodes={peripheralNodes}
              onSelectFocalStudent={setFocalStudentId}
              getEdgeColor={getEdgeColor}
            />

            <InteractionDetailsPanel
              nodes={nodes}
              edges={edges}
              centralNode={centralNode}
              getEdgeColor={getEdgeColor}
              getEdgeLabel={getEdgeLabel}
            />
          </div>
        </>
      )}
    </div>
  );
}
