"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Users, Clock, ShieldAlert, GitBranch, Database, BarChart3, Activity } from "lucide-react";
import { fadeUp, staggerContainer, scaleUp } from "./animations";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 max-w-[90rem] mx-auto space-y-32">
      {/* The Problem Section - Realistic Alert Toasts Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6"
          >
            Dự án nhóm <br />
            đang là một <span className="text-destructive">hộp đen?</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-muted-foreground font-medium text-lg mb-8 leading-relaxed"
          >
            Quản trị dự án học thuật đang dựa quá nhiều vào niềm tin và cảm tính, dẫn đến kết quả đánh giá sai lệch.
          </motion.p>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex items-center gap-4 text-sm font-bold"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                </div>
              ))}
            </div>
            <span className="text-muted-foreground">+500 sinh viên đang gặp vấn đề này</span>
          </motion.div>
        </div>

        <div className="md:w-1/2 w-full relative">
          <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full -z-10" />

          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-4 relative"
          >
            {/* Alert 1 */}
            <motion.div variants={scaleUp} className="bg-card border border-destructive/20 shadow-xl rounded-2xl p-5 flex gap-4 w-full md:w-[90%] md:ml-auto hover:-translate-x-2 transition-transform duration-300">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground text-sm">Đánh giá cảm tính</h3>
                  <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded font-bold">Lỗ hổng</span>
                </div>
                <p className="text-xs text-muted-foreground">Bỏ phiếu kín cuối kỳ dẫn đến cào bằng điểm số, không phản ánh đúng nỗ lực cá nhân.</p>
              </div>
            </motion.div>

            {/* Alert 2 */}
            <motion.div variants={scaleUp} className="bg-card border border-primary/20 shadow-xl rounded-2xl p-5 flex gap-4 w-full md:w-[95%] mx-auto hover:-translate-x-2 transition-transform duration-300 relative z-10">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground text-sm">Gánh team (Bus Factor)</h3>
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">Phổ biến</span>
                </div>
                <p className="text-xs text-muted-foreground">1-2 cá nhân ôm 90% lượng code, trong khi các thành viên khác lại "free-ride".</p>
              </div>
            </motion.div>

            {/* Alert 3 */}
            <motion.div variants={scaleUp} className="bg-card border border-warning/20 shadow-xl rounded-2xl p-5 flex gap-4 w-full md:w-[90%] md:mr-auto hover:-translate-x-2 transition-transform duration-300">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground text-sm">Trễ tiến độ ngầm</h3>
                  <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded font-bold">Rủi ro</span>
                </div>
                <p className="text-xs text-muted-foreground">Blockers không được báo cáo kịp thời, tạo "nợ kỹ thuật" tích tụ cuối Sprint.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Key Features Section - Bento Box Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4"
          >
            Tính năng <span className="text-primary">Cốt lõi</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg"
          >
            Trao quyền kiểm soát dữ liệu hoàn toàn cho quản lý dự án.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]"
        >
          {/* Feature 1: Slicing Pie (Span 2) */}
          <motion.div
            variants={scaleUp}
            className="md:col-span-2 bg-card border border-border shadow-sm rounded-3xl overflow-hidden flex flex-col group hover:border-primary/50 transition-colors duration-500 relative"
          >
            <div className="h-[220px] bg-muted/30 w-full p-8 flex items-end justify-center relative overflow-hidden">
              {/* Mini Mockup: Chart */}
              <div className="w-full max-w-sm bg-background border border-border rounded-t-xl shadow-xl p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs font-bold">Contribution</div>
                  <div className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">LIVE</div>
                </div>
                <div className="space-y-3">
                  {[45, 30, 25].map((val, i) => (
                    <div key={i} className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Slicing Pie Algorithm</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Tự động lượng hóa công sức dựa trên Story Points và khối lượng Code thực tế, đảm bảo tỷ lệ đóng góp công bằng nhất.
              </p>
            </div>
          </motion.div>

          {/* Feature 2: Live Sync (Span 1) */}
          <motion.div
            variants={scaleUp}
            className="col-span-1 bg-card border border-border shadow-sm rounded-3xl overflow-hidden flex flex-col group hover:border-blue-500/50 transition-colors duration-500 relative"
          >
            <div className="h-[220px] bg-blue-500/5 w-full flex items-center justify-center relative overflow-hidden">
              {/* Mini Mockup: Sync Nodes */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-background border border-border rounded-xl shadow-lg flex items-center justify-center z-10 group-hover:-translate-y-2 transition-transform duration-500">
                  <GitBranch className="w-6 h-6 text-foreground" />
                </div>
                <div className="w-8 h-0.5 bg-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500 w-full animate-[shimmer_1.5s_infinite]" style={{ transform: 'translateX(-100%)' }} />
                </div>
                <div className="w-14 h-14 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center z-10 scale-110">
                  <Activity className="w-7 h-7" />
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Đồng bộ Thời gian thực</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Kết nối trực tiếp GitHub & Jira, cập nhật dữ liệu từng giây.
              </p>
            </div>
          </motion.div>

          {/* Feature 3: Early Warning (Span 1) */}
          <motion.div
            variants={scaleUp}
            className="col-span-1 bg-card border border-border shadow-sm rounded-3xl overflow-hidden flex flex-col group hover:border-destructive/50 transition-colors duration-500 relative"
          >
            <div className="h-[220px] bg-destructive/5 w-full flex flex-col items-center justify-center relative overflow-hidden p-6">
              {/* Mini Mockup: Red Flag */}
              <div className="w-full bg-background border border-destructive/20 rounded-xl shadow-lg p-4 group-hover:scale-105 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-sm font-bold text-destructive">Cảnh báo rủi ro</span>
                </div>
                <div className="text-xs text-muted-foreground">Phát hiện tình trạng "Bus Factor" cao trong Sprint 3.</div>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Hệ thống Cảnh báo sớm</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Phát hiện "gánh team" và cảnh báo rủi ro dự án ngay lập tức.
              </p>
            </div>
          </motion.div>

          {/* Feature 4: Traceability (Span 2) */}
          <motion.div
            variants={scaleUp}
            className="md:col-span-2 bg-card border border-border shadow-sm rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-primary/50 transition-colors duration-500 relative"
          >
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Minh bạch Dữ liệu 100%</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Mọi điểm số đều có bằng chứng từ Commits và Tasks, loại bỏ hoàn toàn cảm tính.
              </p>
            </div>
            <div className="md:w-1/2 bg-muted/30 p-8 flex items-center justify-center relative overflow-hidden">
              {/* Mini Mockup: Data Table */}
              <div className="w-full bg-background border border-border rounded-xl shadow-xl flex flex-col overflow-hidden group-hover:-translate-x-2 transition-transform duration-500">
                <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-4 text-[10px] font-bold text-muted-foreground uppercase">
                  <div className="flex-1">Task</div>
                  <div className="w-16 text-right">Points</div>
                </div>
                <div className="p-2 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-2 py-1 rounded bg-muted/30">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center text-[8px] text-blue-500">J</div>
                        <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                      </div>
                      <div className="w-16 text-right text-xs font-bold">5</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
