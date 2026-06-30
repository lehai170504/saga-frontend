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
import { Button } from "@/components/ui/button";
import { Network, Code2, PenTool, FileText, User, Star, PieChart, AlertTriangle, UserCheck, Search, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskDrilldownDrawer } from "./project-detail/task-drilldown-drawer";

// --- CUSTOM EDGES ---

const DrilldownEdge = ({
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
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border shadow-sm rounded-full text-[11px] font-bold text-foreground transition-all group ${data.clickable ? 'cursor-pointer hover:shadow-md hover:border-primary hover:text-primary' : ''}`}
              // We rely on ReactFlow's onEdgeClick for bubbling, or we can use data.onClick if provided.
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

const MultiplierNode = ({ data }: any) => {
  const Icon = data.iconType === 'code' ? Code2 : data.iconType === 'design' ? PenTool : FileText;
  return (
    <div className={`min-w-[180px] px-4 py-3 shadow-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 transition-opacity ${data.inactive ? 'opacity-40 grayscale' : 'opacity-100'}`}>
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.label}</div>
        <div className="text-sm font-black text-foreground">{data.value}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500 border-2 border-background" />
    </div>
  );
};

const StudentNode = ({ data }: any) => {
  const isGhost = data.role === 'ghost';
  const isCore = data.role === 'core';
  const Icon = isGhost ? AlertTriangle : isCore ? UserCheck : User;

  const colorClass = isGhost
    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
    : isCore
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
      : "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800";

  return (
    <div className={`min-w-[200px] px-4 py-3 shadow-lg rounded-2xl bg-white dark:bg-zinc-900 border ${isGhost ? 'border-red-200 dark:border-red-900' : isCore ? 'border-emerald-200 dark:border-emerald-900' : 'border-zinc-200 dark:border-zinc-800'} flex flex-col gap-2 relative`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-background" />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-black text-foreground">{data.name}</div>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${isGhost ? 'text-red-500' : isCore ? 'text-emerald-500' : 'text-muted-foreground'}`}>
            {data.roleLabel}
          </div>
        </div>
      </div>

      <div className="mt-1 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">Base Slices</span>
        <span className="text-xs font-black text-foreground">{data.baseSlices}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-background" />
    </div>
  );
};

