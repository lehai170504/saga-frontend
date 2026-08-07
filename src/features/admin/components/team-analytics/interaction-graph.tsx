"use client";

import React, { useMemo } from "react";
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
import { TeamInteraction, InteractionNode } from "@/features/lecturer/types/analytics";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle } from "lucide-react";

interface InteractionGraphProps {
  data?: TeamInteraction;
  isLoading: boolean;
}

// Custom Node for better styling with Tailwind
const CustomNode = ({ data }: { data: { label: string; group?: string } }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-2xl bg-card border-2 border-primary/20 flex flex-col items-center justify-center min-w-[120px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-primary/50 border-none" />
      <div className="font-bold text-sm text-foreground text-center">{data.label}</div>
      {data.group && (
        <div className="text-[10px] uppercase font-extrabold text-muted-foreground mt-1 tracking-wider bg-muted px-2 py-0.5 rounded-full">
          {data.group}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-primary/50 border-none" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export function InteractionGraph({ data, isLoading }: InteractionGraphProps) {
  // Convert API data to React Flow format with a circular layout
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data || !data.nodes || data.nodes.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    const radius = 150;
    const centerX = 300;
    const centerY = 200;

    const nodes: Node[] = data.nodes.map((node: InteractionNode, i: number) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Handle both standard graph format and specific SAGA API format
      const rawNode = node as unknown as Record<string, string | undefined>;
      const nodeId = rawNode.studentId || node.id || `n-${i}`;
      const nodeLabel = rawNode.fullName || rawNode.name || node.label || "Unknown";
      const nodeGroup = rawNode.studentCode || node.group;

      return {
        id: String(nodeId),
        type: 'custom',
        position: { x, y },
        data: { label: nodeLabel, group: nodeGroup },
      };
    });

    const edges: Edge[] = (data.edges || []).map((edge, i) => ({
      id: `e${edge.from}-${edge.to}-${i}`,
      source: edge.from,
      target: edge.to,
      label: edge.weight > 1 ? edge.weight.toString() : undefined,
      animated: true,
      style: {
        stroke: 'hsl(var(--primary))',
        strokeWidth: Math.max(1, Math.min(edge.weight, 4)),
        opacity: 0.6
      },
      labelStyle: { fill: 'hsl(var(--foreground))', fontWeight: 700, fontSize: 12 },
      labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: 'hsl(var(--primary))',
      },
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update state when data changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    );
  }

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/20">
        <AlertCircle className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground font-medium">Chưa có dữ liệu đồ thị tương tác.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="dark:bg-zinc-950/20"
      >
        <MiniMap
          className="rounded-xl border border-border shadow-sm !bg-card"
          nodeColor="hsl(var(--primary))"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Controls className="!bg-card border-border shadow-sm rounded-xl overflow-hidden" />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
