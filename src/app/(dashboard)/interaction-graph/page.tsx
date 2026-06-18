// src/app/interaction-graph/page.tsx
"use client";

import React from "react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex-shrink-0">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Mạng lưới tương tác (Interaction Graph)
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Trực quan hóa tần suất trao đổi và làm việc nhóm của sinh viên dựa
          trên dữ liệu Continuous Assessment.
        </p>
      </div>

      {/* Vùng hiển thị Graph */}
      <Card className="border-slate-200/60 shadow-sm flex-1 overflow-hidden flex flex-col rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 flex-shrink-0">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            Đồ thị tương tác thời gian thực (Nhóm 1)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-slate-50/30">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            className="z-0"
          >
            <Controls className="bg-white border-slate-200 rounded-lg shadow-md" />
            <MiniMap
              className="bg-white border border-slate-200 rounded-xl shadow-md"
              nodeStrokeColor={(n) => {
                if (n.id === "4") return "#ef4444"; // Red for at-risk
                if (n.id === "1") return "#0052CC"; // Jira Blue for leader
                return "#f97316"; // SAGA Orange for members
              }}
              nodeColor={(n) => {
                if (n.id === "4") return "#fef2f2";
                if (n.id === "1") return "#eff6ff";
                return "#fff7ed";
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1.5}
              color="#cbd5e1"
            />
          </ReactFlow>
        </CardContent>

        {/* Chú giải (Legend) */}
        <div className="bg-white border-t border-slate-100 p-4 flex-shrink-0 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded shadow-sm bg-blue-50 border-[1.5px] border-blue-600"></div>
            <span>Trưởng nhóm (Leader)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded shadow-sm bg-orange-50 border-[1.5px] border-orange-500"></div>
            <span>Thành viên tích cực</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded shadow-sm bg-red-50 border-[1.5px] border-red-500"></div>
            <span>Nguy cơ tách rời nhóm</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
