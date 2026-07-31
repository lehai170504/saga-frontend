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
        <div className="text-sm font-bold text-foreground">{data.label}</div>
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
  { id: 'theory-pie', position: { x: 100, y: 50 }, data: { label: 'Slicing Pie', subtitle: 'Fair Market Value', icon: PieChart, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'theory-agile', position: { x: 400, y: 50 }, data: { label: 'Agile/Scrum', subtitle: 'Story Points & Risk', icon: Target, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'theory-pow', position: { x: 700, y: 50 }, data: { label: 'Proof of Work', subtitle: 'Xác thực Bằng chứng', icon: ShieldCheck, colorClass: 'border-success/20 border-success/20 bg-background bg-card', iconClass: 'bg-success/10 text-success' }, type: 'ruleNode' },

  // Level 1: Multipliers & Inputs
  { id: 'rule-multi', position: { x: 100, y: 200 }, data: { label: 'Hệ số Công việc', subtitle: 'Code(x2.0), Design(x1.5), Docs(x1.0)', icon: Code2, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'rule-bonus', position: { x: 400, y: 200 }, data: { label: 'Bonus Tương tác', subtitle: 'Thảo luận / Review PR', icon: Users, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'rule-pow', position: { x: 700, y: 200 }, data: { label: 'Git Commit / Links', subtitle: 'Chống Ghosting', icon: GitCommit, colorClass: 'border-success/20 border-success/20 bg-background bg-card', iconClass: 'bg-success/10 text-success' }, type: 'ruleNode' },

  // Level 2: Sprints & Early Warning
  { id: 'app-sprint', position: { x: 250, y: 350 }, data: { label: 'Slices Sprint', subtitle: '(SP x Hệ số) + Bonus', icon: Scale, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'app-warn', position: { x: 700, y: 350 }, data: { label: 'Cảnh báo sớm AI', subtitle: 'Ghost 5 ngày, Bus Factor >60%', icon: AlertTriangle, colorClass: 'border-primary/20 border-primary/20 bg-primary/10 bg-primary/20', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },

  // Level 3: Phase & Peer Review
  { id: 'rule-pr', position: { x: 100, y: 500 }, data: { label: 'Đánh giá chéo Mù', subtitle: 'x1.1 (5 sao) / x0.5 (1 sao PIP)', icon: Users, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'app-phase', position: { x: 400, y: 500 }, data: { label: 'Slices Phase', subtitle: 'Sprint Slices x Peer Review', icon: Target, colorClass: 'border-primary/20 border-primary/20 bg-background bg-card', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
  { id: 'app-penalty', position: { x: 700, y: 500 }, data: { label: 'Phạt Slices', subtitle: 'Ghosting / Nợ kỹ thuật >30%', icon: AlertTriangle, colorClass: 'border-destructive/20 border-destructive/20 bg-destructive/10 bg-destructive/20', iconClass: 'bg-destructive/10 text-destructive' }, type: 'ruleNode' },

  // Level 4: Final Output
  { id: 'out-final', position: { x: 400, y: 650 }, data: { label: 'Slices Cuối kỳ', subtitle: 'Tổng Phase x Global Review', icon: PieChart, colorClass: 'border-primary/20 bg-primary/10 bg-primary/20 shadow-xl', iconClass: 'bg-primary/10 text-primary' }, type: 'ruleNode' },
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