const PeerReviewNode = ({ data }: any) => {
  const isPenalty = data.isPenalty;
  return (
    <div className={`min-w-[160px] px-4 py-3 shadow-lg rounded-2xl bg-white dark:bg-zinc-900 border ${isPenalty ? 'border-red-200 dark:border-red-900' : 'border-amber-200 dark:border-amber-900'} flex flex-col gap-1 items-center justify-center text-center`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-background" />
      <div className="flex gap-1 text-amber-400 mb-1">
        {Array.from({ length: data.stars }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <div className="text-xs font-bold text-muted-foreground">{data.label || 'Peer Review Modifier'}</div>
      <div className={`text-lg font-black ${isPenalty ? 'text-red-500' : 'text-amber-500'}`}>{data.modifier}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500 border-2 border-background" />
    </div>
  );
};

const SliceNode = ({ data }: any) => {
  return (
    <div className="min-w-[180px] px-4 py-4 shadow-xl rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center gap-3 relative overflow-hidden">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white border-2 border-indigo-500" />
      <div className="absolute -right-4 -bottom-4 opacity-20">
        <PieChart size={64} />
      </div>
      <div className="relative z-10 p-2 bg-white/20 rounded-xl backdrop-blur-md">
        <PieChart size={20} className="text-white" />
      </div>
      <div className="relative z-10">
        <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">{data.label || 'Tổng Slices Đóng góp'}</div>
        <div className="text-xl font-black">{data.slices} {data.percentage && <span className="text-sm font-semibold text-indigo-200">({data.percentage}%)</span>}</div>
      </div>
    </div>
  );
};

// --- DYNAMIC DATA GENERATOR ---

const generateGraphData = (phase: string) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  // Drilldown data dictionary mapping Edge ID to Detailed Tasks
  const drilldownDetails: Record<string, any> = {
    'e-design-sa': { title: 'Design Tasks - Nguyễn Văn A', tasks: [{ id: 'SAGA-UI-01', name: 'Thiết kế Landing Page', sp: 3, proofText: 'Figma Prototype', proofType: 'link', proofLink: 'https://figma.com' }, { id: 'SAGA-UI-02', name: 'Component System', sp: 2, proofText: 'Figma Library', proofType: 'link', proofLink: 'https://figma.com' }] },
    'e-design-sb': { title: 'Design Tasks - Trần Thị B', tasks: [{ id: 'SAGA-UI-03', name: 'Thiết kế Dashboard Admin', sp: 5, proofText: 'Admin UI Figma', proofType: 'link', proofLink: 'https://figma.com' }] },
    'e-code-sa': { title: 'Code Tasks - Nguyễn Văn A', tasks: [{ id: 'SAGA-API-01', name: 'Auth Module', sp: 10, proofText: 'fb2a19', proofType: 'commit', proofLink: 'https://github.com' }] },
    'e-design-sa-p2': { title: 'Design Tasks - Nguyễn Văn A', tasks: [{ id: 'SAGA-UI-05', name: 'Login Flow UI', sp: 5, proofText: 'Figma Screens', proofType: 'link', proofLink: 'https://figma.com' }] },
    'e-code-sb': { title: 'Code Tasks - Trần Thị B', tasks: [{ id: 'SAGA-FE-01', name: 'React Flow Integration', sp: 5, proofText: '65dda1', proofType: 'commit', proofLink: 'https://github.com' }, { id: 'SAGA-FE-02', name: 'Responsive Layouts', sp: 4, proofText: '99ccd2', proofType: 'commit', proofLink: 'https://github.com' }] },
    'e-docs-sc': { title: 'Docs Tasks - Lê Văn C', tasks: [{ id: 'SAGA-DOC-01', name: 'API Swagger Docs', sp: 2, proofText: 'N/A (Late)', proofType: 'commit' }] },
    'e-docs-sa': { title: 'Docs Tasks - Nguyễn Văn A', tasks: [{ id: 'SAGA-DOC-02', name: 'System Architecture Diagram', sp: 3, proofText: 'Architecture Diagram', proofType: 'link', proofLink: 'https://docs.google.com' }] },
  };

  // Base Multipliers (Top Level)
  const mults = [
    { id: 'mult-code', position: { x: 100, y: 50 }, data: { label: 'Hệ số Code', value: 'x2.0', iconType: 'code', inactive: phase === 'phase1' }, type: 'multiplier' },
    { id: 'mult-design', position: { x: 420, y: 50 }, data: { label: 'Hệ số Design', value: 'x1.5', iconType: 'design', inactive: phase === 'phase3' }, type: 'multiplier' },
    { id: 'mult-docs', position: { x: 700, y: 50 }, data: { label: 'Hệ số Docs', value: 'x1.0', iconType: 'docs', inactive: phase === 'phase1' || phase === 'phase2' }, type: 'multiplier' },
  ];

  if (phase === 'phase1') {
    nodes = [
      ...mults,
      { id: 'student-a', position: { x: 180, y: 320 }, data: { name: 'Nguyễn Văn A', role: 'core', roleLabel: 'Core Member', baseSlices: 7.5 }, type: 'student' },
      { id: 'student-b', position: { x: 450, y: 320 }, data: { name: 'Trần Thị B', role: 'normal', roleLabel: 'Thành viên', baseSlices: 7.5 }, type: 'student' },

      { id: 'pr-a', position: { x: 180, y: 520 }, data: { stars: 4, modifier: 'x1.0', isPenalty: false, label: 'Review Phase 1' }, type: 'peerReview' },
      { id: 'pr-b', position: { x: 450, y: 520 }, data: { stars: 5, modifier: 'x1.1', isPenalty: false, label: 'Review Phase 1' }, type: 'peerReview' },

      { id: 'slices-a', position: { x: 180, y: 720 }, data: { slices: 7.5, label: 'Slices P1' }, type: 'slice' },
      { id: 'slices-b', position: { x: 450, y: 720 }, data: { slices: 8.25, label: 'Slices P1' }, type: 'slice' },
    ];
    edges = [
      { id: 'e-design-sa', source: 'mult-design', target: 'student-a', data: { label: '5 SP Design (7.5 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#8b5cf6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
      { id: 'e-design-sb', source: 'mult-design', target: 'student-b', data: { label: '5 SP Design (7.5 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#8b5cf6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
      { id: 'e-sa-pra', source: 'student-a', target: 'pr-a', data: { label: '7.5 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-sb-prb', source: 'student-b', target: 'pr-b', data: { label: '7.5 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-pra-sla', source: 'pr-a', target: 'slices-a', data: { label: '7.5 * 1.0' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-prb-slb', source: 'pr-b', target: 'slices-b', data: { label: '7.5 * 1.1' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    ];
  } else if (phase === 'phase2') {
    nodes = [
      ...mults,
      { id: 'student-a', position: { x: 180, y: 320 }, data: { name: 'Nguyễn Văn A', role: 'core', roleLabel: 'Core Member', baseSlices: 27.5 }, type: 'student' },
      { id: 'student-b', position: { x: 450, y: 320 }, data: { name: 'Trần Thị B', role: 'normal', roleLabel: 'Thành viên', baseSlices: 18 }, type: 'student' },
      { id: 'student-c', position: { x: 720, y: 320 }, data: { name: 'Lê Văn C', role: 'ghost', roleLabel: 'Cảnh báo Ghosting', baseSlices: 0 }, type: 'student' },

      { id: 'pr-a', position: { x: 180, y: 520 }, data: { stars: 5, modifier: 'x1.1', isPenalty: false, label: 'Review Phase 2' }, type: 'peerReview' },
      { id: 'pr-b', position: { x: 450, y: 520 }, data: { stars: 4, modifier: 'x1.0', isPenalty: false, label: 'Review Phase 2' }, type: 'peerReview' },
      { id: 'pr-c', position: { x: 720, y: 520 }, data: { stars: 1, modifier: 'x0.5', isPenalty: true, label: 'Review Phase 2' }, type: 'peerReview' },

      { id: 'slices-a', position: { x: 180, y: 720 }, data: { slices: 30.25, label: 'Slices P2' }, type: 'slice' },
      { id: 'slices-b', position: { x: 450, y: 720 }, data: { slices: 18, label: 'Slices P2' }, type: 'slice' },
      { id: 'slices-c', position: { x: 720, y: 720 }, data: { slices: 0, label: 'Slices P2' }, type: 'slice' },
    ];
    edges = [
      { id: 'e-code-sa', source: 'mult-code', target: 'student-a', data: { label: '10 SP Code (20 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#3b82f6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
      { id: 'e-design-sa-p2', source: 'mult-design', target: 'student-a', data: { label: '5 SP Design (7.5 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#8b5cf6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
      { id: 'e-code-sb', source: 'mult-code', target: 'student-b', data: { label: '9 SP Code (18 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#3b82f6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },

      { id: 'e-sa-pra', source: 'student-a', target: 'pr-a', data: { label: '27.5 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-sb-prb', source: 'student-b', target: 'pr-b', data: { label: '18 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-sc-prc', source: 'student-c', target: 'pr-c', data: { label: '0 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-pra-sla', source: 'pr-a', target: 'slices-a', data: { label: '27.5 * 1.1' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 } },
      { id: 'e-prb-slb', source: 'pr-b', target: 'slices-b', data: { label: '18 * 1.0' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-prc-slc', source: 'pr-c', target: 'slices-c', data: { label: '0 * 0.5' }, type: 'drilldown', animated: true, style: { stroke: '#ef4444', strokeWidth: 1 } },
    ];
  } else if (phase === 'phase3') {
    // Testing & Docs Phase
    nodes = [
      ...mults,
      { id: 'student-a', position: { x: 180, y: 320 }, data: { name: 'Nguyễn Văn A', role: 'core', roleLabel: 'Core Member', baseSlices: 3 }, type: 'student' },
      { id: 'student-b', position: { x: 450, y: 320 }, data: { name: 'Trần Thị B', role: 'normal', roleLabel: 'Thành viên', baseSlices: 0 }, type: 'student' },
      { id: 'student-c', position: { x: 720, y: 320 }, data: { name: 'Lê Văn C', role: 'ghost', roleLabel: 'Cảnh báo Ghosting', baseSlices: 2 }, type: 'student' },

      { id: 'pr-a', position: { x: 180, y: 520 }, data: { stars: 4, modifier: 'x1.0', isPenalty: false, label: 'Review Phase 3' }, type: 'peerReview' },
      { id: 'pr-b', position: { x: 450, y: 520 }, data: { stars: 4, modifier: 'x1.0', isPenalty: false, label: 'Review Phase 3' }, type: 'peerReview' },
      { id: 'pr-c', position: { x: 720, y: 520 }, data: { stars: 1, modifier: 'x0.5', isPenalty: true, label: 'Review Phase 3' }, type: 'peerReview' },

      { id: 'slices-a', position: { x: 180, y: 720 }, data: { slices: 3, label: 'Slices P3' }, type: 'slice' },
      { id: 'slices-b', position: { x: 450, y: 720 }, data: { slices: 0, label: 'Slices P3' }, type: 'slice' },
      { id: 'slices-c', position: { x: 720, y: 720 }, data: { slices: 1, label: 'Slices P3' }, type: 'slice' },
    ];
    edges = [
      { id: 'e-docs-sa', source: 'mult-docs', target: 'student-a', data: { label: '3 SP Docs (3 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#10b981', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: 'e-docs-sc', source: 'mult-docs', target: 'student-c', data: { label: '2 SP Docs (2 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#10b981', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: 'e-sa-pra', source: 'student-a', target: 'pr-a', data: { label: '3 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-sb-prb', source: 'student-b', target: 'pr-b', data: { label: '0 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-sc-prc', source: 'student-c', target: 'pr-c', data: { label: '2 Base' }, type: 'drilldown', style: { stroke: '#94a3b8' } },
      { id: 'e-pra-sla', source: 'pr-a', target: 'slices-a', data: { label: '3 * 1.0' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-prb-slb', source: 'pr-b', target: 'slices-b', data: { label: '0 * 1.0' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 1 } },
      { id: 'e-prc-slc', source: 'pr-c', target: 'slices-c', data: { label: '2 * 0.5' }, type: 'drilldown', animated: true, style: { stroke: '#ef4444', strokeWidth: 1 } },
    ];
  } else {
    // Final Phase (Aggregated)
    nodes = [
      ...mults,
      { id: 'student-a', position: { x: 180, y: 320 }, data: { name: 'Nguyễn Văn A', role: 'core', roleLabel: 'Core Member (Đa nhiệm)', baseSlices: 37.5 }, type: 'student' },
      { id: 'student-b', position: { x: 450, y: 320 }, data: { name: 'Trần Thị B', role: 'normal', roleLabel: 'Thành viên', baseSlices: 18 }, type: 'student' },
      { id: 'student-c', position: { x: 720, y: 320 }, data: { name: 'Lê Văn C', role: 'ghost', roleLabel: 'Cảnh báo Ghosting', baseSlices: 2 }, type: 'student' },

      { id: 'pr-a', position: { x: 180, y: 520 }, data: { stars: 5, modifier: 'x1.1', isPenalty: false, label: 'Final Review Average' }, type: 'peerReview' },
      { id: 'pr-b', position: { x: 450, y: 520 }, data: { stars: 4, modifier: 'x1.0', isPenalty: false, label: 'Final Review Average' }, type: 'peerReview' },
      { id: 'pr-c', position: { x: 720, y: 520 }, data: { stars: 1, modifier: 'x0.5', isPenalty: true, label: 'Final Review Average' }, type: 'peerReview' },
      { id: 'slices-a', position: { x: 180, y: 720 }, data: { slices: 41.25, percentage: 68.4, label: 'Tổng Slices Cuối Kì' }, type: 'slice' },
      { id: 'slices-b', position: { x: 450, y: 720 }, data: { slices: 18.0, percentage: 29.9, label: 'Tổng Slices Cuối Kì' }, type: 'slice' },
      { id: 'slices-c', position: { x: 720, y: 720 }, data: { slices: 1.0, percentage: 1.7, label: 'Tổng Slices Cuối Kì' }, type: 'slice' },
    ];
    edges = [
      { id: 'e-code-sa', source: 'mult-code', target: 'student-a', data: { label: '15 SP Code (30 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#3b82f6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
      { id: 'e-design-sa', source: 'mult-design', target: 'student-a', data: { label: '5 SP Design (7.5 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#8b5cf6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
      { id: 'e-code-sb', source: 'mult-code', target: 'student-b', data: { label: '9 SP Code (18 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#3b82f6', strokeWidth: 2, cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
      { id: 'e-docs-sc', source: 'mult-docs', target: 'student-c', data: { label: '2 SP Docs (2 Slices)', clickable: true }, type: 'drilldown', style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4', cursor: 'pointer' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: 'e-sa-pra', source: 'student-a', target: 'pr-a', data: { label: '37.5 Base' }, type: 'drilldown', style: { stroke: '#94a3b8', strokeWidth: 2 } },
      { id: 'e-sb-prb', source: 'student-b', target: 'pr-b', data: { label: '18 Base' }, type: 'drilldown', style: { stroke: '#94a3b8', strokeWidth: 2 } },
      { id: 'e-sc-prc', source: 'student-c', target: 'pr-c', data: { label: '2 Base' }, type: 'drilldown', style: { stroke: '#94a3b8', strokeWidth: 2 } },
      { id: 'e-pra-sla', source: 'pr-a', target: 'slices-a', data: { label: '37.5 * 1.1' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 4 } },
      { id: 'e-prb-slb', source: 'pr-b', target: 'slices-b', data: { label: '18.0 * 1.0' }, type: 'drilldown', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-prc-slc', source: 'pr-c', target: 'slices-c', data: { label: '2.0 * 0.5 (Penalty)' }, type: 'drilldown', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
    ];
  }

  return { nodes, edges, drilldownDetails };
};

export function ClassNetworkGraph() {
  const nodeTypes = useMemo(() => ({
    multiplier: MultiplierNode,
    student: StudentNode,
    peerReview: PeerReviewNode,
    slice: SliceNode
  }), []);

  const edgeTypes = useMemo(() => ({
    drilldown: DrilldownEdge
  }), []);

  const [selectedPhase, setSelectedPhase] = useState("final");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Drilldown State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEdgeData, setSelectedEdgeData] = useState<any>(null);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraphData(selectedPhase);
    // Bind click handler to edges so the custom EdgeLabelRenderer can trigger it
    const edgesWithClick = newEdges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        onLabelClick: (id: string) => {
          const { drilldownDetails } = generateGraphData(selectedPhase);
          if (drilldownDetails[id]) {
            setSelectedEdgeData(drilldownDetails[id]);
            setIsDrawerOpen(true);
          }
        }
      }
    }));
    setNodes(newNodes);
    setEdges(edgesWithClick);
  }, [selectedPhase, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const { drilldownDetails } = generateGraphData(selectedPhase);
    if (drilldownDetails[edge.id]) {
      setSelectedEdgeData(drilldownDetails[edge.id]);
      setIsDrawerOpen(true);
    }
  }, [selectedPhase]);

  return (
    <>
      <Card className="rounded-[2rem] shadow-lg border-border bg-card/40 backdrop-blur-xl mb-6 overflow-hidden">
        <CardHeader className="pb-4 flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-border/50 bg-muted/20">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-500" />
              Kiểm toán Đóng góp Nhóm (Slicing Pie Audit)
            </CardTitle>
            <CardDescription className="font-medium mt-2 max-w-3xl text-sm leading-relaxed">
              Mô hình hóa chuỗi giá trị: <strong className="text-indigo-500 dark:text-indigo-400">∑(Story Points × Multiplier) × Peer Review</strong>.<br />
              Sử dụng công cụ này để thanh tra % cổ phần Slices của Nhóm. <strong className="text-primary">Mẹo:</strong> Click vào các đường nối phía trên để truy xuất (Drilldown) chi tiết danh sách Task.
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl font-bold border-border bg-background shadow-sm hover:bg-accent transition-colors">
                <SelectValue placeholder="Chọn Phase" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="phase1" className="font-medium">Phase 1 (Design)</SelectItem>
                <SelectItem value="phase2" className="font-medium">Phase 2 (Coding)</SelectItem>
                <SelectItem value="phase3" className="font-medium">Phase 3 (Testing & Docs)</SelectItem>
                <SelectItem value="final" className="font-bold text-indigo-600">Final Report (Chốt sổ)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className={`h-10 rounded-xl font-bold px-6 shadow-md transition-all gap-2 ${selectedPhase === 'final'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
            >
              <Save className="w-4 h-4" />
              {selectedPhase === 'final' ? 'Chốt Sổ (Publish)' : `Chốt Điểm ${selectedPhase === 'phase1' ? 'Phase 1' : selectedPhase === 'phase2' ? 'Phase 2' : 'Phase 3'
                }`}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative bg-zinc-50/50 dark:bg-zinc-950/50">
          {/* Graph Container */}
          <div className="h-[700px] w-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeClick={handleEdgeClick}
              fitView
              attributionPosition="bottom-right"
              minZoom={0.2}
              maxZoom={1.5}
              defaultEdgeOptions={{ type: 'smoothstep' }}
            >
              <Controls className="bg-background border-border shadow-md rounded-xl overflow-hidden" />
              <MiniMap
                className="bg-background border border-border shadow-md rounded-xl overflow-hidden"
                nodeStrokeColor={(n) => {
                  if (n.type === 'slice') return '#6366f1'; // indigo
                  if (n.type === 'peerReview') return '#f59e0b'; // amber
                  if (n.id.includes('ghost')) return '#ef4444'; // red
                  if (n.id.includes('core')) return '#10b981'; // emerald
                  return '#94a3b8'; // slate
                }}
                nodeColor={(n) => {
                  if (n.type === 'slice') return '#e0e7ff';
                  if (n.type === 'peerReview') return '#fef3c7';
                  if (n.id.includes('ghost')) return '#fee2e2';
                  if (n.id.includes('core')) return '#d1fae5';
                  return '#f1f5f9';
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--muted-foreground)" style={{ opacity: 0.3 }} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Drilldown Drawer */}
      <TaskDrilldownDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        data={selectedEdgeData}
      />
    </>
  );
}


