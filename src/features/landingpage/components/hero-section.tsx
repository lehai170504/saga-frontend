"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, PlayCircle, Layout } from "lucide-react";
import { API_BASE_URL } from "@/lib/axios";
import { fadeUp, scaleUp, float } from "./animations";

export function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-24 max-w-[90rem] mx-auto overflow-hidden">
      {/* Subtle SaaS Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* Left Column: Text */}
        <div className="flex flex-col items-start text-left z-10">
          {/* Badge */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border shadow-sm text-sm font-semibold mb-6 hover:bg-secondary/80 transition-colors cursor-pointer group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-foreground">SAGA v1.0</span> Đã chính thức ra mắt
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6 leading-[1.1]"
          >
            Chấm dứt Free-rider.<br />
            <span className="text-primary">
              Đánh giá công bằng nhờ dữ liệu thật.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8 max-w-xl font-medium leading-relaxed"
          >
            Hệ thống tự động tổng hợp dữ liệu từ Jira và GitHub, kết hợp mô hình Slicing Pie để tính toán tỷ lệ đóng góp của từng sinh viên một cách minh bạch và khách quan nhất.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => window.location.assign(`${API_BASE_URL}/api/auth/login`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg px-8 h-12 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center text-base"
            >
              Đăng nhập / Bắt đầu
            </button>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 text-foreground font-semibold bg-background border border-border rounded-lg hover:bg-muted transition-all duration-300 h-12 group"
            >
              <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              Xem Cách hoạt động
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Floating Data Pipeline Illustration */}
        <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center z-10">

          {/* Background Abstract Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 rounded-full blur-[20px] opacity-30 bg-primary/20"
          />
          <motion.img
            src="/images/abstract_data_network.png"
            alt="Data Network"
            className="absolute w-[80%] h-[80%] object-cover rounded-3xl shadow-2xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.5))' }}
          />

          {/* Central SAGA Dashboard Snippet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute z-20 w-72 bg-card border border-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Tỷ lệ đóng góp (Slicing Pie)</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { name: "Lê Hoàng Hải", val: 45, color: "bg-primary" },
                { name: "Trần Thị B", val: 30, color: "bg-emerald-500" },
                { name: "Nguyễn Văn A", val: 25, color: "bg-amber-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">{item.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{item.name}</span>
                      <span className="text-[10px] font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <motion.div className={`h-full ${item.color}`} initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Left: GitHub Realistic Snippet */}
          <motion.div
            variants={float} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
            className="absolute top-[10%] left-0 z-30 bg-card border border-border p-3 rounded-xl shadow-xl flex gap-3 w-60 hover:-translate-y-1 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <GitBranch className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground">main</span>
                <span className="text-[9px] text-muted-foreground">Vừa xong</span>
              </div>
              <span className="text-xs font-bold text-foreground truncate">Merged PR #142</span>
              <span className="text-[10px] text-success font-medium">+342 lines, -12 lines</span>
            </div>
          </motion.div>

          {/* Bottom Right: Jira Realistic Snippet */}
          <motion.div
            variants={float} initial="hidden" animate="visible" transition={{ delay: 0.6 }}
            className="absolute bottom-[15%] right-0 z-30 bg-card border border-border p-3 rounded-xl shadow-xl flex gap-3 w-56 hover:-translate-y-1 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Layout className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Saga-45</span>
              </div>
              <span className="text-xs font-bold text-foreground truncate">Landing page redesign</span>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 bg-success/15 text-success text-[9px] font-bold rounded uppercase">Done</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
