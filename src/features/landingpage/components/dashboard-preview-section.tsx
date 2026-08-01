"use client";

import React from "react";
import { motion } from "framer-motion";

export function DashboardPreviewSection() {
  return (
    <section className="relative px-6 pb-20 md:pb-24 max-w-[90rem] mx-auto overflow-hidden">
      {/* Realistic Dashboard Mockup */}
      <div className="w-full max-w-5xl relative z-20 flex justify-center mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full relative group"
        >
          {/* Soft shadow */}
          <div className="absolute -inset-1 bg-black/5 dark:bg-white/5 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />

          <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-card transition-all duration-500">
            {/* Header Bar */}
            <div className="h-12 bg-muted/50 flex items-center px-4 gap-4 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 max-w-sm h-7 bg-background border border-border rounded-md flex items-center px-3 text-xs text-muted-foreground font-medium">
                saga.fpt.edu.vn/dashboard
              </div>
            </div>

            {/* Dashboard UI */}
            <div className="p-6 bg-background flex flex-col md:flex-row gap-6 text-left">
              {/* Sidebar Data */}
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
                <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                  <div className="text-sm text-muted-foreground font-medium mb-1">Tổng Commit</div>
                  <div className="text-3xl font-bold text-foreground">1,284</div>
                  <div className="text-xs text-success mt-2 flex items-center gap-1">
                    <span className="font-bold">+12%</span> tuần này
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                  <div className="text-sm text-muted-foreground font-medium mb-1">Jira Issues Done</div>
                  <div className="text-3xl font-bold text-foreground">142</div>
                  <div className="text-xs text-success mt-2 flex items-center gap-1">
                    <span className="font-bold">+5</span> hôm nay
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                  <div className="text-sm text-muted-foreground font-medium mb-1">Cảnh báo rủi ro</div>
                  <div className="text-3xl font-bold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground mt-2">Dự án đang an toàn</div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Chart Area */}
                <div className="p-5 rounded-lg border border-border bg-card shadow-sm flex-1 min-h-[200px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-foreground">Tỷ lệ Đóng góp (Slicing Pie)</h3>
                    <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Live Sync</div>
                  </div>
                  {/* Horizontal Bar Chart Mockup */}
                  <div className="flex-1 flex flex-col justify-center gap-4">
                    {[
                      { name: "Lê Hoàng Hải", val: 35, color: "bg-blue-500" },
                      { name: "Nguyễn Văn A", val: 28, color: "bg-emerald-500" },
                      { name: "Trần Thị B", val: 22, color: "bg-amber-500" },
                      { name: "Phạm Văn C", val: 15, color: "bg-purple-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-24 text-sm font-medium text-muted-foreground truncate">{item.name}</div>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                        </div>
                        <div className="w-10 text-right text-sm font-bold text-foreground">{item.val}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden hidden md:block">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Thành viên</th>
                        <th className="px-4 py-3 font-medium">Nền tảng</th>
                        <th className="px-4 py-3 font-medium">Hoạt động</th>
                        <th className="px-4 py-3 font-medium text-right">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">Lê Hoàng Hải</td>
                        <td className="px-4 py-3"><span className="bg-foreground/10 text-foreground px-2 py-0.5 rounded text-xs font-semibold">GitHub</span></td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">Merged PR #142 (Fix Auth bug)</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">2 phút trước</td>
                      </tr>
                      <tr className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">Nguyễn Văn A</td>
                        <td className="px-4 py-3"><span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-semibold">Jira</span></td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">Moved SAGA-45 to Done</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">15 phút trước</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
