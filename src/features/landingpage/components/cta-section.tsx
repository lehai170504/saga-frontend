"use client";

import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/axios";
import { fadeUp } from "./animations";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="bg-slate-950 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center shadow-2xl"
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[300px] bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          Sẵn sàng thay đổi?
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tight leading-tight max-w-3xl">
          Minh bạch hóa quá trình đánh giá ngay hôm nay.
        </h2>

        <p className="text-slate-300 font-medium mb-10 max-w-xl mx-auto relative z-10 text-lg leading-relaxed">
          Tham gia SAGA để trải nghiệm hệ thống chấm điểm liên tục, tự động đồng bộ từ GitHub và Jira, đảm bảo công bằng 100% cho mọi thành viên trong dự án.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => window.location.assign(`${API_BASE_URL}/api/auth/login`)}
            className="bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 font-bold rounded-2xl px-8 h-14 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-3 text-lg group"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Decorative grids */}
        <div className="absolute left-0 top-0 w-64 h-64 bg-white/[0.02] [mask-image:linear-gradient(to_bottom_right,white,transparent)]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/[0.02] [mask-image:linear-gradient(to_top_left,white,transparent)]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </motion.div>
    </section>
  );
}
