"use client";

import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialNodes, initialEdges } from "@/mock-data/graph";
import { Users, Info, GitCommit, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { MetricCard } from "@/components/shared/MetricCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/DataState";

export default function InteractionGraphPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [timeRange, setTimeRange] = useState("14days");

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false); // Demo error state

  useEffect(() => {
    const timer = setTimeout(() => {
      // Giả lập lỗi nếu chọn "Cả Sprint"
      if (timeRange === "sprint") {
        setIsError(true);
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setIsLoading(true);
    setIsError(false);
  };

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => setSelectedNode(node),
    [],
  );
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50 min-h-screen flex flex-col">
      <PageHeader
        title="Đồ thị tương tác"
        description="Phân tích mạng lưới giao tiếp và đóng góp của nhóm — Sprint 4"
      >
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-10 bg-white border-slate-200 rounded-lg text-sm font-medium">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7days">7 ngày qua</SelectItem>
            <SelectItem value="14days">14 ngày qua</SelectItem>
            <SelectItem value="sprint">Cả Sprint (Test Lỗi)</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white overflow-hidden flex flex-col lg:flex-row min-h-[650px] lg:h-[750px]">
        <div className="flex-1 relative bg-slate-50/50 overflow-hidden min-h-[400px] lg:min-h-0 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-none opacity-40 absolute inset-0" />
          ) : isError ? (
            <ErrorState
              message="Lỗi khi phân tích dữ liệu mạng lưới. Dữ liệu Sprint quá lớn."
              onRetry={() => setTimeRange("14days")}
            />
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              className="z-0"
            >
              <Controls className="bg-white border-slate-200 rounded-lg shadow-md fill-slate-600 mb-4 ml-4" />
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.5}
                color="#cbd5e1"
              />
            </ReactFlow>
          )}
        </div>

        <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col z-10">
          <div className="p-5 xl:p-6 border-b border-slate-100 flex-1 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              Chi tiết thành viên
            </h3>
            {isLoading || isError ? (
              <Skeleton className="h-[200px] w-full rounded-xl" />
            ) : selectedNode ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={selectedNode.data?.label || "Không rõ"}
                    className="w-12 h-12 text-lg"
                    bgColorClass="bg-orange-100 text-orange-600"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {selectedNode.data?.label || "Thành viên không xác định"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Mã Node: {selectedNode.id}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <MetricCard
                    title="Tương tác gửi"
                    value={12}
                    icon={<GitCommit className="h-3 w-3 shrink-0" />}
                  />
                  <MetricCard
                    title="Tương tác nhận"
                    value={8}
                    icon={<MessageSquare className="h-3 w-3 shrink-0" />}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60 py-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 max-w-[200px]">
                  Bấm vào một thành viên trên đồ thị để xem chỉ số tương tác.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
