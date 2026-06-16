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
  // Hàm lấy màu sắc class tương ứng với level hoạt động
  const getLevelClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-indigo-100 dark:bg-indigo-900";
      case 2:
        return "bg-indigo-300 dark:bg-indigo-700";
      case 3:
        return "bg-indigo-500 dark:bg-indigo-500";
      case 4:
        return "bg-indigo-700 dark:bg-indigo-300";
      default:
        return "bg-slate-100 dark:bg-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Heatmap hoạt động
          </h2>
          <p className="text-slate-500">
            Giám sát tính liên tục trong hoạt động làm việc nhóm và code của
            sinh viên.
          </p>
        </div>
        <Select defaultValue="group-1">
          <SelectTrigger className="w-[180px] bg-white border-slate-200">
            <SelectValue placeholder="Chọn nhóm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group-1">Nhóm 1 (SAGA)</SelectItem>
            <SelectItem value="group-2">Nhóm 2 (E-Commerce)</SelectItem>
            <SelectItem value="group-3">Nhóm 3 (IoT SmartHome)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Tần suất đóng góp hệ thống (30 ngày gần nhất)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 max-w-4xl p-4 bg-slate-50 rounded-xl justify-center sm:justify-start">
            {heatmapData.map((item, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-md flex flex-col items-center justify-center text-[10px] font-medium transition-all hover:scale-105 cursor-pointer ${getLevelClass(item.level)} ${item.level > 2 ? "text-white" : "text-slate-600"}`}
                title={`${item.date}: ${item.count} hoạt động`}
              >
                <span>{item.date.split("-")[2]}</span>
              </div>
            ))}
          </div>

          {/* Chú giải màu sắc */}
          <div className="flex items-center gap-2 mt-6 text-xs text-slate-500 px-1">
            <span>Ít hoạt động</span>
            <div className="w-4 h-4 rounded bg-slate-100 border"></div>
            <div className="w-4 h-4 rounded bg-indigo-100"></div>
            <div className="w-4 h-4 rounded bg-indigo-300"></div>
            <div className="w-4 h-4 rounded bg-indigo-500"></div>
            <div className="w-4 h-4 rounded bg-indigo-700"></div>
            <span>Tích cực cao</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
