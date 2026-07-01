"use client";

import React, { useCallback, useState, useEffect, useMemo } from 'react';
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
import { GitCommit, Network, ClipboardList, AlertTriangle, Star, ShieldAlert, Code2, PenTool, FileText, Link, ExternalLink, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- CUSTOM EDGES ---

const InfoEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
}: any) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <div className="px-3 py-1.5 bg-background border border-border shadow-sm rounded-full text-[11px] font-bold text-foreground">
              {data.label}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// --- CUSTOM NODES ---

const TraceNode = ({ data }: any) => {
  let Icon = GitCommit;
  let colorClass = "text-foreground bg-background border-border";
  let iconClass = "bg-muted text-muted-foreground";

  if (data.nodeType === 'commit') {
    Icon = GitCommit;
    colorClass = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
    iconClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  } else if (data.nodeType === 'task') {
    Icon = ClipboardList;
    colorClass = "border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900";
    iconClass = "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  } else if (data.nodeType === 'missing') {
    Icon = ShieldAlert;
    colorClass = "border-amber-200 dark:border-amber-900 bg-white dark:bg-zinc-900";
    iconClass = "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
  } else if (data.nodeType === 'penalty') {
    Icon = AlertTriangle;
    colorClass = "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10";
    iconClass = "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  } else if (data.nodeType === 'score') {
    Icon = Star;
    colorClass = "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-900/10";
    iconClass = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
  } else if (data.nodeType === 'multiplier') {
    Icon = data.iconType === 'code' ? Code2 : data.iconType === 'design' ? PenTool : FileText;
    colorClass = "border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-900";
    iconClass = "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400";
  } else if (data.nodeType === 'proof') {
    Icon = Link;
    colorClass = "border-fuchsia-200 dark:border-fuchsia-900 bg-white dark:bg-zinc-900";
    iconClass = "bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400";
  } else if (data.nodeType === 'peerReview') {
    Icon = UserCheck;
    colorClass = "border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-900/10";
    iconClass = "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
  }

  return (
    <div
      className={`min-w-[200px] px-4 py-3 shadow-lg rounded-2xl border ${colorClass} flex items-center gap-3 relative ${data.link ? 'cursor-pointer hover:ring-2 ring-indigo-400/50 hover:shadow-xl hover:-translate-y-0.5 transition-all' : ''}`}
      onClick={() => {
        if (data.link) {
          window.open(data.link, '_blank');
        }
      }}
      title={data.link ? "Nhấp để mở chi tiết" : ""}
    >
      {data.targetHandle && <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-background" />}
      <div className={`p-2 rounded-xl ${iconClass}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="pr-4">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.subtitle}</div>
        <div className="text-sm font-black text-foreground">{data.title}</div>
      </div>
      {data.link && (
        <div className="absolute top-3 right-3 text-muted-foreground/50 hover:text-indigo-500 transition-colors">
          <ExternalLink size={14} strokeWidth={2.5} />
        </div>
      )}
      {data.sourceHandle && <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-background" />}
    </div>
  );
};

// --- DYNAMIC DATA GENERATOR ---

const generateStudentGraphData = (phase: string) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  if (phase === 'phase1') {
    nodes = [
      { id: 'p1', position: { x: 175, y: 50 }, data: { nodeType: 'proof', title: 'Figma Prototype', subtitle: 'External Link', sourceHandle: true, link: 'https://figma.com' }, type: 'trace' },
      { id: 't1', position: { x: 175, y: 200 }, data: { nodeType: 'task', title: 'SAGA-UI-01', subtitle: '3 Story Points', targetHandle: true, sourceHandle: true, link: 'https://jira.com' }, type: 'trace' },
      { id: 'm1', position: { x: 175, y: 350 }, data: { nodeType: 'multiplier', title: 'Hệ số Design (x1.5)', subtitle: '3 SP * 1.5 = 4.5 Base', iconType: 'design', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'sprint1', position: { x: 175, y: 500 }, data: { nodeType: 'score', title: '+4.5 Slices', subtitle: 'Tổng kết Sprint 1', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'pr', position: { x: 175, y: 650 }, data: { nodeType: 'peerReview', title: 'Peer Review (x1.0)', subtitle: '4 Stars Rating', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'score', position: { x: 175, y: 800 }, data: { nodeType: 'score', title: '+4.5 Slices', subtitle: 'Tổng kết Phase 1', targetHandle: true }, type: 'trace' },
    ];
    edges = [
      { id: 'e-p1-t1', source: 'p1', target: 't1', data: { label: 'Link Đính kèm' }, type: 'info', style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e-t1-m1', source: 't1', target: 'm1', data: { label: 'Quy đổi SP' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-m1-sprint1', source: 'm1', target: 'sprint1', data: { label: '+4.5 Base' }, type: 'info', style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-sprint1-pr', source: 'sprint1', target: 'pr', data: { label: '+4.5 Slices' }, type: 'info', style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e-pr-score', source: 'pr', target: 'score', data: { label: '4.5 * 1.0' }, type: 'info', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    ];
  } else if (phase === 'phase2') {
    nodes = [
      { id: 'c1', position: { x: 50, y: 50 }, data: { nodeType: 'commit', title: 'feat: auth api', subtitle: 'Commit: fb2a19', sourceHandle: true, link: 'https://github.com' }, type: 'trace' },
      { id: 'c2', position: { x: 250, y: 50 }, data: { nodeType: 'commit', title: 'fix: jwt expiry', subtitle: 'Commit: 9c8d11', sourceHandle: true, link: 'https://github.com' }, type: 'trace' },
      { id: 'p1', position: { x: 450, y: 50 }, data: { nodeType: 'proof', title: 'Figma Screens', subtitle: 'External Link', sourceHandle: true, link: 'https://figma.com' }, type: 'trace' },
      { id: 'c-ghost', position: { x: 700, y: 50 }, data: { nodeType: 'commit', title: 'wip: payment', subtitle: 'Commit: late_1', sourceHandle: true, link: 'https://github.com' }, type: 'trace' },

      { id: 't1', position: { x: 150, y: 200 }, data: { nodeType: 'task', title: 'SAGA-API-01', subtitle: '5 Story Points', targetHandle: true, sourceHandle: true, link: 'https://jira.com' }, type: 'trace' },
      { id: 't2', position: { x: 450, y: 200 }, data: { nodeType: 'task', title: 'SAGA-UI-05', subtitle: '2 Story Points', targetHandle: true, sourceHandle: true, link: 'https://jira.com' }, type: 'trace' },
      { id: 't-miss', position: { x: 700, y: 200 }, data: { nodeType: 'missing', title: 'Thiếu mã Jira', subtitle: 'AI Cảnh báo', targetHandle: true, sourceHandle: true }, type: 'trace' },

      { id: 'm1', position: { x: 150, y: 350 }, data: { nodeType: 'multiplier', title: 'Hệ số Code (x2.0)', subtitle: '5 SP * 2.0 = 10 Base', iconType: 'code', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'm2', position: { x: 450, y: 350 }, data: { nodeType: 'multiplier', title: 'Hệ số Design (x1.5)', subtitle: '2 SP * 1.5 = 3.0 Base', iconType: 'design', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'penalty', position: { x: 700, y: 350 }, data: { nodeType: 'penalty', title: 'Trừ Slices', subtitle: 'Phạt -2.0 Base', targetHandle: true, sourceHandle: true }, type: 'trace' },

      { id: 'sprint1', position: { x: 300, y: 500 }, data: { nodeType: 'score', title: '+13.0 Slices', subtitle: 'Tổng kết Sprint 1', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'sprint2', position: { x: 700, y: 500 }, data: { nodeType: 'score', title: '-2.0 Slices', subtitle: 'Tổng kết Sprint 2 (Phạt)', targetHandle: true, sourceHandle: true }, type: 'trace' },

      { id: 'pr', position: { x: 500, y: 650 }, data: { nodeType: 'peerReview', title: 'Peer Review (x1.1)', subtitle: '5 Stars Rating', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'score', position: { x: 500, y: 800 }, data: { nodeType: 'score', title: '+12.1 Slices', subtitle: 'Tổng kết Phase 2', targetHandle: true }, type: 'trace' },
    ];
    edges = [
      { id: 'e-c1-t1', source: 'c1', target: 't1', data: { label: 'Smart Commit' }, type: 'info', style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e-c2-t1', source: 'c2', target: 't1', data: { label: 'Smart Commit' }, type: 'info', style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e-p1-t2', source: 'p1', target: 't2', data: { label: 'Link Đính kèm' }, type: 'info', style: { stroke: '#d946ef', strokeWidth: 2 } },
      { id: 'e-cg-miss', source: 'c-ghost', target: 't-miss', data: { label: 'Không Link Task' }, type: 'info', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' } },

      { id: 'e-t1-m1', source: 't1', target: 'm1', data: { label: 'Quy đổi SP' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-t2-m2', source: 't2', target: 'm2', data: { label: 'Quy đổi SP' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-miss-pen', source: 't-miss', target: 'penalty', data: { label: 'Xác thực vi phạm' }, type: 'info', style: { stroke: '#ef4444', strokeWidth: 2 } },

      { id: 'e-m1-sprint1', source: 'm1', target: 'sprint1', data: { label: '+10 Base' }, type: 'info', style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-m2-sprint1', source: 'm2', target: 'sprint1', data: { label: '+3.0 Base' }, type: 'info', style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-pen-sprint2', source: 'penalty', target: 'sprint2', data: { label: '-2.0 Base' }, type: 'info', style: { stroke: '#ef4444', strokeWidth: 2 } },

      { id: 'e-sprint1-pr', source: 'sprint1', target: 'pr', data: { label: '+13.0 Slices' }, type: 'info', style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e-sprint2-pr', source: 'sprint2', target: 'pr', data: { label: '-2.0 Slices' }, type: 'info', style: { stroke: '#ef4444', strokeWidth: 2 } },

      { id: 'e-pr-score', source: 'pr', target: 'score', data: { label: '11.0 * 1.1' }, type: 'info', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    ];
  } else if (phase === 'phase3') {
    nodes = [
      { id: 'p1', position: { x: 175, y: 50 }, data: { nodeType: 'proof', title: 'API Docs', subtitle: 'Google Docs', sourceHandle: true, link: 'https://docs.google.com' }, type: 'trace' },
      { id: 't1', position: { x: 175, y: 200 }, data: { nodeType: 'task', title: 'SAGA-DOC-01', subtitle: '2 Story Points', targetHandle: true, sourceHandle: true, link: 'https://jira.com' }, type: 'trace' },
      { id: 'm1', position: { x: 175, y: 350 }, data: { nodeType: 'multiplier', title: 'Hệ số Docs (x1.0)', subtitle: '2 SP * 1.0 = 2 Base', iconType: 'docs', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'sprint1', position: { x: 175, y: 500 }, data: { nodeType: 'score', title: '+2.0 Slices', subtitle: 'Tổng kết Sprint 1', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'pr', position: { x: 175, y: 650 }, data: { nodeType: 'peerReview', title: 'Peer Review (x1.0)', subtitle: '3 Stars Rating', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'score', position: { x: 175, y: 800 }, data: { nodeType: 'score', title: '+2.0 Slices', subtitle: 'Tổng kết Phase 3', targetHandle: true }, type: 'trace' },
    ];
    edges = [
      { id: 'e-p1-t1', source: 'p1', target: 't1', data: { label: 'Link Đính kèm' }, type: 'info', style: { stroke: '#d946ef', strokeWidth: 2 } },
      { id: 'e-t1-m1', source: 't1', target: 'm1', data: { label: 'Quy đổi SP' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-m1-sprint1', source: 'm1', target: 'sprint1', data: { label: '+2.0 Base' }, type: 'info', style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-sprint1-pr', source: 'sprint1', target: 'pr', data: { label: '+2.0 Slices' }, type: 'info', style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e-pr-score', source: 'pr', target: 'score', data: { label: '2.0 * 1.0' }, type: 'info', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    ];
  } else {
    // Final
    nodes = [
      { id: 's1', position: { x: 50, y: 150 }, data: { nodeType: 'score', title: '+4.5 Slices', subtitle: 'Phase 1', sourceHandle: true }, type: 'trace' },
      { id: 's2', position: { x: 300, y: 150 }, data: { nodeType: 'score', title: '+12.1 Slices', subtitle: 'Phase 2', sourceHandle: true }, type: 'trace' },
      { id: 's3', position: { x: 550, y: 150 }, data: { nodeType: 'score', title: '+2.0 Slices', subtitle: 'Phase 3', sourceHandle: true }, type: 'trace' },
      { id: 'pr_final', position: { x: 300, y: 350 }, data: { nodeType: 'peerReview', title: 'Global Review (x1.15)', subtitle: 'Thái độ cả kỳ', targetHandle: true, sourceHandle: true }, type: 'trace' },
      { id: 'final', position: { x: 300, y: 500 }, data: { nodeType: 'score', title: '21.39 Slices', subtitle: 'Cổ phần Cuối kì', targetHandle: true }, type: 'trace' },
    ];
    edges = [
      { id: 'e-s1-pr', source: 's1', target: 'pr_final', data: { label: 'Tổng hợp' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-s2-pr', source: 's2', target: 'pr_final', data: { label: 'Tổng hợp' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-s3-pr', source: 's3', target: 'pr_final', data: { label: 'Tổng hợp' }, type: 'info', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e-pr-final', source: 'pr_final', target: 'final', data: { label: '18.6 * 1.15' }, type: 'info', animated: true, style: { stroke: '#3b82f6', strokeWidth: 4 } },
    ];
  }

  return { nodes, edges };
};

export function StudentScoreTraceGraph() {
  const nodeTypes = useMemo(() => ({ trace: TraceNode }), []);
  const edgeTypes = useMemo(() => ({ info: InfoEdge }), []);

  const [selectedPhase, setSelectedPhase] = useState("phase2"); // Default to Phase 2 for demo
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateStudentGraphData(selectedPhase);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [selectedPhase, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <Card className="rounded-[2rem] shadow-sm border-border bg-card/40 backdrop-blur-xl mt-8">
      <CardHeader className="pb-4 shrink-0 border-b border-border/50 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Luồng truy vết điểm cá nhân (Knowledge Graph)
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-1">
            Đồ thị giải thích lý do tại sao bạn được cộng điểm hoặc bị phạt dựa trên liên kết dữ liệu giữa GitHub và Jira theo từng Phase.
          </CardDescription>
        </div>
        <div className="shrink-0">
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl font-bold border-border bg-background shadow-sm hover:bg-accent transition-colors">
              <SelectValue placeholder="Chọn Phase" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="phase1" className="font-medium">Phase 1 (Design)</SelectItem>
              <SelectItem value="phase2" className="font-medium">Phase 2 (Coding)</SelectItem>
              <SelectItem value="phase3" className="font-medium">Phase 3 (Testing & Docs)</SelectItem>
              <SelectItem value="final" className="font-bold text-indigo-600">Final Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[750px] w-full rounded-2xl border border-border bg-background/50 overflow-hidden relative">
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
          >
            <Controls />
            <MiniMap
              nodeStrokeColor={(n) => {
                if (n.data.nodeType === 'score') return '#10b981';
                if (n.data.nodeType === 'penalty' || n.data.nodeType === 'missing') return '#ef4444';
                return '#3b82f6';
              }}
              nodeColor={(n) => {
                if (n.data.nodeType === 'score') return '#ecfdf5';
                if (n.data.nodeType === 'penalty' || n.data.nodeType === 'missing') return '#fef2f2';
                return '#eff6ff';
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
