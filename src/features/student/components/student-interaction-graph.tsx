"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";

// Static mock data for node graph
const nodes = [
  { id: "1", name: "Minh Nguyễn", size: 60, x: 50, y: 35, color: "bg-indigo-500", interactions: 45, initials: "M" },
  { id: "2", name: "Linh Trần", size: 45, x: 25, y: 60, color: "bg-teal-500", interactions: 28, initials: "L" },
  { id: "3", name: "An Lê", size: 75, x: 45, y: 70, color: "bg-orange-500", interactions: 62, initials: "A" },
  { id: "4", name: "Huy Hoàng", size: 50, x: 75, y: 55, color: "bg-pink-500", interactions: 35, initials: "H" },
  { id: "5", name: "Thúc Nguyễn", size: 40, x: 65, y: 85, color: "bg-indigo-500", interactions: 15, initials: "T" },
  { id: "6", name: "Tuấn Lê", size: 55, x: 20, y: 30, color: "bg-amber-500", interactions: 40, initials: "T" },
  { id: "7", name: "Phương Ngô", size: 35, x: 85, y: 25, color: "bg-teal-500", interactions: 12, initials: "P" },
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

export function StudentInteractionGraph() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedNode, setSelectedNode] = useState<typeof nodes[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const subjectsData = [
    { code: "WDP301", name: "Dự án phát triển web", classId: "wdp301-pbl", className: "SE1801", project: "Nhóm PBL-01" },
    { code: "PRN211", name: "Lập trình C# nâng cao", classId: "prn211-pbl", className: "SE1802", project: "Nhóm PBL-02" },
    { code: "CS101", name: "Nhập môn Lập trình", classId: "cs101-pbl", className: "SE1803", project: "Nhóm PBL-03" },
    { code: "SWT301", name: "Kiểm thử phần mềm", classId: "swt301-pbl", className: "SE1804", project: "Nhóm PBL-04" },
    { code: "DBI202", name: "Hệ cơ sở dữ liệu", classId: "dbi202-pbl", className: "SE1805", project: "Nhóm PBL-05" },
  ];

  const getClassName = (classId: string) => {
    if (!classId) return "";
    const match = subjectsData.find((c) => c.classId === classId);
    if (match) return `${match.code} - Lớp ${match.className}`;
    return classId.toUpperCase();
  };

  const getStudentGroup = (classId: string) => {
    const match = subjectsData.find((c) => c.classId === classId);
    return match ? match.project : "Nhóm PBL-01";
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    
    setSelectedClass(cls);
    setSelectedNode(nodes[2]); // Default selection (An Lê)

    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <PageHeader
            title="Mạng lưới tương tác"
            description={`Bản đồ kết nối mức độ cộng tác giữa các thành viên của ${getStudentGroup(selectedClass)} (Lớp ${getClassName(selectedClass)})`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel: Filters */}
          <Card className="rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-sm overflow-hidden h-fit">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Nhóm & Tìm kiếm</h3>
                
                {/* Locked Group Badge */}
                <div className="flex items-center gap-2 px-4 h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs shadow-[0_2px_8px_rgba(234,88,12,0.08)] w-full justify-center">
                  <Users size={14} />
                  <span>{getStudentGroup(selectedClass)}</span>
                </div>

                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input 
                    placeholder="Tìm sinh viên..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background/50 border-border/50 h-10 rounded-xl font-medium text-xs placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Chú giải mạng lưới</h3>
                <div className="space-y-2 text-xs font-bold text-foreground/80">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors">
                    <div className="w-4.5 h-1 bg-indigo-500 rounded-full" />
                    <span>Commits & Push</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors">
                    <div className="w-4.5 h-1 border-b-2 border-dashed border-teal-500" />
                    <span>PR Reviews</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors">
                    <div className="w-4.5 h-1 border-b-2 border-dotted border-amber-500" />
                    <span>Comments</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors">
                    <div className="w-4.5 h-1 bg-rose-500 rounded-full" />
                    <span>Issue Assignment</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center Panel: Graph Visualization */}
          <Card className="lg:col-span-2 rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-lg overflow-hidden relative min-h-[500px] flex flex-col justify-between">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <Skeleton className="w-full h-96 rounded-2xl bg-muted/50" />
              </div>
            ) : (
              <CardContent className="p-0 flex-1 w-full relative">
                {/* SVG Connections/Edges */}
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
                        className="opacity-45 dark:opacity-30"
                      />
                    );
                  })}
                </svg>

                {/* Node Buttons */}
                {filteredNodes.map(node => (
                  <button 
                    key={node.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-black shadow-lg ${node.color} ${selectedNode?.id === node.id ? 'ring-4 ring-primary ring-offset-4 ring-offset-background dark:ring-offset-background/30 z-20 scale-[1.08]' : 'opacity-90 z-10'}`}
                    style={{ 
                      left: `${node.x}%`, 
                      top: `${node.y}%`,
                      width: `${node.size}px`,
                      height: `${node.size}px`,
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <span className="truncate w-full text-center tracking-tight px-1" style={{ fontSize: `${Math.max(10, node.size/5.2)}px` }}>
                      {node.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Right Panel: Node Details */}
          <Card className="rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-sm overflow-hidden h-fit">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto bg-muted" />
                  <Skeleton className="w-32 h-6 mx-auto bg-muted" />
                  <Skeleton className="w-full h-24 bg-muted" />
                </div>
              ) : selectedNode ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center space-y-2">
                    <div className={`w-20 h-20 mx-auto rounded-full ${selectedNode.color} flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4 ring-4 ring-white/10`}>
                      {selectedNode.initials}
                    </div>
                    <h2 className="text-lg font-extrabold text-foreground">{selectedNode.name}</h2>
                    <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider bg-muted/40 dark:bg-muted/20 px-3 py-1 rounded-full border border-border/10 w-fit mx-auto">
                      {getStudentGroup(selectedClass)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center shadow-sm">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Tương tác</p>
                      <p className="text-2xl font-black text-primary">{selectedNode.interactions}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center shadow-sm">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Mức độ</p>
                      <p className="text-base font-black text-emerald-500 mt-1">Năng nổ</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Cộng tác nhiều nhất</h3>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xs font-black ring-1 ring-indigo-500/30">M</div>
                          <span className="text-xs font-bold text-foreground">Minh Nguyễn</span>
                        </div>
                        <span className="text-xs font-extrabold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">15 lần</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center text-xs font-black ring-1 ring-pink-500/30">H</div>
                          <span className="text-xs font-bold text-foreground">Huy Hoàng</span>
                        </div>
                        <span className="text-xs font-extrabold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">8 lần</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-11 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm bg-primary text-primary-foreground hover:bg-primary/95 transition-all">
                    Xem Profile Chi Tiết
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <span className="mb-4 opacity-25 text-primary text-2xl">👥</span>
                  <p className="text-xs font-bold text-center leading-relaxed">Chọn một sinh viên trên biểu đồ<br/>để xem chi tiết</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
