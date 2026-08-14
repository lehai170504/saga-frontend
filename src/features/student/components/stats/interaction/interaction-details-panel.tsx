"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, AlertTriangle, UserCheck } from "lucide-react";
import { InteractionEdge, InteractionNode } from "@/features/projects/types";

interface InteractionDetailsPanelProps {
  nodes: InteractionNode[];
  edges: InteractionEdge[];
  centralNode?: InteractionNode;
  getEdgeColor: (type: string) => string;
  getEdgeLabel: (type: string) => string;
}

export function InteractionDetailsPanel({
  nodes,
  edges,
  centralNode,
  getEdgeColor,
  getEdgeLabel,
}: InteractionDetailsPanelProps) {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/40">
          <Users size={18} className="text-primary" />
          <h3 className="font-extrabold text-base text-foreground">Chi tiết Liên kết Tương tác</h3>
        </div>

        {/* Central Student Info Banner */}
        {centralNode && (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-foreground">{centralNode.fullName}</div>
              <div className="text-xs font-semibold text-muted-foreground">{centralNode.studentCode}</div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-xs">
              Bậc {centralNode.degree}
            </Badge>
          </div>
        )}

        {/* Edges List */}
        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {edges.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-medium">
              Sinh viên này chưa có tương tác với các thành viên khác trong đợt này.
            </div>
          ) : (
            edges.map((edge, i) => {
              const fromUser = nodes.find((n) => n.studentId === edge.fromStudentId);
              const toUser = nodes.find((n) => n.studentId === edge.toStudentId);

              return (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-background/60 border border-border/40 flex items-center justify-between text-xs transition-all hover:border-border"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-foreground truncate">{fromUser?.fullName || "SV"}</span>
                    <ArrowRight size={12} className="text-muted-foreground shrink-0" />
                    <span className="font-bold text-foreground truncate">{toUser?.fullName || "SV"}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 font-extrabold text-[10px] px-2 py-0.5"
                    style={{
                      borderColor: `${getEdgeColor(edge.sourceType)}40`,
                      color: getEdgeColor(edge.sourceType),
                      backgroundColor: `${getEdgeColor(edge.sourceType)}10`,
                    }}
                  >
                    {getEdgeLabel(edge.sourceType)}: {edge.sourceCount}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Isolation Check Banner */}
      {centralNode && centralNode.degree === 0 ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
          <AlertTriangle size={18} className="shrink-0" />
          <span className="font-bold">
            Cảnh báo: Sinh viên hiện đang cô lập (không có liên kết tương tác với nhóm).
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
          <UserCheck size={18} className="shrink-0" />
          <span className="font-bold">
            Sinh viên duy trì tương tác tốt với các thành viên khác trong nhóm.
          </span>
        </div>
      )}
    </Card>
  );
}
