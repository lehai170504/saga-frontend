"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { burndownData } from "@/mock-data/progress";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/DataState";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CheckCircle2 } from "lucide-react";

interface BurndownDay {
  day: string;
  ideal: number;
  actual: number;
}

export default function BurndownPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedDay, setSelectedDay] = useState<BurndownDay | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Biểu đồ Burndown"
        description="Số Story Points còn lại — Sprint 4 của PBL-07"
      />

      <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white flex flex-col pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 pb-8 gap-4">
          <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-6 border-b-2 border-dashed border-blue-600"></span>
              Tiến độ lý tưởng
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 border-b-2 border-orange-500"></span>Tiến độ
              thực tế
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isLoading ? (
              <>
                <Skeleton className="w-28 h-8 rounded-full" />
                <Skeleton className="w-28 h-8 rounded-full" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                  Cam kết{" "}
                  <span className="text-slate-900 font-bold text-sm">80</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/50 text-orange-400 rounded-full text-xs font-semibold">
                  Còn lại{" "}
                  <span className="text-orange-500 font-bold text-sm">24</span>
                </div>
              </>
            )}
          </div>
        </div>

        <CardContent className="px-2 pb-6">
          <div className="h-[450px] w-full">
            {isLoading ? (
              <div className="w-full h-full px-6">
                <Skeleton className="w-full h-full rounded-xl opacity-50" />
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => setIsError(false)} />
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart
                  data={burndownData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  onClick={(e) => {
                    if (e && typeof e === "object" && "activePayload" in e) {
                      const activePayload = (e as { activePayload?: { payload: BurndownDay }[] }).activePayload;
                      if (activePayload && activePayload.length > 0) {
                        setSelectedDay(activePayload[0].payload);
                      }
                    }
                  }}
                  className="cursor-pointer"
                >
                  <defs>
                    <linearGradient
                      id="colorActual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#f97316"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    domain={[0, 80]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    stroke="#2563eb"
                    strokeDasharray="6 6"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drill-down Drawer */}
      <Sheet open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <SheetContent className="bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl text-orange-600">
              Chi tiết ngày {selectedDay?.day}
            </SheetTitle>
            <SheetDescription>
              Dữ liệu cập nhật từ Jira & GitHub
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">
                Story Points còn lại
              </p>
              <p className="text-3xl font-extrabold text-slate-800">
                {selectedDay?.actual}
              </p>
            </div>
            <h4 className="font-bold text-slate-700 pt-4 border-b pb-2">
              Tasks đã hoàn thành
            </h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      SAGA-10{i}: API Integration
                    </p>
                    <p className="text-xs text-slate-500">
                      Hoàn thành bởi Minh Anh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
