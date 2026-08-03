"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Users, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data cho Mạng tương tác & Phân tích NLP (SAGA Early Warning)
const nodes = [
  { id: "1", name: "Minh Nguyễn", size: 60, x: 50, y: 30, color: "bg-primary", interactions: 45, role: "Core Member" },
  { id: "2", name: "Linh Trần", size: 45, x: 25, y: 60, color: "bg-success", interactions: 28, role: "Member" },
  { id: "3", name: "An Lê", size: 75, x: 45, y: 70, color: "bg-primary", interactions: 62, role: "Core Member" },
  { id: "4", name: "Huy Hoàng", size: 50, x: 75, y: 55, color: "bg-destructive", interactions: 35, role: "Member" },
  { id: "5", name: "Thúc Nguyễn", size: 40, x: 65, y: 85, color: "bg-warning", interactions: 15, role: "Ghosting Warning" },
  { id: "6", name: "Tuấn Lê", size: 55, x: 20, y: 30, color: "bg-destructive", interactions: 40, role: "Toxic Warning" },
  { id: "7", name: "Phương Ngô", size: 35, x: 80, y: 25, color: "bg-success", interactions: 12, role: "Member" },
];

const edges = [
  { source: "1", target: "3", width: 4, type: "collab" }, // Hỗ trợ chéo
  { source: "2", target: "3", width: 3, type: "review" }, // Code Review
  { source: "3", target: "4", width: 5, type: "collab" },
  { source: "1", target: "6", width: 4, type: "toxic" }, // Xung đột NLP (Cãi vã)
  { source: "4", target: "5", width: 1, type: "ghost" }, // Giao tiếp 1 chiều (Ghosting)
  { source: "6", target: "2", width: 3, type: "toxic" }, // Xung đột NLP
  { source: "4", target: "7", width: 2, type: "review" },
];

export default function InteractionGraphPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [selectedNode, setSelectedNode] = useState<{ id: string, name: string, size: number, x: number, y: number, color: string, interactions: number } | null>(nodes[2]); // Default select An Lê

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <Share2 size={14} className="text-primary" />
              SAGA Early Warning System
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Mạng tương tác & Phân tích NLP
            </h1>
            <p className="text-muted-foreground font-medium">Bản đồ đồ thị phân tích văn hóa làm việc nhóm, cảnh báo xung đột (Toxic) và hỗ trợ chéo dựa trên xử lý ngôn ngữ tự nhiên.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel: Filters */}
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Bộ lọc & Tìm kiếm</h3>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Tìm sinh viên..."
                    className="pl-9 bg-background/50 border-border/50"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full bg-background/50 border-border/50">
                    <SelectValue placeholder="Nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả nhóm</SelectItem>
                    <SelectItem value="team-alpha">Team Alpha</SelectItem>
                    <SelectItem value="team-beta">Team Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chú giải mạng lưới</h3>
                <div className="space-y-2 text-sm font-medium">
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 bg-primary rounded-full" />
                    <span>Commits & Push</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 border-b-2 border-dashed border-success/20" />
                    <span>PR Reviews</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 border-b-2 border-dotted border-primary/20" />
                    <span>Comments</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 bg-destructive rounded-full" />
                    <span>Issue Assignment</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center Panel: Graph Visualization */}
          <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-lg overflow-hidden relative min-h-[500px]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <CardContent className="p-0 h-full w-full relative">
              {/* Fake SVG Graph */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity={0.5} />
                  </marker>
                  <marker id="arrowhead-toxic" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" opacity={0.8} />
                  </marker>
                </defs>
                {edges.map((edge, i) => {
                  const source = nodes.find(n => n.id === edge.source);
                  const target = nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;

                  let strokeDasharray = "";
                  let stroke = "#6366f1"; // collab (indigo)
                  let marker = "url(#arrowhead)";

                  if (edge.type === "review") { stroke = "#10b981"; } // review (emerald)
                  if (edge.type === "ghost") { stroke = "#f59e0b"; strokeDasharray = "4 4"; } // ghost (amber)
                  if (edge.type === "toxic") { stroke = "#ef4444"; marker = "url(#arrowhead-toxic)"; } // toxic (red)

                  return (
                    <line
                      key={i}
                      x1={`${source.x}%`}
                      y1={`${source.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={stroke}
                      strokeWidth={edge.width}
                      strokeDasharray={strokeDasharray}
                      markerEnd={marker}
                      className={edge.type === "toxic" ? "opacity-70" : "opacity-40"}
                    />
                  );
                })}
              </svg>

              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-bold shadow-lg ${node.color} ${selectedNode?.id === node.id ? 'ring-4 ring-primary ring-offset-4 ring-offset-background z-20' : 'opacity-90 z-10'}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <span className="truncate w-full text-center text-xs px-1" style={{ fontSize: `${Math.max(10, node.size / 5)}px` }}>
                    {node.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Panel: Node Details */}
          <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
            <CardContent className="p-6">
              {selectedNode ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center space-y-2">
                    <div className={`w-20 h-20 mx-auto rounded-full ${selectedNode.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4`}>
                      {selectedNode.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{selectedNode.name}</h2>
                    <p className="text-sm text-muted-foreground font-medium">Nhóm PBL-07</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Tương tác</p>
                      <p className="text-2xl font-bold text-primary">{selectedNode.interactions}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Mức độ</p>
                      <p className="text-lg font-bold text-success mt-1">Năng nổ</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Phân tích Chi tiết (AI)</h3>
                    <div className="space-y-2">
                      {edges.filter(e => e.source === selectedNode?.id || e.target === selectedNode?.id).map((edge, idx) => {
                        const isSource = edge.source === selectedNode?.id;
                        const otherNode = nodes.find(n => n.id === (isSource ? edge.target : edge.source));

                        const getActionText = () => {
                          if (edge.type === "toxic") return isSource ? "Cãi vã với" : "Bị toxic bởi";
                          if (edge.type === "review") return isSource ? "Review code của" : "Được review bởi";
                          if (edge.type === "ghost") return isSource ? "Bơ tin nhắn của" : "Bị bơ bởi";
                          return isSource ? "Hỗ trợ" : "Được hỗ trợ bởi";
                        };

                        const getBadgeColor = () => {
                          if (edge.type === "toxic") return "bg-destructive/10 text-destructive border-destructive/20 bg-destructive/20 text-destructive";
                          if (edge.type === "ghost") return "bg-warning/10 text-warning border-warning/20 bg-warning/20 text-warning";
                          if (edge.type === "review") return "bg-success/10 text-success border-success/20 bg-success/20 text-success";
                          return "bg-primary/10 text-primary border-primary/20 bg-primary/20 text-primary";
                        };

                        return (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-xl bg-background/50 border border-border/50">
                            <span className="font-medium text-foreground text-xs">{getActionText()} <span className="font-bold">{otherNode?.name}</span></span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getBadgeColor()}`}>
                              {edge.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button className="w-full rounded-xl font-bold h-10">
                    Xem Profile Chi Tiết
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Users size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-center">Chọn một sinh viên trên biểu đồ<br />để xem chi tiết</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
