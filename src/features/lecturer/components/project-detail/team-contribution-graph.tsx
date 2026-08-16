"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, Code2, PenTool, FileText, User, UserCheck, Search, BookOpen, AlertCircle } from "lucide-react";
import { TaskDrilldownDrawer } from "./task-drilldown-drawer";
import { useContributionGraph } from "@/features/projects/hooks/useContribution";
import { Skeleton } from '@/components/ui/skeleton';
import { ContributionGraphNode } from '@/features/projects/types/contribution';

// --- CUSTOM EDGES ---
interface EdgeData {
  label: string;
  clickable: boolean;
  onLabelClick?: (id: string) => void;
}

const DrilldownEdge = ({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, markerEnd,
}: { id: string; sourceX: number; sourceY: number; targetX: number; targetY: number; sourcePosition: Position; targetPosition: Position; style?: React.CSSProperties; data?: EdgeData; markerEnd?: string }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, pointerEvents: 'all' }} className="nodrag nopan">
          {data?.label && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border shadow-sm rounded-full text-[11px] font-bold text-foreground transition-all group ${data.clickable ? 'cursor-pointer hover:shadow-md hover:border-primary hover:text-primary' : ''}`}
              onClick={(e) => {
                if (data.onLabelClick) {
                  e.stopPropagation();
                  data.onLabelClick(id);
                }
              }}
            >
              {data.label}
              {data.clickable && <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// --- CUSTOM NODES ---
const CriterionNode = ({ data }: { data: { label: string; ratio: number; percent: number; criterion: string } }) => {
  const Icon = data.criterion === 'CODE' ? Code2 : data.criterion === 'TEST' ? PenTool : data.criterion === 'DOCUMENT' ? FileText : BookOpen;
  return (
    <div className={`min-w-[180px] px-4 py-3 shadow-lg rounded-2xl bg-card border border-border flex items-center gap-3`}>
      <div className="p-2 bg-primary/10 rounded-xl text-primary">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.label}</div>
        <div className="text-sm font-bold text-foreground">{Number(data.percent?.toFixed(2) || 0)}% <span className="text-xs font-normal text-muted-foreground">(x{Number(data.ratio?.toFixed(2) || 0)})</span></div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </div>
  );
};

const StudentGraphNode = ({ data }: { data: { name: string; roleLabel: string; isGhost: boolean; isCore: boolean; sliceScore: number; peerCoefficient: number; finalContributionPercentage: number } }) => {
  const { isGhost, isCore } = data;
  const Icon = isGhost ? AlertCircle : isCore ? UserCheck : User;
  const colorClass = isGhost ? "text-destructive bg-destructive/10" : isCore ? "text-success bg-success/10" : "text-muted-foreground bg-muted";

  return (
    <div className={`min-w-[240px] px-4 py-3 shadow-lg rounded-2xl bg-card border ${isGhost ? 'border-destructive/30' : isCore ? 'border-success/30' : 'border-border'} flex flex-col gap-2 relative`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-background" />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground truncate max-w-[150px]" title={data.name}>{data.name}</div>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${isGhost ? 'text-destructive' : isCore ? 'text-success' : 'text-muted-foreground'}`}>
            {data.roleLabel}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-dashed border-border space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Base Slices</span>
          <span className="text-xs font-bold text-foreground">{data.sliceScore.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Hệ số Peer (P)</span>
          <span className="text-xs font-bold text-foreground">x{data.peerCoefficient.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-border/50">
          <span className="text-[10px] font-extrabold text-primary uppercase">% Đóng góp (Final)</span>
          <span className="text-sm font-black text-primary">{data.finalContributionPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export function TeamContributionGraph({ teamId, isEnded }: { teamId: string; isEnded?: boolean }) {
  const { data: graphData, isLoading, error } = useContributionGraph(teamId);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  interface DrilldownData {
    title: string;
    tasks: { id: string; name: string; sp: number; sprint: string }[];
  }
  const [selectedEdgeData, setSelectedEdgeData] = useState<DrilldownData | null>(null);

  const nodeTypes = useMemo(() => ({ criterion: CriterionNode, student: StudentGraphNode }), []);
  const edgeTypes = useMemo(() => ({ drilldown: DrilldownEdge }), []);

  useEffect(() => {
    if (!graphData) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const drilldownDetails: Record<string, DrilldownData> = {};

    let criteriaCount = 0;

    // Filter and sort nodes to layout them nicely
    const criteriaNodes = graphData.nodes.filter(n => n.kind === 'CRITERION');
    const studentNodes = graphData.nodes.filter(n => n.kind === 'STUDENT');

    const criteriaWidth = 220;
    const startX = 50;

    // Position criteria nodes horizontally at the top
    criteriaNodes.forEach((node, i) => {
      const cNode = node as Extract<ContributionGraphNode, { kind: 'CRITERION' }>;
      newNodes.push({
        id: cNode.id,
        type: 'criterion',
        position: { x: startX + i * criteriaWidth, y: 50 },
        data: {
          label: `Tiêu chí ${cNode.criterion}`,
          criterion: cNode.criterion,
          ratio: cNode.weightRatio,
          percent: cNode.weightPercent
        }
      });
      criteriaCount++;
    });

    const studentWidth = 280;
    const studentStartX = Math.max(50, (criteriaCount * criteriaWidth) / 2 - (studentNodes.length * studentWidth) / 2);

    // Position student nodes horizontally at the bottom
    studentNodes.forEach((node, i) => {
      const sNode = node as Extract<ContributionGraphNode, { kind: 'STUDENT' }>;
      const isLeader = sNode.roleInTeam === 'LEADER';
      const isGhost = sNode.warnings?.length > 0;

      newNodes.push({
        id: sNode.id,
        type: 'student',
        position: { x: studentStartX + i * studentWidth, y: 350 },
        data: {
          name: sNode.fullName,
          roleLabel: isLeader ? 'Leader' : (isGhost ? 'Warning' : 'Thành viên'),
          isCore: isLeader,
          isGhost: isGhost,
          sliceScore: sNode.sliceScore,
          peerCoefficient: sNode.peerCoefficient,
          finalContributionPercentage: sNode.finalContributionPercentage
        }
      });
    });

    // Create edges
    graphData.edges.forEach((edge, i) => {
      const hasTasks = edge.tasks && edge.tasks.length > 0;
      const edgeId = edge.id || `e-${edge.source}-${edge.target}-${i}`;

      // We map colors based on source criterion
      const sourceNode = criteriaNodes.find(n => n.id === edge.source) as Extract<ContributionGraphNode, { kind: 'CRITERION' }> | undefined;
      const color = sourceNode?.criterion === 'CODE' ? '#3b82f6' : sourceNode?.criterion === 'TEST' ? '#f59e0b' : sourceNode?.criterion === 'DOCUMENT' ? '#10b981' : '#8b5cf6';

      drilldownDetails[edgeId] = {
        title: `Danh sách Task - ${sourceNode?.criterion}`,
        tasks: edge.tasks?.map(t => ({ id: t.externalKey, name: t.title, sp: t.storyPoints, sprint: t.sprintName })) || []
      };

      newEdges.push({
        id: edgeId,
        source: edge.source,
        target: edge.target,
        type: 'drilldown',
        data: {
          label: `${edge.storyPoints} SP (${edge.weightedSlice.toFixed(2)} Slices)`,
          clickable: hasTasks,
          onLabelClick: (id: string) => {
            if (drilldownDetails[id]?.tasks.length > 0) {
              setSelectedEdgeData(drilldownDetails[id]);
              setIsDrawerOpen(true);
            }
          }
        },
        style: { stroke: color, strokeWidth: 2, cursor: hasTasks ? 'pointer' : 'default' },
        markerEnd: { type: MarkerType.ArrowClosed, color: color }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  if (isLoading) {
    return <Skeleton className="h-[700px] w-full rounded-[2rem]" />;
  }

  if (error || !graphData) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center border border-dashed rounded-[2rem] bg-muted/30">
        <AlertCircle className="w-10 h-10 text-destructive mb-3" />
        <h3 className="text-lg font-bold text-foreground">Lỗi tải dữ liệu mạng lưới</h3>
        <p className="text-sm text-muted-foreground mt-1">Không thể tải Sơ đồ mạng lưới đóng góp từ hệ thống.</p>
      </div>
    );
  }

  return (
    <>
      <Card className="rounded-[2rem] shadow-lg border-border bg-card/40 backdrop-blur-xl mb-6 overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Sơ đồ Mạng lưới Đóng góp (Graph API)
          </CardTitle>
          <CardDescription className="font-medium mt-2 max-w-3xl text-sm leading-relaxed">
            Công thức đánh giá: <strong>{graphData.formula}</strong>.
            <br />
            <strong className="text-primary">Mẹo:</strong> Click vào các đường nối có số Story Points để xem danh sách chi tiết các Task đã được ghi nhận.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative bg-card">
          <div className="h-[700px] w-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="bottom-right"
              minZoom={0.2}
              maxZoom={1.5}
            >
              <Controls className="bg-background border-border shadow-md rounded-xl overflow-hidden" />
              <MiniMap className="bg-background border border-border shadow-md rounded-xl overflow-hidden" />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--muted-foreground)" style={{ opacity: 0.3 }} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <TaskDrilldownDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        data={selectedEdgeData as React.ComponentProps<typeof TaskDrilldownDrawer>["data"]}
        isEnded={isEnded}
      />
    </>
  );
}
