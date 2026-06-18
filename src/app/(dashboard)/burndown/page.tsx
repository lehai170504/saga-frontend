// src/app/burndown/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Tiến độ Sprint (Burndown Chart)
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Theo dõi tốc độ xử lý Task thực tế từ Jira so với kế hoạch lý tưởng
          của dự án.
        </p>
      </div>

      {/* Chart Card */}
      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
            Biểu đồ khối lượng công việc còn lại (%)
          </CardTitle>
          <CardDescription className="pl-4">
            Cập nhật tự động dựa trên trạng thái Issue (To Do, In Progress,
            Done)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={burndownData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {/* Gradient cho đường thực tế - Cam SAGA */}
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  {/* Gradient cho đường lý tưởng - Xanh Jira */}
                  <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052CC" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#f1f5f9"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  label={{
                    value: "Công việc còn lại (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 15,
                    fill: "#94a3b8",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />

                <Legend
                  wrapperStyle={{ paddingTop: "20px", fontWeight: 500 }}
                  iconType="circle"
                />

                {/* Đường tiến độ lý tưởng (Xanh Jira) */}
                <Area
                  type="monotone"
                  name="Kế hoạch lý tưởng"
                  dataKey="ideal"
                  stroke="#0052CC"
                  strokeDasharray="6 6"
                  fill="url(#colorIdeal)"
                  strokeWidth={2.5}
                />

                {/* Đường tiến độ thực tế (Cam SAGA) */}
                <Area
                  type="monotone"
                  name="Thực tế đạt được"
                  dataKey="actual"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  strokeWidth={3.5}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#f97316" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
