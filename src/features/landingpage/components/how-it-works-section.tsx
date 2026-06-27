"use client";

import React from "react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Quy trình <span className="text-orange-500">Tối giản</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
            Không cần thay đổi thói quen làm việc. Bạn cứ tập trung code, SAGA sẽ lo phần báo cáo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-border via-orange-500/50 to-border -z-10" />
          {[
            {
              step: "01",
              title: "Cấu hình",
              desc: "Nhập Link GitHub Repository và Jira Project Key vào hệ thống SAGA.",
            },
            {
              step: "02",
              title: "Thu thập",
              desc: "Background Worker tự động cào dữ liệu và tính toán mỗi ngày.",
            },
            {
              step: "03",
              title: "Dashboard",
              desc: "Giảng viên và sinh viên xem báo cáo trực quan tức thời mà không cần chờ đợi.",
            },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-card border-2 border-border text-foreground font-black text-3xl flex items-center justify-center shadow-md mb-8 group-hover:-translate-y-3 group-hover:border-orange-500 group-hover:text-orange-500 group-hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] transition-all duration-300 relative">
                {item.step}
                <div className="absolute inset-0 rounded-[2rem] bg-orange-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
