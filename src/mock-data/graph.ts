// src/mock-data/graph.ts
import { Node, Edge } from "reactflow";

// Danh sách sinh viên (Nodes)
export const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    data: { label: "Nguyễn Văn A (Leader)" },
    position: { x: 250, y: 50 },
    style: {
      background: "#e0e7ff",
      border: "2px solid #6366f1",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  },
  {
    id: "2",
    type: "default",
    data: { label: "Trần Thị B" },
    position: { x: 100, y: 200 },
    style: {
      background: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
    },
  },
  {
    id: "3",
    type: "default",
    data: { label: "Lê Văn C" },
    position: { x: 400, y: 200 },
    style: {
      background: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
    },
  },
  {
    id: "4",
    type: "default",
    data: { label: "Phạm Minh D (Ít tương tác)" },
    position: { x: 250, y: 350 },
    style: {
      background: "#fff1f2",
      border: "2px solid #f43f5e",
      borderRadius: "8px",
    }, // Màu đỏ cảnh báo
  },
];

// Mối quan hệ tương tác (Edges)
export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "45 tương tác",
    animated: true,
    style: { stroke: "#6366f1" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "30 tương tác",
    animated: true,
    style: { stroke: "#6366f1" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    label: "12 tương tác",
    style: { stroke: "#cbd5e1" },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    label: "2 tương tác",
    style: { stroke: "#f43f5e", strokeDasharray: "5" },
  }, // Nét đứt biểu thị tương tác yếu
];
