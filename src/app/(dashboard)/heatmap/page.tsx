// src/app/heatmap/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { heatmapData } from "@/mock-data/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HeatmapPage() {
  // Đổi tone màu sang dải Cam SAGA (Orange) chuẩn GitHub Heatmap style
  const getLevelClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-orange-100 dark:bg-orange-900/40 border-orange-200";
      case 2:
        return "bg-orange-300 dark:bg-orange-700/60 border-orange-400";
      case 3:
        return "bg-orange-500 dark:bg-orange-500 border-orange-600";
      case 4:
        return "bg-orange-600 dark:bg-orange-400 border-orange-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Heatmap Hoạt Động
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Giám sát tính liên tục trong hoạt động làm việc nhóm và commit code.
          </p>
        </div>
        <Select defaultValue="group-1">
          <SelectTrigger className="w-[200px] h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all">
            <SelectValue placeholder="Chọn nhóm" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="group-1" className="font-medium">
              Nhóm 1 (SAGA)
            </SelectItem>
            <SelectItem value="group-2">Nhóm 2 (E-Commerce)</SelectItem>
            <SelectItem value="group-3">Nhóm 3 (IoT SmartHome)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
            Tần suất đóng góp hệ thống (30 ngày gần nhất)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2.5 max-w-4xl p-6 bg-white border border-slate-100 rounded-xl justify-center sm:justify-start shadow-inner">
            {heatmapData.map((item, index) => (
              <div
                key={index}
                className={`w-11 h-11 rounded-lg border flex flex-col items-center justify-center text-[11px] font-bold transition-all hover:scale-110 hover:shadow-md cursor-pointer ${getLevelClass(item.level)} ${item.level > 2 ? "text-white" : "text-slate-600"}`}
                title={`${item.date}: ${item.count} hoạt động`}
              >
                <span>{item.date.split("-")[2]}</span>
              </div>
            ))}
          </div>

          {/* Chú giải màu sắc */}
          <div className="flex items-center gap-2 mt-6 text-sm font-medium text-slate-500 px-2">
            <span>Ít hoạt động</span>
            <div className="w-5 h-5 rounded bg-slate-100 border border-slate-200"></div>
            <div className="w-5 h-5 rounded bg-orange-100 border border-orange-200"></div>
            <div className="w-5 h-5 rounded bg-orange-300 border border-orange-400"></div>
            <div className="w-5 h-5 rounded bg-orange-500 border border-orange-600"></div>
            <div className="w-5 h-5 rounded bg-orange-600 border border-orange-700"></div>
            <span>Tích cực cao</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
