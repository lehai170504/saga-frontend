"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, GitBranch, PlayCircle } from "lucide-react";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { fadeUp } from "./animations";

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
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none -z-10"
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-sm text-sm font-bold text-foreground mb-8 hover:bg-muted/80 transition-colors cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600" />
        </span>
        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-amber-600">SAGA v1.0</span> đã chính thức ra mắt
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-5xl md:text-[5.5rem] font-black text-foreground tracking-tight mb-8 max-w-5xl leading-[1.05]"
      >
        Theo dõi Tiến độ Đa môn học với <br className="hidden md:block" />
        <span className="relative inline-block mt-2">
          <span className="relative z-10 bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            Dữ liệu Thực tế
          </span>
          {/* Highlight Swoosh */}
          <svg className="absolute -bottom-2 w-full h-4 text-orange-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl font-medium leading-relaxed"
      >
        Hệ thống phân tích, đánh giá đồ thị liên tục và theo dõi tiến độ sinh viên qua nhiều môn học. Tích hợp GitHub, Jira, tự động hóa quy trình đánh giá.
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
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

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
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-2 sm:mb-6 shadow-lg shadow-orange-500/20" />
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
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-500/50" />
                    </div>
                    <div className="w-1/2 h-2 sm:h-3 rounded-full bg-white/20" />
                    <div className="w-3/4 h-3 sm:h-4 rounded-full bg-white/40" />
                  </div>
                ))}
              </div>

              {/* Middle Row (Git Graph) */}
              <div className="h-28 sm:h-40 rounded-2xl bg-white/5 border border-white/5 p-3 sm:p-4 flex flex-col gap-2 shrink-0">
                <div className="w-1/4 h-3 sm:h-4 rounded-full bg-white/20 mb-1 sm:mb-2" />
                <div className="flex-1 flex overflow-hidden">
                  {/* Create a grid of tiny blocks resembling github contributions */}
                  <div className="flex flex-col flex-wrap gap-[2px] sm:gap-1 h-full w-full opacity-80 mix-blend-screen">
                    {[...Array(200)].map((_, i) => {
                      // Pseudo-random intensity based on index to avoid hydration mismatch
                      const val = (i * 29) % 100;
                      let bgClass = "bg-white/5";
                      if (val > 85) bgClass = "bg-emerald-400";
                      else if (val > 60) bgClass = "bg-emerald-500/70";
                      else if (val > 30) bgClass = "bg-emerald-500/40";
                      return <div key={i} className={`w-[6px] h-[6px] sm:w-[10px] sm:h-[10px] rounded-[2px] ${bgClass}`} />
                    })}
                  </div>
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
                    <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-[8px] sm:border-[12px] border-orange-500 border-r-transparent border-t-transparent rotate-45" />
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
        <motion.div style={{ y: y2 }} className="hidden md:flex absolute top-1/4 -left-6 lg:-left-12 bg-card/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl items-center gap-4 animate-bounce hover:animate-none z-30">
          <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">Đồng bộ FAP</p>
            <p className="text-xs text-muted-foreground">Thành công lúc 08:30</p>
          </div>
        </motion.div>

        <motion.div style={{ y: y1 }} className="hidden md:flex absolute bottom-1/4 -right-6 lg:-right-12 bg-card/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl items-center gap-4 z-30">
          <div className="bg-blue-500/20 p-2 rounded-full"><GitBranch className="w-6 h-6 text-blue-500" /></div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">14 Commits mới</p>
            <p className="text-xs text-muted-foreground">Team Backend</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
