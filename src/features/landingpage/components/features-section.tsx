"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Users, Clock, ShieldAlert, Network } from "lucide-react";
import { fadeUp, staggerContainer, scaleUp } from "./animations";

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto space-y-32">
      {/* The Problem Section */}
      <div>
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl md:text-5xl font-black text-foreground mb-6"
          >
            Nhận diện <span className="bg-gradient-to-r from-red-500 to-indigo-500 bg-clip-text text-transparent">Nỗi đau</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg"
          >
            Những vấn đề cố hữu trong làm việc nhóm Agile đang bào mòn tinh thần và làm sai lệch kết quả đánh giá năng lực thực sự.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Problem 1 */}
          <motion.div variants={scaleUp} className="bg-card/40 backdrop-blur-xl border border-white/5 dark:border-white/10 shadow-xl hover:shadow-red-500/10 rounded-3xl p-8 hover:border-red-500/50 hover:bg-card/60 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 blur-3xl rounded-full group-hover:bg-red-500/20 transition-all duration-500" />
            <div className="relative z-10 w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">Đánh giá cảm tính</h3>
            <p className="text-muted-foreground font-medium relative z-10">Bỏ phiếu kín và cào bằng điểm số vào cuối kỳ, thiếu minh bạch và không phản ánh đúng giá trị đóng góp thật sự.</p>
          </motion.div>

          {/* Problem 2 */}
          <motion.div variants={scaleUp} className="bg-card/40 backdrop-blur-xl border border-white/5 dark:border-white/10 shadow-xl hover:shadow-indigo-500/10 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-card/60 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-500" />
            <div className="relative z-10 w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Users className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">Gánh team (Bus Factor)</h3>
            <p className="text-muted-foreground font-medium relative z-10">Tình trạng 1-2 cá nhân phải đảm đương toàn bộ khối lượng công việc, gây quá tải (burnout) trong khi các thành viên khác lại "free-ride".</p>
          </motion.div>

          {/* Problem 3 */}
          <motion.div variants={scaleUp} className="bg-card/40 backdrop-blur-xl border border-white/5 dark:border-white/10 shadow-xl hover:shadow-blue-500/10 rounded-3xl p-8 hover:border-blue-500/50 hover:bg-card/60 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
            <div className="relative z-10 w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Clock className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">Trễ tiến độ ngầm</h3>
            <p className="text-muted-foreground font-medium relative z-10">Blockers không được báo cáo kịp thời, tạo ra "nợ kỹ thuật" tích tụ và làm chệch hướng hoàn toàn mục tiêu của Sprint.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Key Features Section */}
      <div>
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl md:text-5xl font-black text-foreground mb-6"
          >
            Tính năng <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">Cốt lõi</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg"
          >
            SAGA cung cấp hệ sinh thái công cụ giám sát và đánh giá mạnh mẽ, trao quyền cho nhóm kiểm soát hoàn toàn tiến độ dự án.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[350px]"
        >
          {/* Feature 1: Early Warning */}
          <motion.div
            variants={scaleUp}
            className="bg-card/40 backdrop-blur-xl border border-white/5 dark:border-white/10 shadow-2xl rounded-3xl p-10 relative overflow-hidden group hover:border-emerald-500/50 hover:bg-card/60 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4 relative z-10 group-hover:text-emerald-500 transition-colors">Early Warning System</h3>
            <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-lg group-hover:text-foreground/80 transition-colors">
              Trợ lý AI tự động phát hiện tình trạng mất cân bằng (Bus Factor) và cảnh báo cờ đỏ khi xuất hiện "Zero contribution" (đóng băng đóng góp) trong Daily Scrum.
            </p>
          </motion.div>

          {/* Feature 2: Traceability Graph */}
          <motion.div
            variants={scaleUp}
            className="bg-card/40 backdrop-blur-xl border border-white/5 dark:border-white/10 shadow-2xl rounded-3xl p-10 relative overflow-hidden group hover:border-indigo-500/50 hover:bg-card/60 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-transform duration-500">
              <Network className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4 relative z-10 group-hover:text-indigo-500 transition-colors">Traceability Graph (XAI)</h3>
            <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-lg group-hover:text-foreground/80 transition-colors">
              Đồ thị truy vết minh bạch hóa luồng phân bổ điểm số. Mọi Story Points từ GitHub/Jira đều được truy xuất rõ ràng, loại bỏ hoàn toàn tính "hộp đen" của hệ thống.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
