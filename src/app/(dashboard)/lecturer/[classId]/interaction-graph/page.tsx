"use client";

import { useLecturerClass } from "@/context/LecturerClassContext";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Users, Filter, CheckCircle2, MessageSquare, GitCommit, Search, GitPullRequest } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Static mock data for node graph
const nodes = [
  { id: "1", name: "Minh Nguyễn", size: 60, x: 50, y: 30, color: "bg-indigo-500", interactions: 45 },
  { id: "2", name: "Linh Trần", size: 45, x: 25, y: 60, color: "bg-teal-500", interactions: 28 },
  { id: "3", name: "An Lê", size: 75, x: 45, y: 70, color: "bg-orange-500", interactions: 62 },
  { id: "4", name: "Huy Hoàng", size: 50, x: 75, y: 55, color: "bg-pink-500", interactions: 35 },
  { id: "5", name: "Thúc Nguyễn", size: 40, x: 65, y: 85, color: "bg-indigo-500", interactions: 15 },
  { id: "6", name: "Tuấn Lê", size: 55, x: 20, y: 30, color: "bg-amber-500", interactions: 40 },
  { id: "7", name: "Phương Ngô", size: 35, x: 80, y: 25, color: "bg-teal-500", interactions: 12 },
];

const edges = [
  { source: "1", target: "3", width: 4, type: "commit" },
  { source: "2", target: "3", width: 3, type: "review" },
  { source: "3", target: "4", width: 5, type: "issue" },
  { source: "1", target: "6", width: 2, type: "comment" },
  { source: "4", target: "5", width: 3, type: "review" },
  { source: "1", target: "7", width: 2, type: "commit" },
  { source: "4", target: "7", width: 2, type: "issue" },
];

export default function InteractionGraphPage() {
  const { classId } = useLecturerClass();
  const [selectedNode, setSelectedNode] = useState<any>(nodes[2]); // Default select An Lê

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
              <Share2 size={14} className="text-primary" />
              Network Analysis
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Mạng lưới tương tác
            </h1>
            <p className="text-muted-foreground font-medium">Bản đồ kết nối mức độ cộng tác giữa các thành viên lớp {classId}</p>
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
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 bg-indigo-500 rounded-full" />
                    <span>Commits & Push</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 border-b-2 border-dashed border-teal-500" />
                    <span>PR Reviews</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 border-b-2 border-dotted border-amber-500" />
                    <span>Comments</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-4 h-1 bg-rose-500 rounded-full" />
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
                {edges.map((edge, i) => {
                  const source = nodes.find(n => n.id === edge.source);
                  const target = nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;
                  
                  let strokeDasharray = "";
                  let stroke = "#6366f1"; // indigo
                  if (edge.type === "review") { stroke = "#14b8a6"; strokeDasharray = "4 4"; } // teal
                  if (edge.type === "comment") { stroke = "#f59e0b"; strokeDasharray = "2 4"; } // amber
                  if (edge.type === "issue") { stroke = "#f43f5e"; } // rose

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
                      className="opacity-40"
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
                  <span className="truncate w-full text-center text-xs px-1" style={{ fontSize: `${Math.max(10, node.size/5)}px` }}>
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
                    <div className={`w-20 h-20 mx-auto rounded-full ${selectedNode.color} flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4`}>
                      {selectedNode.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{selectedNode.name}</h2>
                    <p className="text-sm text-muted-foreground font-medium">Nhóm PBL-07</p>
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
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Cộng tác nhiều nhất</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xs font-bold">M</div>
                          <span className="text-sm font-medium">Minh Nguyễn</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">15 lần</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center text-xs font-bold">H</div>
                          <span className="text-sm font-medium">Huy Hoàng</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">8 lần</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full rounded-xl font-bold h-10">
                    Xem Profile Chi Tiết
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Users size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-center">Chọn một sinh viên trên biểu đồ<br/>để xem chi tiết</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
