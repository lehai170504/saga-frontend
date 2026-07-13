"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GitMerge, Users, PieChart, Star, ShieldCheck, Zap } from "lucide-react";

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-32 bg-background relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Center Animated Timeline Line (Visible on Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-40 bottom-40 w-px bg-border/50 -translate-x-1/2 z-0">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 via-violet-500 to-emerald-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          style={{ height: lineHeight }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24 relative"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <Zap size={28} className="drop-shadow-md" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Quy trình <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-500 drop-shadow-sm">Slicing Pie</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Khung đánh giá động dựa trên giá trị thực tế, tích hợp hoàn hảo với quy trình làm việc Agile để ghi nhận mọi nỗ lực của bạn.
          </p>
        </motion.div>

        <div className="space-y-32">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16 group relative">
            {/* Timeline Dot */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background border-4 border-indigo-500 rounded-full items-center justify-center z-10 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <span className="text-indigo-500 font-black">1</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 space-y-6 md:pr-12"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black tracking-widest uppercase text-xs">
                <GitMerge size={16} /> Tích lũy liên tục
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">Tích lũy đóng góp qua từng nhiệm vụ</h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                Điểm số được tính toán tự động dựa trên Story Points mỗi khi bạn hoàn thành nhiệm vụ và được duyệt mã nguồn. Hệ thống đồng bộ tức thời từ Github & Jira.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 w-full perspective-1000"
            >
              <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-indigo-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Simulated UI */}
                <div className="relative z-10 space-y-4">
                  {[1, 2, 3].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
                      viewport={{ once: true }}
                      className={`flex items-center justify-between p-4 rounded-2xl border ${i === 1 ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-105 z-10 relative' : 'bg-background/60 border-border/50 opacity-60'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-2">
                          <div className={`h-2.5 w-32 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-muted-foreground/30'}`} />
                          <div className={`h-2 w-20 rounded-full ${i === 1 ? 'bg-indigo-500/50' : 'bg-muted-foreground/20'}`} />
                        </div>
                      </div>
                      <div className={`font-black text-lg ${i === 1 ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                        +{i === 1 ? '8' : '3'} SP
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 group relative">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background border-4 border-violet-500 rounded-full items-center justify-center z-10 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <span className="text-violet-500 font-black">2</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 space-y-6 md:pl-12"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-black tracking-widest uppercase text-xs">
                <Users size={16} /> Hiệu chỉnh tập thể
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">Hiệu chỉnh tại Sprint Retrospective</h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                Điểm cứng từ hệ thống được cả nhóm thảo luận để áp dụng các hệ số thưởng/phạt (x1.2, x0.8) cho các hoạt động hỗ trợ đồng đội hoặc vi phạm kỷ luật.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 w-full perspective-1000"
            >
              <div className="bg-gradient-to-bl from-card/80 to-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-violet-500/30">
                <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/10 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Simulated UI: Floating Avatars */}
                <div className="relative z-10 h-64 flex items-center justify-center">
                  {/* Central Node */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-20 w-24 h-24 rounded-full bg-violet-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] border-4 border-background"
                  >
                    <Star className="text-white" size={32} fill="currentColor" />
                  </motion.div>

                  {/* Orbital Nodes */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="absolute -top-4 -left-4 bg-background border border-violet-500/50 p-3 rounded-2xl shadow-xl z-30 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs">+</div>
                    <div>
                      <div className="h-2 w-16 bg-foreground/80 rounded-full mb-1" />
                      <div className="text-emerald-500 font-black text-sm">x1.2</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 right-0 bg-background border border-red-500/50 p-3 rounded-2xl shadow-xl z-30 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-black text-xs">-</div>
                    <div>
                      <div className="h-2 w-16 bg-foreground/80 rounded-full mb-1" />
                      <div className="text-red-500 font-black text-sm">x0.8</div>
                    </div>
                  </motion.div>

                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-16 group relative">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background border-4 border-emerald-500 rounded-full items-center justify-center z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="text-emerald-500 font-black">3</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 space-y-6 md:pr-12"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase text-xs">
                <PieChart size={16} /> Tổng kết minh bạch
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">Tự động chốt tỷ lệ cổ phần công bằng</h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                Tất cả điểm số sau khi hiệu chỉnh được cộng dồn và tự động chuyển đổi thành phần trăm % Cổ phần của từng cá nhân. Giảng viên chỉ cần xem đồ thị trực quan và phê duyệt.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 w-full perspective-1000"
            >
              <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30 flex items-center justify-center min-h-[340px]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* 3D Animated Pie Chart */}
                <div className="relative z-10 w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                    {/* Dev 1: 45% */}
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="20"
                      initial={{ strokeDasharray: "0 251.2" }}
                      whileInView={{ strokeDasharray: `${251.2 * 0.45} 251.2` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    {/* Dev 2: 35% */}
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDashoffset={-(251.2 * 0.45)}
                      initial={{ strokeDasharray: "0 251.2" }}
                      whileInView={{ strokeDasharray: `${251.2 * 0.35} 251.2` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    {/* Dev 3: 20% */}
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDashoffset={-(251.2 * 0.80)}
                      initial={{ strokeDasharray: "0 251.2" }}
                      whileInView={{ strokeDasharray: `${251.2 * 0.20} 251.2` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                  </svg>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-background rounded-full shadow-inner flex items-center justify-center flex-col">
                      <span className="text-xl font-black text-foreground">100%</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Equity</span>
                    </div>
                  </div>

                  {/* Tooltips */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8 }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -right-12 bg-background border border-border shadow-lg rounded-xl px-3 py-1.5 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="font-bold text-sm">45%</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
