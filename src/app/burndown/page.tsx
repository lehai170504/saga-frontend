// src/app/burndown/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { burndownData } from "@/mock-data/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function BurndownPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Tiến độ Task (Burndown Chart)
        </h2>
        <p className="text-slate-500">
          So sánh tốc độ xử lý công việc thực tế với kế hoạch lý tưởng của
          Sprint.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Biểu đồ khối lượng công việc còn lại (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={burndownData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  label={{
                    value: "Công việc còn lại (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: "#64748b",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                {/* Đường tiến độ lý tưởng */}
                <Area
                  type="monotone"
                  name="Đường lý tưởng"
                  dataKey="ideal"
                  stroke="#cbd5e1"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={2}
                />
                {/* Đường tiến độ thực tế */}
                <Area
                  type="monotone"
                  name="Thực tế đạt được"
                  dataKey="actual"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
