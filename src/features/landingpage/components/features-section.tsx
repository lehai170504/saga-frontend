"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, GitPullRequest, Users, Layout } from "lucide-react";
import { fadeUp, staggerContainer } from "./animations";

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-4xl md:text-5xl font-black text-foreground mb-6"
        >
          Trải nghiệm <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Đột phá</span>
        </motion.h2>
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg"
        >
          Giao diện được thiết kế tối giản, tập trung hiển thị các dữ liệu cốt lõi, giúp giảng viên phát hiện sớm sinh viên "lười biếng" và khen thưởng các cá nhân xuất sắc.
        </motion.p>
      </div>

      <motion.div 
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]"
      >
        {/* Large Card 1 */}
        <motion.div 
          variants={fadeUp}
          className="md:col-span-2 bg-gradient-to-br from-card to-background border border-border rounded-3xl p-10 relative overflow-hidden group hover:border-orange-500/50 transition-colors"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-500" />
          <div className="relative z-10 w-16 h-16 bg-orange-100 dark:bg-orange-950/50 rounded-2xl flex items-center justify-center mb-8 border border-orange-200 dark:border-orange-900 shadow-sm">
            <LineChart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4 relative z-10">Phân tích Tiến độ Real-time</h3>
          <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-lg">
            Tạm biệt các báo cáo bằng tay. Biểu đồ Burndown và Heatmap đóng góp được vẽ tự động dựa trên Commit thực tế mỗi giờ.
          </p>
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500">
            <div className="w-64 h-48 bg-card rounded-tl-2xl border-l border-t border-border shadow-2xl p-4 flex items-end gap-2">
               {[30, 70, 45, 90, 65, 100].map((h, i) => (
                 <div key={i} className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-md" style={{ height: `${h}%` }} />
               ))}
            </div>
          </div>
        </motion.div>

        {/* Small Card 1 */}
        <motion.div 
          variants={fadeUp}
          className="bg-card border border-border rounded-3xl p-8 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all flex flex-col justify-between group"
        >
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-900 group-hover:scale-110 transition-transform">
            <GitPullRequest className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Code Metrics</h3>
            <p className="text-muted-foreground font-medium">Theo dõi chất lượng Code, Pull Requests và dòng code thay đổi.</p>
          </div>
        </motion.div>

        {/* Small Card 2 */}
        <motion.div 
          variants={fadeUp}
          className="bg-card border border-border rounded-3xl p-8 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all flex flex-col justify-between group"
        >
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-900 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Mạng Tương tác</h3>
            <p className="text-muted-foreground font-medium">Phân tích Graph Node-Edge để tìm ra người "gánh team".</p>
          </div>
        </motion.div>

        {/* Large Card 2 */}
        <motion.div 
          variants={fadeUp}
          className="md:col-span-2 bg-gradient-to-br from-indigo-500/5 to-transparent border border-border rounded-3xl p-10 relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
        >
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-500" />
           <div className="relative z-10 w-16 h-16 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mb-8 border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <Layout className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4 relative z-10">Đồng bộ Jira Board</h3>
          <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-lg">
            Khớp nối từng Task trên Jira với Commit trên GitHub để đánh giá chính xác mức độ hoàn thành công việc của từng thành viên.
          </p>
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:translate-y-0 transition-transform duration-500 opacity-60">
             <div className="flex gap-4 p-6 bg-card border border-border rounded-3xl shadow-2xl rotate-12">
               <div className="w-32 space-y-3 bg-muted/50 p-3 rounded-xl border border-border"><div className="h-4 bg-foreground/20 rounded w-1/2"/><div className="h-16 bg-card rounded-md border border-border shadow-sm"/><div className="h-16 bg-card rounded-md border border-border shadow-sm"/></div>
               <div className="w-32 space-y-3 bg-muted/50 p-3 rounded-xl border border-border"><div className="h-4 bg-foreground/20 rounded w-1/2"/><div className="h-16 bg-card rounded-md border border-border shadow-sm"/></div>
               <div className="w-32 space-y-3 bg-muted/50 p-3 rounded-xl border border-border"><div className="h-4 bg-foreground/20 rounded w-1/2"/><div className="h-16 bg-card rounded-md border border-border shadow-sm"/></div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
