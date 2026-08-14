"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";
import { InteractionEdge, InteractionNode } from "@/features/projects/types";

interface InteractionSvgGraphProps {
  nodes: InteractionNode[];
  edges: InteractionEdge[];
  centralNode?: InteractionNode;
  peripheralNodes: InteractionNode[];
  onSelectFocalStudent: (studentId: string) => void;
  getEdgeColor: (type: string) => string;
}

export function InteractionSvgGraph({
  nodes,
  edges,
  centralNode,
  peripheralNodes,
  onSelectFocalStudent,
  getEdgeColor,
}: InteractionSvgGraphProps) {
  const [hoveredStudent, setHoveredStudent] = useState<InteractionNode | null>(null);

  // Node position calculation in SVG canvas (560 x 400)
  const width = 560;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const orbitRadius = 135;

  // Calculate peripheral node coordinates on circle
  const nodePositions = new Map<string, { x: number; y: number }>();
  nodePositions.set(centralNode?.studentId || "", { x: centerX, y: centerY });

  peripheralNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / (peripheralNodes.length || 1) - Math.PI / 2;
    const x = centerX + orbitRadius * Math.cos(angle);
    const y = centerY + orbitRadius * Math.sin(angle);
    nodePositions.set(node.studentId, { x, y });
  });

  return (
    <Card className="lg:col-span-2 rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Network size={18} />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">Sơ đồ Mạng lưới Tương tác</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Bấm vào từng sinh viên để xoay chuyển góc nhìn trung tâm
            </p>
          </div>
        </div>
        {centralNode && (
          <Badge variant="outline" className="rounded-xl text-[10px] font-extrabold py-1 px-3 border-primary/30 text-primary bg-primary/5">
            Bậc tương tác: {centralNode.degree}
          </Badge>
        )}
      </div>

      {/* Interactive SVG Area */}
      <div className="relative w-full overflow-hidden flex items-center justify-center py-4 bg-muted/20 rounded-[2rem] border border-border/30">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148, 163, 184, 0.6)" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, idx) => {
            const fromPos = nodePositions.get(edge.fromStudentId);
            const toPos = nodePositions.get(edge.toStudentId);

            if (!fromPos || !toPos) return null;

            const color = getEdgeColor(edge.sourceType);
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={`${edge.fromStudentId}-${edge.toStudentId}-${edge.sourceType}-${idx}`} className="pointer-events-none">
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={color}
                  strokeWidth={Math.min(1 + edge.sourceCount * 0.8, 5)}
                  strokeOpacity={0.7}
                  markerEnd="url(#arrow)"
                />
                {/* Edge Label Pill */}
                <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="20"
                    rx="10"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {edge.sourceCount}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node.studentId);
            if (!pos) return null;

            const isCentral = node.studentId === centralNode?.studentId;
            const r = isCentral ? 38 : 28;

            return (
              <g
                key={node.studentId}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => onSelectFocalStudent(node.studentId)}
                onMouseEnter={() => setHoveredStudent(node)}
                onMouseLeave={() => setHoveredStudent(null)}
                className="cursor-pointer transition-transform duration-200 ease-out hover:scale-110 group origin-center"
              >
                {/* Invisible Hit-Box Circle to eliminate hover jitter loop */}
                <circle
                  r={r + 18}
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                />

                {/* Central Glow */}
                {isCentral && (
                  <circle
                    r={r + 8}
                    fill="var(--primary, #3b82f6)"
                    fillOpacity={0.15}
                    className="animate-pulse pointer-events-none"
                  />
                )}

                <circle
                  r={r}
                  fill={isCentral ? "var(--primary, #3b82f6)" : "rgba(30, 41, 59, 0.95)"}
                  stroke={isCentral ? "#ffffff" : "var(--border, rgba(255,255,255,0.2))"}
                  strokeWidth={isCentral ? 3 : 2}
                  className="shadow-xl pointer-events-none"
                />

                {/* Student Initial (Centered) */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#ffffff"
                  fontSize={isCentral ? "14" : "12"}
                  fontWeight="900"
                  className="pointer-events-none select-none"
                >
                  {node.fullName?.charAt(0) || "S"}
                </text>

                {/* Name Label below Node */}
                <g transform={`translate(0, ${r + 14})`} className="pointer-events-none">
                  <rect
                    x="-45"
                    y="-9"
                    width="90"
                    height="18"
                    rx="9"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke="rgba(255, 255, 255, 0.15)"
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {node.fullName.split(" ").slice(-1)[0]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Floating Glassmorphism Tooltip Card on Hover */}
          {hoveredStudent && (() => {
            const pos = nodePositions.get(hoveredStudent.studentId);
            if (!pos) return null;
            const isCentral = hoveredStudent.studentId === centralNode?.studentId;
            const offsetY = isCentral ? -48 : -38;

            const nameStr = hoveredStudent.fullName || "";
            const degreeStr = `Bậc tương tác: ${hoveredStudent.degree} kết nối`;
            const maxCharLen = Math.max(nameStr.length, degreeStr.length);
            const tooltipWidth = Math.max(140, Math.min(260, maxCharLen * 7.5 + 28));
            const halfWidth = tooltipWidth / 2;

            return (
              <g
                transform={`translate(${pos.x}, ${pos.y + offsetY})`}
                className="pointer-events-none animate-in fade-in zoom-in-95 duration-200"
              >
                <rect
                  x={-halfWidth}
                  y="-26"
                  width={tooltipWidth}
                  height="38"
                  rx="12"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke="var(--primary, #3b82f6)"
                  strokeWidth="1.5"
                  className="shadow-2xl"
                />
                <text
                  textAnchor="middle"
                  y="-9"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="900"
                  className="pointer-events-none"
                >
                  {nameStr}
                </text>
                <text
                  textAnchor="middle"
                  y="7"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {degreeStr}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </Card>
  );
}
