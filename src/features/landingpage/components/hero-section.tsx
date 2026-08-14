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
              Đánh giá công bằng với Slicing Pie.
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
            Hệ thống tự động tổng hợp dữ liệu từ Jira và GitHub, kết hợp AI cảnh báo rủi ro và mô hình Dynamic Equity để tính toán tỷ lệ đóng góp (Slices) minh bạch, khách quan nhất.
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
            className="absolute inset-0 rounded-full blur-[30px] opacity-20 bg-primary/30"
          />
          <motion.img
            src="/images/saga_hero_dashboard.png"
            alt="SAGA Dashboard Mockup"
            className="absolute w-[90%] h-[90%] object-cover rounded-3xl shadow-[0_0_50px_rgba(2,132,199,0.2)] border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
          />


        </div>
      </div>
    </section>
  );
}
