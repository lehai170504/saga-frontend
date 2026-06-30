"use client";

import React, { useCallback } from 'react';
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
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handle, Position, MarkerType } from '@xyflow/react';
import { PieChart, ShieldCheck, GitCommit, Link, Users, Code2, AlertTriangle, Scale, Target } from "lucide-react";

// --- CUSTOM NODE ---
const RuleNode = ({ data }: any) => {
  const Icon = data.icon || Target;
  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl border ${data.colorClass || 'border-border bg-card'} flex items-center gap-3 min-w-[220px]`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
      <div className={`p-2 rounded-lg ${data.iconClass || 'bg-muted text-muted-foreground'}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.subtitle}</div>
        <div className="text-sm font-black text-foreground">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 opacity-0" />
    </div>
  );
};

const nodeTypes = {
  ruleNode: RuleNode,
};

// initial nodes and edges mapping from theories to score rules
const initialNodes: Node[] = [
  // Root Concepts
  { id: 'theory-pie', position: { x: 250, y: 50 }, data: { label: 'Slicing Pie', subtitle: 'Lý thuyết Cốt lõi', icon: PieChart, colorClass: 'border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-900', iconClass: 'bg-indigo-50 text-indigo-600' }, type: 'ruleNode' },
  { id: 'theory-pow', position: { x: 650, y: 50 }, data: { label: 'Bằng chứng (PoW)', subtitle: 'Xác thực Công việc', icon: ShieldCheck, colorClass: 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900', iconClass: 'bg-emerald-50 text-emerald-600' }, type: 'ruleNode' },

  // Level 1: Mapping
  { id: 'rule-multi', position: { x: 50, y: 200 }, data: { label: 'Hệ số Vai trò', subtitle: 'Code, Design, Docs', icon: Code2, colorClass: 'border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900', iconClass: 'bg-blue-50 text-blue-600' }, type: 'ruleNode' },
  { id: 'rule-pr', position: { x: 320, y: 200 }, data: { label: 'Đánh giá chéo', subtitle: 'Từng Phase & Final', icon: Users, colorClass: 'border-orange-200 dark:border-orange-900 bg-white dark:bg-zinc-900', iconClass: 'bg-orange-50 text-orange-600' }, type: 'ruleNode' },

  { id: 'rule-commit', position: { x: 650, y: 200 }, data: { label: 'Smart Commit', subtitle: 'Dành cho Code', icon: GitCommit, colorClass: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900', iconClass: 'bg-slate-100 text-slate-600' }, type: 'ruleNode' },
  { id: 'rule-link', position: { x: 920, y: 200 }, data: { label: 'External Link', subtitle: 'Dành cho Design/Docs', icon: Link, colorClass: 'border-fuchsia-200 dark:border-fuchsia-900 bg-white dark:bg-zinc-900', iconClass: 'bg-fuchsia-50 text-fuchsia-600' }, type: 'ruleNode' },

  // Level 2: Real-world Application
  { id: 'app-multi', position: { x: 185, y: 350 }, data: { label: 'Cộng dồn Đa nhiệm', subtitle: 'Sinh viên gánh team', icon: Scale, colorClass: 'border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900', iconClass: 'bg-blue-50 text-blue-600' }, type: 'ruleNode' },
  { id: 'app-verify', position: { x: 785, y: 350 }, data: { label: 'Phạt Ghosting', subtitle: 'AI Cảnh báo Ảo', icon: AlertTriangle, colorClass: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10', iconClass: 'bg-red-100 text-red-600' }, type: 'ruleNode' },

  // Level 3: Output Rules
  { id: 'out-fair', position: { x: 485, y: 500 }, data: { label: 'Sổ cái Cân bằng', subtitle: 'Đầu ra Hệ thống', icon: PieChart, colorClass: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-xl', iconClass: 'bg-indigo-100 text-indigo-600' }, type: 'ruleNode' },
];

const initialEdges: Edge[] = [
  // Slicing Pie branch
  { id: 'e1', source: 'theory-pie', target: 'rule-multi', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e2', source: 'theory-pie', target: 'rule-pr', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e3', source: 'rule-multi', target: 'app-multi', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e4', source: 'rule-pr', target: 'app-multi', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e5', source: 'app-multi', target: 'out-fair', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },

  // PoW Branch
  { id: 'e7', source: 'theory-pow', target: 'rule-commit', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e8', source: 'theory-pow', target: 'rule-link', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e9', source: 'rule-commit', target: 'app-verify', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e10', source: 'rule-link', target: 'app-verify', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e11', source: 'app-verify', target: 'out-fair', type: 'smoothstep', animated: true, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }, label: 'Trừ Slices' },
];

export function KnowledgeGraphRules() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <Card className="border-border/50 shadow-sm glassmorphism overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Đồ thị Liên kết Lý thuyết & Hệ số</CardTitle>
        <CardDescription>
          Mô hình hóa quan hệ (Knowledge Graph) ánh xạ trực tiếp từ các Lý thuyết nền tảng sang quy tắc tính điểm, giúp giải thích trực quan các ngưỡng Hệ số trong dự án.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: '600px', width: '100%' }} className="rounded-xl border border-border bg-background/50 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
