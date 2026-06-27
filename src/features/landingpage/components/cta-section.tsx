"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuthModal } from "@/features/auth/components/auth-modal";

export function CtaSection() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-foreground rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl group"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/40 blur-[100px] rounded-full pointer-events-none group-hover:bg-orange-500/60 transition-colors duration-700" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/50 transition-colors duration-700" />
        
        <h2 className="text-4xl md:text-6xl font-black text-background mb-8 relative z-10 tracking-tight leading-tight">
          Sẵn sàng Nâng tầm<br />Chất lượng Đồ án?
        </h2>
        <p className="text-background/80 font-medium mb-14 max-w-2xl mx-auto relative z-10 text-xl leading-relaxed">
          Tạo tài khoản và trải nghiệm hệ thống quản lý đồ án minh bạch, công bằng và hiệu quả nhất từ trước đến nay.
        </p>
        <div className="relative z-10 inline-block scale-110 hover:scale-125 transition-transform duration-300">
          <AuthModal />
        </div>
      </motion.div>
    </section>
  );
}
