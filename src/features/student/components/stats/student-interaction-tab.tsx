"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/shared/Skeleton";
import { useStudentInteractions } from "@/features/projects/hooks/useProjectDashboardStats";

interface StudentInteractionTabProps {
  courseId: string;
  teamId: string;
  currentStudentId?: string;
  teamMembers?: { studentId: string; fullName: string; studentCode: string; roleInTeam?: string }[];
}

// Custom Node for React Flow with Tailwind glassmorphism styling
const CustomStudentNode = ({
  data,
  selected,
}: {
  data: { label: string; fullName: string; studentCode?: string; interactions: number; isCentral: boolean };
  selected: boolean;
}) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-2xl bg-card/95 backdrop-blur-md border-2 transition-all duration-300 min-w-[130px] flex flex-col items-center justify-center cursor-pointer ${
        selected
          ? "border-primary ring-4 ring-primary/30 scale-105 shadow-primary/20 z-30"
          : data.isCentral
          ? "border-primary/80 bg-primary/10 shadow-primary/10"
          : "border-border/60 hover:border-primary/50"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-0 h-0 border-none bg-transparent opacity-0 pointer-events-none" />
      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-black text-sm flex items-center justify-center mb-1.5 shadow-sm">
        {data.fullName.charAt(0)}
      </div>
      <div className="font-extrabold text-xs text-foreground text-center truncate max-w-[120px]">
        {data.fullName}
      </div>
      {data.studentCode && (
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 px-2 py-0.5 rounded-full mt-1">
          {data.studentCode}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-0 h-0 border-none bg-transparent opacity-0 pointer-events-none" />
    </div>
  );
};

const nodeTypes = {
  customStudent: CustomStudentNode,
};

export function StudentInteractionTab({
  courseId,
  teamId,
  currentStudentId,
  teamMembers = [],
}: StudentInteractionTabProps) {

  const defaultStudentId = currentStudentId || teamMembers[0]?.studentId || "";
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);

  const activeStudentId = selectedStudentId || defaultStudentId;

  const { data: interactionData, isLoading, error } = useStudentInteractions(
    courseId,
    teamId,
    activeStudentId
  );

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!interactionData?.nodes || interactionData.nodes.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    const radius = 170;
    const centerX = 320;
    const centerY = 240;
    const total = interactionData.nodes.length;

    const nodes: Node[] = interactionData.nodes.map((n, i) => {
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: String(n.studentId),
        type: "customStudent",
        position: { x, y },
        data: {
          label: n.fullName || n.studentCode || "Unknown",
          fullName: n.fullName || n.studentCode || "Unknown",
          studentCode: n.studentCode,
          interactions: n.degree || 0,
          isCentral: n.studentId === activeStudentId,
        },
      };
    });

    const edges: Edge[] = (interactionData.edges || []).map((edge, i) => {
      let strokeColor = "#3b82f6";
      let strokeDasharray = "";

      if (edge.sourceType === "REVIEWED") strokeColor = "#10b981";
      if (edge.sourceType === "COMMENTED_ON") {
        strokeColor = "#f59e0b";
        strokeDasharray = "5 5";
      }
      if (edge.sourceType === "ASSIGNED_TO") strokeColor = "#f43f5e";

      return {
        id: `edge-${edge.fromStudentId}-${edge.toStudentId}-${i}`,
        source: String(edge.fromStudentId),
        target: String(edge.toStudentId),
        label: edge.sourceCount > 1 ? `${edge.sourceCount}` : undefined,
        animated: edge.sourceType === "ASSIGNED_TO" || edge.sourceType === "REVIEWED",
        style: {
          stroke: strokeColor,
          strokeWidth: Math.max(1.5, Math.min(edge.sourceCount, 4)),
          strokeDasharray,
          opacity: 0.85,
        },
        labelStyle: { fill: "#ffffff", fontWeight: 800, fontSize: 11 },
        labelBgStyle: { fill: strokeColor, fillOpacity: 0.95, rx: 6, ry: 6 },
        labelBgPadding: [6, 4] as [number, number],
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: strokeColor,
        },
      };
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [interactionData, activeStudentId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeSelectedNode = useMemo(() => {
    const targetId = selectedNodeId || activeStudentId;
    const rawNode = interactionData?.nodes?.find((n) => n.studentId === targetId) || interactionData?.nodes?.[0];
    if (!rawNode) return null;
    return {
      id: rawNode.studentId,
      name: rawNode.fullName || rawNode.studentCode || "Unknown",
      role: rawNode.studentCode || "Member",
      interactions: rawNode.degree || 0,
    };
  }, [selectedNodeId, activeStudentId, interactionData?.nodes]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Mạng tương tác & NLP
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            Bản đồ đồ thị tương tác sinh động phân tích văn hóa làm việc nhóm, cảnh báo xung đột và kết nối hỗ trợ chéo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Filters & Legend */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Chọn Sinh Viên (Trung tâm)
              </h3>
              <Select
                value={activeStudentId}
                onValueChange={(val) => {
                  setSelectedStudentId(val);
                  setSelectedNodeId(val);
                }}
              >
                <SelectTrigger className="w-full bg-background/60 border-border/60 rounded-xl h-11 text-xs font-bold">
                  <SelectValue placeholder="Chọn sinh viên..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((m) => (
                      <SelectItem key={m.studentId} value={m.studentId} className="rounded-lg text-xs font-semibold py-2">
                        {m.fullName} ({m.studentCode})
                      </SelectItem>
                    ))
                  ) : (
                    interactionData?.nodes?.map((n) => (
                      <SelectItem key={n.studentId} value={n.studentId} className="rounded-lg text-xs font-semibold py-2">
                        {n.fullName} ({n.studentCode})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Chú giải mạng lưới
              </h3>
              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/40">
                  <div className="w-4 h-1 bg-primary rounded-full" />
                  <span>Phối hợp (Commits/Tasks)</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/40">
                  <div className="w-4 h-1 bg-emerald-500 rounded-full" />
                  <span>Review Code</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/40">
                  <div className="w-4 h-1 border-b-[3px] border-dotted border-amber-500" />
                  <span>Bình luận (Comments)</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/40">
                  <div className="w-4 h-1 bg-rose-500 rounded-full" />
                  <span>Giao việc (Assignment)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Panel: ReactFlow Canvas */}
        <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden min-h-[520px]">
          <CardContent className="p-0 h-[520px] w-full relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <Skeleton className="w-full h-full rounded-[2rem]" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-2">
                <AlertTriangle size={32} className="text-destructive opacity-80" />
                <p className="text-sm font-bold text-foreground">Không thể tải mạng tương tác</p>
                <p className="text-xs text-muted-foreground">Vui lòng thử chọn lại một sinh viên khác.</p>
              </div>
            ) : nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-semibold">
                Chưa có dữ liệu mạng lưới tương tác
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                className="dark:bg-zinc-950/20"
              >
                <Controls className="!bg-card/90 border border-border/50 shadow-md rounded-xl overflow-hidden" />
                <Background gap={20} size={1} color="rgba(255, 255, 255, 0.08)" />
              </ReactFlow>
            )}
          </CardContent>
        </Card>

        {/* Right Panel: Selected Node Details */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6">
            {activeSelectedNode ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20 mb-3">
                    {activeSelectedNode.name.charAt(0)}
                  </div>
                  <h2 className="text-lg font-black text-foreground">{activeSelectedNode.name}</h2>
                  <p className="text-xs text-muted-foreground font-bold">{activeSelectedNode.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-2xl p-3.5 text-center border border-border/50">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1">Tương tác</p>
                    <p className="text-2xl font-black text-primary">{activeSelectedNode.interactions}</p>
                  </div>
                  <div className="bg-muted/40 rounded-2xl p-3.5 text-center border border-border/50">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1">Mức độ</p>
                    <p className="text-base font-black text-emerald-500 mt-1">Năng nổ</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Phân tích Chi tiết (AI)
                  </h3>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {(interactionData?.edges || [])
                      .filter((e) => e.fromStudentId === activeSelectedNode?.id || e.toStudentId === activeSelectedNode?.id)
                      .map((edge, idx) => {
                        const isSource = edge.fromStudentId === activeSelectedNode?.id;
                        const otherStudentId = isSource ? edge.toStudentId : edge.fromStudentId;
                        const otherNode = interactionData?.nodes?.find((n) => n.studentId === otherStudentId);

                        const getActionText = () => {
                          if (edge.sourceType === "ASSIGNED_TO") return isSource ? "Giao công việc cho" : "Được giao công việc bởi";
                          if (edge.sourceType === "REVIEWED") return isSource ? "Review code cho" : "Được Review code bởi";
                          if (edge.sourceType === "COMMENTED_ON") return isSource ? "Bình luận trao đổi với" : "Được bình luận bởi";
                          return isSource ? "Phối hợp làm việc cùng" : "Được phối hợp bởi";
                        };

                        const getBadgeColor = () => {
                          if (edge.sourceType === "ASSIGNED_TO") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
                          if (edge.sourceType === "REVIEWED") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                          if (edge.sourceType === "COMMENTED_ON") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
                          return "bg-primary/10 text-primary border-primary/20";
                        };

                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-background/80 border border-border/60 space-y-1.5 shadow-sm hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                {getActionText()}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold uppercase tracking-wider shrink-0 ${getBadgeColor()}`}>
                                {edge.sourceType}
                              </span>
                            </div>
                            <p className="font-black text-xs text-foreground leading-snug">
                              {otherNode?.fullName || otherStudentId}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground text-center space-y-2">
                <Users size={40} className="opacity-30" />
                <p className="font-bold text-xs text-muted-foreground">Chọn một thành viên<br />để xem chi tiết kết nối</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
