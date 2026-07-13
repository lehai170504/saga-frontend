"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, GitBranch, PlayCircle } from "lucide-react";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { fadeUp, scaleUp, float } from "./animations";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.05]);

  return (
    <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-32 max-w-[90rem] mx-auto flex flex-col items-center text-center overflow-visible">
      {/* Background Animated Blobs */}
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [1, 1.2, 1, 1.2, 1]
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        variants={scaleUp}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-sm text-sm font-bold text-foreground mb-8 hover:bg-muted/80 transition-colors cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600" />
        </span>
        <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-violet-600">SAGA v1.0</span> đã chính thức ra mắt
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-5xl md:text-[5.5rem] font-black text-foreground tracking-tight mb-8 max-w-5xl leading-[1.05]"
      >
        Loại bỏ Free-rider với <br className="hidden md:block" />
        <span className="relative inline-block mt-2">
          <span className="relative z-10 bg-gradient-to-br from-indigo-500 via-violet-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            Quản trị Dự án Agile
          </span>
          {/* Highlight Swoosh Animated */}
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
            className="absolute -bottom-2 w-full h-4 text-indigo-500/30 -z-10"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </motion.svg>
        </span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl font-medium leading-relaxed"
      >
        Tích hợp mô hình phân chia cổ phần <strong className="text-foreground font-bold">Slicing Pie</strong> vào quy trình Scrum. Minh bạch hóa đóng góp bằng AI truy vết, đảm bảo công bằng và chấm dứt rủi ro dự án.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-4 z-10 mb-32"
      >
        <div className="scale-110">
          <AuthModal />
        </div>
        <Link
          href="#how-it-works"
          className="inline-flex items-center justify-center px-8 py-3.5 text-foreground font-bold bg-card/50 backdrop-blur-md border border-border rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-lg h-14 group"
        >
          <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          Xem Demo
        </Link>
      </motion.div>

      {/* Media / Video Frame */}
      <motion.div
        style={{ scale }}
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl relative z-20 group perspective-1000"
      >
        {/* Glow effect behind mockup */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] ring-1 ring-white/10 transform transition-all duration-700 ease-out hover:-translate-y-2">
          {/* Mac OS Header */}
          <div className="h-12 bg-[#1a1a1a] flex items-center px-6 gap-2 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="mx-auto w-1/2 h-6 bg-white/5 rounded-md flex items-center justify-center text-[10px] text-white/30 font-medium">
              saga.fpt.edu.vn
            </div>
          </div>

          {/* Dashboard Skeleton UI */}
          <div className="aspect-[16/9] bg-[#0a0a0a] relative overflow-hidden group/image p-3 sm:p-5 flex gap-3 sm:gap-5 select-none">
            {/* Sidebar Skeleton */}
            <div className="w-12 sm:w-16 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center py-4 gap-4 shrink-0 shadow-inner">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 mb-2 sm:mb-6 shadow-lg shadow-indigo-500/20" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-white/10" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-white/10" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-white/10" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-white/5 mt-auto" />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-5 overflow-hidden">
              {/* Header */}
              <div className="h-10 sm:h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between px-4 shrink-0">
                <div className="w-1/3 h-3 sm:h-4 rounded-full bg-white/10" />
                <div className="flex gap-2 items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 bg-white/5" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 sm:gap-5 shrink-0 h-16 sm:h-24">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 flex flex-col justify-center gap-2 sm:gap-3 group-hover/image:bg-white/[0.07] transition-colors duration-500">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-500/50" />
                    </div>
                    <div className="w-1/2 h-2 sm:h-3 rounded-full bg-white/20" />
                    <div className="w-3/4 h-3 sm:h-4 rounded-full bg-white/40" />
                  </div>
                ))}
              </div>

              {/* Middle Row (Traceability Graph) */}
              <div className="h-28 sm:h-40 rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 flex flex-col gap-2 shrink-0 relative overflow-hidden group/graph">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/graph:opacity-100 transition-opacity duration-1000" />
                <div className="w-1/4 h-3 sm:h-4 rounded-full bg-white/20 mb-1 sm:mb-2 z-10" />
                <div className="flex-1 flex relative items-center justify-center">
                  {/* Nodes */}
                  <div className="absolute left-[10%] w-8 h-8 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"><div className="w-3 h-3 bg-emerald-400 rounded-full" /></div>

                  <div className="absolute left-[45%] top-[10%] w-10 h-10 rounded-xl border border-blue-500/50 bg-blue-500/10 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-110 transition-transform"><div className="w-4 h-4 bg-blue-400 rounded-sm" /></div>

                  <div className="absolute left-[45%] bottom-[10%] w-10 h-10 rounded-xl border border-indigo-500/50 bg-indigo-500/10 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-110 transition-transform"><div className="w-4 h-4 bg-indigo-400 rounded-sm" /></div>

                  <div className="absolute right-[10%] w-12 h-12 rounded-full border border-purple-500/50 bg-purple-500/10 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover/graph:scale-110 transition-transform duration-500"><div className="w-5 h-5 bg-purple-400 rounded-full animate-pulse" /></div>
                  {/* Edges */}
                  <svg className="absolute inset-0 w-full h-full opacity-60 z-10" preserveAspectRatio="none">
                    <path d="M 15% 50% Q 30% 25% 45% 25%" fill="none" stroke="url(#grad-emerald-blue)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
                    <path d="M 15% 50% Q 30% 75% 45% 75%" fill="none" stroke="url(#grad-emerald-indigo)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
                    <path d="M 55% 25% Q 75% 25% 90% 50%" fill="none" stroke="url(#grad-blue-purple)" strokeWidth="2" />
                    <path d="M 55% 75% Q 75% 75% 90% 50%" fill="none" stroke="url(#grad-indigo-purple)" strokeWidth="2" />

                    <defs>
                      <linearGradient id="grad-emerald-blue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
                      <linearGradient id="grad-emerald-indigo" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
                      <linearGradient id="grad-blue-purple" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#c084fc" /></linearGradient>
                      <linearGradient id="grad-indigo-purple" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#c084fc" /></linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex-1 flex gap-3 sm:gap-5 min-h-0">
                {/* Bar chart */}
                <div className="flex-[2] rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 flex flex-col gap-2 relative overflow-hidden">
                  <div className="w-1/3 h-3 sm:h-4 rounded-full bg-white/20 mb-2" />
                  <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2 z-10">
                    {[40, 70, 45, 90, 65, 80, 55, 30, 85].map((h, i) => (
                      <div key={i} className="w-full bg-blue-500/20 rounded-t-md relative group-hover/image:bg-blue-500/30 transition-colors duration-700 delay-75" style={{ height: `${h}%` }}>
                        <div className="absolute top-0 left-0 w-full bg-blue-400 rounded-t-md" style={{ height: '4px' }} />
                      </div>
                    ))}
                  </div>
                  {/* Chart Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-end px-4 py-4 z-0 pointer-events-none opacity-20">
                    <div className="w-full border-t border-dashed border-white/30 h-1/4" />
                    <div className="w-full border-t border-dashed border-white/30 h-1/4" />
                    <div className="w-full border-t border-dashed border-white/30 h-1/4" />
                    <div className="w-full border-t border-white/40 h-0" />
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="flex-[1] rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 flex flex-col items-center justify-center relative">
                  {/* Fake Donut Chart via Borders */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[8px] sm:border-[12px] border-white/5 relative group-hover/image:scale-105 transition-transform duration-700">
                    <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-[8px] sm:border-[12px] border-indigo-500 border-r-transparent border-t-transparent rotate-45" />
                    <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-[8px] sm:border-[12px] border-blue-500 border-l-transparent border-b-transparent -rotate-12 opacity-80" />
                  </div>
                  <div className="absolute text-center flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-base sm:text-xl font-black text-white">85%</div>
                    <div className="text-[8px] sm:text-[10px] text-white/50 uppercase tracking-widest font-bold">Tiến độ</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-transparent to-[#0a0a0a]/40 pointer-events-none" />
          </div>
        </div>

        {/* Floating UI Elements now positioned relative to the Mockup Frame */}
        <motion.div style={{ y: y2 }} className="hidden md:flex absolute top-1/4 -left-6 lg:-left-12 z-30">
          <motion.div
            variants={float} initial="hidden" animate="visible"
            className="bg-card/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Đồng bộ FAP</p>
              <p className="text-xs text-muted-foreground">Thành công lúc 08:30</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: y1 }} className="hidden md:flex absolute bottom-1/4 -right-6 lg:-right-12 z-30">
          <motion.div
            variants={float} initial="hidden" animate="visible" transition={{ delay: 0.5 }}
            className="bg-card/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="bg-blue-500/20 p-2 rounded-full"><GitBranch className="w-6 h-6 text-blue-500" /></div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">14 Commits mới</p>
              <p className="text-xs text-muted-foreground">Team Backend</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
