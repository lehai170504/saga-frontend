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
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
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
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-background min-h-screen flex flex-col">
      <PageHeader
        title="Đồ thị tương tác"
        description="Phân tích mạng lưới giao tiếp và đóng góp của nhóm — Sprint 4"
      >
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-10 bg-background border-input rounded-lg text-sm font-medium">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-popover text-popover-foreground">
            <SelectItem value="7days">7 ngày qua</SelectItem>
            <SelectItem value="14days">14 ngày qua</SelectItem>
            <SelectItem value="sprint">Cả Sprint (Test Lỗi)</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground overflow-hidden flex flex-col lg:flex-row min-h-[650px] lg:h-[750px]">
        <div className="flex-1 relative bg-muted/20 overflow-hidden min-h-[400px] lg:min-h-0 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-none opacity-40 absolute inset-0 bg-muted" />
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
              <Controls className="bg-background border-border rounded-lg shadow-md fill-foreground mb-4 ml-4" />
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.5}
                color="var(--muted-foreground)"
              />
            </ReactFlow>
          )}
        </div>

        <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 bg-card border-t lg:border-t-0 lg:border-l border-border flex flex-col z-10">
          <div className="p-5 xl:p-6 border-b border-border flex-1 overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              Chi tiết thành viên
            </h3>
            {isLoading || isError ? (
              <Skeleton className="h-[200px] w-full rounded-xl bg-muted" />
            ) : selectedNode ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={selectedNode.data?.label || "Không rõ"}
                    className="w-12 h-12 text-lg"
                    bgColorClass="bg-orange-100/80 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">
                      {selectedNode.data?.label || "Thành viên không xác định"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
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
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px]">
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
