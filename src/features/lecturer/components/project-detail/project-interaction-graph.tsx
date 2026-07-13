import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data cho Mạng tương tác & Phân tích NLP (SAGA Early Warning) cho một nhóm cụ thể
const projectNodes = [
  { id: "1", name: "Nguyễn Văn A", size: 60, x: 50, y: 30, color: "bg-indigo-500", interactions: 45, role: "Core Member" },
  { id: "2", name: "Trần Thị B", size: 45, x: 25, y: 60, color: "bg-teal-500", interactions: 28, role: "Member" },
  { id: "3", name: "Lê Văn C", size: 40, x: 75, y: 55, color: "bg-amber-500", interactions: 15, role: "Ghosting Warning" },
];

const projectEdges = [
  { source: "1", target: "2", width: 4, type: "collab" }, // Hỗ trợ chéo
  { source: "2", target: "1", width: 3, type: "review" }, // Code Review
  { source: "1", target: "3", width: 1, type: "ghost" }, // Giao tiếp 1 chiều (Ghosting)
];

export function ProjectInteractionGraph({ projectId }: { projectId: string }) {
  const [selectedNode, setSelectedNode] = useState<{ id: string, name: string, size: number, x: number, y: number, color: string, interactions: number } | null>(projectNodes[0]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
            <Share2 size={14} className="text-primary" />
            SAGA Early Warning System
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Mạng tương tác & NLP
          </h2>
          <p className="text-muted-foreground font-medium">Bản đồ đồ thị phân tích văn hóa làm việc nhóm, cảnh báo xung đột (Toxic) và hỗ trợ chéo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Filters */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Tìm kiếm</h3>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Tìm thành viên..."
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chú giải mạng lưới</h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 bg-indigo-500 rounded-full" />
                  <span>Commits & Push</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 border-b-2 border-dashed border-teal-500" />
                  <span>PR Reviews</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 border-b-2 border-dotted border-violet-500" />
                  <span>Comments</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 bg-rose-500 rounded-full" />
                  <span>Issue Assignment</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Panel: Graph Visualization */}
        <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden relative min-h-[500px]">
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
              {projectEdges.map((edge, i) => {
                const source = projectNodes.find(n => n.id === edge.source);
                const target = projectNodes.find(n => n.id === edge.target);
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

            {projectNodes.map(node => (
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
                  {node.name.split(' ').pop()}
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
                  <div className={`w-20 h-20 mx-auto rounded-full ${selectedNode.color} flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4`}>
                    {selectedNode.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedNode.name}</h2>
                  <p className="text-sm text-muted-foreground font-medium">Nhóm {projectId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tương tác</p>
                    <p className="text-2xl font-black text-primary">{selectedNode.interactions}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Mức độ</p>
                    <p className="text-lg font-black text-emerald-500 mt-1">Năng nổ</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Phân tích Chi tiết (AI)</h3>
                  <div className="space-y-2">
                    {projectEdges.filter(e => e.source === selectedNode?.id || e.target === selectedNode?.id).map((edge, idx) => {
                      const isSource = edge.source === selectedNode?.id;
                      const otherNode = projectNodes.find(n => n.id === (isSource ? edge.target : edge.source));

                      const getActionText = () => {
                        if (edge.type === "toxic") return isSource ? "Cãi vã với" : "Bị toxic bởi";
                        if (edge.type === "review") return isSource ? "Review code của" : "Được review bởi";
                        if (edge.type === "ghost") return isSource ? "Bơ tin nhắn của" : "Bị bơ bởi";
                        return isSource ? "Hỗ trợ" : "Được hỗ trợ bởi";
                      };

                      const getBadgeColor = () => {
                        if (edge.type === "toxic") return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400";
                        if (edge.type === "ghost") return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
                        if (edge.type === "review") return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
                        return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400";
                      };

                      return (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-xl bg-background/50 border border-border/50">
                          <span className="font-medium text-foreground text-xs">{getActionText()} <span className="font-bold">{otherNode?.name}</span></span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md border font-black uppercase tracking-wider ${getBadgeColor()}`}>
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
                <p className="font-medium text-center">Chọn một thành viên<br />để xem chi tiết</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
