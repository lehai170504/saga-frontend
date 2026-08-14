import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useStudentInteractions, useTeamMembers } from "@/features/lecturer/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectInteractionGraph({ courseId, teamId }: { courseId: string; teamId: string }) {
  const { data: members, isLoading: isLoadingMembers } = useTeamMembers(courseId, teamId);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const activeStudentId = selectedStudentId || (members?.content?.[0]?.studentId ?? "");

  const { data: interactionData, isLoading: isLoadingGraph } = useStudentInteractions(
    courseId,
    teamId,
    activeStudentId
  );

  const isLoading = isLoadingMembers || isLoadingGraph;

  const projectNodes = React.useMemo(() => {
    if (!interactionData?.nodes) return [];
    const total = interactionData.nodes.length;
    return interactionData.nodes.map((n, i) => {
      // Circular layout
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      const radius = 30; // 30% from center
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      const interactions = n.degree || 0;

      return {
        id: n.studentId,
        name: n.fullName || n.studentCode || "Unknown",
        size: Math.max(30, interactions * 5 + 20),
        x,
        y,
        color: "bg-primary",
        interactions,
        role: n.studentCode || "Member"
      };
    });
  }, [interactionData]);

  const projectEdges = React.useMemo(() => {
    if (!interactionData?.edges) return [];
    return interactionData.edges.map(e => ({
      source: e.fromStudentId,
      target: e.toStudentId,
      width: Math.max(1, e.sourceCount || 1),
      type: e.sourceType
    }));
  }, [interactionData]);

  const [selectedNode, setSelectedNode] = useState<{ id: string, name: string, size: number, role: string, x: number, y: number, color: string, interactions: number } | null>(null);
  const activeSelectedNode = selectedNode || (projectNodes.length > 0 ? projectNodes[0] : null);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
            <Share2 size={14} className="text-primary" />
            SAGA Early Warning System
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
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
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chọn Sinh Viên (Trung tâm)</h3>
              <Select value={activeStudentId} onValueChange={setSelectedStudentId} disabled={!members || isLoadingMembers}>
                <SelectTrigger className="w-full bg-background/50 border-border/50">
                  <SelectValue placeholder="Chọn sinh viên..." />
                </SelectTrigger>
                <SelectContent>
                  {members?.content?.map((m: { studentId: string; fullName: string; studentCode: string }) => (
                    <SelectItem key={m.studentId} value={m.studentId}>
                      {m.fullName} ({m.studentCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Chú giải mạng lưới</h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 bg-primary rounded-full" />
                  <span>Phối hợp (Commits/Tasks)</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 bg-success rounded-full" />
                  <span>Review Code</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 border-b-[3px] border-dotted border-primary" />
                  <span>Bình luận (Comments)</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-4 h-1 bg-destructive rounded-full" />
                  <span>Giao việc (Assignment)</span>
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
            {/* SVG Graph for Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm">
              <defs>
                <marker id="arrowhead-collab" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
                </marker>
                <marker id="arrowhead-review" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--success)" />
                </marker>
                <marker id="arrowhead-assignment" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--destructive)" />
                </marker>
              </defs>
              {projectEdges.map((edge, i) => {
                const source = projectNodes.find(n => n.id === edge.source);
                const target = projectNodes.find(n => n.id === edge.target);
                if (!source || !target) return null;

                let strokeDasharray = "";
                let stroke = "var(--primary)"; // collab
                let marker = "url(#arrowhead-collab)";

                if (edge.type === "REVIEWED") { stroke = "var(--success)"; marker = "url(#arrowhead-review)"; } // review
                if (edge.type === "COMMENTED_ON") { strokeDasharray = "4 4"; } // comments
                if (edge.type === "ASSIGNED_TO") { stroke = "var(--destructive)"; marker = "url(#arrowhead-assignment)"; } // assignment
                if (edge.type === "COLLABORATED_WITH") { stroke = "var(--primary)"; } // collab

                return (
                  <line
                    key={i}
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={stroke}
                    strokeWidth={Math.max(1.5, edge.width)}
                    strokeDasharray={strokeDasharray}
                    markerEnd={marker}
                    className={edge.type === "ASSIGNED_TO" ? "opacity-100" : "opacity-80"}
                  />
                );
              })}
            </svg>

            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-64 h-64 rounded-full" />
              </div>
            ) : projectNodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground font-medium">Chưa có dữ liệu mạng lưới tương tác</p>
              </div>
            ) : (
              projectNodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-bold shadow-lg ${node.color} ${activeSelectedNode?.id === node.id ? 'ring-4 ring-primary ring-offset-4 ring-offset-background z-20' : 'opacity-90 z-10'}`}
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
              ))
            )}
          </CardContent>
        </Card>

        {/* Right Panel: Node Details */}
        <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden h-fit">
          <CardContent className="p-6">
            {activeSelectedNode ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                  <div className={`w-20 h-20 mx-auto rounded-full ${activeSelectedNode.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4`}>
                    {activeSelectedNode.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{activeSelectedNode.name}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{activeSelectedNode.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tương tác</p>
                    <p className="text-2xl font-bold text-primary">{activeSelectedNode.interactions}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Mức độ</p>
                    <p className="text-lg font-bold text-success mt-1">Năng nổ</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Phân tích Chi tiết (AI)</h3>
                  <div className="space-y-2">
                    {projectEdges.filter(e => e.source === activeSelectedNode?.id || e.target === activeSelectedNode?.id).map((edge, idx) => {
                      const isSource = edge.source === activeSelectedNode?.id;
                      const otherNode = projectNodes.find(n => n.id === (isSource ? edge.target : edge.source));

                      const getActionText = () => {
                        if (edge.type === "ASSIGNED_TO") return isSource ? "Giao task cho" : "Được giao task bởi";
                        if (edge.type === "REVIEWED") return isSource ? "Review code của" : "Được review bởi";
                        if (edge.type === "COMMENTED_ON") return isSource ? "Bình luận bài của" : "Được bình luận bởi";
                        return isSource ? "Phối hợp với" : "Được phối hợp bởi";
                      };

                      const getBadgeColor = () => {
                        if (edge.type === "ASSIGNED_TO") return "bg-destructive/10 text-destructive border-destructive/20";
                        if (edge.type === "REVIEWED") return "bg-success/10 text-success border-success/20";
                        if (edge.type === "COMMENTED_ON") return "bg-primary/10 text-primary border-primary/20";
                        return "bg-primary/10 text-primary border-primary/20";
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

                <Button asChild className="w-full rounded-xl font-bold h-10 hover-lift">
                  <Link href={`/lecturer/${courseId}/students/${activeSelectedNode.id}`}>
                    Xem Profile Chi Tiết
                  </Link>
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
