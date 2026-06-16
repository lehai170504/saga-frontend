// src/app/interaction-graph/page.tsx
"use client";

import React, { useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initialNodes, initialEdges } from "@/mock-data/graph";

export default function InteractionGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Mạng lưới tương tác (Interaction Graph)
        </h2>
        <p className="text-slate-500">
          Trực quan hóa tần suất trao đổi và làm việc nhóm của sinh viên dựa
          trên dữ liệu Continuous Assessment.
        </p>
      </div>

      {/* Vùng hiển thị Graph */}
      <Card className="border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-slate-50 py-3">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Đồ thị tương tác thời gian thực (Nhóm 1)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-slate-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Controls />
            <MiniMap
              nodeStrokeColor={(n) => {
                if (n.id === "4") return "#f43f5e";
                return "#6366f1";
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </CardContent>
      </Card>

      {/* Chú giải (Legend) */}
      <div className="flex gap-6 text-sm text-slate-600 px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-500"></div>
          <span>Trưởng nhóm (Leader)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-slate-300"></div>
          <span>Thành viên tích cực</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-50 border border-rose-500"></div>
          <span>Nguy cơ tách rời nhóm (Ít tương tác)</span>
        </div>
      </div>
    </div>
  );
}
