"use client";

import { motion } from "framer-motion";
import { GitMerge, CheckCircle2, Terminal, ChevronRight, BarChart3 } from "lucide-react";
import { fadeUp, scaleUp } from "./animations";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6"
          >
            Đồng bộ <span className="text-primary">Tự động</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-muted-foreground font-medium text-lg leading-relaxed"
          >
            Không cần phải nhập liệu thủ công. SAGA tự động lấy dữ liệu từ các công cụ bạn đang dùng hàng ngày (Jira, GitHub) để tính điểm đóng góp theo thời gian thực.
          </motion.p>
        </div>

        <div className="space-y-32 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pr-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
                Bước 1
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Làm việc bình thường</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                Code trên GitHub, kéo thả task trên Jira y như quy trình Agile chuẩn.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />

              {/* Realistic Mockup: Kanban Board & Code */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl flex flex-col gap-4 transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                {/* Kanban Header */}
                <div className="flex gap-4">
                  {/* To Do Column */}
                  <div className="flex-1 bg-muted/30 rounded-xl p-3 border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">To Do (2)</div>
                    <div className="bg-background border border-border p-2 rounded-lg shadow-sm text-xs font-medium text-muted-foreground mb-2 opacity-60">Thiết kế UI/UX</div>
                    <div className="bg-background border border-border p-2 rounded-lg shadow-sm text-xs font-medium text-muted-foreground opacity-60">Viết API Docs</div>
                  </div>
                  {/* In Progress Column */}
                  <div className="flex-1 bg-muted/50 rounded-xl p-3 border border-primary/20">
                    <div className="text-[10px] font-bold text-primary uppercase mb-2">In Progress (1)</div>
                    <div className="bg-background border border-primary/40 p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing relative hover:-translate-y-1 transition-transform">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">SAGA-45</span>
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">H</div>
                      </div>
                      <div className="text-xs font-bold text-foreground mb-2">Build Authentication API</div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span className="bg-muted px-1.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 5 Story Points</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* GitHub Commit Bar */}
                <div className="bg-[#0d1117] rounded-xl border border-border/50 p-3 flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <GitMerge className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-mono text-emerald-500 mb-1">Merge pull request #12</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Le Hoang Hai committed 2 mins ago</div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-500">+254 -12</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pl-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                Bước 2
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">SAGA tự động Tracking</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                SAGA âm thầm bắt sự kiện (Webhooks), đo lường Story Points và Commits để ghi nhận đóng góp.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-10" />

              {/* Realistic Mockup: Terminal / Webhook Logs */}
              <div className="bg-[#0c0c0c] border border-border/20 rounded-2xl overflow-hidden shadow-2xl transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                {/* Mac Window Header */}
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Terminal className="w-3 h-3" /> saga-sync-worker
                  </div>
                </div>
                {/* Terminal Body */}
                <div className="p-4 font-mono text-xs leading-relaxed text-[#00ff00] h-[240px] flex flex-col justify-end overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0c0c0c] to-transparent z-10" />
                  <div className="space-y-2 opacity-50">
                    <div><span className="text-[#888]">[14:22:01]</span> INFO: Polling Jira API for project SAGA...</div>
                    <div><span className="text-[#888]">[14:22:05]</span> INFO: Received webhook from GitHub (event: push)</div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div><span className="text-[#888]">[14:22:06]</span> <span className="text-blue-400">JIRA</span> ➔ Task <span className="font-bold">SAGA-45</span> transitioned to <span className="text-emerald-400">DONE</span> (Points: 5)</div>
                    <div><span className="text-[#888]">[14:22:06]</span> <span className="text-blue-400">JIRA</span> ➔ Assignee: <span className="font-bold">lehoanghai</span></div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#888] shrink-0">[14:22:07]</span>
                      <span className="text-purple-400 shrink-0">GITHUB</span>
                      <span>➔ Commit <span className="font-bold text-white">#8f2a1b</span> by <span className="font-bold">lehoanghai</span> (+254 lines)</span>
                    </div>
                    <div className="text-yellow-400 font-bold flex items-center gap-2 mt-2 bg-yellow-400/10 p-1.5 rounded">
                      <ChevronRight className="w-3 h-3" /> CALCULATING SLICING PIE: +8.5 SLICE for lehoanghai
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pr-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-xs uppercase tracking-wider">
                Bước 3
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Báo cáo minh bạch</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                Tự động xuất Bảng xếp hạng % Đóng góp minh bạch tuyệt đối tại các buổi Sprint Retrospective.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full -z-10" />

              {/* Realistic Mockup: Leaderboard / Pie Chart */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <h4 className="font-bold text-sm">Sprint 1 - Contribution</h4>
                  </div>
                  <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded font-bold uppercase tracking-wider">Finalized</span>
                </div>

                <div className="space-y-4">
                  {/* Person 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">H</div>
                        <span className="font-bold text-foreground">Lê Hoàng Hải</span>
                      </div>
                      <span className="font-bold text-primary">45%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full relative" style={{ width: '45%' }}>
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Person 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">A</div>
                        <span className="font-bold text-foreground">Nguyễn Văn A</span>
                      </div>
                      <span className="font-bold text-emerald-500">35%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  {/* Person 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-[10px] font-bold text-warning">B</div>
                        <span className="font-bold text-foreground">Trần Thị B</span>
                      </div>
                      <span className="font-bold text-warning">20%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
