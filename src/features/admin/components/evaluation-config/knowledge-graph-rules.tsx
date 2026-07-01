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
  { id: 'theory-pie', position: { x: 100, y: 50 }, data: { label: 'Slicing Pie', subtitle: 'Fair Market Value', icon: PieChart, colorClass: 'border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-900', iconClass: 'bg-indigo-50 text-indigo-600' }, type: 'ruleNode' },
  { id: 'theory-agile', position: { x: 400, y: 50 }, data: { label: 'Agile/Scrum', subtitle: 'Story Points & Risk', icon: Target, colorClass: 'border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900', iconClass: 'bg-blue-50 text-blue-600' }, type: 'ruleNode' },
  { id: 'theory-pow', position: { x: 700, y: 50 }, data: { label: 'Proof of Work', subtitle: 'Xác thực Bằng chứng', icon: ShieldCheck, colorClass: 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900', iconClass: 'bg-emerald-50 text-emerald-600' }, type: 'ruleNode' },

  // Level 1: Multipliers & Inputs
  { id: 'rule-multi', position: { x: 100, y: 200 }, data: { label: 'Hệ số Công việc', subtitle: 'Code(x2.0), Design(x1.5), Docs(x1.0)', icon: Code2, colorClass: 'border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-900', iconClass: 'bg-indigo-50 text-indigo-600' }, type: 'ruleNode' },
  { id: 'rule-bonus', position: { x: 400, y: 200 }, data: { label: 'Bonus Tương tác', subtitle: 'Thảo luận / Review PR', icon: Users, colorClass: 'border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-900', iconClass: 'bg-blue-50 text-blue-600' }, type: 'ruleNode' },
  { id: 'rule-pow', position: { x: 700, y: 200 }, data: { label: 'Git Commit / Links', subtitle: 'Chống Ghosting', icon: GitCommit, colorClass: 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900', iconClass: 'bg-emerald-50 text-emerald-600' }, type: 'ruleNode' },

  // Level 2: Sprints & Early Warning
  { id: 'app-sprint', position: { x: 250, y: 350 }, data: { label: 'Slices Sprint', subtitle: '(SP x Hệ số) + Bonus', icon: Scale, colorClass: 'border-fuchsia-200 dark:border-fuchsia-900 bg-white dark:bg-zinc-900', iconClass: 'bg-fuchsia-50 text-fuchsia-600' }, type: 'ruleNode' },
  { id: 'app-warn', position: { x: 700, y: 350 }, data: { label: 'Cảnh báo sớm AI', subtitle: 'Ghost 5 ngày, Bus Factor >60%', icon: AlertTriangle, colorClass: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/10', iconClass: 'bg-amber-100 text-amber-600' }, type: 'ruleNode' },

  // Level 3: Phase & Peer Review
  { id: 'rule-pr', position: { x: 100, y: 500 }, data: { label: 'Đánh giá chéo Mù', subtitle: 'x1.1 (5 sao) / x0.5 (1 sao PIP)', icon: Users, colorClass: 'border-orange-200 dark:border-orange-900 bg-white dark:bg-zinc-900', iconClass: 'bg-orange-50 text-orange-600' }, type: 'ruleNode' },
  { id: 'app-phase', position: { x: 400, y: 500 }, data: { label: 'Slices Phase', subtitle: 'Sprint Slices x Peer Review', icon: Target, colorClass: 'border-fuchsia-200 dark:border-fuchsia-900 bg-white dark:bg-zinc-900', iconClass: 'bg-fuchsia-50 text-fuchsia-600' }, type: 'ruleNode' },
  { id: 'app-penalty', position: { x: 700, y: 500 }, data: { label: 'Phạt Slices', subtitle: 'Ghosting / Nợ kỹ thuật >30%', icon: AlertTriangle, colorClass: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10', iconClass: 'bg-red-100 text-red-600' }, type: 'ruleNode' },

  // Level 4: Final Output
  { id: 'out-final', position: { x: 400, y: 650 }, data: { label: 'Slices Cuối kỳ', subtitle: 'Tổng Phase x Global Review', icon: PieChart, colorClass: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-xl', iconClass: 'bg-indigo-100 text-indigo-600' }, type: 'ruleNode' },
];

const initialEdges: Edge[] = [
  // Top level mapping
  { id: 'e1', source: 'theory-pie', target: 'rule-multi', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e2', source: 'theory-agile', target: 'rule-multi', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e3', source: 'theory-agile', target: 'rule-bonus', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e4', source: 'theory-pow', target: 'rule-pow', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },

  // To Sprint
  { id: 'e5', source: 'rule-multi', target: 'app-sprint', type: 'smoothstep', style: { stroke: '#d946ef', strokeWidth: 2 } },
  { id: 'e6', source: 'rule-bonus', target: 'app-sprint', type: 'smoothstep', style: { stroke: '#d946ef', strokeWidth: 2 } },

  // To Warn & Penalty
  { id: 'e7', source: 'rule-pow', target: 'app-warn', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e8', source: 'app-warn', target: 'app-penalty', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2 } },

  // To Phase
  { id: 'e9', source: 'app-sprint', target: 'app-phase', type: 'smoothstep', style: { stroke: '#d946ef', strokeWidth: 2 } },
  { id: 'e10', source: 'rule-pr', target: 'app-phase', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },

  // Penalty reduces Phase Slices
  { id: 'e11', source: 'app-penalty', target: 'app-phase', type: 'smoothstep', animated: true, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }, label: 'Trừ Slices' },

  // To Final
  { id: 'e12', source: 'app-phase', target: 'out-final', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
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
