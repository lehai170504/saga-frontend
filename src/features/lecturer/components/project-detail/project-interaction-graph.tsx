import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useStudentInteractions, useTeamMembers } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ReactFlow,
  MiniMap,
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

const CustomNode = ({ data }: { data: { isSelected: boolean, label: string, role?: string, id: string, interactions: number } }) => {
  return (
    <div className={`p-3 shadow-lg rounded-2xl flex flex-col items-center justify-center min-w-[100px] bg-card border-2 transition-all ${data.isSelected ? 'border-primary scale-110 shadow-primary/20 ring-4 ring-primary/20' : 'border-border/50 hover:border-primary/50 hover:scale-105'}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-primary/50 border-none" />
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-2 text-lg">
        {data.label.charAt(0)}
      </div>
      <div className="font-bold text-xs text-foreground text-center line-clamp-1">{data.label}</div>
      <div className="text-[9px] uppercase font-extrabold text-muted-foreground mt-1 tracking-wider bg-muted px-2 py-0.5 rounded-full">
        {data.role || "Member"}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-primary/50 border-none" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export function ProjectInteractionGraph({ courseId, teamId }: { courseId: string; teamId: string }) {
  const { data: members, isLoading: isLoadingMembers } = useTeamMembers(courseId, teamId);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const activeStudentId = selectedStudentId || (members?.content?.[0]?.studentId ?? "");

  const { data: interactionData, isLoading: isLoadingGraph } = useStudentInteractions(
    courseId,
    teamId,
    activeStudentId
  );

  const isLoading = isLoadingMembers || isLoadingGraph;

  const [selectedNode, setSelectedNode] = useState<{ id: string, name: string, role: string, interactions: number } | null>(null);

  const activeSelectedNode = useMemo(() => {
    if (selectedNode) return selectedNode;
    if (interactionData?.nodes && interactionData.nodes.length > 0) {
      const n = interactionData.nodes[0];
      return { id: n.studentId, name: n.fullName || n.studentCode || "Unknown", role: n.studentCode, interactions: n.degree || 0 };
    }
    return null;
  }, [selectedNode, interactionData]);

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!interactionData?.nodes) return { initialNodes: [], initialEdges: [] };

    const radius = 180;
    const centerX = 250;
    const centerY = 200;

    const nodes: Node[] = interactionData.nodes.map((n, i) => {
      const angle = (i / interactionData.nodes.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const interactions = n.degree || 0;

      return {
        id: n.studentId,
        type: 'custom',
        position: { x, y },
        data: {
          id: n.studentId,
          label: n.fullName || n.studentCode || "Unknown",
          role: n.studentCode || "Member",
          interactions,
          isSelected: activeSelectedNode?.id === n.studentId
        }
      };
    });

    const edges: Edge[] = (interactionData.edges || []).map((edge, i) => {
      let strokeDasharray = undefined;
      let stroke = "var(--primary)";

      if (edge.sourceType === "REVIEWED") { stroke = "var(--success)"; }
      if (edge.sourceType === "COMMENTED_ON") { strokeDasharray = "4 4"; }
      if (edge.sourceType === "ASSIGNED_TO") { stroke = "var(--destructive)"; }

      return {
        id: `e${edge.fromStudentId}-${edge.toStudentId}-${i}`,
        source: edge.fromStudentId,
        target: edge.toStudentId,
        animated: edge.sourceType === "ASSIGNED_TO" || edge.sourceType === "REVIEWED",
        style: {
          stroke: stroke,
          strokeWidth: Math.max(1.5, Math.min(edge.sourceCount || 1, 4)),
          strokeDasharray: strokeDasharray,
          opacity: edge.sourceType === "ASSIGNED_TO" ? 1 : 0.6
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: stroke,
        },
      };
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [interactionData, activeSelectedNode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode({
      id: node.data.id as string,
      name: node.data.label as string,
      role: node.data.role as string,
      interactions: node.data.interactions as number,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
            <Share2 size={14} className="text-primary" />
            SAGA Early Warning System
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Mạng tương tác & NLP
          </h2>
          <p className="text-muted-foreground font-medium">Bản đồ đồ thị phân tích văn hóa làm việc nhóm, cảnh báo xung đột (Toxic) và hỗ trợ chéo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Filters */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chọn Sinh Viên (Trung tâm)</h3>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={!members || isLoadingMembers}>
                <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11">
                  <SelectValue placeholder="Chọn sinh viên..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {members?.content?.map((m: { studentId: string; fullName: string; studentCode: string }) => (
                    <SelectItem key={m.studentId} value={m.studentId} className="rounded-lg my-1 cursor-pointer">
                      {m.fullName} ({m.studentCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chú giải mạng lưới</h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/50">
                  <div className="w-4 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  <span>Phối hợp (Commits/Tasks)</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/50">
                  <div className="w-4 h-1.5 bg-success rounded-full shadow-[0_0_8px_rgba(var(--success),0.5)]" />
                  <span>Review Code</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/50">
                  <div className="w-4 h-1.5 border-b-[3px] border-dotted border-primary shadow-[0_0_8px_rgba(var(--primary),0.2)]" />
                  <span>Bình luận (Comments)</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/50">
                  <div className="w-4 h-1.5 bg-destructive rounded-full shadow-[0_0_8px_rgba(var(--destructive),0.5)]" />
                  <span>Giao việc (Assignment)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Panel: React Flow Visualization */}
        <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden relative min-h-[500px]">
          <CardContent className="p-0 h-full w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
                <Skeleton className="w-64 h-64 rounded-full" />
              </div>
            ) : initialNodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground font-medium">Chưa có dữ liệu mạng lưới tương tác</p>
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
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
                className="dark:bg-zinc-950/20"
              >
                <MiniMap
                  className="rounded-xl border border-border shadow-sm !bg-card"
                  style={{ width: 50, height: 50 }}
                  nodeColor="var(--primary)"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Controls className="!bg-card border-border shadow-sm rounded-xl overflow-hidden" />
                <Background gap={16} size={1} />
              </ReactFlow>
            )}
          </CardContent>
        </Card>

        {/* Right Panel: Node Details */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6">
            {activeSelectedNode ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/30 mb-4`}>
                    {activeSelectedNode.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{activeSelectedNode.name}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{activeSelectedNode.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-xl p-3 text-center border border-border/50 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tương tác</p>
                    <p className="text-2xl font-black text-primary">{activeSelectedNode.interactions}</p>
                  </div>
                  <div className="bg-background rounded-xl p-3 text-center border border-border/50 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Mức độ</p>
                    <p className="text-lg font-bold text-success mt-1">Năng nổ</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Phân tích Chi tiết (AI)</h3>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                    {interactionData?.edges?.filter((e) => e.fromStudentId === activeSelectedNode?.id || e.toStudentId === activeSelectedNode?.id).map((edge, idx) => {
                      const isSource = edge.fromStudentId === activeSelectedNode?.id;
                      const otherNode = interactionData?.nodes?.find((n) => n.studentId === (isSource ? edge.toStudentId : edge.fromStudentId));

                      const getActionText = () => {
                        if (edge.sourceType === "ASSIGNED_TO") return isSource ? "Giao task cho" : "Được giao task bởi";
                        if (edge.sourceType === "REVIEWED") return isSource ? "Review code của" : "Được review bởi";
                        if (edge.sourceType === "COMMENTED_ON") return isSource ? "Bình luận bài của" : "Được bình luận bởi";
                        return isSource ? "Phối hợp với" : "Được phối hợp bởi";
                      };

                      const getBadgeColor = () => {
                        if (edge.sourceType === "ASSIGNED_TO") return "bg-destructive/10 text-destructive border-destructive/20";
                        if (edge.sourceType === "REVIEWED") return "bg-success/10 text-success border-success/20";
                        if (edge.sourceType === "COMMENTED_ON") return "bg-primary/10 text-primary border-primary/20";
                        return "bg-primary/10 text-primary border-primary/20";
                      };

                      return (
                        <div key={idx} className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors">
                          <span className="font-medium text-foreground text-xs">{getActionText()} <span className="font-bold text-primary">{otherNode?.fullName?.split(' ').pop()}</span></span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold uppercase tracking-wider ${getBadgeColor()}`}>
                            {edge.sourceType}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button asChild className="w-full rounded-xl font-bold h-11 hover-lift shadow-md">
                  <Link href={`/lecturer/${courseId}/students/${activeSelectedNode.id}`}>
                    Xem Profile Chi Tiết
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Users size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-center">Chọn một thành viên<br />để xem chi tiết</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
